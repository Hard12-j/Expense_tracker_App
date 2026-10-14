import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { ExpenseDto, UserDto, ExpenseCategory } from '@/types/expense';
import {
  loginUser,
  signupUser,
  pingProtected,
  refreshAccessToken,
  type LoginRequest,
  type SignupRequest,
} from '@/services/authService';
import {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from '@/services/tokenStorage';

interface ExpenseContextType {
  expenses: ExpenseDto[];
  user: UserDto;
  isLoggedIn: boolean;
  /** True while the app is checking for a stored session on boot */
  authLoading: boolean;
  /** The current JWT access token (null when logged out) */
  accessToken: string | null;
  totalSpent: number;
  budgetLimit: number;
  remainingBudget: number;
  percentageSpent: number;
  statusText: 'Healthy' | 'At Risk' | 'Over Budget';
  topCategory: { category: ExpenseCategory; amount: number };
  dailyAverage: number;
  currency: string;
  addExpense: (expense: Omit<ExpenseDto, 'key' | 'createdAt'> & { createdAt?: Date | string }) => void;
  deleteExpense: (key: number) => void;
  updateUser: (fields: Partial<UserDto>) => void;
  setBudgetLimit: (limit: number) => void;
  setCurrency: (curr: string) => void;
  resetSampleData: () => void;
  /** Real login — calls POST /auth/v1/login, persists tokens */
  loginWithCredentials: (req: LoginRequest) => Promise<void>;
  /** Real signup — calls POST /auth/v1/signup, persists tokens */
  signupWithDetails: (req: SignupRequest) => Promise<void>;
  /** Clears tokens and resets state */
  logout: () => Promise<void>;
  /** @deprecated Use loginWithCredentials instead */
  login: () => void;
}

const INITIAL_USER: UserDto = {
  userId: 'EXP-89241',
  firstName: 'Lovepreet',
  lastName: 'Singh',
  phoneNumber: '+91 98765 43210',
  email: 'lovepreet.dev@example.com',
  profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  monthlyBudget: 10000,
  currency: '₹',
};

const INITIAL_EXPENSES: ExpenseDto[] = [
  {
    key: 1,
    merchant: 'Amazon Electronics',
    amount: 3299,
    currency: '₹',
    category: 'Shopping',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hrs ago
    notes: 'Wireless Noise Canceling Earbuds',
  },
  {
    key: 2,
    merchant: 'Starbucks Coffee',
    amount: 450,
    currency: '₹',
    category: 'Dining',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // yesterday
    notes: 'Caramel Macchiato & Croissant',
  },
  {
    key: 3,
    merchant: 'Apple App Store',
    amount: 899,
    currency: '₹',
    category: 'Entertainment',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    notes: 'Cloud Storage & Developer Subs',
  },
  {
    key: 4,
    merchant: 'Uber Rides',
    amount: 380,
    currency: '₹',
    category: 'Transport',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    notes: 'Ride to City Tech Park',
  },
  {
    key: 5,
    merchant: 'Zara Fashion',
    amount: 2450,
    currency: '₹',
    category: 'Shopping',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    notes: 'Casual Linen Shirt',
  },
  {
    key: 6,
    merchant: 'Electricity & Gas Utility',
    amount: 1120,
    currency: '₹',
    category: 'Utilities',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    notes: 'Monthly power utility bill',
  },
];

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<ExpenseDto[]>(INITIAL_EXPENSES);
  const [user, setUser] = useState<UserDto>(INITIAL_USER);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // ── Auto-restore session on boot ─────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const stored = await getAccessToken();
        if (!stored) {
          setAuthLoading(false);
          return;
        }

        // Validate the stored access token
        const valid = await pingProtected(stored);
        if (valid) {
          setAccessToken(stored);
          setIsLoggedIn(true);
          setAuthLoading(false);
          return;
        }

        // Access token expired — try refresh
        const rt = await getRefreshToken();
        if (rt) {
          try {
            const refreshed = await refreshAccessToken(rt);
            await saveTokens(refreshed.accessToken, refreshed.token);
            setAccessToken(refreshed.accessToken);
            setIsLoggedIn(true);
          } catch {
            // Refresh token also invalid — force re-login
            await clearTokens();
          }
        }
      } catch {
        // Network error — clear tokens to be safe
        await clearTokens();
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []);

  // ── Computed values ──────────────────────────────────────────────────────
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const budgetLimit = user.monthlyBudget;
  const remainingBudget = Math.max(0, budgetLimit - totalSpent);
  const percentageSpent = Math.min(100, Math.round((totalSpent / (budgetLimit || 1)) * 100));

  const statusText: 'Healthy' | 'At Risk' | 'Over Budget' = useMemo(() => {
    if (totalSpent > budgetLimit) return 'Over Budget';
    if (percentageSpent >= 80) return 'At Risk';
    return 'Healthy';
  }, [totalSpent, budgetLimit, percentageSpent]);

  const topCategory = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((item) => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
    });

    let top: ExpenseCategory = 'Shopping';
    let max = 0;
    Object.entries(categoryTotals).forEach(([cat, val]) => {
      if (val > max) {
        max = val;
        top = cat as ExpenseCategory;
      }
    });

    return { category: top, amount: max };
  }, [expenses]);

  const dailyAverage = useMemo(() => {
    const days = 30;
    return Math.round(totalSpent / days);
  }, [totalSpent]);

  // ── Expense actions ──────────────────────────────────────────────────────
  const addExpense = (
    expense: Omit<ExpenseDto, 'key' | 'createdAt'> & { createdAt?: Date | string }
  ) => {
    const newExpense: ExpenseDto = {
      key: Date.now(),
      amount: Number(expense.amount),
      merchant: expense.merchant.trim(),
      currency: expense.currency || user.currency,
      category: expense.category,
      createdAt: expense.createdAt || new Date().toISOString(),
      notes: expense.notes,
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const deleteExpense = (key: number) => {
    setExpenses((prev) => prev.filter((item) => item.key !== key));
  };

  const updateUser = (fields: Partial<UserDto>) => {
    setUser((prev) => ({ ...prev, ...fields }));
  };

  const setBudgetLimit = (limit: number) => {
    setUser((prev) => ({ ...prev, monthlyBudget: limit }));
  };

  const setCurrency = (curr: string) => {
    setUser((prev) => ({ ...prev, currency: curr }));
    setExpenses((prev) => prev.map((exp) => ({ ...exp, currency: curr })));
  };

  const resetSampleData = () => {
    setExpenses(INITIAL_EXPENSES);
    setUser(INITIAL_USER);
  };

  // ── Auth actions ─────────────────────────────────────────────────────────

  /**
   * Calls POST /auth/v1/login, saves tokens, and marks the user as logged in.
   * Throws an AuthError if credentials are wrong or the server is unreachable.
   */
  const loginWithCredentials = useCallback(async (req: LoginRequest) => {
    const jwt = await loginUser(req);
    await saveTokens(jwt.accessToken, jwt.token);
    setAccessToken(jwt.accessToken);
    // Derive a friendly first name from the username
    const firstName = req.userName.includes('.')
      ? req.userName.split('.')[0]
      : req.userName;
    setUser((prev) => ({ ...prev, firstName }));
    setIsLoggedIn(true);
  }, []);

  /**
   * Calls POST /auth/v1/signup, saves tokens, and marks the user as logged in.
   * Throws an AuthError if the username already exists.
   */
  const signupWithDetails = useCallback(async (req: SignupRequest) => {
    const jwt = await signupUser(req);
    await saveTokens(jwt.accessToken, jwt.token);
    setAccessToken(jwt.accessToken);
    setUser((prev) => ({
      ...prev,
      firstName: req.first_name,
      lastName: req.last_name,
      email: req.email,
      phoneNumber: String(req.phone_number),
    }));
    setIsLoggedIn(true);
  }, []);

  /** Clears secure storage and resets all state to defaults. */
  const logout = useCallback(async () => {
    await clearTokens();
    setAccessToken(null);
    setIsLoggedIn(false);
    setUser(INITIAL_USER);
    setExpenses(INITIAL_EXPENSES);
  }, []);

  /** @deprecated — kept for backward compatibility with older screens */
  const login = () => setIsLoggedIn(true);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        user,
        isLoggedIn,
        authLoading,
        accessToken,
        totalSpent,
        budgetLimit,
        remainingBudget,
        percentageSpent,
        statusText,
        topCategory,
        dailyAverage,
        currency: user.currency,
        addExpense,
        deleteExpense,
        updateUser,
        setBudgetLimit,
        setCurrency,
        resetSampleData,
        loginWithCredentials,
        signupWithDetails,
        logout,
        login,
      }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = (): ExpenseContextType => {
  const ctx = useContext(ExpenseContext);
  if (!ctx) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return ctx;
};

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { theme } from '@/theme/theme';
import { useExpenses } from '@/context/ExpenseContext';
import { ExpenseCategory } from '@/types/expense';
import { StatusBar } from 'expo-status-bar';
import Nav from '@/components/Nav';
import CustomBox from '@/components/CustomBox';
import ExpenseTrackerGraph from '@/components/ExpenseTrackerGraph';
import SpendsInsights from '@/components/SpendsInsights';
import Heading from '@/components/Heading';
import Expense from '@/components/Expense';
import AddExpenseModal from '@/components/AddExpenseModal';

const CATEGORY_FILTERS: ('All' | ExpenseCategory)[] = [
  'All',
  'Shopping',
  'Dining',
  'Transport',
  'Entertainment',
  'Utilities',
  'Groceries',
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {
    expenses,
    deleteExpense,
    totalSpent,
    remainingBudget,
    budgetLimit,
    currency,
  } = useExpenses();

  const [selectedCategory, setSelectedCategory] = useState<'All' | ExpenseCategory>('All');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // Filtered recent expenses
  const filteredExpenses = useMemo(() => {
    if (selectedCategory === 'All') return expenses;
    return expenses.filter((item) => item.category === selectedCategory);
  }, [expenses, selectedCategory]);

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 16) }]}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: insets.bottom + 90 },
        ]}>
        {/* Navigation Bar */}
        <Nav onOpenAddModal={() => setIsAddModalVisible(true)} />

        {/* Overview Hero Card: Circular Graph + Insights */}
        <CustomBox variant="elevated" style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.graphColumn}>
              <ExpenseTrackerGraph size={164} />
            </View>
            <View style={styles.insightsColumn}>
              <SpendsInsights />
            </View>
          </View>

          {/* Quick Metrics Ticker */}
          <View style={styles.tickerRow}>
            <View style={styles.tickerItem}>
              <Text style={styles.tickerLabel}>TOTAL SPENT</Text>
              <Text style={styles.tickerValue}>
                {currency}{totalSpent.toLocaleString()}
              </Text>
            </View>
            <View style={styles.tickerDivider} />
            <View style={styles.tickerItem}>
              <Text style={styles.tickerLabel}>REMAINING</Text>
              <Text style={[styles.tickerValue, { color: theme.colors.status.success }]}>
                {currency}{remainingBudget.toLocaleString()}
              </Text>
            </View>
            <View style={styles.tickerDivider} />
            <View style={styles.tickerItem}>
              <Text style={styles.tickerLabel}>LIMIT</Text>
              <Text style={styles.tickerValue}>
                {currency}{budgetLimit.toLocaleString()}
              </Text>
            </View>
          </View>
        </CustomBox>

        {/* Category Filters */}
        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}>
            {CATEGORY_FILTERS.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  android_ripple={{ color: 'rgba(255, 255, 255, 0.15)', borderless: false }}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipSelected,
                  ]}>
                  <Text
                    style={[
                      styles.filterText,
                      isSelected && styles.filterTextSelected,
                    ]}>
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Section Header */}
        <Heading
          title="Your Recent Spends"
          subtitle={`${filteredExpenses.length} transaction${filteredExpenses.length === 1 ? '' : 's'}`}
          rightAction={
            <Pressable
              onPress={() => router.push('/explore')}
              hitSlop={8}
              style={({ pressed }) => [styles.viewAllBtn, pressed && styles.pressed]}>
              <Text style={styles.viewAllText}>View All →</Text>
            </Pressable>
          }
        />

        {/* Expenses List */}
        {filteredExpenses.length > 0 ? (
          <View style={styles.expensesList}>
            {filteredExpenses.slice(0, 10).map((expense) => (
              <Expense
                key={expense.key}
                item={expense}
                onDelete={deleteExpense}
              />
            ))}
          </View>
        ) : (
          <CustomBox variant="glass" style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🧾</Text>
            <Text style={styles.emptyTitle}>No expenses found</Text>
            <Text style={styles.emptySubtitle}>
              {selectedCategory === 'All'
                ? 'Start tracking your spending by adding an expense.'
                : `No expenses recorded under ${selectedCategory}.`}
            </Text>
            <Pressable
              style={styles.emptyAddBtn}
              onPress={() => setIsAddModalVisible(true)}>
              <Text style={styles.emptyAddText}>＋ Add Expense</Text>
            </Pressable>
          </CustomBox>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        android_ripple={{ color: 'rgba(255, 255, 255, 0.3)', borderless: true, radius: 28 }}
        style={({ pressed }) => [
          styles.fab,
          { bottom: insets.bottom + 80 },
          pressed && Platform.OS === 'ios' && styles.fabPressed,
        ]}
        onPress={() => setIsAddModalVisible(true)}>
        <Text style={styles.fabIcon}>＋</Text>
      </Pressable>

      {/* Add Expense Modal Sheet */}
      <AddExpenseModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  heroCard: {
    backgroundColor: '#141720',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  graphColumn: {
    flex: 1,
    minWidth: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightsColumn: {
    flex: 1,
    minWidth: 160,
    justifyContent: 'center',
  },
  tickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md - 2,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.07)',
  },
  tickerItem: {
    alignItems: 'center',
    flex: 1,
  },
  tickerLabel: {
    color: theme.colors.text.secondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  tickerValue: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '700',
  },
  tickerDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterSection: {
    marginVertical: theme.spacing.xs,
  },
  filterScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600',
  },
  filterTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  viewAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  viewAllText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600',
  },
  expensesList: {
    marginBottom: theme.spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing['2xl'],
    marginVertical: theme.spacing.md,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: theme.spacing.sm,
  },
  emptyTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySubtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    textAlign: 'center',
    maxWidth: 240,
    marginBottom: theme.spacing.md,
  },
  emptyAddBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: theme.borderRadius.full,
  },
  emptyAddText: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 24px rgba(0, 122, 255, 0.45)',
      },
    }),
  },
  fabPressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.85,
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '500',
    marginTop: -2,
  },
  pressed: {
    opacity: 0.65,
  },
});
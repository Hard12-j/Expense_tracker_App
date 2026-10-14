import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@/theme/theme';
import { useExpenses } from '@/context/ExpenseContext';
import CustomBox from '@/components/CustomBox';
import SignUpScreen from './signup';
import type { AuthError } from '@/services/authService';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { loginWithCredentials } = useExpenses();

  const [showSignUp, setShowSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (showSignUp) {
    return <SignUpScreen onBackToLogin={() => setShowSignUp(false)} />;
  }

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please provide a username and password.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      await loginWithCredentials({ userName: username.trim(), password });
      // On success the context sets isLoggedIn = true → _layout.tsx navigates automatically
    } catch (err: unknown) {
      const authErr = err as AuthError;
      if (authErr?.status === 401 || authErr?.status === 403) {
        setError('Invalid username or password. Please try again.');
      } else if (authErr?.status === 0 || !authErr?.status) {
        setError('Cannot reach the server. Check your network connection.');
      } else {
        setError(authErr?.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          {/* Header Branding */}
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoEmoji}>💳</Text>
            </View>
            <Text style={styles.brandTitle}>ExpenseTracker</Text>
            <Text style={styles.brandSubtitle}>
              Sign in to track your spends & stay within budget
            </Text>
          </View>

          {/* Login Card (CustomBox) */}
          <CustomBox variant="elevated" style={styles.loginCard}>
            <Text style={styles.cardHeading}>Login</Text>

            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Text style={styles.inputLabel}>USERNAME / EMAIL</Text>
            <TextInput
              style={styles.textInput}
              placeholder="User Name or Email"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              underlineColorAndroid="transparent"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>PASSWORD</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              underlineColorAndroid="transparent"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Submit Button */}
            <Pressable
              android_ripple={{ color: 'rgba(255, 255, 255, 0.25)', borderless: false }}
              style={({ pressed }) => [styles.submitBtn, pressed && Platform.OS === 'ios' && styles.btnPressed]}
              onPress={handleLogin}
              disabled={isLoading}>
              <Text style={styles.submitBtnText}>
                {isLoading ? 'Signing In...' : 'Submit'}
              </Text>
            </Pressable>

            {/* Switch to SignUp */}
            <Pressable
              android_ripple={{ color: 'rgba(255, 255, 255, 0.12)', borderless: false }}
              style={({ pressed }) => [styles.secondaryBtn, pressed && Platform.OS === 'ios' && styles.btnPressed]}
              onPress={() => setShowSignUp(true)}>
              <Text style={styles.secondaryBtnText}>Create New Account (Sign Up)</Text>
            </Pressable>
          </CustomBox>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#1E2538',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 122, 255, 0.4)',
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 32,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.heavy,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 4,
    textAlign: 'center',
  },
  loginCard: {
    backgroundColor: '#151821',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
  },
  cardHeading: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.lg,
  },
  errorBanner: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    borderRadius: theme.borderRadius.sm,
    padding: 10,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  errorText: {
    color: theme.colors.status.error,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600',
  },
  inputLabel: {
    color: theme.colors.text.secondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 4,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.base,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: theme.spacing.md,
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.base,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  secondaryBtnText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600',
  },
  demoBtn: {
    alignSelf: 'center',
    marginTop: theme.spacing.xl,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  demoBtnText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  pressed: {
    opacity: 0.65,
  },
});

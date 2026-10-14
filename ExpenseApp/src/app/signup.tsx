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
import type { AuthError } from '@/services/authService';

export default function SignUpScreen({ onBackToLogin }: { onBackToLogin?: () => void }) {
  const insets = useSafeAreaInsets();
  const { signupWithDetails } = useExpenses();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!firstName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError('First Name, Username, Email and Password are required.');
      return;
    }

    // Phone: strip non-digits; fall back to 0 so backend Long doesn't blow up
    const phoneNum = parseInt(phone.replace(/\D/g, ''), 10) || 0;

    setIsLoading(true);
    setError(null);

    try {
      await signupWithDetails({
        user_name: username.trim(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim() || 'User',
        phone_number: phoneNum,
        email: email.trim(),
      });
      // Context sets isLoggedIn = true → _layout.tsx navigates automatically
    } catch (err: unknown) {
      const authErr = err as AuthError;
      if (authErr?.status === 400 && authErr.message?.includes('Already Exist')) {
        setError('That username is already taken. Please choose another.');
      } else if (authErr?.status === 0 || !authErr?.status) {
        setError('Cannot reach the server. Check your network connection.');
      } else {
        setError(authErr?.message || 'Sign up failed. Please try again.');
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
          {/* Header */}
          <View style={styles.brandContainer}>
            <Text style={styles.brandTitle}>Create Account</Text>
            <Text style={styles.brandSubtitle}>
              Join ExpenseTracker to monitor and optimize your budget
            </Text>
          </View>

          {/* Form Card (CustomBox) */}
          <CustomBox variant="elevated" style={styles.formCard}>
            <Text style={styles.cardHeading}>Sign Up</Text>

            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.rowInputs}>
              <View style={styles.colInput}>
                <Text style={styles.inputLabel}>FIRST NAME</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="First Name"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  underlineColorAndroid="transparent"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>

              <View style={styles.colInput}>
                <Text style={styles.inputLabel}>LAST NAME</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Last Name"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  underlineColorAndroid="transparent"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>USERNAME</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Unique Username"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              underlineColorAndroid="transparent"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>EMAIL</Text>
            <TextInput
              style={styles.textInput}
              placeholder="email@example.com"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              underlineColorAndroid="transparent"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>PHONE NUMBER</Text>
            <TextInput
              style={styles.textInput}
              placeholder="+91 98765 43210"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              underlineColorAndroid="transparent"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>PASSWORD</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Secure password"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              underlineColorAndroid="transparent"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Submit */}
            <Pressable
              android_ripple={{ color: 'rgba(255, 255, 255, 0.25)', borderless: false }}
              style={({ pressed }) => [styles.submitBtn, pressed && Platform.OS === 'ios' && styles.btnPressed]}
              onPress={handleSignUp}
              disabled={isLoading}>
              <Text style={styles.submitBtnText}>{isLoading ? 'Signing Up...' : 'Sign Up'}</Text>
            </Pressable>

            {/* Go to Login */}
            <Pressable
              android_ripple={{ color: 'rgba(255, 255, 255, 0.12)', borderless: false }}
              style={({ pressed }) => [styles.secondaryBtn, pressed && Platform.OS === 'ios' && styles.btnPressed]}
              onPress={() => onBackToLogin?.()}>
              <Text style={styles.secondaryBtnText}>Already have an account? Log In</Text>
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
    marginBottom: theme.spacing.lg,
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
  formCard: {
    backgroundColor: '#151821',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
  },
  cardHeading: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.md,
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
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  colInput: {
    flex: 1,
  },
  inputLabel: {
    color: theme.colors.text.secondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 5,
    marginTop: 2,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: theme.spacing.sm,
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
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
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { theme } from '@/theme/theme';
import { ExpenseCategory } from '@/types/expense';
import { useExpenses } from '@/context/ExpenseContext';

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
}

const CATEGORIES: { label: ExpenseCategory; icon: string }[] = [
  { label: 'Shopping', icon: '🛍️' },
  { label: 'Dining', icon: '☕' },
  { label: 'Transport', icon: '🚗' },
  { label: 'Entertainment', icon: '🍿' },
  { label: 'Utilities', icon: '⚡' },
  { label: 'Groceries', icon: '🛒' },
  { label: 'Health', icon: '💊' },
  { label: 'General', icon: '💸' },
];

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ visible, onClose }) => {
  const { addExpense, currency } = useExpenses();
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Shopping');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!merchant.trim()) {
      setError('Please enter a merchant or description.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    addExpense({
      merchant: merchant.trim(),
      amount: parsedAmount,
      currency,
      category,
      notes: notes.trim() || undefined,
    });

    // Reset & close
    setMerchant('');
    setAmount('');
    setNotes('');
    setCategory('Shopping');
    setError(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}>
        <Pressable style={styles.dismissOverlay} onPress={onClose} />

        <View style={styles.sheetContent}>
          <View style={styles.indicatorBar} />

          <View style={styles.header}>
            <Text style={styles.title}>New Spend</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.closeBtn}>✕</Text>
            </Pressable>
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>
            {/* Amount Input */}
            <Text style={styles.label}>AMOUNT ({currency})</Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.currencyPrefix}>{currency}</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="rgba(255, 255, 255, 0.25)"
                keyboardType="decimal-pad"
                underlineColorAndroid="transparent"
                value={amount}
                onChangeText={(val) => {
                  setAmount(val);
                  setError(null);
                }}
              />
            </View>

            {/* Merchant Input */}
            <Text style={styles.label}>MERCHANT / PAYEE</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Whole Foods, Netflix, Uber"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              underlineColorAndroid="transparent"
              value={merchant}
              onChangeText={(val) => {
                setMerchant(val);
                setError(null);
              }}
            />

            {/* Category Selector */}
            <Text style={styles.label}>CATEGORY</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.label;
                return (
                  <Pressable
                    key={cat.label}
                    android_ripple={{ color: 'rgba(255, 255, 255, 0.15)', borderless: false }}
                    onPress={() => setCategory(cat.label)}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.categoryChipSelected,
                    ]}>
                    <Text style={styles.chipEmoji}>{cat.icon}</Text>
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}>
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Notes Input */}
            <Text style={styles.label}>NOTES (OPTIONAL)</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Additional details or receipt note"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              underlineColorAndroid="transparent"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={2}
            />

            {/* Action Buttons */}
            <Pressable
              android_ripple={{ color: 'rgba(255, 255, 255, 0.25)', borderless: false }}
              style={({ pressed }) => [styles.submitBtn, pressed && Platform.OS === 'ios' && styles.btnPressed]}
              onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Add Expense</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  dismissOverlay: {
    flex: 1,
  },
  sheetContent: {
    backgroundColor: '#161922',
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: theme.spacing.sm,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  indicatorBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
  },
  closeBtn: {
    color: theme.colors.text.secondary,
    fontSize: 18,
    padding: 4,
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
  formScroll: {
    marginBottom: 10,
  },
  label: {
    color: theme.colors.text.secondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 10,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  currencyPrefix: {
    color: theme.colors.primary,
    fontSize: 26,
    fontWeight: '700',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    paddingVertical: 12,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.base,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  notesInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  categoryRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipEmoji: {
    marginRight: 6,
    fontSize: 15,
  },
  chipText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.base,
    fontWeight: '700',
  },
});

export default AddExpenseModal;

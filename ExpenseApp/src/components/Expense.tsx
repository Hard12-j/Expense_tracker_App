import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { theme } from '@/theme/theme';
import { ExpenseDto, ExpenseCategory } from '@/types/expense';

interface ExpenseProps {
  item: ExpenseDto;
  onDelete?: (key: number) => void;
}

const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  Shopping: '🛍️',
  Dining: '☕',
  Transport: '🚗',
  Entertainment: '🍿',
  Utilities: '⚡',
  Groceries: '🛒',
  Health: '💊',
  General: '💸',
};

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Shopping: '#FF2D55',
  Dining: '#FF9500',
  Transport: '#5856D6',
  Entertainment: '#AF52DE',
  Utilities: '#30B0C7',
  Groceries: '#34C759',
  Health: '#FF3B30',
  General: '#007AFF',
};

export const Expense: React.FC<ExpenseProps> = ({ item, onDelete }) => {
  const formatDate = (dateInput: Date | string) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'Recently';

    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    if (isToday) {
      return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const catColor = CATEGORY_COLORS[item.category] || theme.colors.primary;
  const icon = CATEGORY_ICONS[item.category] || '💸';

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={[styles.iconWrapper, { backgroundColor: `${catColor}20`, borderColor: `${catColor}40` }]}>
          <Text style={styles.categoryEmoji}>{icon}</Text>
        </View>

        <View style={styles.merchantInfo}>
          <Text style={styles.merchantText} numberOfLines={1}>
            {item.merchant}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.categoryTag}>{item.category}</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightContent}>
        <Text style={styles.amountText}>
          -{item.currency}{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>

        {onDelete && (
          <Pressable
            hitSlop={10}
            android_ripple={{ color: 'rgba(239, 68, 68, 0.25)', borderless: true, radius: 18 }}
            onPress={() => onDelete(item.key)}
            style={({ pressed }) => [styles.deleteBtn, pressed && Platform.OS === 'ios' && styles.deletePressed]}>
            <Text style={styles.deleteIcon}>✕</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md - 2,
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.surface.cardBorder,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
      },
    }),
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: theme.spacing.md - 2,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  merchantInfo: {
    flex: 1,
  },
  merchantText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTag: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '500',
  },
  dotSeparator: {
    color: theme.colors.text.tertiary,
    fontSize: 10,
    marginHorizontal: 5,
  },
  dateText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },
  amountText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: -0.2,
  },
  deleteBtn: {
    padding: 3,
    opacity: 0.45,
  },
  deletePressed: {
    opacity: 1,
  },
  deleteIcon: {
    color: theme.colors.text.secondary,
    fontSize: 11,
    fontWeight: '700',
  },
});

export default Expense;

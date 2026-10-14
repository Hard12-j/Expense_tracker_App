import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { theme } from '@/theme/theme';
import { useExpenses } from '@/context/ExpenseContext';

interface ExpenseTrackerGraphProps {
  size?: number;
  strokeWidth?: number;
}

export const ExpenseTrackerGraph: React.FC<ExpenseTrackerGraphProps> = ({
  size = 170,
  strokeWidth = 14,
}) => {
  const { totalSpent, budgetLimit, percentageSpent, statusText, currency } = useExpenses();

  const strokeColor =
    statusText === 'Healthy'
      ? theme.colors.status.success
      : statusText === 'At Risk'
      ? theme.colors.status.warning
      : theme.colors.status.error;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.outerContainer, { width: size, height: size }]}>
        {/* Outer subtle glow background */}
        <View
          style={[
            styles.glowRing,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: strokeColor,
              shadowColor: strokeColor,
            },
          ]}
        />

        {/* Circular Progress Gauge representation */}
        <View
          style={[
            styles.trackRing,
            {
              width: size - 8,
              height: size - 8,
              borderRadius: (size - 8) / 2,
              borderWidth: strokeWidth,
            },
          ]}>
          {/* Active Progress Arc */}
          <View
            style={[
              styles.progressArc,
              {
                borderColor: strokeColor,
                borderWidth: strokeWidth,
                borderRadius: (size - 8) / 2,
                transform: [
                  { rotate: `${Math.min(360, (percentageSpent / 100) * 360)}deg` },
                ],
              },
            ]}
          />
        </View>

        {/* Center Stats Display */}
        <View style={styles.centerContent}>
          <Text style={[styles.percentageText, { color: theme.colors.text.primary }]}>
            {percentageSpent}%
          </Text>
          <Text style={styles.spentLabel}>OF BUDGET</Text>
          <View style={styles.amountBadge}>
            <Text style={styles.amountText}>
              {currency}{totalSpent.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
      <Text style={[styles.subLimitText]}>
        Limit: {currency}{budgetLimit.toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
  },
  outerContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowRing: {
    position: 'absolute',
    borderWidth: 1,
    opacity: 0.25,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 18,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 0 30px rgba(0, 122, 255, 0.25)',
      },
    }),
  },
  trackRing: {
    position: 'absolute',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressArc: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    opacity: 0.95,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  spentLabel: {
    color: theme.colors.text.secondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: -2,
    marginBottom: 4,
  },
  amountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  amountText: {
    color: theme.colors.text.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  subLimitText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    marginTop: theme.spacing.xs + 2,
    fontWeight: '500',
  },
});

export default ExpenseTrackerGraph;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme/theme';
import { useExpenses } from '@/context/ExpenseContext';

export const SpendsInsights: React.FC = () => {
  const { statusText, budgetLimit, topCategory, dailyAverage, currency } = useExpenses();

  const getStatusColor = () => {
    switch (statusText) {
      case 'Healthy':
        return theme.colors.status.success;
      case 'At Risk':
        return theme.colors.status.warning;
      case 'Over Budget':
        return theme.colors.status.error;
      default:
        return theme.colors.status.info;
    }
  };

  const insightsData = [
    {
      id: '1',
      label: 'Budget Status',
      value: statusText,
      badgeColor: getStatusColor(),
      isStatus: true,
    },
    {
      id: '2',
      label: 'Monthly Limit',
      value: `${currency}${budgetLimit.toLocaleString()}`,
    },
    {
      id: '3',
      label: 'Top Category',
      value: `${topCategory.category} (${currency}${topCategory.amount.toLocaleString()})`,
    },
    {
      id: '4',
      label: 'Daily Average',
      value: `${currency}${dailyAverage.toLocaleString()} / day`,
    },
  ];

  return (
    <View style={styles.container}>
      {insightsData.map((insight) => (
        <View key={insight.id} style={styles.insightRow}>
          <View style={styles.labelCol}>
            <Text style={styles.indexNumber}>{insight.id}.</Text>
            <Text style={styles.labelText}>{insight.label}</Text>
          </View>

          {insight.isStatus ? (
            <View style={[styles.statusBadge, { backgroundColor: `${insight.badgeColor}22` }]}>
              <View style={[styles.statusDot, { backgroundColor: insight.badgeColor }]} />
              <Text style={[styles.statusValue, { color: insight.badgeColor }]}>
                {insight.value}
              </Text>
            </View>
          ) : (
            <Text style={styles.valueText} numberOfLines={1}>
              {insight.value}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 10,
    paddingLeft: theme.spacing.xs,
  },
  insightRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  labelCol: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 4,
  },
  indexNumber: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '700',
  },
  labelText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '500',
  },
  valueText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
    gap: 6,
    marginTop: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusValue: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '700',
  },
});

export default SpendsInsights;

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/theme/theme';
import { useExpenses } from '@/context/ExpenseContext';
import { ExpenseCategory } from '@/types/expense';
import { StatusBar } from 'expo-status-bar';
import CustomBox from '@/components/CustomBox';
import Expense from '@/components/Expense';
import AddExpenseModal from '@/components/AddExpenseModal';

const CATEGORIES: ('All' | ExpenseCategory)[] = [
  'All',
  'Shopping',
  'Dining',
  'Transport',
  'Entertainment',
  'Utilities',
  'Groceries',
  'Health',
  'General',
];

export default function SpendsScreen() {
  const insets = useSafeAreaInsets();
  const { expenses, deleteExpense, totalSpent, currency, budgetLimit } = useExpenses();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ExpenseCategory>('All');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // Filtered expenses
  const filteredList = useMemo(() => {
    return expenses.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [expenses, selectedCategory, searchQuery]);

  // Category spending breakdown for analytics
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    expenses.forEach((item) => {
      stats[item.category] = (stats[item.category] || 0) + item.amount;
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 16) }]}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + 90 },
        ]}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.screenTitle}>Transactions</Text>
            <Text style={styles.screenSubtitle}>
              {expenses.length} total recorded expenses
            </Text>
          </View>
          <Pressable
            android_ripple={{ color: 'rgba(255, 255, 255, 0.25)', borderless: false }}
            style={({ pressed }) => [styles.newSpendBtn, pressed && Platform.OS === 'ios' && styles.btnPressed]}
            onPress={() => setIsAddModalVisible(true)}>
            <Text style={styles.newSpendText}>＋ Add</Text>
          </Pressable>
        </View>

        {/* Spending Breakdown Card */}
        <CustomBox variant="elevated" style={styles.breakdownCard}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.breakdownTitle}>Category Distribution</Text>
            <Text style={styles.breakdownTotal}>
              {currency}{totalSpent.toLocaleString()}
            </Text>
          </View>

          <View style={styles.barsContainer}>
            {categoryStats.slice(0, 4).map(([cat, amount]) => {
              const pct = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
              return (
                <View key={cat} style={styles.categoryBarRow}>
                  <View style={styles.barLabels}>
                    <Text style={styles.barCatName}>{cat}</Text>
                    <Text style={styles.barAmount}>
                      {currency}{amount.toLocaleString()} ({pct}%)
                    </Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${pct}%`,
                          backgroundColor:
                            cat === 'Shopping'
                              ? '#FF2D55'
                              : cat === 'Dining'
                              ? '#FF9500'
                              : cat === 'Transport'
                              ? '#5856D6'
                              : theme.colors.primary,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </CustomBox>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by merchant or notes..."
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
            underlineColorAndroid="transparent"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={10}>
              <Text style={styles.clearIcon}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}>
          {CATEGORIES.map((cat) => {
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

        {/* Transactions List */}
        <View style={styles.listSection}>
          <Text style={styles.sectionHeader}>
            {filteredList.length} Result{filteredList.length === 1 ? '' : 's'}
          </Text>

          {filteredList.length > 0 ? (
            filteredList.map((item) => (
              <Expense key={item.key} item={item} onDelete={deleteExpense} />
            ))
          ) : (
            <CustomBox variant="glass" style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No matching transactions</Text>
              <Text style={styles.emptyDesc}>
                Try adjusting your search query or category filter.
              </Text>
            </CustomBox>
          )}
        </View>
      </ScrollView>

      {/* Add Modal */}
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
  container: {
    paddingHorizontal: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  screenTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.heavy,
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 2,
  },
  newSpendBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: theme.borderRadius.full,
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
  newSpendText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: theme.typography.fontSize.sm,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  breakdownCard: {
    backgroundColor: '#141720',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  breakdownTitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  breakdownTotal: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '700',
  },
  barsContainer: {
    gap: 10,
    marginTop: 4,
  },
  categoryBarRow: {
    gap: 4,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barCatName: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600',
  },
  barAmount: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
  },
  barTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: theme.spacing.sm,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
    opacity: 0.7,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.sm,
    paddingVertical: 10,
  },
  clearIcon: {
    color: theme.colors.text.secondary,
    fontSize: 14,
    padding: 4,
  },
  categoryScroll: {
    marginBottom: theme.spacing.md,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginRight: 8,
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
  listSection: {
    marginTop: 4,
  },
  sectionHeader: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
    marginLeft: 4,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing['2xl'],
    marginVertical: theme.spacing.md,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  emptyTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '700',
  },
  emptyDesc: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 4,
    textAlign: 'center',
  },
});

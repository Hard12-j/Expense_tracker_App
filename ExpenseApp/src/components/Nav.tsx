import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform } from 'react-native';
import { router } from 'expo-router';
import { theme } from '@/theme/theme';
import { useExpenses } from '@/context/ExpenseContext';

interface NavProps {
  onOpenAddModal?: () => void;
}

export const Nav: React.FC<NavProps> = ({ onOpenAddModal }) => {
  const { user } = useExpenses();

  const handleProfilePress = () => {
    router.push('/profile' as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoIcon}>💳</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>ExpenseTracker</Text>
          <Text style={styles.subtitle}>Welcome back, {user.firstName}</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        {onOpenAddModal && (
          <Pressable
            android_ripple={{ color: 'rgba(255, 255, 255, 0.25)', borderless: false }}
            style={({ pressed }) => [styles.addButton, pressed && Platform.OS === 'ios' && styles.pressed]}
            onPress={onOpenAddModal}>
            <Text style={styles.addIcon}>＋</Text>
            <Text style={styles.addText}>Add</Text>
          </Pressable>
        )}

        <Pressable
          android_ripple={{ color: 'rgba(37, 99, 235, 0.3)', borderless: true, radius: 24 }}
          style={({ pressed }) => [styles.avatarContainer, pressed && Platform.OS === 'ios' && styles.pressed]}
          onPress={handleProfilePress}>
          <Image source={{ uri: user.profilePic }} style={styles.avatarImage} />
          <View style={styles.onlineDot} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm + 4,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#1E2538',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  logoIcon: {
    fontSize: 22,
  },
  textContainer: {
    justifyContent: 'center',
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm + 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.borderRadius.full,
    gap: 4,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  addIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  addText: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.status.success,
    borderWidth: 2,
    borderColor: theme.colors.background.primary,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },
});

export default Nav;

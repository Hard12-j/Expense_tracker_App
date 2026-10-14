import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Switch,
  TextInput,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@/theme/theme';
import { useExpenses } from '@/context/ExpenseContext';
import CustomBox from '@/components/CustomBox';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const {
    user,
    updateUser,
    budgetLimit,
    setBudgetLimit,
    currency,
    setCurrency,
    resetSampleData,
    logout,
  } = useExpenses();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isEditBudgetModal, setIsEditBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budgetLimit.toString());

  const [isEditProfileModal, setIsEditProfileModal] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState(user.firstName);
  const [lastNameInput, setLastNameInput] = useState(user.lastName);
  const [phoneInput, setPhoneInput] = useState(user.phoneNumber.toString());
  const [emailInput, setEmailInput] = useState(user.email);

  const currencies = ['₹', '$', '€', '£'];

  const handleSaveBudget = () => {
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val > 0) {
      setBudgetLimit(val);
      setIsEditBudgetModal(false);
    }
  };

  const handleSaveProfile = () => {
    updateUser({
      firstName: firstNameInput.trim() || user.firstName,
      lastName: lastNameInput.trim() || user.lastName,
      phoneNumber: phoneInput.trim() || user.phoneNumber,
      email: emailInput.trim() || user.email,
    });
    setIsEditProfileModal(false);
  };

  const handleResetData = () => {
    resetSampleData();
    Alert.alert('Reset Complete', 'Sample expenses and profile restored to defaults.');
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 16) }]}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + 90 },
        ]}>
        {/* Header with Avatar & User Info */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.profilePic }} style={styles.avatarImage} />
            <Pressable
              style={({ pressed }) => [styles.cameraBadge, pressed && styles.pressed]}
              onPress={() => setIsEditProfileModal(true)}>
              <Text style={styles.cameraIcon}>✏️</Text>
            </Pressable>
          </View>
          <Text style={styles.userName}>
            {user.firstName} {user.lastName}
          </Text>
          <View style={styles.userIdBadge}>
            <Text style={styles.userIdText}>ID: {user.userId}</Text>
          </View>
        </View>

        {/* Section 1: Personal Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <Pressable onPress={() => setIsEditProfileModal(true)} hitSlop={10}>
              <Text style={styles.editActionText}>Edit</Text>
            </Pressable>
          </View>

          <CustomBox variant="elevated" style={styles.card}>
            <View style={styles.itemRow}>
              <View style={styles.iconBox}>
                <Text style={styles.rowEmoji}>👤</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>Full Name</Text>
                <Text style={styles.itemValue}>
                  {user.firstName} {user.lastName}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.itemRow}>
              <View style={styles.iconBox}>
                <Text style={styles.rowEmoji}>📞</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>Phone</Text>
                <Text style={styles.itemValue}>{user.phoneNumber}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.itemRow}>
              <View style={styles.iconBox}>
                <Text style={styles.rowEmoji}>✉️</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>Email</Text>
                <Text style={styles.itemValue}>{user.email}</Text>
              </View>
            </View>
          </CustomBox>
        </View>

        {/* Section 2: Budget & Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Preferences</Text>

          <CustomBox variant="elevated" style={styles.card}>
            <Pressable
              style={styles.clickableRow}
              onPress={() => {
                setBudgetInput(budgetLimit.toString());
                setIsEditBudgetModal(true);
              }}>
              <View style={styles.iconBox}>
                <Text style={styles.rowEmoji}>🎯</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>Monthly Budget Limit</Text>
                <Text style={styles.itemValue}>
                  {currency}{budgetLimit.toLocaleString()}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>

            <View style={styles.divider} />

            <View style={styles.itemRow}>
              <View style={styles.iconBox}>
                <Text style={styles.rowEmoji}>💱</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>Default Currency</Text>
                <View style={styles.currencyToggleRow}>
                  {currencies.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setCurrency(c)}
                      style={[
                        styles.currPill,
                        currency === c && styles.currPillActive,
                      ]}>
                      <Text
                        style={[
                          styles.currPillText,
                          currency === c && styles.currPillTextActive,
                        ]}>
                        {c}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </CustomBox>
        </View>

        {/* Section 3: App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <CustomBox variant="elevated" style={styles.card}>
            <View style={styles.itemRow}>
              <View style={styles.iconBox}>
                <Text style={styles.rowEmoji}>🔔</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>Notifications</Text>
                <Text style={styles.itemValueSub}>Daily limit & spend alerts</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#3A3D4A', true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.itemRow}>
              <View style={styles.iconBox}>
                <Text style={styles.rowEmoji}>🌙</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>Theme Mode</Text>
                <Text style={styles.itemValueSub}>OLED Apple Dark</Text>
              </View>
              <View style={styles.systemTag}>
                <Text style={styles.systemTagText}>Active</Text>
              </View>
            </View>
          </CustomBox>
        </View>

        {/* Section 4: Account Actions */}
        <View style={styles.section}>
          <Pressable
            style={({ pressed }) => [styles.actionButton, styles.resetButton, pressed && styles.pressed]}
            onPress={handleResetData}>
            <Text style={styles.resetButtonText}>🔄 Reset to Sample Data</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.actionButton, styles.signOutButton, pressed && styles.pressed]}
            onPress={() => {
              Alert.alert(
                'Sign Out',
                'Are you sure you want to sign out?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
                ]
              );
            }}>
            <Text style={styles.signOutButtonText}>🚪 Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Edit Budget Modal */}
      <Modal
        visible={isEditBudgetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditBudgetModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Set Monthly Budget</Text>
            <Text style={styles.modalSubtitle}>
              Adjust your monthly spending limit to recalculate your circular gauge and insights.
            </Text>
            <View style={styles.budgetInputContainer}>
              <Text style={styles.inputPrefix}>{currency}</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                underlineColorAndroid="transparent"
                value={budgetInput}
                onChangeText={setBudgetInput}
              />
            </View>
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={() => setIsEditBudgetModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalSaveBtn} onPress={handleSaveBudget}>
                <Text style={styles.modalSaveText}>Save Limit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditProfileModal}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditProfileModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.modalTextInput}
              underlineColorAndroid="transparent"
              value={firstNameInput}
              onChangeText={setFirstNameInput}
            />

            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.modalTextInput}
              underlineColorAndroid="transparent"
              value={lastNameInput}
              onChangeText={setLastNameInput}
            />

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.modalTextInput}
              keyboardType="email-address"
              underlineColorAndroid="transparent"
              value={emailInput}
              onChangeText={setEmailInput}
            />

            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.modalTextInput}
              keyboardType="phone-pad"
              underlineColorAndroid="transparent"
              value={phoneInput}
              onChangeText={setPhoneInput}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={() => setIsEditProfileModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalSaveBtn} onPress={handleSaveProfile}>
                <Text style={styles.modalSaveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: theme.spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  avatarImage: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1E2538',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  cameraIcon: {
    fontSize: 14,
  },
  userName: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: 4,
  },
  userIdBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  userIdText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: -0.2,
    marginBottom: theme.spacing.xs,
    paddingHorizontal: 4,
  },
  editActionText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#141720',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 6,
    paddingHorizontal: theme.spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  clickableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowEmoji: {
    fontSize: 18,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    marginBottom: 2,
  },
  itemValue: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
  },
  itemValueSub: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.xs,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  chevron: {
    color: theme.colors.text.secondary,
    fontSize: 22,
    fontWeight: '300',
  },
  currencyToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  currPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  currPillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  currPillText: {
    color: theme.colors.text.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  currPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  systemTag: {
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
  },
  systemTagText: {
    color: theme.colors.status.success,
    fontSize: 11,
    fontWeight: '700',
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginBottom: 10,
  },
  authButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  authButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '700',
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  resetButtonText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#181B24',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700',
    marginBottom: 6,
  },
  modalSubtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    marginBottom: 16,
    lineHeight: 18,
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 18,
  },
  inputPrefix: {
    color: theme.colors.primary,
    fontSize: 22,
    fontWeight: '700',
    marginRight: 6,
  },
  modalInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    paddingVertical: 10,
  },
  inputLabel: {
    color: theme.colors.text.secondary,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
  },
  modalTextInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 18,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalCancelText: {
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  modalSaveBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.md,
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
  signOutButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.35)',
  },
  signOutButtonText: {
    color: '#FF3B30',
    fontSize: theme.typography.fontSize.base,
    fontWeight: '700',
  },
});

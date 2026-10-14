import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, ActivityIndicator, View } from 'react-native';
import '../global.css';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { ExpenseProvider, useExpenses } from '@/context/ExpenseContext';
import LoginScreen from './login';

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const { isLoggedIn, authLoading } = useExpenses();

  // Guarantee that the native splash screen is dismissed once auth resolves
  useEffect(() => {
    if (!authLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [authLoading]);

  // Silently restoring stored session — show a neutral loading screen
  // so users don't see an unwanted flash of the login screen.
  if (authLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0D1117', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <>
      <AnimatedSplashOverlay />
      {isLoggedIn ? <AppTabs /> : <LoginScreen />}
    </>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ExpenseProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppNavigator />
      </ThemeProvider>
    </ExpenseProvider>
  );
}

import React, { use } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AppNavigator from './AppNavigator';

import { useAuth, type AuthState } from '../store/useAuth';
import { useTheme } from '../store/useTheme';
import { ProfileSheetProvider } from '../components/sheets/ProfileSheetContext';
import TabNavigator from './TabNavigator';
import OtpScreen from '../screens/OtpScreen';

type RootStackParamList = { App: undefined; AuthStack: undefined };
type AuthStackParamList = { Login: undefined; Register: undefined , Otp:undefined };

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const MyLight = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    card: '#ffffff',
    text: '#000000',
    border: '#e5e7eb',
  },
};

const MyDark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0b0b0c',
    card: '#111214',
    text: '#f5f5f5',
    border: '#1f2023',
  },
};

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="Otp" component={OtpScreen} />
    </AuthStack.Navigator>
  );
}

export default function RootNavigator() {
  const isHydrated = useAuth((s: AuthState) => s.isHydrated);
  const token = useAuth((s: AuthState) => s.token);
  const isLogin = useAuth((s: AuthState) => s.otpVerified)
  const mode = useTheme(s => s.mode);

  if (!isHydrated) return null;

  return (
    <NavigationContainer theme={mode === 'light' ? MyLight : MyDark}>
      <ProfileSheetProvider>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {isLogin ? (
            <RootStack.Screen name="App" component={TabNavigator} />
          ) : (
            <RootStack.Screen name="AuthStack" component={AuthStackNavigator} />
          )}
        </RootStack.Navigator>
      </ProfileSheetProvider>
    </NavigationContainer>
  );
}

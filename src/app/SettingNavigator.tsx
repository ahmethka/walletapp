// src/app/stacks/SettingsStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/SettingsScreen';
import ThemeScreen from '../screens/ThemeScreen';
import PinSettingsScreen from '../screens/PinSettingsScreen';
import SupportScreen from '../screens/SupportScreen';
import { HeaderLeftProfile, HeaderRightActions } from '../components/navigations/HeaderButtons';

const Stack = createNativeStackNavigator();
export default function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#ffffff' },
        headerTitleStyle: { color: '#000' },
        headerTintColor: '#000',
        headerTitleAlign: 'center',
        headerLeft: () => <HeaderLeftProfile />,
        headerRight: () => <HeaderRightActions />,
      }}
    >
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ayarlar' }} />
      <Stack.Screen name="Theme" component={ThemeScreen} options={{ title: 'Tema' }} />
      <Stack.Screen name="PinSettings" component={PinSettingsScreen} options={{ title: 'PIN Ayarları' }} />
      <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Destek' }} />
    </Stack.Navigator>
  );
}

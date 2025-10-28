// src/app/stacks/SettingsStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/SettingsScreen';
import ThemeScreen from '../screens/ThemeScreen';
import PinSettingsScreen from '../screens/PinSettingsScreen';
import SupportScreen from '../screens/SupportScreen';
import { HeaderLeftProfile, HeaderRightActions } from '../components/navigations/HeaderButtons';
import AddMoneyScreen from '../screens/AddMoneyScreen';

const Stack = createNativeStackNavigator();
export default function TransferStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#ffffff' },
        headerTitleStyle: { color: '#000' },
        headerTintColor: '#000',
        headerTitleAlign: 'center',
        // headerLeft: () => <HeaderLeftProfile />,
        headerRight: () => <HeaderRightActions />,
      }}
    >
      <Stack.Screen name="Yükle" component={AddMoneyScreen} options={{ title: 'Ayarlar' }} />
    </Stack.Navigator>
  );
}
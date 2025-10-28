import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeStack from './HomeNavigator';
import CardsStack from './CardNavigator';
import TransactionsStack from './TransactionNavigator';
import TransferStack from './TransferNavigator';
import SettingsStack from './SettingNavigator';
import { ProfileSheetProvider } from '../components/sheets/ProfileSheetContext';
import { HeaderRightActions } from '../components/navigations/HeaderButtons';
import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <ProfileSheetProvider>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: '#ffffff', borderTopColor: '#e5e7eb' },
          tabBarActiveTintColor: '#000000',
          tabBarInactiveTintColor: '#6b7280',
        }}
      >
        <Tab.Screen
          name="Ana Sayfa"
          component={HomeStack}
          options={{ tabBarIcon: ({ color, size }) => <Ionicons name="wallet" color={color} size={size} /> }}
        />
        <Tab.Screen
          name="İşlemler"
          component={TransactionsStack}
          options={{ tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} /> }}
        />
        <Tab.Screen
          name="Yükle"
          component={TransferStack}
          options={{ tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} /> }}
        />
        <Tab.Screen
          name="Kartlar"
          component={CardsStack}
          options={{ tabBarIcon: ({ color, size }) => <Ionicons name="card" color={color} size={size} /> }}
        />
        <Tab.Screen
          name="Ayarlar"
          component={SettingsStack}
          options={{ tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} /> }}
        />
      </Tab.Navigator>
    </ProfileSheetProvider>
  );
}

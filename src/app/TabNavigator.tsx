import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AddMoneyScreen from '../screens/AddMoneyScreen';
import CardsScreen from '../screens/CardsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import { HeaderRightActions, HeaderLeftProfile } from '../components/navigations/HeaderButtons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TransferScreen from '../screens/TransferScreen';
import AddCardScreen from '../screens/AddCardScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ThemeScreen from '../screens/ThemeScreen';
import PinSettingsScreen from '../screens/PinSettingsScreen';
import SupportScreen from '../screens/SupportScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#000000',
        headerTitleStyle: { color: '#000' },
        tabBarStyle: { backgroundColor: '#ffffff', borderTopColor: '#e5e7eb' },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#6b7280',
        headerLeft: () => <HeaderLeftProfile />,
        headerRight: () => <HeaderRightActions />,
      }}
    >
      <Tab.Screen
        name="Ana Sayfa"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="wallet" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="İşlemler"
        component={TransactionsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Yükle"
        component={AddMoneyScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Kartlar"
        component={CardsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="card" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Ayarlar"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}

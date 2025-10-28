// src/app/stacks/HomeStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import TransferScreen from '../screens/TransferScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import { HeaderLeftProfile, HeaderRightActions } from '../components/navigations/HeaderButtons';

const Stack = createNativeStackNavigator();
export default function HomeStack() {
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
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Ana Sayfa' }} />
      <Stack.Screen name="Transfer" component={TransferScreen} options={{ title: 'Transfer' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Bildirimler' }} />
    </Stack.Navigator>
  );
}

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import TransferScreen from '../screens/TransferScreen';
import AddCardScreen from '../screens/AddCardScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ThemeScreen from '../screens/ThemeScreen';
import PinSettingsScreen from '../screens/PinSettingsScreen';
import SupportScreen from '../screens/SupportScreen';
import { HeaderRightActions, HeaderLeftProfile } from '../components/navigations/HeaderButtons';
import { ProfileSheetProvider } from '../components/sheets/ProfileSheetContext';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <ProfileSheetProvider>
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
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Transfer" component={TransferScreen} options={{ title: 'Transfer' }} />
        <Stack.Screen name="AddCard" component={AddCardScreen} options={{ title: 'Kart Ekle' }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Bildirimler' }} />
        <Stack.Screen name="Theme" component={ThemeScreen} options={{ title: 'Tema' }} />
        <Stack.Screen name="PinSettings" component={PinSettingsScreen} options={{ title: 'PIN Ayarları' }} />
        <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Destek' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ayarlar' }} />
      </Stack.Navigator>
    </ProfileSheetProvider>
  );
}

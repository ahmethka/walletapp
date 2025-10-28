// src/app/stacks/TransactionsStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TransactionsScreen from '../screens/TransactionsScreen';
import { HeaderLeftProfile, HeaderRightActions } from '../components/navigations/HeaderButtons';

const Stack = createNativeStackNavigator();
export default function TransactionsStack() {
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
      <Stack.Screen name="Transactions" component={TransactionsScreen} options={{ title: 'İşlemler' }} />
    </Stack.Navigator>
  );
}

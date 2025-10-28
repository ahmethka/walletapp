// src/app/stacks/CardsStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CardsScreen from '../screens/CardsScreen';
import AddCardScreen from '../screens/AddCardScreen';
import { HeaderLeftProfile, HeaderRightActions } from '../components/navigations/HeaderButtons';

const Stack = createNativeStackNavigator();
export default function CardsStack() {
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
      <Stack.Screen name="Cards" component={CardsScreen} options={{ title: 'Kartlar' }} />
      <Stack.Screen name="AddCard" component={AddCardScreen} options={{ title: 'Kart Ekle' }} />
    </Stack.Navigator>
  );
}

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/app/RootNavigator';
import { useTheme } from './src/store/useTheme';
import { ToastProvider } from './src/components/ui/ToastProvider';


const client = new QueryClient();

export default function App() {
  const mode = useTheme(s => s.mode);

  return (
    <QueryClientProvider client={client}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <ToastProvider>
            <StatusBar
              style={mode === 'light' ? 'dark' : 'light'}
              backgroundColor={mode === 'light' ? '#ffffff' : '#0b0b0c'}
            />
            <SafeAreaProvider>
              <RootNavigator />
            </SafeAreaProvider>
          </ToastProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

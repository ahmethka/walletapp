import React, { createContext, useContext, useRef, useState } from 'react';
import { Animated, Easing, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error' | 'info';
type ToastState = { text: string; type: ToastType };

const ToastCtx = createContext<{ show: (text: string, type?: ToastType) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ToastState | null>(null);
  const y = useRef(new Animated.Value(-80)).current;

  function show(text: string, type: ToastType = 'info') {
    setState({ text, type });
    Animated.timing(y, { toValue: 0, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(() => {
      setTimeout(() => {
        Animated.timing(y, { toValue: -80, duration: 200, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(() => {
          setState(null);
        });
      }, 1600);
    });
  }

  const bg =
    state?.type === 'success' ? '#16a34a' :
      state?.type === 'error' ? '#ef4444' : '#374151';

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      {state && (
          <Animated.View pointerEvents="none" style={[styles.container, { transform: [{ translateY: y }] }]}>
            <View style={[styles.toast, { backgroundColor: bg }]}>
              <Text style={styles.text}>{state.text}</Text>
            </View>
          </Animated.View>
      )}
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 80, left: 0, right: 0, alignItems: 'center', zIndex: 9999 },
  toast: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  text: { color: '#fff', fontWeight: '600' },
});

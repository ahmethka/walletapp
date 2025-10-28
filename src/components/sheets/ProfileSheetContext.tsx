import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { tokens } from '../../../theme/tokens';
import { useAuth } from '../../store/useAuth';
import { useTheme } from '../../store/useTheme';
import Card from '../ui/Card';
import ThemedText from '../ui/ThemedText';

type Ctx = { openProfileSheet: () => void };
const ProfileSheetCtx = createContext<Ctx | null>(null);

export function ProfileSheetProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<BottomSheetModal>(null);

  const user = useAuth(s => s.user);
  const logout = useAuth(s => s.logout);
  const theme = useTheme();

  const openProfileSheet = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    if (ref.current) {
      ref.current.present();
    } else {
      // Çok nadir race condition için
      setTimeout(() => ref.current?.present(), 0);
    }
  }, []);

  const close = useCallback(() => ref.current?.dismiss(), []);

  const initials = useMemo(() => {
    const base = (user?.name || user?.email || 'Kullanıcı').trim();
    return base
      .split(/\s+/)
      .map(s => s[0]?.toUpperCase())
      .join('')
      .slice(0, 2);
  }, [user?.name, user?.email]);

  const snapPoints = useMemo<Array<string | number>>(() => ['55%'], []);

  const Row = ({
    icon,
    label,
    onPress,
    trailing,
  }: {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
    trailing?: React.ReactNode;
  }) => (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.9 }]}>
      {icon}
      <Text style={styles.rowText}>{label}</Text>
      {trailing ?? <Ionicons name="chevron-forward" size={18} color={tokens.colors.muted} />}
    </Pressable>
  );

  const mail = () => Linking.openURL('mailto:destek@piggybank.app?subject=Destek%20Talebi');
  const phone = () => Linking.openURL('tel:+908501234567');

  return (
    <ProfileSheetCtx.Provider value={{ openProfileSheet }}>
      {children}
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: '#fff', borderRadius: 20 }}
        handleIndicatorStyle={{ backgroundColor: '#e5e7eb' }}
      >
        <View style={{ padding: 16, gap: 14 }}>
          {/* Kullanıcı bilgileri */}
          <Card style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={styles.avatar}>
              <Text style={{ color: tokens.colors.accent, fontWeight: '700' }}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText bold>{user?.name || 'Kullanıcı'}</ThemedText>
              <ThemedText muted>{user?.email || '—'}</ThemedText>
            </View>
          </Card>

          {/* Ayarlar satırları */}
          <Row
            icon={<Ionicons name="color-palette-outline" size={18} color={tokens.colors.text} />}
            label="Tema"
            trailing={
              <View style={styles.themePill}>
                <Text style={styles.themePillText}>{theme.mode === 'light' ? 'Açık' : 'Koyu'}</Text>
              </View>
            }
            onPress={() => {
              close();
              // Navigation burada RootNavigator’daki “Theme” screen ile eşleşmeli
            }}
          />
          <Row
            icon={<Ionicons name="key-outline" size={18} color={tokens.colors.text} />}
            label="PIN Değiştir"
            onPress={() => {
              close();
              // nav.navigate('PinSettings')
            }}
          />
          <Row
            icon={<Ionicons name="help-circle-outline" size={18} color={tokens.colors.text} />}
            label="Destek"
            onPress={() => {
              close();
              // nav.navigate('Support')
            }}
          />

          {/* Hızlı butonlar */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable onPress={mail} style={({ pressed }) => [styles.quickBtn, pressed && { opacity: 0.9 }]}>
              <Ionicons name="mail-outline" size={18} color={tokens.colors.accent} />
              <Text style={styles.quickBtnText}>E-posta</Text>
            </Pressable>
            <Pressable onPress={phone} style={({ pressed }) => [styles.quickBtn, pressed && { opacity: 0.9 }]}>
              <Ionicons name="call-outline" size={18} color={tokens.colors.accent} />
              <Text style={styles.quickBtnText}>Ara</Text>
            </Pressable>
          </View>

          {/* Çıkış */}
          <Row
            icon={<Ionicons name="log-out-outline" size={18} color="#ef4444" />}
            label="Çıkış Yap"
            onPress={() => {
              close();
              logout();
            }}
          />
        </View>
      </BottomSheetModal>
    </ProfileSheetCtx.Provider>
  );
}

export function useProfileSheet() {
  const ctx = useContext(ProfileSheetCtx);
  if (!ctx) throw new Error('useProfileSheet must be used within ProfileSheetProvider');
  return ctx;
}

const styles = StyleSheet.create({
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: tokens.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: tokens.colors.line,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.line,
  },
  rowText: { flex: 1, color: tokens.colors.text, fontWeight: '600' },
  themePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  themePillText: { fontSize: 12, fontWeight: '700', color: tokens.colors.text },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: tokens.colors.line,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  quickBtnText: { color: tokens.colors.accent, fontWeight: '700' },
});

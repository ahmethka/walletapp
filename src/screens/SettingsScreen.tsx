import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ThemedText from '../components/ui/ThemedText';
import { tokens } from '../../theme/tokens';
import { useAuth } from '../store/useAuth';
import { useToast } from '../components/ui/ToastProvider';

export default function SettingsScreen() {
  // 🔧 Sonsuz döngüyü engelle
  const user = useAuth(s => s.user);
  const logout = useAuth(s => s.logout);

  const { show } = useToast();

  const initials = useMemo(() => {
    const base = (user?.name || user?.email || 'Kullanıcı').trim();
    return base
      .split(/\s+/)
      .map(s => s[0]?.toUpperCase())
      .join('')
      .slice(0, 2);
  }, [user?.name, user?.email]);

  async function handleLogout() {
    await logout();
    show('Çıkış yapıldı', 'success');
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.bg, padding: 16, gap: 16 }}>
      {/* Profil kartı */}
      <Card style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View
          style={{
            width: 56, height: 56, borderRadius: 16,
            backgroundColor: tokens.colors.card,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 1, borderColor: tokens.colors.line,
          }}
        >
          <Text style={{ color: tokens.colors.accent, fontWeight: '700', fontSize: 18 }}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText bold style={{ fontSize: 16 }}>{user?.name || 'Kullanıcı'}</ThemedText>
          <ThemedText muted>{user?.email || '—'}</ThemedText>
        </View>
      </Card>

      {/* Hesap */}
      <Card style={{ padding: 20, gap: 12 }}>
        <ThemedText bold>Hesap</ThemedText>
        <Button title="Çıkış Yap" variant="ghost" onPress={handleLogout} accessibilityLabel="Hesaptan çıkış yap" />
      </Card>
    </View>
  );
}

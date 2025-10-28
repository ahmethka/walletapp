import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../../theme/tokens';
import { useProfileSheet } from '../sheets/ProfileSheetContext';
import { useQuery } from '@tanstack/react-query';
import { getUnreadCount } from '../../services/notifications';
import { useNavigation } from '@react-navigation/native';

export function HeaderLeftProfile() {
  const { openProfileSheet } = useProfileSheet();

  return (
    <Pressable
      onPress={() => {
        console.log('[header] profile pressed');
        openProfileSheet(); // sheet aç
      }}
      hitSlop={10}
      style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.8 }]}
    >
      <Ionicons name="person-circle-outline" size={24} color={tokens.colors.text} />
    </Pressable>
  );
}

export function HeaderRightActions() {
  const nav = useNavigation<any>();
  const { data: unread = 0 } = useQuery({ queryKey: ['unreadCount'], queryFn: getUnreadCount, staleTime: 10_000 });

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Pressable
        onPress={() => nav.navigate('Notifications')}
        hitSlop={10}
        style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.8 }]}
      >
        <Ionicons name="notifications-outline" size={22} color={tokens.colors.text} />
        {unread > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  iconBtn: { paddingHorizontal: 6, paddingVertical: 4 },
  badge: {
    position: 'absolute', right: -6, top: -4,
    backgroundColor: tokens.colors.accent, borderRadius: 10, minWidth: 18, height: 18,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});

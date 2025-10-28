import React, { useCallback, useState } from 'react';
import { View, Text, RefreshControl, StyleSheet, Pressable } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { GestureHandlerRootView, Swipeable, RectButton } from 'react-native-gesture-handler';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

import ThemedText from '../components/ui/ThemedText';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Empty from '../components/ui/Empty';
import { tokens } from '../../theme/tokens';

import {
  getNotifications,
  markAllAsRead,
  markAsRead,
  deleteNotification,
  type AppNotification,
} from '../services/notifications';

function NotificationsScreenInner() {
  const qc = useQueryClient();

  const { data: list, isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const mMarkAll = useMutation({
    mutationFn: markAllAsRead,
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['notifications'] });
      await qc.cancelQueries({ queryKey: ['notifCount'] });
      const prev = qc.getQueryData<AppNotification[]>(['notifications']);
      if (prev) qc.setQueryData<AppNotification[]>(['notifications'], prev.map(n => ({ ...n, read: true })));
      qc.setQueryData(['notifCount'], 0);
      return { prev };
    },
    onError: (_e, _v, ctx) => { if (ctx?.prev) qc.setQueryData(['notifications'], ctx.prev); },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: ['notifications'] });
      await qc.invalidateQueries({ queryKey: ['notifCount'] });
    },
  });

  const mRead = useMutation({
    mutationFn: ({ id, read }: { id: number; read: boolean }) => markAsRead(id, read),
    onMutate: async ({ id, read }) => {
      await qc.cancelQueries({ queryKey: ['notifications'] });
      await qc.cancelQueries({ queryKey: ['notifCount'] });
      const prev = qc.getQueryData<AppNotification[]>(['notifications']);
      if (prev) {
        const next = prev.map(n => (n.id === id ? { ...n, read } : n));
        qc.setQueryData<AppNotification[]>(['notifications'], next);
        const unread = next.filter(n => !n.read).length;
        qc.setQueryData(['notifCount'], unread);
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => { if (ctx?.prev) qc.setQueryData(['notifications'], ctx.prev); },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: ['notifications'] });
      await qc.invalidateQueries({ queryKey: ['notifCount'] });
    },
  });

  const mDelete = useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['notifications'] });
      await qc.cancelQueries({ queryKey: ['notifCount'] });
      const prev = qc.getQueryData<AppNotification[]>(['notifications']);
      if (prev) {
        const next = prev.filter(n => n.id !== id);
        qc.setQueryData<AppNotification[]>(['notifications'], next);
        const unread = next.filter(n => !n.read).length;
        qc.setQueryData(['notifCount'], unread);
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => { if (ctx?.prev) qc.setQueryData(['notifications'], ctx.prev); },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: ['notifications'] });
      await qc.invalidateQueries({ queryKey: ['notifCount'] });
    },
  });

  const renderItem = ({ item }: { item: AppNotification }) => {
    const rightActions = () => (
      <RectButton onPress={() => mDelete.mutate(item.id)} style={[styles.swipeAction, { backgroundColor: '#ef4444' }]}>
        <Ionicons name="trash-outline" size={20} color="#fff" />
        <Text style={styles.swipeText}>Sil</Text>
      </RectButton>
    );

    return (
      <Swipeable renderRightActions={rightActions} overshootRight={false}>
        <Pressable onPress={() => mRead.mutate({ id: item.id, read: !item.read })} style={({ pressed }) => [styles.rowPress, pressed && { opacity: 0.9 }]}>
          <Card style={{ padding: 16, borderLeftWidth: 3, borderLeftColor: item.read ? tokens.colors.line : '#22c55e', backgroundColor: tokens.colors.bg }}>
            <View style={styles.rowTop}>
              <ThemedText bold style={{ marginBottom: 4 }}>{item.title}</ThemedText>
              {!item.read && <View style={styles.unreadDot} />}
            </View>
            {item.body ? <Text style={{ color: tokens.colors.muted }}>{item.body}</Text> : null}
            <Text style={{ color: tokens.colors.muted, marginTop: 6, fontSize: 12 }}>
              {new Date(item.date).toLocaleString('tr-TR')}
            </Text>
          </Card>
        </Pressable>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: tokens.colors.bg }}>
      <View style={{ flex: 1, padding: 16 }}>
        <View style={styles.headerRow}>
          <ThemedText bold style={{ fontSize: 20 }}>Bildirimler</ThemedText>
          {list && list.some(n => !n.read) ? (
            <Button title="Tümünü Okundu" variant="ghost" onPress={() => mMarkAll.mutate()} />
          ) : null}
        </View>

        {isLoading ? (
          <Card style={{ padding: 20, gap: 12 }}>
            <View style={styles.skel} /><View style={styles.skel} /><View style={styles.skel} />
          </Card>
        ) : list && list.length > 0 ? (
          <FlatList
            data={list}
            keyExtractor={(it) => String(it.id)}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        ) : (
          <Empty title="Bildirim yok" subtitle="Yeni bir bildirim geldiğinde burada görünecek." />
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  skel: { height: 14, backgroundColor: tokens.colors.card, borderRadius: 8 },
  rowPress: { borderRadius: 16, overflow: 'hidden' },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e', marginLeft: 8 },
  swipeAction: { width: 72, alignItems: 'center', justifyContent: 'center', marginLeft: 8, borderRadius: 12 },
  swipeText: { color: '#fff', fontSize: 12, marginTop: 4, fontWeight: '600' },
});

// ✅ default export şart
export default function NotificationsScreen() {
  return <NotificationsScreenInner />;
}

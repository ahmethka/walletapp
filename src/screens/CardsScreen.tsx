import React, { useCallback, useState } from 'react';
import { ScrollView, View, RefreshControl, Alert, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import Empty from '../components/ui/Empty';
import ThemedText from '../components/ui/ThemedText';

import { getCards, deleteCard, setDefaultCard, type WalletCard } from '../services/wallet';
import { tokens } from '../../theme/tokens';
import { useToast } from '../components/ui/ToastProvider';

export default function CardsScreen() {
  const navigation = useNavigation<any>();
  const qc = useQueryClient();
  const { show } = useToast();

  const { data: cards, isLoading, refetch } = useQuery({
    queryKey: ['cards'],
    queryFn: getCards,
  });

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const mDelete = useMutation({
    mutationFn: async (id: number) => deleteCard(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['cards'] });
      const prev = qc.getQueryData<WalletCard[]>(['cards']);
      if (prev) qc.setQueryData<WalletCard[]>(['cards'], prev.filter(c => c.id !== id));
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['cards'], ctx.prev);
      show('Kart silinemedi', 'error');
    },
    onSuccess: () => show('Kart silindi', 'success'),
    onSettled: () => qc.invalidateQueries({ queryKey: ['cards'] }),
  });

  const mDefault = useMutation({
    mutationFn: async (id: number) => setDefaultCard(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['cards'] });
      const prev = qc.getQueryData<WalletCard[]>(['cards']);
      if (prev) {
        const next = prev.map(c => ({ ...c, isDefault: c.id === id }));
        qc.setQueryData<WalletCard[]>(['cards'], next);
      }
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['cards'], ctx.prev);
      show('Varsayılan kart ayarlanamadı', 'error');
    },
    onSuccess: () => show('Varsayılan kart güncellendi', 'success'),
    onSettled: () => qc.invalidateQueries({ queryKey: ['cards'] }),
  });

  function confirmDelete(id: number) {
    Alert.alert('Kartı sil', 'Bu kartı silmek istediğine emin misin?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => mDelete.mutate(id) },
    ]);
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: tokens.colors.bg }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Başlık + Kart Ekle */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <ThemedText bold style={{ fontSize: 20 }}>Kartlar</ThemedText>
        <Button
          title="Kart Ekle"
          variant="primary"
          leftIcon={<Ionicons name="add" size={18} color="#fff" />}
          onPress={() => navigation.navigate('AddCard')}
          textStyle={{ fontSize: 14 }}
        />
      </View>

      {/* Liste */}
      {isLoading && (
        <Card style={{ padding: 20, gap: 12 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={72} radius={16} />
          ))}
        </Card>
      )}

      {!isLoading && cards && cards.length > 0 && cards.map(card => (
        <View
          key={card.id}
          style={{
            borderRadius: 16,
            padding: 16,
            backgroundColor: card.color || '#1f2937',
            gap: 12,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          {/* Üst satır */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>
              {card.brand.toUpperCase()}
            </Text>
            {card.isDefault ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="star" size={16} color="#fde047" />
                <Text style={{ color: '#fde047', fontWeight: '600' }}>Varsayılan</Text>
              </View>
            ) : null}
          </View>

          {/* Numara / İsim / Son kullanma */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Text style={{ color: '#fff', letterSpacing: 2, fontSize: 18 }}>
              •••• •••• •••• {card.last4}
            </Text>
            <Text style={{ color: '#e5e7eb' }}>{card.expiry}</Text>
          </View>
          <Text style={{ color: '#e5e7eb', fontSize: 12 }}>{card.holderName}</Text>

          {/* Aksiyonlar */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
            {!card.isDefault && (
              <View style={{ flex: 1 }}>
                <Button
                  title="Varsayılan Yap"
                  variant="ghost"
                  leftIcon={<Ionicons name="star-outline" size={16} color="#fff" />}
                  onPress={() => mDefault.mutate(card.id)}
                  textStyle={{ fontSize: 13, color: '#fff' }}
                  style={{ borderColor: '#ffffff88' }}
                />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Button
                title="Sil"
                variant="ghost"
                leftIcon={<Ionicons name="trash-outline" size={16} color="#fff" />}
                onPress={() => confirmDelete(card.id)}
                textStyle={{ fontSize: 13, color: '#fff' }}
                style={{ borderColor: '#ffffff88' }}
              />
            </View>
          </View>
        </View>
      ))}

      {!isLoading && (!cards || cards.length === 0) && (
        <Empty title="Kayıtlı kart yok" subtitle="Kart ekleyerek başlayabilirsin." />
      )}
    </ScrollView>
  );
}

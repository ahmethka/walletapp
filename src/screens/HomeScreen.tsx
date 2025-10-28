import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Text, TextProps } from 'react-native';
import ThemedText from '../components/ui/ThemedText';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { tokens } from '../../theme/tokens';
import { getBalance, getTransactions } from '../services/wallet';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const nav = useNavigation<any>();

  const { data: balance, isLoading: balLoading } = useQuery({
    queryKey: ['balance'],
    queryFn: getBalance,
  });
  const { data: txs, isLoading: txLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  return (
    <SafeAreaView style={styles.screen}>
      {/* Üst kart */}
      <Card style={styles.topCard}>
        <ThemedText muted>Toplam Bakiye</ThemedText>
        <ThemedText bold style={styles.amount}>
          {balLoading ? '—' : `${balance?.amount?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${balance?.currency || '₺'}`}
        </ThemedText>

        {/* 3 eş buton (flex:1) */}
        <View style={styles.actionsRow}>
          <View style={{ flex: 1 }}>
            <Button
              title="Yükle"
              onPress={() => nav.navigate('Yükle')}
              leftIcon={<Ionicons name="add" size={18} color="#fff" />}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Transfer"
              onPress={() => nav.navigate('Transfer')}
              leftIcon={<Ionicons name="swap-horizontal" size={18} color="#fff" />}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Gönder"
              onPress={() => nav.navigate('Transfer')}
              leftIcon={<Ionicons name="paper-plane" size={16} color="#fff" />}
            />
          </View>
        </View>
      </Card>

      {/* Son İşlemler */}
      <Card style={{ padding: 16 }}>
        <ThemedText bold>Son İşlemler</ThemedText>
        <View style={{ marginTop: 8 }}>
          {txLoading && <ThemedText muted>Yükleniyor…</ThemedText>}

          {!txLoading && txs?.slice(0, 5)?.map((tx, idx) => (
            <View key={tx.id} style={[styles.txRow, idx < 4 && styles.txDivider]}>
              <ThemedText>{tx.title}</ThemedText>
              <ThemedText bold style={{ color: tx.amount < 0 ? '#ef4444' : '#22c55e' }}>
                {(tx.amount < 0 ? '' : '+') + tx.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </ThemedText>
            </View>
          ))}

          {!txLoading && (!txs || txs.length === 0) && (
            <View style={{ paddingVertical: 8 }}>
              <ThemedText muted>Kayıt bulunamadı</ThemedText>
            </View>
          )}
        </View>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex:1 , backgroundColor: tokens.colors.bg, padding: 16, gap: 16 },
  topCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: tokens.colors.line,      // üst kart kenarlığı
  },
  amount: { fontSize: 32, marginTop: 4 },
  actionsRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
  txRow: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  txDivider: {
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.line,
  },
});

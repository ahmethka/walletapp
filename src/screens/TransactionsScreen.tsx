import React, { useCallback } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getTransactions, type Transaction } from '../services/wallet';
import ThemedText from '../components/ui/ThemedText';
import Card from '../components/ui/Card';
import { tokens } from '../../theme/tokens';
import { useToast } from '../components/ui/ToastProvider';

function formatAmount(a: number) {
  const sign = a < 0 ? '' : '+';
  return `${sign}${a.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`;
}
function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export default function TransactionsScreen() {
  const { show } = useToast();
  const { data, isLoading, isRefetching, refetch, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  const onRefresh = useCallback(async () => {
    try { await refetch(); } catch (e: any) { show(e?.message || 'Yenileme başarısız'); }
  }, [refetch, show]);

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <ThemedText bold>{item.title}</ThemedText>
        <ThemedText muted style={{ marginTop: 2 }}>{formatDate(item.date)}</ThemedText>
      </View>
      <ThemedText bold style={{ color: item.amount < 0 ? '#ef4444' : '#22c55e' }}>
        {formatAmount(item.amount)}
      </ThemedText>
    </View>
  );

  const keyExtractor = (i: Transaction) => String(i.id);

  return (
    <View style={styles.screen}>
      <ThemedText bold style={{ fontSize: 20, marginBottom: 12 }}>İşlemler</ThemedText>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <FlatList
          data={data ?? []}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          ListEmptyComponent={
            !isLoading ? (
              <View style={{ padding: 16 }}>
                <ThemedText muted>Kayıt bulunamadı.</ThemedText>
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              tintColor={tokens.colors.accent}
              colors={[tokens.colors.accent]}
              refreshing={isRefetching && !isLoading}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={{ paddingVertical: 4 }}
        />
      </Card>

      {error ? <ThemedText muted style={{ marginTop: 8 }}>Hata: {(error as any)?.message || '—'}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.colors.bg, padding: 16 },
  row: {
    paddingHorizontal: 16, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  sep: { height: 1, backgroundColor: tokens.colors.line, marginHorizontal: 16 },
});

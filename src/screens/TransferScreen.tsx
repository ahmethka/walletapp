import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ThemedText from '../components/ui/ThemedText';
import { tokens } from '../../theme/tokens';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transferMoney, type Transaction, type Balance } from '../services/wallet';
import { useToast } from '../components/ui/ToastProvider';

type FormData = {
  recipient: string;
  amount: string;
  note?: string;
};

export default function TransferScreen() {
  const { control, handleSubmit } = useForm<FormData>({ defaultValues: { recipient: '', amount: '', note: '' } });
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();
  const { show } = useToast();

  const mutation = useMutation({
    mutationFn: async (payload: { recipient: string; amount: number; note?: string }) =>
      transferMoney(payload.recipient, payload.amount, payload.note),

    onMutate: async ({ amount, recipient, note }) => {
      await qc.cancelQueries({ queryKey: ['balance'] });
      await qc.cancelQueries({ queryKey: ['transactions'] });

      const prevBal = qc.getQueryData<Balance>(['balance']);
      const prevTxs = qc.getQueryData<Transaction[]>(['transactions']);

      if (prevBal) qc.setQueryData<Balance>(['balance'], { ...prevBal, amount: prevBal.amount - amount });

      if (prevTxs) {
        const nextId = (prevTxs && prevTxs.length > 0 ? Math.max(...prevTxs.map(t => t.id)) : 0) + 1;
        const optimisticTx: Transaction = {
          id: nextId,
          title: `Transfer: ${recipient}`,
          amount: -amount,
          date: new Date().toISOString(),
          note,
        };
        qc.setQueryData<Transaction[]>(['transactions'], [optimisticTx, ...prevTxs]);
      }
      return { prevBal, prevTxs };
    },

    onError: (_e, _vars, ctx) => {
      if (ctx?.prevBal) qc.setQueryData(['balance'], ctx.prevBal);
      if (ctx?.prevTxs) qc.setQueryData(['transactions'], ctx.prevTxs);
      show('Transfer başarısız', 'error');
    },

    onSuccess: () => {
      show('Transfer başarılı', 'success');
      // ✅ Bildirim badge ve listeyi yenile
      qc.invalidateQueries({ queryKey: ['notifCount'] });
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['balance'] });
      qc.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const onSubmit = async (data: FormData) => {
    const amount = Number((data.amount || '').replace(',', '.'));
    if (!data.recipient || !amount || amount <= 0) {
      Alert.alert('Uyarı', 'Alıcı ve tutar zorunlu.');
      return;
    }
    try {
      setLoading(true);
      await mutation.mutateAsync({
        recipient: data.recipient.trim(),
        amount,
        note: data.note?.trim() || undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: tokens.colors.bg, padding: tokens.spacing.lg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ gap: 16 }}>
        <ThemedText bold style={{ fontSize: 20 }}>Para Transferi</ThemedText>

        <Controller
          control={control}
          name="recipient"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Alıcı (IBAN veya Telefon)"
              value={value}
              onChangeText={onChange}
              placeholder="TR00 0000 0000 0000 0000 0000 00"
              autoCapitalize="characters"
            />
          )}
        />

        <Controller
          control={control}
          name="amount"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Tutar (₺)"
              value={value}
              onChangeText={onChange}
              placeholder="100"
              keyboardType="numeric"
            />
          )}
        />

        <Controller
          control={control}
          name="note"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Açıklama (opsiyonel)"
              value={value}
              onChangeText={onChange}
              placeholder="Kira, fatura vb."
            />
          )}
        />

        <Button title="Gönder" onPress={handleSubmit(onSubmit)} loading={loading} />
      </View>
    </KeyboardAvoidingView>
  );
}

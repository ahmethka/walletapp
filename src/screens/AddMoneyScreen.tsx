import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, View, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ThemedText from '../components/ui/ThemedText';
import { tokens } from '../../theme/tokens';
import { addMoney, type Balance, type Transaction } from '../services/wallet';
import { useToast } from '../components/ui/ToastProvider';

type FormData = { amount: string; note?: string };

export default function AddMoneyScreen() {
  const { control, handleSubmit, reset, watch, setValue } = useForm<FormData>({ defaultValues: { amount: '', note: '' } });
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();
  const { show } = useToast();

  const mutation = useMutation({
    mutationFn: async ({ amount, note }: { amount: number; note?: string }) => addMoney(amount, note),

    onMutate: async ({ amount, note }) => {
      await qc.cancelQueries({ queryKey: ['balance'] });
      await qc.cancelQueries({ queryKey: ['transactions'] });

      const prevBal = qc.getQueryData<Balance>(['balance']);
      const prevTxs = qc.getQueryData<Transaction[]>(['transactions']);

      if (prevBal) qc.setQueryData<Balance>(['balance'], { ...prevBal, amount: prevBal.amount + amount });

      if (prevTxs) {
        const nextId = (prevTxs && prevTxs.length > 0 ? Math.max(...prevTxs.map(t => t.id)) : 0) + 1;
        const optimisticTx: Transaction = {
          id: nextId,
          title: 'Para Yükleme',
          amount: Math.abs(amount),
          date: new Date().toISOString(),
          note,
        };
        qc.setQueryData<Transaction[]>(['transactions'], [optimisticTx, ...prevTxs]);
      }
      return { prevBal, prevTxs };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.prevBal) qc.setQueryData(['balance'], ctx.prevBal);
      if (ctx?.prevTxs) qc.setQueryData(['transactions'], ctx.prevTxs);
      show('Yükleme başarısız', 'error');
    },

    onSuccess: () => {
      show('Bakiye yüklendi', 'success');
      reset({ amount: '', note: '' });
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
    if (!amount || amount <= 0) {
      Alert.alert('Uyarı', 'Geçerli bir tutar giriniz.');
      return;
    }
    try {
      setLoading(true);
      await mutation.mutateAsync({ amount: Math.abs(amount), note: data.note?.trim() || undefined });
    } finally {
      setLoading(false);
    }
  };

  const quick = [100, 250, 500];
  const watchedAmount = watch('amount');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: tokens.colors.bg, padding: tokens.spacing.lg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ gap: 16 }}>
        <ThemedText bold style={{ fontSize: 20 }}>Para Yükle</ThemedText>

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

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {quick.map(q => (
            <Button
              key={q}
              title={`+${q}`}
              variant="ghost"
              onPress={() => {
                const current = Number((watchedAmount || '').replace(',', '.')) || 0;
                const next = current + q;
                setValue('amount', String(next), { shouldDirty: true, shouldValidate: true });
              }}
            />
          ))}
        </View>

        <Controller
          control={control}
          name="note"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Açıklama (opsiyonel)"
              value={value}
              onChangeText={onChange}
              placeholder="Cüzdana yükleme"
            />
          )}
        />

        <Button title="Yükle" onPress={handleSubmit(onSubmit)} loading={loading} />
      </View>
    </KeyboardAvoidingView>
  );
}

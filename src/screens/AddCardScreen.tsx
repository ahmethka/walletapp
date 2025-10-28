import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, View, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ThemedText from '../components/ui/ThemedText';
import { tokens } from '../../theme/tokens';
import { addCard } from '../services/wallet';
import { useToast } from '../components/ui/ToastProvider';
import { Ionicons } from '@expo/vector-icons';

type FormData = {
  holderName: string;
  number: string; // PAN (maskesiz girilecek; biz last4'e çeviririz)
  expiry: string; // MM/YY
};

export default function AddCardScreen() {
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { holderName: '', number: '', expiry: '' },
  });
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();
  const { show } = useToast();

  const mutation = useMutation({
    mutationFn: async (payload: FormData) => {
      return addCard(payload);
    },
    onSuccess: async () => {
      show('Kart eklendi', 'success');
      reset();
      await qc.invalidateQueries({ queryKey: ['cards'] });
    },
    onError: () => show('Kart eklenemedi', 'error'),
  });

  const onSubmit = async (data: FormData) => {
    const pan = data.number.replace(/\s+/g, '');
    if (!/^\d{12,19}$/.test(pan)) {
      Alert.alert('Uyarı', 'Kart numarası 12-19 hane olmalı.');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(data.expiry)) {
      Alert.alert('Uyarı', 'Son kullanma tarihi MM/YY formatında olmalı (örn. 12/26).');
      return;
    }
    if (!data.holderName.trim()) {
      Alert.alert('Uyarı', 'Kart üzerindeki isim boş olamaz.');
      return;
    }
    setLoading(true);
    try {
      await mutation.mutateAsync({
        holderName: data.holderName,
        number: pan,
        expiry: data.expiry,
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
        <ThemedText bold style={{ fontSize: 20 }}>Yeni Kart</ThemedText>

        <Controller
          control={control}
          name="holderName"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Kart Üzerindeki İsim"
              value={value}
              onChangeText={onChange}
              placeholder="AD SOYAD"
              autoCapitalize="characters"
            />
          )}
        />

        <Controller
          control={control}
          name="number"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Kart Numarası"
              value={value}
              onChangeText={(t) => onChange(t.replace(/[^\d]/g, ''))}
              placeholder="5555444433331111"
              keyboardType="numeric"
              maxLength={19}
            />
          )}
        />

        <Controller
          control={control}
          name="expiry"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Son Kullanma (MM/YY)"
              value={value}
              onChangeText={onChange}
              placeholder="12/26"
              keyboardType="numeric"
              maxLength={5}
            />
          )}
        />

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <View style={{ flex: 1 }}>
            <Button
              title="Kaydet"
              variant="primary"
              onPress={handleSubmit(onSubmit)}
              leftIcon={<Ionicons name="save-outline" size={18} color="#fff" />}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Temizle"
              variant="ghost"
              onPress={() => reset()}
              leftIcon={<Ionicons name="refresh" size={18} color={tokens.colors.accent} />}
              textStyle={{ color: tokens.colors.accent }}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

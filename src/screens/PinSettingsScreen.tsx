import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useForm, Controller } from 'react-hook-form';
import ThemedText from '../components/ui/ThemedText';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { tokens } from '../../theme/tokens'

type Form = {
  current?: string;
  pin: string;
  confirm: string;
};

const KEY = 'app_user_pin';

export default function PinSettingsScreen() {
  const { control, handleSubmit, reset } = useForm<Form>({ defaultValues: { current: '', pin: '', confirm: '' } });
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const v = await SecureStore.getItemAsync(KEY);
      setHasPin(!!v);
    })();
  }, []);

  const onSubmit = async (data: Form) => {
    if (hasPin && !data.current) {
      Alert.alert('Uyarı', 'Mevcut PIN gerekli.');
      return;
    }
    if (!/^\d{4}$/.test(data.pin)) {
      Alert.alert('Uyarı', 'PIN 4 haneli olmalı (sadece rakam).');
      return;
    }
    if (data.pin !== data.confirm) {
      Alert.alert('Uyarı', 'PIN tekrarı uyuşmuyor.');
      return;
    }

    setLoading(true);
    try {
      if (hasPin) {
        const cur = await SecureStore.getItemAsync(KEY);
        if (cur && data.current !== cur) {
          Alert.alert('Uyarı', 'Mevcut PIN hatalı.');
          setLoading(false);
          return;
        }
      }
      await SecureStore.setItemAsync(KEY, data.pin);
      Alert.alert('Başarılı', hasPin ? 'PIN güncellendi.' : 'PIN oluşturuldu.');
      reset({ current: '', pin: '', confirm: '' });
      setHasPin(true);
    } finally {
      setLoading(false);
    }
  };

  if (hasPin === null) return null;

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.bg, padding: 16, gap: 16 }}>
      <ThemedText bold style={{ fontSize: 20 }}>PIN Ayarları</ThemedText>
      <Card style={{ padding: 16, gap: 12 }}>
        {hasPin ? (
          <Controller
            control={control}
            name="current"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Mevcut PIN"
                value={value}
                onChangeText={onChange}
                placeholder="••••"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
              />
            )}
          />
        ) : null}

        <Controller
          control={control}
          name="pin"
          render={({ field: { onChange, value } }) => (
            <Input
              label={hasPin ? 'Yeni PIN' : 'PIN'}
              value={value}
              onChangeText={onChange}
              placeholder="••••"
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
            />
          )}
        />

        <Controller
          control={control}
          name="confirm"
          render={({ field: { onChange, value } }) => (
            <Input
              label="PIN (Tekrar)"
              value={value}
              onChangeText={onChange}
              placeholder="••••"
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
            />
          )}
        />

        <Button title={hasPin ? 'Güncelle' : 'Oluştur'} onPress={handleSubmit(onSubmit)} loading={loading} />
      </Card>
    </View>
  );
}

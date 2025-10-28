import React, { useState } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, Text, Alert, Pressable } from 'react-native';
import Button from '../components/ui/Button';
import { tokens } from '../../theme/tokens';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>()

  const onRegister = async () => {
    try {
      setLoading(true);
      // TODO: backend hazır olunca burada POST /users veya /auth/register
      Alert.alert('Bilgi', 'Kayıt akışı mock — backend bağlandığında eklenecek.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: tokens.colors.bg, padding: tokens.spacing.lg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ gap: 16, marginTop: 48 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: tokens.colors.text }}>Kayıt Ol</Text>

        <Text style={{ color: tokens.colors.muted }}>E-posta</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="user@example.com"
          placeholderTextColor={tokens.colors.muted}
          style={{
            backgroundColor: tokens.colors.card,
            color: tokens.colors.text,
            borderColor: tokens.colors.line,
            borderWidth: 1,
            borderRadius: tokens.radii.lg,
            padding: tokens.spacing.md,
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="username"
        />

        <Text style={{ color: tokens.colors.muted }}>PIN (4–6 hane)</Text>
        <TextInput
          value={pin}
          onChangeText={setPin}
          placeholderTextColor={tokens.colors.muted}
          style={{
            backgroundColor: tokens.colors.card,
            color: tokens.colors.text,
            borderColor: tokens.colors.line,
            borderWidth: 1,
            borderRadius: tokens.radii.lg,
            padding: tokens.spacing.md,
          }}
          autoCapitalize="none"
          secureTextEntry
          keyboardType="numeric"
          maxLength={6}
          textContentType="oneTimeCode"
        />

        <Button title="Kayıt Ol" onPress={onRegister} loading={loading} />
      </View>
              <View style={{ alignItems: 'center', marginTop: 8 }}>
                <Pressable onPress={() => navigation.navigate('Login')}>
                  <Text style={{ color: tokens.colors.accent, fontWeight: '600', textDecorationLine: 'underline' }}>
                    Zaten bir hesabın var mı ? Giriş
                  </Text>
                </Pressable>
              </View>
    </KeyboardAvoidingView>
  );
}

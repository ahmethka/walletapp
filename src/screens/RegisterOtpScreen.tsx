// src/screens/OtpScreen.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View, TextInput, KeyboardAvoidingView, Platform, Text, Pressable, Image,
  NativeSyntheticEvent, TextInputKeyPressEventData
} from 'react-native';
import Button from '../components/ui/Button';
import { tokens } from '../../theme/tokens';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../store/useAuth';
import { useToast } from '../components/ui/ToastProvider';

export default function RegisterOtpScreen() {
  const [codes, setCodes] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const [seconds, setSeconds] = useState(120);
  const [isResending, setIsResending] = useState(false);

  const refs = Array.from({ length: 6 }, () => useRef<TextInput>(null));

  const value = useMemo(() => codes.join(''), [codes]);
  const filled = value.length === 6;

  const focus = (i: number) => refs[i]?.current?.focus();

  const handleChange = useCallback((text: string, idx: number) => {
    if (text.length === 1) {
      const next = [...codes];
      next[idx] = text.replace(/\D/g, '');
      setCodes(next);
      if (idx < 5) focus(idx + 1);
    } else if (text.length > 1) {
      const digits = text.replace(/\D/g, '').slice(0, 6).split('');
      const next = Array(6).fill('');
      for (let i = 0; i < digits.length; i++) (next as string[])[i] = digits[i];
      setCodes(next as string[]);
      if (digits.length >= 6) refs[5].current?.blur();
    } else {
      const next = [...codes];
      next[idx] = '';
      setCodes(next);
    }
  }, [codes]);

  const handleKeyPress = useCallback((e: NativeSyntheticEvent<TextInputKeyPressEventData>, idx: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!codes[idx] && idx > 0) {
        const next = [...codes];
        next[idx - 1] = '';
        setCodes(next);
        focus(idx - 1);
      }
    }
  }, [codes]);

const setSession = useAuth(s => s.setSession);
const currentUser = useAuth(s => s.user);

const onSubmit = useCallback(async () => {
  if (!filled || loading) return;
  try {
    setLoading(true);
    navigation.navigate('RegisterMain');
    // const resp = await verifyOtp(value);
  } finally {
    setLoading(false);
  }
}, [filled, loading]);

  // 6 hane dolunca otomatik submit etmek istersen:
  useEffect(() => { if (filled) onSubmit(); }, [filled, onSubmit]);

  // 2 dakikalık geri sayım
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const formatTime = (s: number) => {
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${m}:${sec}`;
  };

  const resendCode = async () => {
    setIsResending(true);
    try {
      // TODO: backend’e tekrar kod isteği
      setSeconds(120);
    } finally {
      setIsResending(false);
    }
  };

  const logoSrc = require('../../assets/piggybank_logo.png');
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: tokens.colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1, paddingHorizontal: tokens.spacing.lg, paddingTop: tokens.spacing.xl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.lg }}>
          <Image source={logoSrc} style={{ width: 400, height: 80, borderRadius: 8 }} />
        </View>

        {/* Başlık */}
        <View style={{ alignItems: 'center', marginBottom: tokens.spacing.lg }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: tokens.colors.text }}>SMS Doğrulama</Text>
          <Text style={{ textAlign: 'center', fontSize: 14, color: tokens.colors.muted, paddingTop: 10 }}>
            Telefonuna gelen 6 haneli doğrulama kodunu gir
          </Text>
        </View>

        {/* OTP kutuları */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: tokens.spacing.lg, marginTop: 25 }}>
          {codes.map((c, i) => (
            <TextInput
              key={i}
              ref={refs[i]}
              value={c}
              onChangeText={(t) => handleChange(t, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              keyboardType="number-pad"
              inputMode="numeric"
              autoComplete="sms-otp"
              textContentType="oneTimeCode"
              secureTextEntry
              maxLength={1}
              textAlign="center"
              onSubmitEditing={() => (i < 5 ? focus(i + 1) : onSubmit())}
              style={{
                height: 50,
                width: 50,
                borderColor: tokens.colors.line,
                borderWidth: 1,
                borderRadius: 14,
                marginHorizontal: 6,
                padding: 0,
                backgroundColor: tokens.colors.card,
                color: tokens.colors.text,
                fontSize: 20,
                fontWeight: '700',
              }}
            />
          ))}
        </View>

        {/* Geri sayım / yeniden gönder */}
        <View style={{ alignItems: 'center', marginBottom: tokens.spacing.lg }}>
          {seconds > 0 ? (
            <Text style={{ color: tokens.colors.muted, fontSize: 14 }}>
              Kodu yeniden gönderebilirsin: <Text style={{ fontWeight: '700' }}>{formatTime(seconds)}</Text>
            </Text>
          ) : (
            <Pressable disabled={isResending} onPress={resendCode}>
              <Text
                style={{
                  color: isResending ? tokens.colors.muted : tokens.colors.accent,
                  fontSize: 14,
                  fontWeight: '600',
                  textDecorationLine: 'underline',
                }}
              >
                Kodu yeniden gönder
              </Text>
            </Pressable>
          )}
        </View>

        <Button title="Devam" onPress={onSubmit} loading={loading} disabled={!filled} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

// src/screens/LoginScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, TextInput, Alert, KeyboardAvoidingView, Platform, Text, Pressable, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm, Controller } from 'react-hook-form';
import Button from '../components/ui/Button';
import { useAuth, User } from '../store/useAuth';
import { tokens } from '../../theme/tokens';
import { useNavigation } from '@react-navigation/native';
import { useToast } from '../components/ui/ToastProvider';
import { set } from 'zod';

type FormData = { email: string; password: string };


export default function LoginScreen() {
  const { control, handleSubmit, setValue } = useForm<FormData>({ defaultValues: { email: '', password: '' } });
  const loginWithCredentials = useAuth(s => s.loginWithCredentials);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const toast = useToast();

  const [profile, setProfile] = useState<User>(null);

  // Yarı Login Kontrol
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('profile');
        if (raw) {
          const p = JSON.parse(raw) as User;
          setProfile(p);
          if (p?.email) setValue('email', p.email);
        }
      } catch {
        //alamıyorsa datayı sıkıntı yok.. 
      }
    })();
  }, [setValue]);

  const onDeleteProfile =  async () => {
    await AsyncStorage.removeItem('profile');
    setValue('email' , '');
    setProfile(null);
  }

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const res = await loginWithCredentials(data.email, data.password);

      const nextProfile: User = {
        name: res?.name,
        email: data.email,
        id: res?.id
      };
      await AsyncStorage.setItem('profile', JSON.stringify(nextProfile));

      toast.show(`Hoş geldin${nextProfile?.name ? `, ${nextProfile.name}` : ''}!`,'success');

    } catch (e: any) {
      Alert.alert('Giriş başarısız', e?.response?.data?.message || e?.message || 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  const logoSrc = require('../../assets/piggybank_logo.png');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: tokens.colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, paddingHorizontal: tokens.spacing.lg, paddingTop: tokens.spacing.xl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.lg }}>
          <Image source={logoSrc} style={{ width: 400 , height: 80, borderRadius: 8 }} />
          <Text style={{ fontSize: 24, fontWeight: '800', color: tokens.colors.text, marginLeft: 10 }}>
            Hoş Geldin!
          </Text>
           <Text style={{ fontSize: 24, fontWeight: '800', color: tokens.colors.text, marginLeft: 10 }}>
            Telefon numaran veya e-posta adresin
            ile giriş yap.
          </Text>
        </View>

        <View style={{ alignItems: 'center', marginBottom: tokens.spacing.lg , display: profile ? 'flex' : 'none' }}>
          <View style={{ width: 86, height: 86, borderRadius: 43 , backgroundColor: tokens.colors.text }}> 
            <Text style={{color:tokens.colors.bg , textAlign:'center' , margin:'auto' , fontSize: 30}}>{profile?.name?.slice(0,2).toUpperCase()}</Text>
          </View>
          
          {!!profile?.name && (
            <Text style={{ marginTop: 8, fontSize: 16, color: tokens.colors.text }}>
              Hoş geldin, <Text style={{ fontWeight: '700' }}>{profile.name}</Text> 👋
            </Text>
          )}
         <View style={{ alignItems: 'center', marginTop: 8 , display: profile ? 'flex' : 'none'}}>
          <Pressable onPress={onDeleteProfile}>
            <Text style={{ color: tokens.colors.accent, fontWeight: '600', textDecorationLine: 'underline' }}>
              Bu kişi sen değil misin ? 
            </Text>
          </Pressable>
        </View>
        </View>

        {/* FORM */}
        
        <View style={{ gap: 10 , marginTop:60 }}>
          <Text style={{ color: tokens.colors.muted , display: profile ? 'none' :'flex'}}>E-posta</Text>
          <Controller
            control={control}
            name="email"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="user@example.com"
                placeholderTextColor={tokens.colors.muted}
                style={{
                  backgroundColor: tokens.colors.card,
                  color: tokens.colors.text,
                  borderColor: tokens.colors.line,
                  borderWidth: 1,
                  borderRadius: tokens.radii.lg,
                  padding: tokens.spacing.md,
                  display: profile ? 'none' :'flex'
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="username"
              />
            )}
          />

          <Text style={{ color: tokens.colors.muted }}>Şifre (PIN)</Text>
          <Controller
            control={control}
            name="password"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="••••••"
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
                textContentType="oneTimeCode"
                maxLength={6}
              />
            )}
          />

          <Button title="Giriş Yap" onPress={handleSubmit(onSubmit)} loading={loading} />
        </View>

        {/* ALT BAĞLANTILAR */}
        <View style={{ alignItems: 'center', marginTop: 8 }}>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={{ color: tokens.colors.accent, fontWeight: '600', textDecorationLine: 'underline' }}>
              Hesabın yok mu? Kayıt ol
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

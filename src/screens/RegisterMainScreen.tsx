import React, { useState } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, Text, Alert, Pressable, Image } from 'react-native';
import Button from '../components/ui/Button';
import { tokens } from '../../theme/tokens';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterMainScreen() {
  const [name, setName] = useState('');
  const [surName, setSurname] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const onSubmit = () => {

  }

  const logoSrc = require('../../assets/piggybank_logo.png');
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: tokens.colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 2, paddingHorizontal: tokens.spacing.lg, paddingTop: tokens.spacing.xl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.lg }}>
          <Image source={logoSrc} style={{ width: 400, height: 80, borderRadius: 8 }} />
        </View>

        <View style={{ alignItems: 'center', marginBottom: tokens.spacing.lg }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: tokens.colors.text, marginLeft: 10 }}>
            Kişisel Bilgiler
          </Text>
          <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '300', color: tokens.colors.text, marginLeft: 10, paddingTop: 10 }}>
            Bilgilerini eksiksiz olarak gir ve zorunlu sözleşmeleri onayla.
          </Text>
        </View>

        <View style={{ gap: 10, marginTop: 60 }}>
          <Text style={{ color: tokens.colors.muted}}>Ad</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            maxLength={25}
            placeholder="Ad"
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
            keyboardType="default"
            textContentType="name"
          />
          <Text style={{ color: tokens.colors.muted}}>Soyad</Text>
          <TextInput
            value={surName}
            onChangeText={setSurname}
            maxLength={25}
            placeholder="Soyad"
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
            keyboardType="default"
            textContentType="givenName"
          />
          <Text style={{ color: tokens.colors.muted}}>Davet Kodu (Opsiyonel)</Text>
          <TextInput
            value={surName}
            onChangeText={setSurname}
            maxLength={25}
            placeholder="Davet Kodu"
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
            keyboardType="default"
            textContentType="none"
          />
            <Button style={{ marginTop: 20 }} title="Giriş Yap" onPress={onSubmit} loading={loading} />
        </View>
        {/* <View style={{marginTop:15}}>
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
        </View> */}

        <Button style={{marginTop:15}} title="İleri" onPress={() => navigation.navigate('RegisterOtp')} loading={loading} />

        <View style={{ alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: tokens.colors.accent, fontWeight: '600', textAlign:'center' }}>
              Zaten bir hesabın var mı 
            </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: tokens.colors.accent, fontWeight: '600', textDecorationLine: 'underline' , textAlign:'center' }}>
             Giriş
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

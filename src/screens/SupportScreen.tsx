import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../components/ui/ThemedText';
import Card from '../components/ui/Card';
import { tokens } from '../../theme/tokens';

export default function SupportScreen() {
  const mail = () => Linking.openURL('mailto:destek@piggybank.app?subject=Destek%20Talebi');
  const phone = () => Linking.openURL('tel:+908501234567');

  const Row = ({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress: () => void }) => (
    <Pressable onPress={onPress} style={({ pressed }) => [{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 12 }, pressed && { opacity: 0.9 }]}>
      {icon}
      <Text style={{ color: tokens.colors.text, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.bg, padding: 16, gap: 16 }}>
      <ThemedText bold style={{ fontSize: 20 }}>Destek</ThemedText>
      <Card style={{ padding: 16 }}>
        <Row icon={<Ionicons name="mail-outline" size={18} color={tokens.colors.accent} />} label="E-posta ile iletişim" onPress={mail} />
        <Row icon={<Ionicons name="call-outline" size={18} color={tokens.colors.accent} />} label="Telefon ile iletişim" onPress={phone} />
      </Card>
      <Card style={{ padding: 16 }}>
        <Text style={{ color: tokens.colors.muted, lineHeight: 20 }}>
          Çalışma saatlerimiz: Hafta içi 09:00–18:00 (TR). {`\n`}
          Acil durumlarda telefon hattımızdan bize ulaşabilirsiniz.
        </Text>
      </Card>
    </View>
  );
}

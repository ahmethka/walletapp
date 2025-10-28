import React from 'react';
import { View, Text } from 'react-native';
import { tokens } from '../../../theme/tokens';

export default function Empty({ title = 'Kayıt bulunamadı', subtitle }: { title?: string; subtitle?: string }) {
  return (
    <View style={{ padding: 20, alignItems: 'center', gap: 6 }}>
      <Text style={{ color: tokens.colors.muted }}>{title}</Text>
      {subtitle ? <Text style={{ color: tokens.colors.muted }}>{subtitle}</Text> : null}
    </View>
  );
}

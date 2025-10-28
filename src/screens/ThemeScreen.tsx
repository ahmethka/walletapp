import React from 'react';
import { View, Text, Pressable } from 'react-native';
import ThemedText from '../components/ui/ThemedText';
import Card from '../components/ui/Card';
import { useTheme, type ThemeMode } from '../store/useTheme';
import { tokens } from '../../theme/tokens';

export default function ThemeScreen() {
  const { mode, setMode } = useTheme();

  const Option = ({ value, label }: { value: ThemeMode; label: string }) => {
    const active = mode === value;
    return (
      <Pressable
        onPress={() => setMode(value)}
        style={({ pressed }) => [
          {
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: active ? tokens.colors.accent : tokens.colors.line,
            backgroundColor: '#fff',
            marginBottom: 10,
          },
          pressed && { opacity: 0.9 },
        ]}
      >
        <Text style={{ fontWeight: '700', color: active ? tokens.colors.accent : tokens.colors.text }}>{label}</Text>
        {active && <Text style={{ color: tokens.colors.muted, marginTop: 4, fontSize: 12 }}>Seçili</Text>}
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.bg, padding: 16, gap: 16 }}>
      <ThemedText bold style={{ fontSize: 20 }}>Tema</ThemedText>
      <Card style={{ padding: 16 }}>
        <Option value="light" label="Açık" />
        <Option value="dark" label="Koyu" />
      </Card>
    </View>
  );
}

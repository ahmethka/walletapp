import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../../theme/tokens';

export default function Logo({ size = 64 }: { size?: number }) {
  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <View
        style={{
          width: size, height: size, borderRadius: 16,
          backgroundColor: tokens.colors.text, // siyah kare
          alignItems: 'center', justifyContent: 'center'
        }}
      >
        <Ionicons name="wallet" size={Math.floor(size * 0.6)} color={tokens.colors.bg} />
      </View>
      <Text style={{ color: tokens.colors.text, fontWeight: '700', fontSize: 20 }}>PiggyBank</Text>
    </View>
  );
}
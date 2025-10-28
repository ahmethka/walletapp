import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  Platform,
  View,
  ViewStyle,
  StyleProp,
  TextStyle,
  PressableProps,
} from 'react-native';
import { tokens } from '../../../theme/tokens';
import * as Haptics from 'expo-haptics';

type Props = PressableProps & {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  accessibilityLabel?: string;
  leftIcon?: React.ReactNode;           // ikon
  style?: StyleProp<ViewStyle>;         // dış stil (container)
  textStyle?: StyleProp<TextStyle>;     // ✅ yeni: metin stili
};

export default function Button({
  title,
  onPress,
  loading,
  variant = 'primary',
  disabled,
  accessibilityLabel,
  leftIcon,
  style,
  textStyle,
  ...rest
}: Props) {
  const isPrimary = variant === 'primary';

  async function handlePress() {
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    onPress?.();
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      android_ripple={isPrimary ? { color: '#11182722' } : { color: '#37415122' }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.ghost,
        pressed && (isPrimary ? styles.primaryPressed : styles.ghostPressed),
        (disabled || loading) && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : tokens.colors.accent} />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon ? <View style={styles.iconBox}>{leftIcon}</View> : null}
          <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textGhost, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.radii.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.08,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 48,
  },
  contentRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconBox: { marginRight: 2 },
  primary: { backgroundColor: tokens.colors.accent },
  primaryPressed: { backgroundColor: tokens.colors.accentHover, transform: [{ scale: 0.98 }] },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: tokens.colors.accent },
  ghostPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.6 },
  text: { fontSize: tokens.fontSizes.md, fontWeight: '600' },
  textPrimary: { color: '#fff' },
  textGhost: { color: tokens.colors.accent },
});

import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { tokens } from '../../../theme/tokens';

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export default function Input({ label, error, style, ...rest }: Props) {
  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, style, error && { borderColor: tokens.colors.danger }]}
        placeholderTextColor={tokens.colors.muted}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: tokens.colors.muted },
  input: {
    backgroundColor: tokens.colors.card,
    color: tokens.colors.text,
    borderColor: tokens.colors.line,
    borderWidth: 1,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.md,
  },
  error: { color: tokens.colors.danger, fontSize: tokens.fontSizes.sm },
});

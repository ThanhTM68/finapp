import React from 'react';
import {
  View, Text, TextInput as RNTextInput, StyleSheet, type TextInputProps,
} from 'react-native';
import { COLORS, RADIUS } from '../../../core/constants/colors';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function FormInput({ label, error, style, ...props }: FormInputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={COLORS.textSecondary}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: COLORS.text, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, padding: 14, fontSize: 16, color: COLORS.text,
  },
  inputError: { borderColor: COLORS.error },
  error: { color: COLORS.error, fontSize: 12, marginTop: 4 },
});

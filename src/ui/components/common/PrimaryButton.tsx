import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, type TouchableOpacityProps } from 'react-native';
import { COLORS, RADIUS } from '../../../core/constants/colors';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
}

export function PrimaryButton({ title, loading, style, ...props }: PrimaryButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} disabled={loading} {...props}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight } from '../../theme';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption' | 'label';
  color?: string;
  bold?: boolean;
}

export function Typography({
  variant = 'body',
  color,
  bold,
  style,
  ...rest
}: TypographyProps) {
  return (
    <Text
      style={[styles[variant], bold && styles.bold, color ? { color } : null, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  h2: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  h3: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  body: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    color: Colors.textPrimary,
  },
  bodySmall: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  bold: {
    fontWeight: FontWeight.bold,
  },
});

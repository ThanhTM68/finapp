import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../../theme';

interface CardProps extends ViewProps {
  padding?: number;
  elevated?: boolean;
}

export function Card({ padding = Spacing.md, elevated = true, style, children, ...rest }: CardProps) {
  return (
    <View
      style={[styles.card, elevated && styles.elevated, { padding }, style]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
  },
  elevated: {
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
});

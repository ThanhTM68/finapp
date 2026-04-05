import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../../core/constants/colors';

interface NumpadProps {
  value: string;
  onChange: (value: string) => void;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

export function Numpad({ value, onChange }: NumpadProps) {
  const handleKey = (key: string) => {
    if (key === '⌫') {
      onChange(value.slice(0, -1));
    } else if (key === '.' && value.includes('.')) {
      return;
    } else {
      onChange(value + key);
    }
  };

  return (
    <View style={styles.grid}>
      {KEYS.map((key) => (
        <TouchableOpacity key={key} style={styles.key} onPress={() => handleKey(key)}>
          <Text style={styles.keyText}>{key}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  key: {
    width: '33.33%', padding: SPACING.md, alignItems: 'center',
    borderWidth: 0.5, borderColor: COLORS.border,
  },
  keyText: { fontSize: 22, color: COLORS.text, fontWeight: '500' },
});

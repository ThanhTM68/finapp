import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../../core/constants/colors';
import { formatCurrency } from '../../../utils/currency';
import { Wallet } from '../../../domain/wallet/wallet.types';

interface WalletCardProps {
  wallet: Wallet;
  isSelected?: boolean;
}

export function WalletCard({ wallet, isSelected }: WalletCardProps) {
  return (
    <View style={[styles.card, isSelected && styles.selected, { borderLeftColor: wallet.color }]}>
      <Text style={styles.name}>{wallet.name}</Text>
      <Text style={[styles.balance, wallet.balance < 0 && styles.negative]}>
        {formatCurrency(wallet.balance)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    marginBottom: SPACING.sm,
    elevation: 2,
  },
  selected: { borderWidth: 2, borderColor: COLORS.primary },
  name: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  balance: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  negative: { color: COLORS.error },
});

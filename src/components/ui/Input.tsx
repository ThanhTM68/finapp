import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, BorderRadius, Spacing, FontSize } from '../../theme';
import { Typography } from './Typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secure?: boolean;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  secure,
  style,
  ...rest
}: InputProps) {
  const [showSecure, setShowSecure] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Typography variant="label" style={styles.label}>
          {label}
        </Typography>
      ) : null}
      <View style={[styles.container, error ? styles.containerError : null]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.textDisabled}
          secureTextEntry={secure && !showSecure}
          {...rest}
        />
        {secure ? (
          <TouchableOpacity
            onPress={() => setShowSecure((v) => !v)}
            style={styles.rightIcon}
          >
            <Typography variant="caption">{showSecure ? '🙈' : '👁'}</Typography>
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIcon}>{rightIcon}</View>
        ) : null}
      </View>
      {error ? (
        <Typography variant="caption" style={styles.error}>
          {error}
        </Typography>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
  },
  label: {
    marginBottom: Spacing.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  containerError: {
    borderWidth: 1.5,
    borderColor: Colors.expense,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm + 4,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    marginLeft: Spacing.sm,
  },
  error: {
    color: Colors.expense,
    marginTop: Spacing.xs,
  },
});

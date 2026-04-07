import { StyleSheet, ViewStyle } from 'react-native';
import { Colors } from './colors';

/** Helper to generate neumorphism shadow styles */
export function neumorphicShadow(
  elevation: number = 8,
): ViewStyle {
  return {
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: elevation / 2, height: elevation / 2 },
    shadowOpacity: 1,
    shadowRadius: elevation,
    elevation,
  };
}

export const neumorphicStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardPressed: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
});

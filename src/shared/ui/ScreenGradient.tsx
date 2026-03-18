import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Box } from '@gluestack-ui/themed';
import { LinearGradient } from 'expo-linear-gradient';

type ScreenGradientProps = {
  children: ReactNode;
};

export function ScreenGradient({ children }: ScreenGradientProps) {
  return (
    <Box flex={1}>
      <LinearGradient
        colors={['#09111F', '#12263C', '#111B2E', '#0B1322']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fill}
      >
        <LinearGradient
          colors={['rgba(125, 203, 255, 0.2)', 'rgba(125, 203, 255, 0)']}
          style={styles.topGlow}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 1, y: 1 }}
          pointerEvents="none"
        />
        <LinearGradient
          colors={['rgba(27, 87, 167, 0.24)', 'rgba(27, 87, 167, 0)']}
          style={styles.bottomGlow}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          pointerEvents="none"
        />
        <Box flex={1}>{children}</Box>
      </LinearGradient>
    </Box>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  topGlow: {
    position: 'absolute',
    width: 260,
    height: 260,
    top: -80,
    right: -50,
    borderRadius: 260,
  },
  bottomGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    left: -110,
    bottom: -110,
    borderRadius: 300,
  },
});

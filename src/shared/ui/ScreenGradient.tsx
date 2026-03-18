import { ReactNode } from 'react';
import { Box } from '@gluestack-ui/themed';
import { LinearGradient } from 'expo-linear-gradient';

type ScreenGradientProps = {
  children: ReactNode;
};

export function ScreenGradient({ children }: ScreenGradientProps) {
  return (
    <Box flex={1}>
      <LinearGradient
        colors={['#0D1B2A', '#152238', '#0F172A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {children}
      </LinearGradient>
    </Box>
  );
}

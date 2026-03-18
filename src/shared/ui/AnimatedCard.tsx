import { ReactNode } from 'react';
import { Box } from '@gluestack-ui/themed';
import { MotiView } from 'moti';

type AnimatedCardProps = {
  children: ReactNode;
  delay?: number;
};

export function AnimatedCard({ children, delay = 0 }: AnimatedCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: 'timing',
        duration: 420,
        delay,
      }}
    >
      <Box
        bg="$backgroundDark800"
        borderColor="$borderDark700"
        borderWidth={1}
        borderRadius="$2xl"
        p="$4"
      >
        {children}
      </Box>
    </MotiView>
  );
}

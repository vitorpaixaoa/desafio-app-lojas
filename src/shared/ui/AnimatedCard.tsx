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
      from={{ opacity: 0, translateY: 18, scale: 0.985 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        type: 'spring',
        damping: 18,
        stiffness: 170,
        delay,
      }}
    >
      <Box
        bg="$backgroundDark800"
        borderColor="$borderDark600"
        borderWidth={1}
        borderRadius="$3xl"
        p="$5"
        shadowColor="$backgroundDark950"
        shadowOffset={{ width: 0, height: 10 }}
        shadowOpacity={0.25}
        shadowRadius={16}
      >
        {children}
      </Box>
    </MotiView>
  );
}

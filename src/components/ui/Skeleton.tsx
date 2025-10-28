import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { tokens } from '../../../theme/tokens';

type Props = { height?: number; width?: number | string; radius?: number; style?: any };

export default function Skeleton({ height = 14, width = '100%', radius = 8, style }: Props) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View style={[styles.base, { height, width, borderRadius: radius, opacity }, style]} />;
}

const styles = StyleSheet.create({
  base: { backgroundColor: tokens.colors.card },
});

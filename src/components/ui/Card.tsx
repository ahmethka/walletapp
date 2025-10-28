// src/components/ui/Card.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  className?: string; // NativeWind için
  children?: React.ReactNode;
}

export default function Card({ className, style, children, ...rest }: CardProps) {
  return (
    <View
      className={`bg-card border border-line rounded-xl ${className ?? ''}`}
      style={[
        {
          // iOS gölge + Android elevation
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

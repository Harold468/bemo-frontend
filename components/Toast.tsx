import React, { useState, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';

export interface ToastProps {
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  visible: boolean;
  onHide: () => void;
}

const toastConfig = {
  success: {
    backgroundColor: '#4CAF50',
    icon: '😊',
  },
  warning: {
    backgroundColor: '#FF9800',
    icon: '⚠️',
  },
  error: {
    backgroundColor: '#F44336',
    icon: '❌',
  },
  info: {
    backgroundColor: '#2196F3',
    icon: 'ℹ️',
  },
};

export function Toast({ message, type, visible, onHide }: ToastProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  const config = toastConfig[type] || toastConfig.info;

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        zIndex: 9999,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View
        style={{
          backgroundColor: config.backgroundColor,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}
        >
          <Text style={{ fontSize: 16 }}>{config.icon}</Text>
        </View>
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16,
            flex: 1,
          }}
        >
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../../../core/theme/colors';
import { Typography } from '../../../../core/theme/typography';
import { calculatePercentage } from '../../../../core/utils/calculations';

interface ProgressCircleProps {
  count: number;
  limit: number;
  progress: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  count,
  limit,
  progress,
}) => {
  const percentage = calculatePercentage(count, limit);
  const isExceeded = count > limit;

  // Animation values
  const animatedValue = useRef(new Animated.Value(0)).current;
  const radius = 80;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  useEffect(() => {
    const targetProgress = Math.min(100, Math.max(0, percentage));
    const strokeDashoffset = circumference - (circumference * targetProgress) / 100;

    Animated.timing(animatedValue, {
      toValue: strokeDashoffset,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [percentage, circumference]);

  const getProgressColor = () => {
    if (isExceeded) return Colors.error;
    if (percentage >= 90) return Colors.warning;
    if (percentage >= 75) return Colors.warning;
    return Colors.success;
  };

  const color = getProgressColor();

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <Svg
          width={radius * 2 + strokeWidth * 2}
          height={radius * 2 + strokeWidth * 2}
          viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
        >
          <Circle
            cx={halfCircle}
            cy={halfCircle}
            r={radius}
            stroke={Colors.surface}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <AnimatedCircle
            cx={halfCircle}
            cy={halfCircle}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={animatedValue}
            strokeLinecap="round"
            rotation="-90"
            origin={`${halfCircle}, ${halfCircle}`}
          />
        </Svg>
        <View style={styles.innerContent}>
          <Text style={[styles.count, { color }]}>{count}</Text>
          <Text style={styles.limit}>/ {limit}</Text>
          <Text style={[styles.percentage, { color }]}>
            {percentage.toFixed(0)}%
          </Text>
        </View>
      </View>
      <Text style={styles.label}>Daily Progress</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 24,
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  innerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    ...Typography.h1,
    fontSize: 48,
    fontWeight: 'bold',
  },
  limit: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  label: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  percentage: {
    ...Typography.h3,
    marginTop: 4,
    fontWeight: 'bold',
  },
});

export default ProgressCircle;


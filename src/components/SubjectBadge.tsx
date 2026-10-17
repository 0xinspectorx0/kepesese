import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KpssSubject } from '../types';
import { Theme } from '../constants/theme';

interface SubjectBadgeProps {
  subject: KpssSubject;
  size?: 'sm' | 'md' | 'lg';
}

export const SubjectBadge: React.FC<SubjectBadgeProps> = ({ subject, size = 'md' }) => {
  const colorScheme = Theme.subjectColors[subject] || Theme.subjectColors['Güncel Bilgiler'];

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colorScheme.light,
          paddingHorizontal: isSmall ? 8 : isLarge ? 14 : 10,
          paddingVertical: isSmall ? 3 : isLarge ? 6 : 4,
          borderRadius: Theme.borderRadius.round,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: colorScheme.main }]} />
      <Text
        style={[
          styles.text,
          {
            color: colorScheme.badgeText,
            fontSize: isSmall ? 11 : isLarge ? 14 : 12,
            fontWeight: '600',
          },
        ]}
      >
        {subject}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    letterSpacing: 0.2,
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DailyTip } from '../types';
import { Theme } from '../constants/theme';
import { SubjectBadge } from './SubjectBadge';
import { useApp } from '../context/AppContext';

interface DailyTipCardProps {
  tip: DailyTip;
  expanded?: boolean;
}

export const DailyTipCard: React.FC<DailyTipCardProps> = ({ tip, expanded = false }) => {
  const { toggleSaveTip, likeDailyTip } = useApp();
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (!isLiked) {
      likeDailyTip(tip.id);
      setIsLiked(true);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `KPSS Günün Bilgisi: ${tip.title}\n\n${tip.content}${tip.codeTrick ? `\n\n${tip.codeTrick}` : ''}\n\nKPSS Master Uygulaması'ndan paylaşıldı.`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <SubjectBadge subject={tip.subject} size="sm" />
        <Text style={styles.date}>{tip.date}</Text>
      </View>

      {/* Title & Body */}
      <Text style={styles.title}>{tip.title}</Text>
      <Text style={styles.content}>{tip.content}</Text>

      {/* Code Trick / Memory Tip Highlight */}
      {tip.codeTrick ? (
        <View style={styles.trickBox}>
          <View style={styles.trickIconBadge}>
            <Ionicons name="key-sharp" size={14} color="#6C5CE7" />
          </View>
          <Text style={styles.trickText}>{tip.codeTrick}</Text>
        </View>
      ) : null}

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike} activeOpacity={0.7}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={18}
            color={isLiked ? '#FF6B6B' : Theme.colors.textSecondary}
          />
          <Text style={[styles.actionText, isLiked && { color: '#FF6B6B', fontWeight: '600' }]}>
            {tip.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => toggleSaveTip(tip.id)} activeOpacity={0.7}>
          <Ionicons
            name={tip.isSaved ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={tip.isSaved ? Theme.colors.primary : Theme.colors.textSecondary}
          />
          <Text style={[styles.actionText, tip.isSaved && { color: Theme.colors.primary }]}>
            {tip.isSaved ? 'Kaydedildi' : 'Kaydet'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={handleShare} activeOpacity={0.7}>
          <Ionicons name="share-social-outline" size={18} color={Theme.colors.textSecondary} />
          <Text style={styles.actionText}>Paylaş</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.textMain,
    marginBottom: 8,
    lineHeight: 22,
  },
  content: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    lineHeight: 21,
    marginBottom: 12,
  },
  trickBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F0FF',
    padding: 10,
    borderRadius: Theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.primary,
    marginBottom: 14,
  },
  trickIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  trickText: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.primary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
});

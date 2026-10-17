import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Question } from '../types';
import { Theme } from '../constants/theme';
import { SubjectBadge } from './SubjectBadge';
import { useApp } from '../context/AppContext';

interface QuestionCardProps {
  question: Question;
  showExplanationInitially?: boolean;
  onSelectOption?: (option: 'A' | 'B' | 'C' | 'D' | 'E') => void;
  selectedOption?: 'A' | 'B' | 'C' | 'D' | 'E' | null;
  isSubmitted?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  showExplanationInitially = false,
  onSelectOption,
  selectedOption: externalSelectedOption,
  isSubmitted: externalIsSubmitted,
}) => {
  const { toggleBookmark } = useApp();
  const [internalSelected, setInternalSelected] = useState<'A' | 'B' | 'C' | 'D' | 'E' | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(showExplanationInitially);

  const selected = externalSelectedOption !== undefined ? externalSelectedOption : internalSelected;
  const isAnswered = externalIsSubmitted !== undefined ? externalIsSubmitted : internalSelected !== null;

  const handleOptionPress = (key: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (onSelectOption) {
      onSelectOption(key);
    } else {
      setInternalSelected(key);
      setShowExplanation(true);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Kolay':
        return '#10B981';
      case 'Orta':
        return '#F59E0B';
      case 'Zor':
        return '#FF6B6B';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={styles.card}>
      {/* Top Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <SubjectBadge subject={question.subject} size="sm" />
          <View
            style={[
              styles.difficultyTag,
              { backgroundColor: getDifficultyColor(question.difficulty) + '15' },
            ]}
          >
            <Text style={[styles.difficultyText, { color: getDifficultyColor(question.difficulty) }]}>
              {question.difficulty}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => toggleBookmark(question.id)}
          style={styles.bookmarkBtn}
          activeOpacity={0.7}
        >
          <Ionicons
            name={question.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={question.isBookmarked ? Theme.colors.primary : Theme.colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Topic & Year */}
      <View style={styles.metaRow}>
        <Text style={styles.topicText}>{question.topic}</Text>
        {question.year && <Text style={styles.yearText}>{question.year} KPSS</Text>}
      </View>

      {/* Question Text */}
      <Text style={styles.questionText}>{question.questionText}</Text>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {(['A', 'B', 'C', 'D', 'E'] as const).map((key) => {
          const optionText = question.options[key];
          if (!optionText) return null;

          const isSelected = selected === key;
          const isCorrect = key === question.correctOption;

          let optionStyle = styles.optionItem;
          let textStyle = styles.optionText;
          let badgeStyle = styles.optionLetter;
          let badgeTextStyle = styles.optionLetterText;

          if (isAnswered) {
            if (isCorrect) {
              optionStyle = [styles.optionItem, styles.correctOption];
              textStyle = [styles.optionText, styles.correctOptionText];
              badgeStyle = [styles.optionLetter, styles.correctOptionLetter];
              badgeTextStyle = [styles.optionLetterText, styles.correctOptionLetterText];
            } else if (isSelected && !isCorrect) {
              optionStyle = [styles.optionItem, styles.wrongOption];
              textStyle = [styles.optionText, styles.wrongOptionText];
              badgeStyle = [styles.optionLetter, styles.wrongOptionLetter];
              badgeTextStyle = [styles.optionLetterText, styles.wrongOptionLetterText];
            }
          } else if (isSelected) {
            optionStyle = [styles.optionItem, styles.selectedOption];
            badgeStyle = [styles.optionLetter, styles.selectedOptionLetter];
            badgeTextStyle = [styles.optionLetterText, styles.selectedOptionLetterText];
          }

          return (
            <TouchableOpacity
              key={key}
              style={optionStyle}
              onPress={() => handleOptionPress(key)}
              activeOpacity={0.8}
            >
              <View style={badgeStyle}>
                <Text style={badgeTextStyle}>{key}</Text>
              </View>
              <Text style={textStyle}>{optionText}</Text>
              {isAnswered && isCorrect && (
                <Ionicons name="checkmark-circle" size={20} color="#10B981" style={styles.iconRight} />
              )}
              {isAnswered && isSelected && !isCorrect && (
                <Ionicons name="close-circle" size={20} color="#FF6B6B" style={styles.iconRight} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Toggle Explanation Button */}
      {isAnswered && (
        <TouchableOpacity
          style={styles.toggleExpBtn}
          onPress={() => setShowExplanation(!showExplanation)}
          activeOpacity={0.7}
        >
          <Ionicons name="bulb-outline" size={18} color={Theme.colors.primary} />
          <Text style={styles.toggleExpText}>
            {showExplanation ? 'Çözüm Açıklamasını Gizle' : 'Çözüm Açıklamasını Gör'}
          </Text>
          <Ionicons
            name={showExplanation ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={Theme.colors.primary}
          />
        </TouchableOpacity>
      )}

      {/* Explanation Box */}
      {showExplanation && (
        <View style={styles.explanationBox}>
          <View style={styles.expHeader}>
            <Ionicons name="checkmark-done-circle" size={18} color="#10B981" />
            <Text style={styles.expTitle}>
              Doğru Cevap: <Text style={{ color: '#10B981', fontWeight: '800' }}>{question.correctOption}</Text>
            </Text>
          </View>
          <Text style={styles.expContent}>{question.explanation}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: 18,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Theme.borderRadius.round,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
  },
  bookmarkBtn: {
    padding: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  topicText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  yearText: {
    fontSize: 11,
    color: Theme.colors.primary,
    fontWeight: '600',
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  questionText: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.textMain,
    lineHeight: 23,
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 10,
    marginBottom: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: Theme.borderRadius.md,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    backgroundColor: '#F0EEFF',
    borderColor: Theme.colors.primary,
  },
  correctOption: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  wrongOption: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  optionLetter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedOptionLetter: {
    backgroundColor: Theme.colors.primary,
  },
  correctOptionLetter: {
    backgroundColor: '#10B981',
  },
  wrongOptionLetter: {
    backgroundColor: '#EF4444',
  },
  optionLetterText: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
  },
  selectedOptionLetterText: {
    color: '#FFFFFF',
  },
  correctOptionLetterText: {
    color: '#FFFFFF',
  },
  wrongOptionLetterText: {
    color: '#FFFFFF',
  },
  optionText: {
    fontSize: 14,
    color: Theme.colors.textMain,
    flex: 1,
    lineHeight: 20,
  },
  correctOptionText: {
    color: '#065F46',
    fontWeight: '600',
  },
  wrongOptionText: {
    color: '#991B1B',
  },
  iconRight: {
    marginLeft: 8,
  },
  toggleExpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F0FF',
    paddingVertical: 10,
    borderRadius: Theme.borderRadius.md,
    marginTop: 4,
    gap: 6,
  },
  toggleExpText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  explanationBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: Theme.borderRadius.md,
    padding: 14,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.info,
  },
  expHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  expTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.textMain,
  },
  expContent: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
  },
});

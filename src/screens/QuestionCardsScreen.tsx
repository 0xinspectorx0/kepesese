import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { QuestionCard } from '../components/QuestionCard';
import { KpssSubject, QuestionDifficulty } from '../types';

const { width } = Dimensions.get('window');

const ALL_SUBJECTS: Array<KpssSubject | 'Tümü'> = [
  'Tümü',
  'Tarih',
  'Coğrafya',
  'Vatandaşlık',
  'Türkçe',
  'Matematik',
  'Güncel Bilgiler',
];

const DIFFICULTIES: Array<QuestionDifficulty | 'Tümü'> = ['Tümü', 'Kolay', 'Orta', 'Zor'];

export const QuestionCardsScreen: React.FC<any> = ({ route }) => {
  const { questions } = useApp();
  const initialSubject = route?.params?.selectedSubject || 'Tümü';

  const [selectedSubject, setSelectedSubject] = useState<KpssSubject | 'Tümü'>(initialSubject);
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | 'Tümü'>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchSubject = selectedSubject === 'Tümü' || q.subject === selectedSubject;
      const matchDiff = selectedDifficulty === 'Tümü' || q.difficulty === selectedDifficulty;
      const matchSearch =
        searchQuery.trim() === '' ||
        q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubject && matchDiff && matchSearch;
    });
  }, [questions, selectedSubject, selectedDifficulty, searchQuery]);

  // Ensure currentIndex stays within bounds
  const currentQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Search Header */}
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={18} color={Theme.colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Soru veya konu ara..."
            value={searchQuery}
            onChangeText={(txt) => {
              setSearchQuery(txt);
              setCurrentIndex(0);
            }}
            placeholderTextColor={Theme.colors.textMuted}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Subject Filter Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {ALL_SUBJECTS.map((subj) => (
            <TouchableOpacity
              key={subj}
              style={[
                styles.filterChip,
                selectedSubject === subj && styles.filterChipActive,
              ]}
              onPress={() => {
                setSelectedSubject(subj);
                setCurrentIndex(0);
              }}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedSubject === subj && styles.filterChipTextActive,
                ]}
              >
                {subj}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Difficulty Sub-bar & Deck Counter */}
        <View style={styles.counterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
            {DIFFICULTIES.map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[
                  styles.diffChip,
                  selectedDifficulty === diff && styles.diffChipActive,
                ]}
                onPress={() => {
                  setSelectedDifficulty(diff);
                  setCurrentIndex(0);
                }}
              >
                <Text
                  style={[
                    styles.diffChipText,
                    selectedDifficulty === diff && styles.diffChipTextActive,
                  ]}
                >
                  {diff}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {filteredQuestions.length > 0 && (
            <View style={styles.deckCounter}>
              <Text style={styles.deckCounterText}>
                {currentIndex + 1} / {filteredQuestions.length}
              </Text>
            </View>
          )}
        </View>

        {/* Question Deck Card View */}
        <ScrollView style={styles.cardScrollView} showsVerticalScrollIndicator={false}>
          {filteredQuestions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="file-tray-outline" size={56} color={Theme.colors.textMuted} />
              <Text style={styles.emptyTitle}>Soru Bulunamadı</Text>
              <Text style={styles.emptySub}>
                Seçtiğiniz filtreye uygun soru bulunamadı. Lütfen filtreleri değiştirin.
              </Text>
            </View>
          ) : (
            <QuestionCard key={currentQuestion.id} question={currentQuestion} />
          )}
        </ScrollView>

        {/* Bottom Navigation Buttons */}
        {filteredQuestions.length > 0 && (
          <View style={styles.deckNavRow}>
            <TouchableOpacity
              style={[styles.deckNavBtn, currentIndex === 0 && styles.deckNavBtnDisabled]}
              onPress={handlePrev}
              disabled={currentIndex === 0}
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={currentIndex === 0 ? Theme.colors.textMuted : Theme.colors.primary}
              />
              <Text
                style={[
                  styles.deckNavText,
                  currentIndex === 0 && styles.deckNavTextDisabled,
                ]}
              >
                Önceki
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deckNavBtn,
                styles.deckNavBtnNext,
                currentIndex === filteredQuestions.length - 1 && styles.deckNavBtnDisabled,
              ]}
              onPress={handleNext}
              disabled={currentIndex === filteredQuestions.length - 1}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.deckNavText,
                  styles.deckNavTextNext,
                  currentIndex === filteredQuestions.length - 1 && styles.deckNavTextDisabled,
                ]}
              >
                Sonraki Soru
              </Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={
                  currentIndex === filteredQuestions.length - 1 ? Theme.colors.textMuted : '#FFFFFF'
                }
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Theme.colors.textMain,
    padding: 0,
  },
  filterScroll: {
    maxHeight: 38,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Theme.borderRadius.round,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  diffChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: '#EAECEF',
    marginRight: 6,
  },
  diffChipActive: {
    backgroundColor: Theme.colors.textMain,
  },
  diffChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  diffChipTextActive: {
    color: '#FFFFFF',
  },
  deckCounter: {
    backgroundColor: Theme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.round,
  },
  deckCounterText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  cardScrollView: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.textMain,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  deckNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    backgroundColor: Theme.colors.background,
  },
  deckNavBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    gap: 6,
  },
  deckNavBtnNext: {
    backgroundColor: Theme.colors.primary,
  },
  deckNavBtnDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  deckNavText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  deckNavTextNext: {
    color: '#FFFFFF',
  },
  deckNavTextDisabled: {
    color: Theme.colors.textMuted,
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Question } from '../types';
import { SubjectBadge } from '../components/SubjectBadge';

export const QuizActiveScreen: React.FC<any> = ({ route, navigation }) => {
  const { quizTitle, subject, questions, durationSeconds } = route.params as {
    quizTitle: string;
    subject: string;
    questions: Question[];
    durationSeconds: number;
  };

  const { recordQuizResult } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | 'E' | null>>(
    {}
  );
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [showGridModal, setShowGridModal] = useState(false);

  const currentQ = questions[currentIndex];

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinishQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (optionKey: 'A' | 'B' | 'C' | 'D' | 'E') => {
    const updated = {
      ...userAnswers,
      [currentQ.id]: userAnswers[currentQ.id] === optionKey ? null : optionKey,
    };
    setUserAnswers(updated);
  };

  const handleFinishQuiz = () => {
    // Calculate results
    let correctCount = 0;
    let wrongCount = 0;
    let emptyCount = 0;

    questions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (!ans) {
        emptyCount++;
      } else if (ans === q.correctOption) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const netCount = Number((correctCount - wrongCount * 0.25).toFixed(2));
    const score = Math.max(0, Math.round((correctCount / questions.length) * 100));
    const spentTime = durationSeconds - timeLeft;

    recordQuizResult({
      quizTitle,
      subject: subject as any,
      totalQuestions: questions.length,
      correctCount,
      wrongCount,
      emptyCount,
      netCount,
      score,
      durationSeconds: spentTime,
      userAnswers,
    });

    navigation.replace('QuizResult', {
      quizTitle,
      subject,
      questions,
      userAnswers,
      correctCount,
      wrongCount,
      emptyCount,
      netCount,
      score,
      durationSeconds: spentTime,
    });
  };

  const confirmFinish = () => {
    const answeredCount = Object.values(userAnswers).filter(Boolean).length;
    const isWeb = typeof window !== 'undefined';
    
    if (isWeb) {
      if (confirm(`Testi bitirmek istediğinize emin misiniz?\n${answeredCount} / ${questions.length} soru yanıtlandı.`)) {
        handleFinishQuiz();
      }
    } else {
      Alert.alert(
        'Testi Bitir',
        `${answeredCount} / ${questions.length} soru yanıtlandı. Testi tamamlamak istiyor musunuz?`,
        [
          { text: 'Devam Et', style: 'cancel' },
          { text: 'Bitir', style: 'destructive', onPress: handleFinishQuiz },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Quiz Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={confirmFinish} style={styles.exitBtn}>
          <Ionicons name="close" size={22} color={Theme.colors.textMain} />
        </TouchableOpacity>

        <View style={styles.timerBadge}>
          <Ionicons name="time" size={16} color={timeLeft < 60 ? '#FF6B6B' : Theme.colors.primary} />
          <Text
            style={[
              styles.timerText,
              timeLeft < 60 && { color: '#FF6B6B', fontWeight: '800' },
            ]}
          >
            {formatTime(timeLeft)}
          </Text>
        </View>

        <TouchableOpacity onPress={() => setShowGridModal(true)} style={styles.gridBtn}>
          <Ionicons name="grid-outline" size={20} color={Theme.colors.primary} />
          <Text style={styles.gridBtnText}>
            {currentIndex + 1}/{questions.length}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBg}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentIndex + 1) / questions.length) * 100}%` },
          ]}
        />
      </View>

      {/* Main Question Scroll */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {currentQ && (
          <View style={styles.qCard}>
            <View style={styles.qHeader}>
              <SubjectBadge subject={currentQ.subject} size="sm" />
              <Text style={styles.qTopic}>{currentQ.topic}</Text>
            </View>

            <Text style={styles.qText}>{currentQ.questionText}</Text>

            {/* Options */}
            <View style={styles.optionsList}>
              {(['A', 'B', 'C', 'D', 'E'] as const).map((key) => {
                const optText = currentQ.options[key];
                if (!optText) return null;

                const isSelected = userAnswers[currentQ.id] === key;

                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.optItem, isSelected && styles.optItemSelected]}
                    onPress={() => handleSelectAnswer(key)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.optBadge, isSelected && styles.optBadgeSelected]}>
                      <Text style={[styles.optLetter, isSelected && styles.optLetterSelected]}>
                        {key}
                      </Text>
                    </View>
                    <Text style={[styles.optText, isSelected && styles.optTextSelected]}>
                      {optText}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
          onPress={() => setCurrentIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          <Ionicons name="arrow-back" size={18} color={currentIndex === 0 ? '#9CA3AF' : Theme.colors.primary} />
          <Text style={[styles.navBtnText, currentIndex === 0 && styles.navBtnTextDisabled]}>Önceki</Text>
        </TouchableOpacity>

        {currentIndex === questions.length - 1 ? (
          <TouchableOpacity style={styles.finishBtn} onPress={confirmFinish}>
            <Ionicons name="checkmark-done" size={18} color="#FFF" />
            <Text style={styles.finishBtnText}>Testi Bitir</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextBtn} onPress={() => setCurrentIndex(currentIndex + 1)}>
            <Text style={styles.nextBtnText}>Sonraki Soru</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Soru Listesi Grid Modal */}
      <Modal visible={showGridModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Soru Haritası</Text>
              <TouchableOpacity onPress={() => setShowGridModal(false)}>
                <Ionicons name="close" size={24} color={Theme.colors.textMain} />
              </TouchableOpacity>
            </View>

            <View style={styles.gridContainer}>
              {questions.map((q, idx) => {
                const isAnswered = !!userAnswers[q.id];
                const isCurrent = idx === currentIndex;

                return (
                  <TouchableOpacity
                    key={q.id}
                    style={[
                      styles.gridItem,
                      isAnswered && styles.gridItemAnswered,
                      isCurrent && styles.gridItemCurrent,
                    ]}
                    onPress={() => {
                      setCurrentIndex(idx);
                      setShowGridModal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.gridItemText,
                        isAnswered && styles.gridItemTextAnswered,
                        isCurrent && styles.gridItemTextCurrent,
                      ]}
                    >
                      {idx + 1}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.gridLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Theme.colors.primary }]} />
                <Text style={styles.legendText}>Cevaplandı</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#E5E7EB' }]} />
                <Text style={styles.legendText}>Boş</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  exitBtn: {
    padding: 6,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.round,
    gap: 6,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  gridBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.md,
  },
  gridBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  progressBg: {
    height: 4,
    backgroundColor: '#E5E7EB',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  qCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
    marginBottom: 20,
  },
  qHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  qTopic: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textMuted,
  },
  qText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.textMain,
    lineHeight: 24,
    marginBottom: 18,
  },
  optionsList: {
    gap: 10,
  },
  optItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: Theme.borderRadius.md,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  optItemSelected: {
    backgroundColor: '#F0EEFF',
    borderColor: Theme.colors.primary,
  },
  optBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  optBadgeSelected: {
    backgroundColor: Theme.colors.primary,
  },
  optLetter: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
  },
  optLetterSelected: {
    color: '#FFFFFF',
  },
  optText: {
    fontSize: 14,
    color: Theme.colors.textMain,
    flex: 1,
  },
  optTextSelected: {
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  navBtnDisabled: {
    opacity: 0.5,
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  navBtnTextDisabled: {
    color: '#9CA3AF',
  },
  nextBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.primary,
    gap: 6,
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  finishBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: '#10B981',
    gap: 6,
  },
  finishBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.xl,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Theme.colors.textMain,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  gridItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  gridItemAnswered: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  gridItemCurrent: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  gridItemText: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.textMain,
  },
  gridItemTextAnswered: {
    color: '#FFFFFF',
  },
  gridItemTextCurrent: {
    color: '#10B981',
  },
  gridLegend: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
});

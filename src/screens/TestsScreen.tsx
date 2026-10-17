import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { KpssSubject } from '../types';

interface QuizPreset {
  id: string;
  title: string;
  subject: KpssSubject | 'Karma';
  questionCount: number;
  durationMinutes: number;
  description: string;
  badge: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const QUIZ_PRESETS: QuizPreset[] = [
  {
    id: 'p_karma_mini',
    title: 'KPSS Genel Karma Mini Deneme',
    subject: 'Karma',
    questionCount: 10,
    durationMinutes: 10,
    description: 'Tüm KPSS derslerinden karma sorulardan oluşan süre ayarlı mini deneme.',
    badge: 'Popüler',
    color: '#6C5CE7',
    icon: 'school-outline',
  },
  {
    id: 'p_tarih',
    title: 'Tarih Konu Testi',
    subject: 'Tarih',
    questionCount: 8,
    durationMinutes: 8,
    description: 'Osmanlı, İnkılap ve Türk Tarihi odaklı kavrama testi.',
    badge: 'Tarih',
    color: '#8E44AD',
    icon: 'time-outline',
  },
  {
    id: 'p_cografya',
    title: 'Coğrafya Harita & Konu Testi',
    subject: 'Coğrafya',
    questionCount: 6,
    durationMinutes: 6,
    description: 'Türkiye fiziki coğrafya ve iklim soruları.',
    badge: 'Coğrafya',
    color: '#2980B9',
    icon: 'compass-outline',
  },
  {
    id: 'p_vatandashk',
    title: 'Vatandaşlık & Anayasa Testi',
    subject: 'Vatandaşlık',
    questionCount: 6,
    durationMinutes: 6,
    description: '1982 Anayasası, Yasama, Yürütme ve Yargı organları.',
    badge: 'Vatandaşlık',
    color: '#C0392B',
    icon: 'briefcase-outline',
  },
  {
    id: 'p_turkce_mat',
    title: 'Türkçe & Matematik Yetenek',
    subject: 'Türkçe',
    questionCount: 8,
    durationMinutes: 10,
    description: 'Yazım kuralları, paragraf ve sayı problemleri.',
    badge: 'Genel Yetenek',
    color: '#27AE60',
    icon: 'calculator-outline',
  },
  {
    id: 'p_sprint',
    title: '5 Soruluk Hızlı Sprint Test',
    subject: 'Karma',
    questionCount: 5,
    durationMinutes: 4,
    description: 'Otobüste, molada çözebileceğiniz hızlı ve pratik 5 soru.',
    badge: 'Hızlı',
    color: '#D35400',
    icon: 'flash-outline',
  },
];

export const TestsScreen: React.FC<any> = ({ navigation }) => {
  const { questions, wrongQuestionIds } = useApp();

  const handleStartQuiz = (preset: QuizPreset) => {
    // Select questions
    let quizQuestions = questions;
    if (preset.subject !== 'Karma') {
      quizQuestions = questions.filter((q) => q.subject === preset.subject);
    }

    if (quizQuestions.length === 0) {
      quizQuestions = questions;
    }

    // Shuffle and pick limit
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, preset.questionCount);

    navigation.navigate('QuizActive', {
      quizTitle: preset.title,
      subject: preset.subject,
      questions: selected,
      durationSeconds: preset.durationMinutes * 60,
    });
  };

  const handleStartWrongQuiz = () => {
    const wrongQuestions = questions.filter((q) => wrongQuestionIds.includes(q.id));
    if (wrongQuestions.length === 0) {
      alert('Henüz yanlış yaptığınız soru bulunmuyor! Harika iş!');
      return;
    }

    navigation.navigate('QuizActive', {
      quizTitle: 'Yanlış Yapılan Sorular Testi',
      subject: 'Karma',
      questions: wrongQuestions,
      durationSeconds: wrongQuestions.length * 90,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Testler ve Denemeler</Text>
        <Text style={styles.headerSub}>Sınav formatına uygun hazırlanan soru setleri</Text>

        {/* Custom Wrong Questions Card */}
        {wrongQuestionIds.length > 0 && (
          <TouchableOpacity
            style={styles.wrongQuizBanner}
            onPress={handleStartWrongQuiz}
            activeOpacity={0.85}
          >
            <View style={styles.wrongIconBg}>
              <Ionicons name="alert-circle" size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.wrongTitle}>Yanlışlarımı Tekrar Et</Text>
              <Text style={styles.wrongSub}>
                Daha önce yanlış yaptığın {wrongQuestionIds.length} sorudan test oluştur.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        )}

        {/* Presets List */}
        <Text style={styles.sectionTitle}>Hazır Test Modları</Text>
        <View style={styles.presetList}>
          {QUIZ_PRESETS.map((preset) => (
            <TouchableOpacity
              key={preset.id}
              style={styles.presetCard}
              onPress={() => handleStartQuiz(preset)}
              activeOpacity={0.8}
            >
              <View style={styles.presetHeader}>
                <View style={[styles.iconBox, { backgroundColor: preset.color + '15' }]}>
                  <Ionicons name={preset.icon} size={22} color={preset.color} />
                </View>
                <View style={[styles.badge, { backgroundColor: preset.color + '15' }]}>
                  <Text style={[styles.badgeText, { color: preset.color }]}>{preset.badge}</Text>
                </View>
              </View>

              <Text style={styles.presetTitle}>{preset.title}</Text>
              <Text style={styles.presetDesc}>{preset.description}</Text>

              <View style={styles.presetFooter}>
                <View style={styles.metaItem}>
                  <Ionicons name="help-circle-outline" size={15} color={Theme.colors.textMuted} />
                  <Text style={styles.metaText}>{preset.questionCount} Soru</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={15} color={Theme.colors.textMuted} />
                  <Text style={styles.metaText}>{preset.durationMinutes} Dakika</Text>
                </View>
                <View style={styles.startBtnPill}>
                  <Text style={styles.startBtnPillText}>Başlat</Text>
                  <Ionicons name="arrow-forward" size={14} color={Theme.colors.primary} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Theme.colors.textMain,
    marginTop: 14,
  },
  headerSub: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  wrongQuizBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE3E3',
    borderRadius: Theme.borderRadius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFC9C9',
    gap: 12,
  },
  wrongIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrongTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#991B1B',
  },
  wrongSub: {
    fontSize: 12,
    color: '#7F1D1D',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.textMain,
    marginBottom: 12,
  },
  presetList: {
    gap: 12,
  },
  presetCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  presetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.round,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  presetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.textMain,
    marginBottom: 4,
  },
  presetDesc: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    lineHeight: 19,
    marginBottom: 14,
  },
  presetFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    fontWeight: '500',
  },
  startBtnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Theme.borderRadius.round,
    gap: 4,
  },
  startBtnPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
});

import React from 'react';
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
import { QuestionCard } from '../components/QuestionCard';

export const QuizResultScreen: React.FC<any> = ({ route, navigation }) => {
  const {
    quizTitle,
    questions,
    userAnswers,
    correctCount,
    wrongCount,
    emptyCount,
    netCount,
    score,
    durationSeconds,
  } = route.params;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}dk ${s}sn`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Celebration Header */}
        <View style={styles.headerCard}>
          <View style={styles.trophyCircle}>
            <Ionicons
              name={score >= 70 ? 'trophy' : 'ribbon'}
              size={38}
              color={score >= 70 ? '#F59E0B' : Theme.colors.primary}
            />
          </View>

          <Text style={styles.title}>{quizTitle} Tamamlandı!</Text>
          <Text style={styles.scoreText}>{score} Başarı Puanı</Text>

          {/* Stats Grid */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: '#10B981' }]}>{correctCount}</Text>
              <Text style={styles.statLabel}>Doğru</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: '#EF4444' }]}>{wrongCount}</Text>
              <Text style={styles.statLabel}>Yanlış</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: '#6B7280' }]}>{emptyCount}</Text>
              <Text style={styles.statLabel}>Boş</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: Theme.colors.primary }]}>{netCount}</Text>
              <Text style={styles.statLabel}>Net</Text>
            </View>
          </View>

          <Text style={styles.timeText}>
            ⏱ Tamamlama Süresi: <Text style={{ fontWeight: '700' }}>{formatTime(durationSeconds)}</Text>
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
          >
            <Ionicons name="home-outline" size={18} color={Theme.colors.primary} />
            <Text style={styles.homeBtnText}>Ana Sayfa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.retakeBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Tests' })}
          >
            <Ionicons name="refresh-outline" size={18} color="#FFF" />
            <Text style={styles.retakeBtnText}>Yeni Test Çöz</Text>
          </TouchableOpacity>
        </View>

        {/* Question Solutions Breakdown */}
        <Text style={styles.sectionTitle}>Soru Çözümleri ve İnceleme</Text>
        {questions.map((q: any, idx: number) => (
          <View key={q.id} style={{ marginBottom: 10 }}>
            <View style={styles.numBadge}>
              <Text style={styles.numText}>Soru {idx + 1}</Text>
            </View>
            <QuestionCard
              question={q}
              selectedOption={userAnswers[q.id]}
              isSubmitted={true}
              showExplanationInitially={true}
            />
          </View>
        ))}

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
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.xl,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  trophyCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.textMain,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 22,
    fontWeight: '800',
    color: Theme.colors.primary,
    marginTop: 4,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: Theme.borderRadius.md,
    paddingVertical: 12,
    marginBottom: 12,
  },
  statBox: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  timeText: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  homeBtn: {
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
  homeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  retakeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.primary,
    gap: 6,
  },
  retakeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.textMain,
    marginBottom: 12,
  },
  numBadge: {
    backgroundColor: Theme.colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.round,
    marginBottom: -16,
    zIndex: 10,
    marginLeft: 12,
  },
  numText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

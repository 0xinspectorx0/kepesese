import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { DailyTipCard } from '../components/DailyTipCard';
import { SubjectBadge } from '../components/SubjectBadge';
import { KpssSubject } from '../types';

interface HomeScreenProps {
  navigation: any;
}

const SUBJECT_LIST: KpssSubject[] = [
  'Tarih',
  'Coğrafya',
  'Vatandaşlık',
  'Türkçe',
  'Matematik',
  'Güncel Bilgiler',
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { currentUser, dailyTips, questions, stats, toggleUserRole } = useApp();

  const featuredTip = dailyTips[0];
  const targetPercent = Math.min(
    100,
    Math.round((stats.totalQuestionsSolved / currentUser.dailyGoal) * 100)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Soft Header */}
        <View style={styles.header}>
          <View style={styles.userRow}>
            <Image
              source={{
                uri: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
              }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.greetingText}>Merhaba, {currentUser.name.split(' ')[0]} 👋</Text>
              <Text style={styles.subGreeting}>KPSS Sınavına <Text style={{fontWeight: '700', color: Theme.colors.primary}}>240 Gün</Text> Kaldı</Text>
            </View>
            <TouchableOpacity
              style={styles.roleBadge}
              onPress={toggleUserRole}
              activeOpacity={0.8}
            >
              <Text style={styles.roleBadgeText}>
                {currentUser.role === 'admin' ? '👑 Admin' : '👤 Öğrenci'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Goal & Streak Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerTop}>
            <View>
              <Text style={styles.bannerTitle}>Günlük Soru Hedefi</Text>
              <Text style={styles.bannerSubtitle}>
                {stats.totalQuestionsSolved} / {currentUser.dailyGoal} Soru Tamamlandı
              </Text>
            </View>
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={18} color="#FF6B6B" />
              <Text style={styles.streakText}>{currentUser.streakDays} Gün Seri</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${targetPercent}%` }]} />
          </View>
        </View>

        {/* Quick Action Grid */}
        <Text style={styles.sectionHeader}>Hızlı İşlemler</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#F0EEFF' }]}
            onPress={() => navigation.navigate('QuestionCards')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBg, { backgroundColor: Theme.colors.primary }]}>
              <Ionicons name="layers-outline" size={22} color="#FFF" />
            </View>
            <Text style={styles.actionCardTitle}>Soru Kartları</Text>
            <Text style={styles.actionCardSub}>{questions.length} Soru Havuzu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#E6F9F5' }]}
            onPress={() => navigation.navigate('Tests')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBg, { backgroundColor: Theme.colors.secondary }]}>
              <Ionicons name="clipboard-outline" size={22} color="#FFF" />
            </View>
            <Text style={styles.actionCardTitle}>Mini Deneme</Text>
            <Text style={styles.actionCardSub}>Zaman Ayarlı Test</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#FFEEEE' }]}
            onPress={() => navigation.navigate('Saved', { screen: 'Yanlislarim' })}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBg, { backgroundColor: Theme.colors.error }]}>
              <Ionicons name="refresh-circle-outline" size={22} color="#FFF" />
            </View>
            <Text style={styles.actionCardTitle}>Yanlışlarım</Text>
            <Text style={styles.actionCardSub}>Tekrar Et</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#FFF4E5' }]}
            onPress={() => navigation.navigate('Saved', { screen: 'Kaydedilenler' })}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBg, { backgroundColor: Theme.colors.warning }]}>
              <Ionicons name="bookmark-outline" size={22} color="#FFF" />
            </View>
            <Text style={styles.actionCardTitle}>Kaydedilenler</Text>
            <Text style={styles.actionCardSub}>Favori Soruların</Text>
          </TouchableOpacity>
        </View>

        {/* Günün Bilgisi Highlight */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>💡 Günün Bilgisi & Şifresi</Text>
        </View>
        {featuredTip && <DailyTipCard tip={featuredTip} />}

        {/* Subject Performance Breakdown */}
        <Text style={styles.sectionHeader}>Ders Bazlı Başarı</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectScroll}>
          {SUBJECT_LIST.map((subject) => {
            const subjStat = stats.subjectStats[subject] || { solved: 0, correct: 0 };
            const percent =
              subjStat.solved > 0
                ? Math.round((subjStat.correct / subjStat.solved) * 100)
                : 0;
            const colorScheme = Theme.subjectColors[subject];

            return (
              <TouchableOpacity
                key={subject}
                style={styles.subjectCard}
                onPress={() => navigation.navigate('QuestionCards', { selectedSubject: subject })}
                activeOpacity={0.8}
              >
                <SubjectBadge subject={subject} size="sm" />
                <View style={styles.subjStatRow}>
                  <Text style={styles.subjPercent}>{percent}%</Text>
                  <Text style={styles.subjSolved}>{subjStat.solved} Soru</Text>
                </View>
                <View style={styles.subjProgressBg}>
                  <View
                    style={[
                      styles.subjProgressFill,
                      { width: `${percent}%`, backgroundColor: colorScheme.main },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Admin Shortcut if Admin */}
        {currentUser.role === 'admin' && (
          <TouchableOpacity
            style={styles.adminBanner}
            onPress={() => navigation.navigate('AdminPanel')}
            activeOpacity={0.85}
          >
            <View style={styles.adminBannerIcon}>
              <Ionicons name="shield-checkmark-sharp" size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.adminBannerTitle}>Admin Yönetim Paneli</Text>
              <Text style={styles.adminBannerSub}>Soru ekle/düzenle, kullanıcıları yönet</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        )}

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
  header: {
    paddingVertical: 14,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.textMain,
  },
  subGreeting: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: Theme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Theme.borderRadius.round,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '30',
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  bannerCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  bannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.textMain,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEEF0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Theme.borderRadius.round,
    gap: 4,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.textMain,
    marginTop: 18,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionCard: {
    width: '48%',
    borderRadius: Theme.borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  actionIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.textMain,
  },
  actionCardSub: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  subjectScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  subjectCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.md,
    padding: 12,
    marginRight: 10,
    width: 140,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  subjStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 12,
    marginBottom: 6,
  },
  subjPercent: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.textMain,
  },
  subjSolved: {
    fontSize: 11,
    color: Theme.colors.textMuted,
  },
  subjProgressBg: {
    height: 5,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  subjProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.lg,
    padding: 16,
    marginTop: 20,
    gap: 12,
  },
  adminBannerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  adminBannerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
  },
});

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
import { QuestionCard } from '../components/QuestionCard';
import { DailyTipCard } from '../components/DailyTipCard';

export const SavedQuestionsScreen: React.FC<any> = ({ route }) => {
  const { questions, dailyTips, wrongQuestionIds } = useApp();
  const initialTab = route?.params?.screen === 'Yanlislarim' ? 'yanlislar' : 'kaydedilen';

  const [activeTab, setActiveTab] = useState<'kaydedilen' | 'yanlislar' | 'bilgiler'>(
    initialTab
  );

  const bookmarkedQuestions = questions.filter((q) => q.isBookmarked);
  const wrongQuestions = questions.filter((q) => wrongQuestionIds.includes(q.id));
  const savedTips = dailyTips.filter((t) => t.isSaved);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Kütüphanem & Favoriler</Text>

        {/* Tab Selector */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'kaydedilen' && styles.tabItemActive]}
            onPress={() => setActiveTab('kaydedilen')}
          >
            <Ionicons
              name={activeTab === 'kaydedilen' ? 'bookmark' : 'bookmark-outline'}
              size={16}
              color={activeTab === 'kaydedilen' ? Theme.colors.primary : Theme.colors.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'kaydedilen' && styles.tabTextActive,
              ]}
            >
              Favori Sorular ({bookmarkedQuestions.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'yanlislar' && styles.tabItemActive]}
            onPress={() => setActiveTab('yanlislar')}
          >
            <Ionicons
              name={activeTab === 'yanlislar' ? 'close-circle' : 'close-circle-outline'}
              size={16}
              color={activeTab === 'yanlislar' ? '#EF4444' : Theme.colors.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'yanlislar' && { color: '#EF4444', fontWeight: '700' },
              ]}
            >
              Yanlışlarım ({wrongQuestions.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'bilgiler' && styles.tabItemActive]}
            onPress={() => setActiveTab('bilgiler')}
          >
            <Ionicons
              name={activeTab === 'bilgiler' ? 'bulb' : 'bulb-outline'}
              size={16}
              color={activeTab === 'bilgiler' ? Theme.colors.primary : Theme.colors.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'bilgiler' && styles.tabTextActive,
              ]}
            >
              Bilgiler ({savedTips.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
          {activeTab === 'kaydedilen' && (
            <View>
              {bookmarkedQuestions.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Ionicons name="bookmark-outline" size={48} color={Theme.colors.textMuted} />
                  <Text style={styles.emptyTitle}>Kayıtlı Soru Yok</Text>
                  <Text style={styles.emptySub}>
                    Soruları çözerken sağ üstteki ayraç ikonuna dokunarak favorilerinize ekleyebilirsiniz.
                  </Text>
                </View>
              ) : (
                bookmarkedQuestions.map((q) => <QuestionCard key={q.id} question={q} />)
              )}
            </View>
          )}

          {activeTab === 'yanlislar' && (
            <View>
              {wrongQuestions.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Ionicons name="checkmark-circle-outline" size={48} color="#10B981" />
                  <Text style={styles.emptyTitle}>Harika! Yanlış Sorunuz Yok</Text>
                  <Text style={styles.emptySub}>
                    Çözdüğünüz testlerdeki yanlış yaptığınız sorular otomatik olarak buraya eklenir.
                  </Text>
                </View>
              ) : (
                wrongQuestions.map((q) => <QuestionCard key={q.id} question={q} showExplanationInitially />)
              )}
            </View>
          )}

          {activeTab === 'bilgiler' && (
            <View>
              {savedTips.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Ionicons name="bulb-outline" size={48} color={Theme.colors.textMuted} />
                  <Text style={styles.emptyTitle}>Kaydedilmiş Bilgi Yok</Text>
                  <Text style={styles.emptySub}>
                    Günün bilgisini veya şifreli KPSS notlarını kaydederek daha sonra tekrar edebilirsiniz.
                  </Text>
                </View>
              ) : (
                savedTips.map((tip) => <DailyTipCard key={tip.id} tip={tip} />)
              )}
            </View>
          )}

          <View style={{ height: 30 }} />
        </ScrollView>
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
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Theme.colors.textMain,
    marginTop: 14,
    marginBottom: 12,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: 12,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: Theme.borderRadius.md,
    gap: 4,
  },
  tabItemActive: {
    backgroundColor: '#F0EEFF',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.textMuted,
  },
  tabTextActive: {
    color: Theme.colors.primary,
    fontWeight: '700',
  },
  contentScroll: {
    flex: 1,
  },
  emptyBox: {
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
});

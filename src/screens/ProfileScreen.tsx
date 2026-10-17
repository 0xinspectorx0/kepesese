import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

export const ProfileScreen: React.FC<any> = ({ navigation }) => {
  const {
    currentUser,
    stats,
    toggleUserRole,
    updateUserProfile,
    resetAllStats,
    restoreSeedData,
  } = useApp();

  const [dailyGoal, setDailyGoal] = useState(currentUser.dailyGoal);

  const totalNets = Math.max(0, stats.totalCorrect - stats.totalWrong * 0.25).toFixed(1);
  const accuracyRate =
    stats.totalQuestionsSolved > 0
      ? Math.round((stats.totalCorrect / stats.totalQuestionsSolved) * 100)
      : 0;

  const handleUpdateGoal = (delta: number) => {
    const newGoal = Math.max(10, dailyGoal + delta);
    setDailyGoal(newGoal);
    updateUserProfile({ dailyGoal: newGoal });
  };

  const handleResetConfirm = () => {
    const isWeb = typeof window !== 'undefined';
    if (isWeb) {
      if (confirm('Tüm istatistiklerinizi sıfırlamak istediğinize emin misiniz?')) {
        resetAllStats();
      }
    } else {
      Alert.alert(
        'İstatistikleri Sıfırla',
        'Tüm test geçmişiniz ve soru istatistikleriniz sıfırlanacaktır. Onaylıyor musunuz?',
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Sıfırla', style: 'destructive', onPress: resetAllStats },
        ]
      );
    }
  };

  const handleRestoreConfirm = () => {
    const isWeb = typeof window !== 'undefined';
    if (isWeb) {
      if (confirm('Varsayılan başlangıç verilerini ve örnek soruları geri yüklemek istiyor musunuz?')) {
        restoreSeedData();
      }
    } else {
      Alert.alert(
        'Örnek Verileri Yükle',
        'Uygulama ilk haline döndürülecektir.',
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Yükle', onPress: restoreSeedData },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Profilim & Hedeflerim</Text>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{currentUser.name}</Text>
          <Text style={styles.userEmail}>{currentUser.email}</Text>

          {/* Role Pill Switch */}
          <TouchableOpacity
            style={[
              styles.roleSwitchBtn,
              currentUser.role === 'admin' ? styles.adminRoleBtn : styles.userRoleBtn,
            ]}
            onPress={toggleUserRole}
            activeOpacity={0.8}
          >
            <Ionicons
              name={currentUser.role === 'admin' ? 'shield-checkmark' : 'person'}
              size={16}
              color={currentUser.role === 'admin' ? '#FFFFFF' : Theme.colors.primary}
            />
            <Text
              style={[
                styles.roleSwitchText,
                currentUser.role === 'admin' && { color: '#FFFFFF' },
              ]}
            >
              {currentUser.role === 'admin'
                ? '👑 Yönetici Modu (Admin)'
                : 'Öğrenci Modu (Admin Olmak İçin Tıkla)'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>Sınav Başarı İstatistikleri</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#F0EEFF' }]}>
              <Ionicons name="documents-outline" size={20} color={Theme.colors.primary} />
            </View>
            <Text style={styles.statVal}>{stats.totalQuestionsSolved}</Text>
            <Text style={styles.statLabel}>Çözülen Soru</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
            </View>
            <Text style={[styles.statVal, { color: '#10B981' }]}>{stats.totalCorrect}</Text>
            <Text style={styles.statLabel}>Doğru Cevap</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
            </View>
            <Text style={[styles.statVal, { color: '#EF4444' }]}>{stats.totalWrong}</Text>
            <Text style={styles.statLabel}>Yanlış Cevap</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#FFF4E5' }]}>
              <Ionicons name="stats-chart-outline" size={20} color="#F59E0B" />
            </View>
            <Text style={[styles.statVal, { color: '#F59E0B' }]}>%{accuracyRate}</Text>
            <Text style={styles.statLabel}>Doğruluk Oranı</Text>
          </View>
        </View>

        {/* Target Goal Adjustment Box */}
        <Text style={styles.sectionTitle}>Günlük Çalışma Hedefim</Text>
        <View style={styles.goalCard}>
          <View style={styles.goalRow}>
            <View>
              <Text style={styles.goalTitle}>Günlük Soru Hedefi</Text>
              <Text style={styles.goalSub}>Her gün çözmeyi hedeflediğiniz soru sayısı</Text>
            </View>

            <View style={styles.counterControl}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => handleUpdateGoal(-10)}
              >
                <Ionicons name="remove" size={18} color={Theme.colors.primary} />
              </TouchableOpacity>
              <Text style={styles.counterVal}>{dailyGoal}</Text>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => handleUpdateGoal(10)}
              >
                <Ionicons name="add" size={18} color={Theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Admin Section Access if Admin */}
        {currentUser.role === 'admin' && (
          <TouchableOpacity
            style={styles.adminAccessTile}
            onPress={() => navigation.navigate('AdminPanel')}
            activeOpacity={0.8}
          >
            <Ionicons name="shield-checkmark-sharp" size={24} color="#FFF" />
            <View style={{ flex: 1 }}>
              <Text style={styles.adminAccessTitle}>Soru & Kullanıcı Yönetim Paneli</Text>
              <Text style={styles.adminAccessSub}>Soruları ve kullanıcıları buradan yönetin</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        )}

        {/* App Reset & Tools */}
        <Text style={styles.sectionTitle}>Uygulama Ayarları</Text>
        <View style={styles.optionsList}>
          <TouchableOpacity style={styles.optionRow} onPress={handleRestoreConfirm}>
            <Ionicons name="refresh-outline" size={20} color={Theme.colors.primary} />
            <Text style={styles.optionText}>Örnek KPSS Sorularını Geri Yükle</Text>
            <Ionicons name="chevron-forward" size={18} color={Theme.colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={handleResetConfirm}>
            <Ionicons name="trash-bin-outline" size={20} color="#EF4444" />
            <Text style={[styles.optionText, { color: '#EF4444' }]}>
              Çözüm İstatistiklerimi Sıfırla
            </Text>
            <Ionicons name="chevron-forward" size={18} color={Theme.colors.textMuted} />
          </TouchableOpacity>
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
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Theme.colors.textMain,
    marginTop: 14,
    marginBottom: 12,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.xl,
    padding: 20,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.textMain,
  },
  userEmail: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    marginBottom: 12,
  },
  roleSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Theme.borderRadius.round,
    gap: 6,
  },
  userRoleBtn: {
    backgroundColor: Theme.colors.primaryLight,
  },
  adminRoleBtn: {
    backgroundColor: Theme.colors.primary,
  },
  roleSwitchText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.textMain,
    marginBottom: 10,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statVal: {
    fontSize: 20,
    fontWeight: '800',
    color: Theme.colors.textMain,
  },
  statLabel: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.lg,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.textMain,
  },
  goalSub: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  counterControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: Theme.borderRadius.round,
    padding: 4,
    gap: 8,
  },
  counterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterVal: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.textMain,
    minWidth: 24,
    textAlign: 'center',
  },
  adminAccessTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.lg,
    padding: 16,
    marginBottom: 18,
    gap: 12,
  },
  adminAccessTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  adminAccessSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
  },
  optionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    gap: 12,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.textMain,
    flex: 1,
  },
});

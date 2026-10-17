import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { UserProfile } from '../types';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface EditUserModalProps {
  visible: boolean;
  onClose: () => void;
  user: UserProfile | null;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ visible, onClose, user }) => {
  const { adminUpdateUserRole, adminUpdateUserStatus, adminDeleteUser } = useApp();

  if (!user) return null;

  const handleToggleRole = () => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    adminUpdateUserRole(user.id, newRole);
  };

  const handleToggleStatus = () => {
    const newStatus = user.status === 'active' ? 'banned' : 'active';
    adminUpdateUserStatus(user.id, newStatus);
  };

  const handleDelete = () => {
    if (confirm(`${user.name} kullanıcısını silmek istediğinize emin misiniz?`)) {
      adminDeleteUser(user.id);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Kullanıcı Yönetimi</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* User Profile Card */}
          <View style={styles.profileSection}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>

            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: user.role === 'admin' ? '#F0EEFF' : '#EBF5FB' },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: user.role === 'admin' ? Theme.colors.primary : '#2980B9' },
                  ]}
                >
                  {user.role === 'admin' ? '👑 Yönetici (Admin)' : '👤 Öğrenci'}
                </Text>
              </View>

              <View
                style={[
                  styles.badge,
                  { backgroundColor: user.status === 'active' ? '#ECFDF5' : '#FEF2F2' },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: user.status === 'active' ? '#10B981' : '#EF4444' },
                  ]}
                >
                  {user.status === 'active' ? '● Aktif' : '🔒 Engelli'}
                </Text>
              </View>
            </View>
          </View>

          {/* User Details */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Hedef Puan</Text>
              <Text style={styles.detailVal}>{user.targetScore} Puan</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Günlük Hedef</Text>
              <Text style={styles.detailVal}>{user.dailyGoal} Soru</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Seri Gün</Text>
              <Text style={styles.detailVal}>{user.streakDays} Gün 🔥</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Kayıt Tarihi</Text>
              <Text style={styles.detailVal}>{user.joinedDate}</Text>
            </View>
          </View>

          {/* Admin Actions */}
          <Text style={styles.sectionTitle}>Yönetici İşlemleri</Text>

          <TouchableOpacity style={styles.actionRowBtn} onPress={handleToggleRole}>
            <View style={styles.actionIconBox}>
              <Ionicons
                name={user.role === 'admin' ? 'person' : 'shield-checkmark'}
                size={20}
                color={Theme.colors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>
                {user.role === 'admin' ? 'Öğrenci Rolüne Düşür' : 'Admin (Yönetici) Yap'}
              </Text>
              <Text style={styles.actionSub}>Kullanıcının yetkilerini günceller</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRowBtn} onPress={handleToggleStatus}>
            <View
              style={[
                styles.actionIconBox,
                { backgroundColor: user.status === 'active' ? '#FEF2F2' : '#ECFDF5' },
              ]}
            >
              <Ionicons
                name={user.status === 'active' ? 'lock-closed' : 'lock-open'}
                size={20}
                color={user.status === 'active' ? '#EF4444' : '#10B981'}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.actionTitle,
                  user.status === 'active' && { color: '#EF4444' },
                ]}
              >
                {user.status === 'active' ? 'Hesabı Engelle (Ban)' : 'Hesap Engeli Kaldır'}
              </Text>
              <Text style={styles.actionSub}>Sisteme erişim durumunu değiştirir</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
            <Text style={styles.deleteBtnText}>Kullanıcıyı Sil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeFullBtn} onPress={onClose}>
            <Text style={styles.closeFullText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.xl,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.textMain,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: Theme.colors.textMain,
  },
  userEmail: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.round,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: Theme.borderRadius.md,
  },
  detailBox: {
    width: '48%',
  },
  detailLabel: {
    fontSize: 11,
    color: Theme.colors.textMuted,
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.textMain,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.textMain,
    marginBottom: 10,
  },
  actionRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    gap: 12,
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.textMain,
  },
  actionSub: {
    fontSize: 11,
    color: Theme.colors.textMuted,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
    marginTop: 10,
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
  closeFullBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    marginTop: 8,
  },
  closeFullText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
});

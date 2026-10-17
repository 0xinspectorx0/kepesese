import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Question, DailyTip, UserProfile, KpssSubject } from '../types';
import { SubjectBadge } from '../components/SubjectBadge';
import { AddQuestionModal } from '../components/AddQuestionModal';
import { AddTipModal } from '../components/AddTipModal';
import { EditUserModal } from '../components/EditUserModal';

export const AdminPanelScreen: React.FC<any> = ({ navigation }) => {
  const {
    currentUser,
    questions,
    dailyTips,
    users,
    deleteQuestion,
    deleteDailyTip,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'questions' | 'users' | 'tips'>('questions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<KpssSubject | 'Tümü'>('Tümü');

  // Modals state
  const [showAddQModal, setShowAddQModal] = useState(false);
  const [qToEdit, setQToEdit] = useState<Question | null>(null);

  const [showAddTipModal, setShowAddTipModal] = useState(false);
  const [tipToEdit, setTipToEdit] = useState<DailyTip | null>(null);

  const [userToEdit, setUserToEdit] = useState<UserProfile | null>(null);

  // Filtered lists
  const filteredQuestions = questions.filter((q) => {
    const matchSubject = selectedSubject === 'Tümü' || q.subject === selectedSubject;
    const matchSearch =
      searchQuery === '' ||
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchSearch;
  });

  const filteredUsers = users.filter((u) => {
    return (
      searchQuery === '' ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredTips = dailyTips.filter((t) => {
    return (
      searchQuery === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleDeleteQ = (q: Question) => {
    const isWeb = typeof window !== 'undefined';
    if (isWeb) {
      if (confirm('Bu soruyu silmek istediğinize emin misiniz?')) {
        deleteQuestion(q.id);
      }
    } else {
      Alert.alert('Soruyu Sil', 'Bu soruyu silmek istediğinize emin misiniz?', [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: () => deleteQuestion(q.id) },
      ]);
    }
  };

  const handleDeleteTip = (tip: DailyTip) => {
    const isWeb = typeof window !== 'undefined';
    if (isWeb) {
      if (confirm('Bu bilgiyi silmek istediğinize emin misiniz?')) {
        deleteDailyTip(tip.id);
      }
    } else {
      Alert.alert('Bilgiyi Sil', 'Bu bilgiyi silmek istediğinize emin misiniz?', [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: () => deleteDailyTip(tip.id) },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={Theme.colors.textMain} />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>KPSS Admin Paneli 👑</Text>
              <Text style={styles.headerSub}>İçerik ve Kullanıcı Yönetimi</Text>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'questions' && styles.tabItemActive]}
            onPress={() => {
              setActiveTab('questions');
              setSearchQuery('');
            }}
          >
            <Ionicons
              name="help-circle"
              size={18}
              color={activeTab === 'questions' ? Theme.colors.primary : Theme.colors.textMuted}
            />
            <Text style={[styles.tabText, activeTab === 'questions' && styles.tabTextActive]}>
              Sorular ({questions.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'users' && styles.tabItemActive]}
            onPress={() => {
              setActiveTab('users');
              setSearchQuery('');
            }}
          >
            <Ionicons
              name="people"
              size={18}
              color={activeTab === 'users' ? Theme.colors.primary : Theme.colors.textMuted}
            />
            <Text style={[styles.tabText, activeTab === 'users' && styles.tabTextActive]}>
              Kullanıcılar ({users.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'tips' && styles.tabItemActive]}
            onPress={() => {
              setActiveTab('tips');
              setSearchQuery('');
            }}
          >
            <Ionicons
              name="bulb"
              size={18}
              color={activeTab === 'tips' ? Theme.colors.primary : Theme.colors.textMuted}
            />
            <Text style={[styles.tabText, activeTab === 'tips' && styles.tabTextActive]}>
              Günün Bilgisi ({dailyTips.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar & Action Button */}
        <View style={styles.actionHeaderRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={Theme.colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder={
                activeTab === 'questions'
                  ? 'Soru ara...'
                  : activeTab === 'users'
                  ? 'Kullanıcı veya e-posta ara...'
                  : 'Günün bilgisini ara...'
              }
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Theme.colors.textMuted}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={Theme.colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {activeTab === 'questions' && (
            <TouchableOpacity
              style={styles.addPrimaryBtn}
              onPress={() => {
                setQToEdit(null);
                setShowAddQModal(true);
              }}
            >
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addPrimaryText}>Soru Ekle</Text>
            </TouchableOpacity>
          )}

          {activeTab === 'tips' && (
            <TouchableOpacity
              style={styles.addPrimaryBtn}
              onPress={() => {
                setTipToEdit(null);
                setShowAddTipModal(true);
              }}
            >
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addPrimaryText}>Bilgi Ekle</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Scrollable Content */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* QUESTIONS TAB */}
          {activeTab === 'questions' && (
            <View>
              {filteredQuestions.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Ionicons name="document-text-outline" size={48} color={Theme.colors.textMuted} />
                  <Text style={styles.emptyTitle}>Soru Bulunamadı</Text>
                </View>
              ) : (
                filteredQuestions.map((q) => (
                  <View key={q.id} style={styles.adminQCard}>
                    <View style={styles.adminQHeader}>
                      <SubjectBadge subject={q.subject} size="sm" />
                      <Text style={styles.adminQDiff}>{q.difficulty}</Text>
                    </View>

                    <Text style={styles.adminQTopic}>{q.topic}</Text>
                    <Text style={styles.adminQText}>{q.questionText}</Text>

                    <Text style={styles.adminCorrectAns}>
                      Doğru Şık: <Text style={{ fontWeight: '800' }}>{q.correctOption}</Text> -{' '}
                      {q.options[q.correctOption]}
                    </Text>

                    <View style={styles.adminCardFooter}>
                      <TouchableOpacity
                        style={styles.adminEditBtn}
                        onPress={() => {
                          setQToEdit(q);
                          setShowAddQModal(true);
                        }}
                      >
                        <Ionicons name="create-outline" size={16} color={Theme.colors.primary} />
                        <Text style={styles.adminEditText}>Düzenle</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.adminDeleteBtn}
                        onPress={() => handleDeleteQ(q)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        <Text style={styles.adminDeleteText}>Sil</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <View>
              {filteredUsers.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Ionicons name="people-outline" size={48} color={Theme.colors.textMuted} />
                  <Text style={styles.emptyTitle}>Kullanıcı Bulunamadı</Text>
                </View>
              ) : (
                filteredUsers.map((u) => (
                  <TouchableOpacity
                    key={u.id}
                    style={styles.userRowCard}
                    onPress={() => setUserToEdit(u)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: u.avatar }} style={styles.userRowAvatar} />

                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.userRowName}>{u.name}</Text>
                        {u.role === 'admin' && (
                          <View style={styles.adminRoleTag}>
                            <Text style={styles.adminRoleTagText}>Admin</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.userRowEmail}>{u.email}</Text>
                    </View>

                    <View
                      style={[
                        styles.statusPill,
                        { backgroundColor: u.status === 'active' ? '#ECFDF5' : '#FEF2F2' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          { color: u.status === 'active' ? '#10B981' : '#EF4444' },
                        ]}
                      >
                        {u.status === 'active' ? 'Aktif' : 'Banlı'}
                      </Text>
                    </View>

                    <Ionicons name="chevron-forward" size={18} color={Theme.colors.textMuted} />
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {/* TIPS TAB */}
          {activeTab === 'tips' && (
            <View>
              {filteredTips.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Ionicons name="bulb-outline" size={48} color={Theme.colors.textMuted} />
                  <Text style={styles.emptyTitle}>Bilgi Bulunamadı</Text>
                </View>
              ) : (
                filteredTips.map((tip) => (
                  <View key={tip.id} style={styles.adminTipCard}>
                    <View style={styles.adminTipHeader}>
                      <SubjectBadge subject={tip.subject} size="sm" />
                      <Text style={styles.adminTipDate}>{tip.date}</Text>
                    </View>

                    <Text style={styles.adminTipTitle}>{tip.title}</Text>
                    <Text style={styles.adminTipContent}>{tip.content}</Text>

                    {tip.codeTrick && (
                      <View style={styles.adminTrickBox}>
                        <Text style={styles.adminTrickText}>{tip.codeTrick}</Text>
                      </View>
                    )}

                    <View style={styles.adminCardFooter}>
                      <TouchableOpacity
                        style={styles.adminEditBtn}
                        onPress={() => {
                          setTipToEdit(tip);
                          setShowAddTipModal(true);
                        }}
                      >
                        <Ionicons name="create-outline" size={16} color={Theme.colors.primary} />
                        <Text style={styles.adminEditText}>Düzenle</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.adminDeleteBtn}
                        onPress={() => handleDeleteTip(tip)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        <Text style={styles.adminDeleteText}>Sil</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          <View style={{ height: 30 }} />
        </ScrollView>

        {/* Modals */}
        <AddQuestionModal
          visible={showAddQModal}
          onClose={() => {
            setShowAddQModal(false);
            setQToEdit(null);
          }}
          questionToEdit={qToEdit}
        />

        <AddTipModal
          visible={showAddTipModal}
          onClose={() => {
            setShowAddTipModal(false);
            setTipToEdit(null);
          }}
          tipToEdit={tipToEdit}
        />

        <EditUserModal
          visible={!!userToEdit}
          onClose={() => setUserToEdit(null)}
          user={userToEdit}
        />
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
  header: {
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.textMain,
  },
  headerSub: {
    fontSize: 12,
    color: Theme.colors.textMuted,
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
  actionHeaderRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Theme.colors.textMain,
    marginLeft: 8,
    padding: 0,
  },
  addPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 14,
    borderRadius: Theme.borderRadius.md,
    gap: 4,
  },
  addPrimaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContent: {
    flex: 1,
  },
  adminQCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  adminQHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  adminQDiff: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  adminQTopic: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textMuted,
    marginBottom: 4,
  },
  adminQText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.textMain,
    lineHeight: 21,
    marginBottom: 10,
  },
  adminCorrectAns: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  adminCardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingTop: 10,
  },
  adminEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  adminEditText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  adminDeleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  adminDeleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
  userRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.lg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    gap: 12,
  },
  userRowAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userRowName: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.textMain,
  },
  userRowEmail: {
    fontSize: 12,
    color: Theme.colors.textMuted,
  },
  adminRoleTag: {
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminRoleTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.round,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  adminTipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  adminTipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  adminTipDate: {
    fontSize: 11,
    color: Theme.colors.textMuted,
  },
  adminTipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.textMain,
    marginBottom: 6,
  },
  adminTipContent: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    lineHeight: 19,
    marginBottom: 10,
  },
  adminTrickBox: {
    backgroundColor: '#F0EEFF',
    padding: 8,
    borderRadius: Theme.borderRadius.md,
    marginBottom: 10,
  },
  adminTrickText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.textMuted,
    marginTop: 10,
  },
});

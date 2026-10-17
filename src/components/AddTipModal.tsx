import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DailyTip, KpssSubject } from '../types';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface AddTipModalProps {
  visible: boolean;
  onClose: () => void;
  tipToEdit?: DailyTip | null;
}

const SUBJECTS: KpssSubject[] = [
  'Tarih',
  'Coğrafya',
  'Vatandaşlık',
  'Türkçe',
  'Matematik',
  'Güncel Bilgiler',
];

export const AddTipModal: React.FC<AddTipModalProps> = ({ visible, onClose, tipToEdit }) => {
  const { addDailyTip, updateDailyTip } = useApp();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<KpssSubject>('Coğrafya');
  const [content, setContent] = useState('');
  const [codeTrick, setCodeTrick] = useState('');

  useEffect(() => {
    if (tipToEdit) {
      setTitle(tipToEdit.title);
      setSubject(tipToEdit.subject);
      setContent(tipToEdit.content);
      setCodeTrick(tipToEdit.codeTrick || '');
    } else {
      resetForm();
    }
  }, [tipToEdit, visible]);

  const resetForm = () => {
    setTitle('');
    setSubject('Coğrafya');
    setContent('');
    setCodeTrick('');
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('Lütfen başlık ve içerik alanlarını doldurun.');
      return;
    }

    if (tipToEdit) {
      updateDailyTip({
        ...tipToEdit,
        title: title.trim(),
        subject,
        content: content.trim(),
        codeTrick: codeTrick.trim() || undefined,
      });
    } else {
      addDailyTip({
        title: title.trim(),
        subject,
        content: content.trim(),
        codeTrick: codeTrick.trim() || undefined,
      });
    }

    onClose();
    resetForm();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {tipToEdit ? 'Günün Bilgisini Düzenle' : 'Yeni Günün Bilgisi Ekle'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body}>
            <Text style={styles.label}>Ders Seçin</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              {SUBJECTS.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, subject === s && styles.chipActive]}
                  onPress={() => setSubject(s)}
                >
                  <Text style={[styles.chipText, subject === s && styles.chipTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Bilgi Başlığı</Text>
            <TextInput
              style={styles.input}
              placeholder="örn: Ege Dağları Kodlaması"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={Theme.colors.textMuted}
            />

            <Text style={styles.label}>Bilgi Metni & Detay</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Günün önemli KPSS bilgisini yazınız..."
              multiline
              numberOfLines={4}
              value={content}
              onChangeText={setContent}
              placeholderTextColor={Theme.colors.textMuted}
            />

            <Text style={styles.label}>Şifre / Akılda Kalıcı Kodlama (İsteğe Bağlı)</Text>
            <TextInput
              style={styles.input}
              placeholder="örn: ŞİFRE: KAZ-MA-YUN-T"
              value={codeTrick}
              onChangeText={setCodeTrick}
              placeholderTextColor={Theme.colors.textMuted}
            />

            <View style={{ height: 20 }} />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Ionicons name="checkmark" size={20} color="#FFF" />
              <Text style={styles.saveText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Theme.colors.card,
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
    padding: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Theme.colors.textMain,
  },
  body: {
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.textMain,
    marginBottom: 6,
    marginTop: 10,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Theme.borderRadius.round,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: Theme.colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Theme.colors.textMain,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingTop: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.primary,
    gap: 6,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

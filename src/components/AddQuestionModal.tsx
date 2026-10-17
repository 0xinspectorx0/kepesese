import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Question, KpssSubject, QuestionDifficulty } from '../types';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface AddQuestionModalProps {
  visible: boolean;
  onClose: () => void;
  questionToEdit?: Question | null;
}

const SUBJECTS: KpssSubject[] = [
  'Tarih',
  'Coğrafya',
  'Vatandaşlık',
  'Türkçe',
  'Matematik',
  'Güncel Bilgiler',
];

const DIFFICULTIES: QuestionDifficulty[] = ['Kolay', 'Orta', 'Zor'];

export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  visible,
  onClose,
  questionToEdit,
}) => {
  const { addQuestion, updateQuestion } = useApp();

  const [subject, setSubject] = useState<KpssSubject>('Tarih');
  const [topic, setTopic] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [optionE, setOptionE] = useState('');
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [explanation, setExplanation] = useState('');
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>('Orta');
  const [year, setYear] = useState<string>('2024');

  useEffect(() => {
    if (questionToEdit) {
      setSubject(questionToEdit.subject);
      setTopic(questionToEdit.topic);
      setQuestionText(questionToEdit.questionText);
      setOptionA(questionToEdit.options.A || '');
      setOptionB(questionToEdit.options.B || '');
      setOptionC(questionToEdit.options.C || '');
      setOptionD(questionToEdit.options.D || '');
      setOptionE(questionToEdit.options.E || '');
      setCorrectOption(questionToEdit.correctOption);
      setExplanation(questionToEdit.explanation);
      setDifficulty(questionToEdit.difficulty);
      setYear(questionToEdit.year ? String(questionToEdit.year) : '2024');
    } else {
      resetForm();
    }
  }, [questionToEdit, visible]);

  const resetForm = () => {
    setSubject('Tarih');
    setTopic('');
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setOptionE('');
    setCorrectOption('A');
    setExplanation('');
    setDifficulty('Orta');
    setYear('2024');
  };

  const handleSave = () => {
    if (!questionText.trim() || !optionA.trim() || !optionB.trim()) {
      alert('Lütfen soru metnini ve en az A ve B şıklarını doldurun.');
      return;
    }

    const payload = {
      subject,
      topic: topic.trim() || 'Genel Konu',
      questionText: questionText.trim(),
      options: {
        A: optionA.trim(),
        B: optionB.trim(),
        C: optionC.trim(),
        D: optionD.trim(),
        E: optionE.trim(),
      },
      correctOption,
      explanation: explanation.trim() || 'Açıklama girilmedi.',
      difficulty,
      year: parseInt(year) || 2024,
    };

    if (questionToEdit) {
      updateQuestion({
        ...questionToEdit,
        ...payload,
      });
    } else {
      addQuestion(payload);
    }

    onClose();
    resetForm();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {questionToEdit ? 'Soruyu Düzenle' : 'Yeni Soru Ekle'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={Theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Subject Selector */}
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

            {/* Topic & Year */}
            <View style={styles.flexRow}>
              <View style={[styles.inputGroup, { flex: 2 }]}>
                <Text style={styles.label}>Konu Başlığı</Text>
                <TextInput
                  style={styles.input}
                  placeholder="örn: Osmanlı Yükselme Dönemi"
                  value={topic}
                  onChangeText={setTopic}
                  placeholderTextColor={Theme.colors.textMuted}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Yıl / KPSS</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2024"
                  keyboardType="numeric"
                  value={year}
                  onChangeText={setYear}
                  placeholderTextColor={Theme.colors.textMuted}
                />
              </View>
            </View>

            {/* Question Text */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Soru Metni</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Soru kökünü ve metnini yazınız..."
                multiline
                numberOfLines={4}
                value={questionText}
                onChangeText={setQuestionText}
                placeholderTextColor={Theme.colors.textMuted}
              />
            </View>

            {/* Options */}
            <Text style={styles.label}>Seçenekler ve Doğru Cevap</Text>
            {(['A', 'B', 'C', 'D', 'E'] as const).map((optKey) => {
              const valMap = {
                A: optionA,
                B: optionB,
                C: optionC,
                D: optionD,
                E: optionE,
              };
              const setValMap = {
                A: setOptionA,
                B: setOptionB,
                C: setOptionC,
                D: setOptionD,
                E: setOptionE,
              };

              const isCorrect = correctOption === optKey;

              return (
                <View key={optKey} style={styles.optionRow}>
                  <TouchableOpacity
                    style={[styles.correctSelectBtn, isCorrect && styles.correctSelectBtnActive]}
                    onPress={() => setCorrectOption(optKey)}
                  >
                    <Text
                      style={[
                        styles.correctSelectText,
                        isCorrect && styles.correctSelectTextActive,
                      ]}
                    >
                      {optKey}
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.input, styles.optionInput, isCorrect && styles.inputActiveCorrect]}
                    placeholder={`Şık ${optKey}...`}
                    value={valMap[optKey]}
                    onChangeText={setValMap[optKey]}
                    placeholderTextColor={Theme.colors.textMuted}
                  />
                </View>
              );
            })}

            {/* Explanation */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Çözüm Açıklaması</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Detaylı soru çözümünü yazınız..."
                multiline
                numberOfLines={3}
                value={explanation}
                onChangeText={setExplanation}
                placeholderTextColor={Theme.colors.textMuted}
              />
            </View>

            {/* Difficulty */}
            <Text style={styles.label}>Zorluk Seviyesi</Text>
            <View style={styles.diffRow}>
              {DIFFICULTIES.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.diffBtn, difficulty === d && styles.diffBtnActive]}
                  onPress={() => setDifficulty(d)}
                >
                  <Text style={[styles.diffText, difficulty === d && styles.diffTextActive]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer Save Button */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Ionicons name="checkmark" size={20} color="#FFF" />
              <Text style={styles.saveBtnText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: '90%',
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
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.textMain,
  },
  closeBtn: {
    padding: 4,
  },
  scroll: {
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Theme.borderRadius.round,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: Theme.colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  flexRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputGroup: {
    marginBottom: 10,
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
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  correctSelectBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  correctSelectBtnActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  correctSelectText: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
  },
  correctSelectTextActive: {
    color: '#FFFFFF',
  },
  optionInput: {
    flex: 1,
  },
  inputActiveCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  diffRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  diffBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  diffBtnActive: {
    backgroundColor: Theme.colors.primary,
  },
  diffText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  diffTextActive: {
    color: '#FFFFFF',
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
  cancelBtnText: {
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
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

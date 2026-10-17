export type KpssSubject = 'Tarih' | 'Coğrafya' | 'Vatandaşlık' | 'Türkçe' | 'Matematik' | 'Güncel Bilgiler';

export type QuestionDifficulty = 'Kolay' | 'Orta' | 'Zor';

export interface Question {
  id: string;
  subject: KpssSubject;
  topic: string;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  correctOption: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string;
  difficulty: QuestionDifficulty;
  year?: number; // e.g., 2022 KPSS Çıkmış Benzeri
  isBookmarked?: boolean;
  createdAt: string;
}

export interface DailyTip {
  id: string;
  title: string;
  subject: KpssSubject;
  content: string;
  codeTrick?: string; // Kodlama / Şifre e.g., "ŞİFRE: DACİA"
  date: string;
  likes: number;
  isSaved?: boolean;
}

export interface QuizResult {
  id: string;
  quizTitle: string;
  subject: KpssSubject | 'Karma';
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  emptyCount: number;
  netCount: number;
  score: number;
  durationSeconds: number;
  date: string;
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D' | 'E' | null>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  targetScore: number;
  dailyGoal: number; // Daily question target e.g. 50
  streakDays: number;
  role: 'user' | 'admin';
  status: 'active' | 'banned';
  joinedDate: string;
}

export interface UserStats {
  totalQuestionsSolved: number;
  totalCorrect: number;
  totalWrong: number;
  totalEmpty: number;
  netAverage: number;
  streakCount: number;
  subjectStats: Record<KpssSubject, { solved: number; correct: number }>;
}

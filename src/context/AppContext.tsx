import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Question, DailyTip, UserProfile, UserStats, QuizResult, KpssSubject } from '../types';
import { INITIAL_QUESTIONS, INITIAL_DAILY_TIPS, INITIAL_USERS, INITIAL_STATS } from '../constants/initialData';

const STORAGE_KEYS = {
  QUESTIONS: '@kpss_questions_v1',
  DAILY_TIPS: '@kpss_daily_tips_v1',
  USERS: '@kpss_users_v1',
  CURRENT_USER: '@kpss_current_user_v1',
  STATS: '@kpss_stats_v1',
  QUIZ_RESULTS: '@kpss_quiz_results_v1',
  WRONG_QUESTIONS: '@kpss_wrong_questions_v1',
};

interface AppContextType {
  questions: Question[];
  dailyTips: DailyTip[];
  users: UserProfile[];
  currentUser: UserProfile;
  stats: UserStats;
  quizResults: QuizResult[];
  wrongQuestionIds: string[];
  isLoading: boolean;
  
  // Actions
  toggleBookmark: (questionId: string) => void;
  toggleSaveTip: (tipId: string) => void;
  addQuestion: (newQ: Omit<Question, 'id' | 'createdAt'>) => void;
  updateQuestion: (question: Question) => void;
  deleteQuestion: (id: string) => void;
  
  addDailyTip: (tip: Omit<DailyTip, 'id' | 'date' | 'likes'>) => void;
  updateDailyTip: (tip: DailyTip) => void;
  deleteDailyTip: (id: string) => void;
  likeDailyTip: (id: string) => void;

  recordQuizResult: (result: Omit<QuizResult, 'id' | 'date'>) => void;
  toggleUserRole: () => void; // Switch Admin <-> User mode easily
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  
  // Admin User Actions
  adminUpdateUserStatus: (userId: string, status: 'active' | 'banned') => void;
  adminUpdateUserRole: (userId: string, role: 'user' | 'admin') => void;
  adminDeleteUser: (userId: string) => void;
  resetAllStats: () => void;
  restoreSeedData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [dailyTips, setDailyTips] = useState<DailyTip[]>(INITIAL_DAILY_TIPS);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[1]); // Default to Admin for full demo
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>(['q1', 'q6']);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load state on mount
  useEffect(() => {
    loadPersistedData();
  }, []);

  const loadPersistedData = async () => {
    try {
      const storedQuestions = await AsyncStorage.getItem(STORAGE_KEYS.QUESTIONS);
      const storedTips = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_TIPS);
      const storedUsers = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const storedCurrentUser = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      const storedStats = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
      const storedQuizResults = await AsyncStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
      const storedWrong = await AsyncStorage.getItem(STORAGE_KEYS.WRONG_QUESTIONS);

      if (storedQuestions) setQuestions(JSON.parse(storedQuestions));
      if (storedTips) setDailyTips(JSON.parse(storedTips));
      if (storedUsers) setUsers(JSON.parse(storedUsers));
      if (storedCurrentUser) setCurrentUser(JSON.parse(storedCurrentUser));
      if (storedStats) setStats(JSON.parse(storedStats));
      if (storedQuizResults) setQuizResults(JSON.parse(storedQuizResults));
      if (storedWrong) setWrongQuestionIds(JSON.parse(storedWrong));
    } catch (e) {
      console.error('Failed to load persisted data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const persistData = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data', key, e);
    }
  };

  // Toggle bookmark question
  const toggleBookmark = (questionId: string) => {
    const updated = questions.map((q) =>
      q.id === questionId ? { ...q, isBookmarked: !q.isBookmarked } : q
    );
    setQuestions(updated);
    persistData(STORAGE_KEYS.QUESTIONS, updated);
  };

  // Toggle save tip
  const toggleSaveTip = (tipId: string) => {
    const updated = dailyTips.map((t) =>
      t.id === tipId ? { ...t, isSaved: !t.isSaved } : t
    );
    setDailyTips(updated);
    persistData(STORAGE_KEYS.DAILY_TIPS, updated);
  };

  const likeDailyTip = (id: string) => {
    const updated = dailyTips.map((t) =>
      t.id === id ? { ...t, likes: t.likes + 1 } : t
    );
    setDailyTips(updated);
    persistData(STORAGE_KEYS.DAILY_TIPS, updated);
  };

  // Add Question
  const addQuestion = (newQ: Omit<Question, 'id' | 'createdAt'>) => {
    const created: Question = {
      ...newQ,
      id: 'q_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [created, ...questions];
    setQuestions(updated);
    persistData(STORAGE_KEYS.QUESTIONS, updated);
  };

  // Update Question
  const updateQuestion = (question: Question) => {
    const updated = questions.map((q) => (q.id === question.id ? question : q));
    setQuestions(updated);
    persistData(STORAGE_KEYS.QUESTIONS, updated);
  };

  // Delete Question
  const deleteQuestion = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    persistData(STORAGE_KEYS.QUESTIONS, updated);
  };

  // Add Daily Tip
  const addDailyTip = (tip: Omit<DailyTip, 'id' | 'date' | 'likes'>) => {
    const created: DailyTip = {
      ...tip,
      id: 'tip_' + Date.now(),
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      likes: 1,
    };
    const updated = [created, ...dailyTips];
    setDailyTips(updated);
    persistData(STORAGE_KEYS.DAILY_TIPS, updated);
  };

  const updateDailyTip = (tip: DailyTip) => {
    const updated = dailyTips.map((t) => (t.id === tip.id ? tip : t));
    setDailyTips(updated);
    persistData(STORAGE_KEYS.DAILY_TIPS, updated);
  };

  const deleteDailyTip = (id: string) => {
    const updated = dailyTips.filter((t) => t.id !== id);
    setDailyTips(updated);
    persistData(STORAGE_KEYS.DAILY_TIPS, updated);
  };

  // Record Quiz Result & update statistics
  const recordQuizResult = (resultData: Omit<QuizResult, 'id' | 'date'>) => {
    const newResult: QuizResult = {
      ...resultData,
      id: 'res_' + Date.now(),
      date: new Date().toISOString(),
    };

    const updatedResults = [newResult, ...quizResults];
    setQuizResults(updatedResults);
    persistData(STORAGE_KEYS.QUIZ_RESULTS, updatedResults);

    // Update user stats
    const updatedStats: UserStats = { ...stats };
    updatedStats.totalQuestionsSolved += newResult.totalQuestions;
    updatedStats.totalCorrect += newResult.correctCount;
    updatedStats.totalWrong += newResult.wrongCount;
    updatedStats.totalEmpty += newResult.emptyCount;
    
    // Net calculate (Correct - Wrong / 4)
    const newNet = newResult.correctCount - newResult.wrongCount * 0.25;
    const totalNets = (stats.netAverage * (quizResults.length || 1)) + newNet;
    updatedStats.netAverage = Number((totalNets / (quizResults.length + 1)).toFixed(2));

    if (newResult.subject !== 'Karma' && updatedStats.subjectStats[newResult.subject as KpssSubject]) {
      const subj = updatedStats.subjectStats[newResult.subject as KpssSubject];
      subj.solved += newResult.totalQuestions;
      subj.correct += newResult.correctCount;
    }

    setStats(updatedStats);
    persistData(STORAGE_KEYS.STATS, updatedStats);

    // Track wrong answers
    const wrongIdsFromQuiz = Object.entries(newResult.userAnswers)
      .filter(([qId, ans]) => {
        const q = questions.find((item) => item.id === qId);
        return q && ans && ans !== q.correctOption;
      })
      .map(([qId]) => qId);

    if (wrongIdsFromQuiz.length > 0) {
      const updatedWrong = Array.from(new Set([...wrongQuestionIds, ...wrongIdsFromQuiz]));
      setWrongQuestionIds(updatedWrong);
      persistData(STORAGE_KEYS.WRONG_QUESTIONS, updatedWrong);
    }
  };

  // Toggle user role between 'user' and 'admin'
  const toggleUserRole = () => {
    const updatedUser: UserProfile = {
      ...currentUser,
      role: currentUser.role === 'admin' ? 'user' : 'admin',
    };
    setCurrentUser(updatedUser);
    persistData(STORAGE_KEYS.CURRENT_USER, updatedUser);

    // Also update in users list
    const updatedList = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
    setUsers(updatedList);
    persistData(STORAGE_KEYS.USERS, updatedList);
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    const updatedUser = { ...currentUser, ...profile };
    setCurrentUser(updatedUser);
    persistData(STORAGE_KEYS.CURRENT_USER, updatedUser);

    const updatedList = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
    setUsers(updatedList);
    persistData(STORAGE_KEYS.USERS, updatedList);
  };

  const adminUpdateUserStatus = (userId: string, status: 'active' | 'banned') => {
    const updated = users.map((u) => (u.id === userId ? { ...u, status } : u));
    setUsers(updated);
    persistData(STORAGE_KEYS.USERS, updated);
  };

  const adminUpdateUserRole = (userId: string, role: 'user' | 'admin') => {
    const updated = users.map((u) => (u.id === userId ? { ...u, role } : u));
    setUsers(updated);
    persistData(STORAGE_KEYS.USERS, updated);
  };

  const adminDeleteUser = (userId: string) => {
    const updated = users.filter((u) => u.id !== userId);
    setUsers(updated);
    persistData(STORAGE_KEYS.USERS, updated);
  };

  const resetAllStats = () => {
    setStats(INITIAL_STATS);
    setQuizResults([]);
    setWrongQuestionIds([]);
    persistData(STORAGE_KEYS.STATS, INITIAL_STATS);
    persistData(STORAGE_KEYS.QUIZ_RESULTS, []);
    persistData(STORAGE_KEYS.WRONG_QUESTIONS, []);
  };

  const restoreSeedData = () => {
    setQuestions(INITIAL_QUESTIONS);
    setDailyTips(INITIAL_DAILY_TIPS);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[1]);
    setStats(INITIAL_STATS);
    setQuizResults([]);
    setWrongQuestionIds(['q1', 'q6']);
    
    persistData(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    persistData(STORAGE_KEYS.DAILY_TIPS, INITIAL_DAILY_TIPS);
    persistData(STORAGE_KEYS.USERS, INITIAL_USERS);
    persistData(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[1]);
    persistData(STORAGE_KEYS.STATS, INITIAL_STATS);
    persistData(STORAGE_KEYS.QUIZ_RESULTS, []);
    persistData(STORAGE_KEYS.WRONG_QUESTIONS, ['q1', 'q6']);
  };

  return (
    <AppContext.Provider
      value={{
        questions,
        dailyTips,
        users,
        currentUser,
        stats,
        quizResults,
        wrongQuestionIds,
        isLoading,
        toggleBookmark,
        toggleSaveTip,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        addDailyTip,
        updateDailyTip,
        deleteDailyTip,
        likeDailyTip,
        recordQuizResult,
        toggleUserRole,
        updateUserProfile,
        adminUpdateUserStatus,
        adminUpdateUserRole,
        adminDeleteUser,
        resetAllStats,
        restoreSeedData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

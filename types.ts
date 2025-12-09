
export enum Goal {
  LOSE_WEIGHT = 'Queimar Gordura',
  BUILD_MUSCLE = 'Hipertrofia / Força',
  SKILL_CALISTHENICS = 'Habilidades Calistenia',
  ENDURANCE = 'Resistência Infinita',
  MOBILITY = 'Mobilidade & Flexibilidade'
}

export enum ExperienceLevel {
  BEGINNER = 'Iniciante (Fundação)',
  INTERMEDIATE = 'Intermediário (Progresso)',
  ADVANCED = 'Avançado (Elite)',
  ELITE = 'Deus da Calistenia'
}

export enum ExerciseCategory {
  PUSH = 'Empurrar (Push)',
  PULL = 'Puxar (Pull)',
  LEGS = 'Pernas',
  CORE = 'Core/Abdômen',
  CARDIO = 'Cardio/HIIT',
  SKILL = 'Skill/Isometria',
  MOBILITY = 'Mobilidade'
}

export enum MuscleGroup {
  CHEST = 'Peitoral',
  BACK = 'Dorsais',
  LEGS = 'Pernas',
  SHOULDERS = 'Ombros',
  ARMS = 'Braços',
  ABS = 'Abdômen',
  CARDIO = 'Cardio',
  FULL_BODY = 'Full Body'
}

export enum Injury {
  NONE = 'Nenhuma',
  SHOULDERS = 'Ombros',
  KNEES = 'Joelhos',
  BACK = 'Lombar',
  WRISTS = 'Punhos'
}

export enum CoachStyle {
  FRIENDLY = 'Amigo Motivador',
  MILITARY = 'Sargento Hardcore',
  ANALYTICAL = 'IA Analítica'
}

export enum Equipment {
  NONE = 'Somente Peso do Corpo',
  BAR = 'Barra Fixa / Argolas',
  PARALLETTES = 'Paralelas',
  BAND = 'Elásticos'
}

export type Gender = 'male' | 'female';

export interface UserProfile {
  name: string;
  gender: Gender;
  age: number;
  weight: number;
  height: number;
  goal: Goal;
  level: ExperienceLevel;
  equipment: Equipment[];
  injuries: Injury[];
  coachStyle: CoachStyle;
  workoutDuration: number;
  workoutFrequency: number;
  onboarded: boolean;
  xp: number;
  levelNumber: number; // 1 to 50
  coins: number;
  campaignProgress: number; 
  equippedSkin?: string;
  silentMode?: boolean; // New setting
  aiEnabled?: boolean; // New setting
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroup: MuscleGroup;
  musculosPrimarios: string[];
  musculosSecundarios?: string[];
  difficulty: ExperienceLevel;
  videoPlaceholder: string;
  videoUrl: string; // YouTube/TikTok link
  description: string;
  stepByStep: string[]; 
  commonErrors?: string[]; 
  breathingTip?: string; 
  variations?: { 
      easier?: string[];
      harder?: string[];
  };
  reps?: string; // "10-12" or "FALHA"
  sets?: number;
  durationSeconds?: number;
  caloriesPerMinute?: number;
  contraindications?: Injury[];
  equipmentRequired?: Equipment[];
  isIsolater?: boolean; // For 3D rotation logic
}

export interface WorkoutSession {
  id: string;
  name: string;
  dateCreated: number;
  exercises: Exercise[];
  completed: boolean;
  durationTaken?: number;
  caloriesBurned?: number;
  notes?: string;
  isProgramWorkout?: boolean;
  type: 'HIIT' | 'STRENGTH' | 'SKILL' | 'FLOW';
}

export interface ProgramDay {
    day: number;
    title: string;
    focus: string;
    description: string;
    workout: Exercise[]; 
    completed: boolean;
}

export interface Program {
    id: string;
    title: string;
    description: string;
    level: ExperienceLevel;
    durationWeeks: number;
    days: ProgramDay[];
    image: string;
}

export interface HabitLog {
  date: string;
  waterIntake: number;
  sleepHours: number;
  mood: number;
}

export interface Post {
    id: string;
    author: string;
    avatar: string;
    image?: string;
    content: string;
    likes: number;
    timestamp: number;
    isLikedByMe: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  xpReward: number;
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface StoreItem {
    id: string;
    name: string;
    type: 'skin' | 'theme';
    cost: number;
    preview: string;
    description: string;
}

export interface InventoryItem {
    id: string;
    itemId: string;
    acquiredAt: number;
}

export interface WorkoutTemplate {
    id: string;
    name: string;
    exercises: Exercise[];
    createdAt: number;
}

// Nutrition Types
export interface MealItem {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    icon: string;
}

export interface DailyNutritionLog {
    date: string; // YYYY-MM-DD
    items: MealItem[];
}

// Logbook
export interface ExerciseSetLog {
    exerciseId: string;
    date: number;
    reps: number;
    weight?: number; 
    durationSeconds?: number;
    isPR?: boolean; 
}

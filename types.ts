
export enum Goal {
  LOSE_WEIGHT = 'Perder Peso',
  BUILD_MUSCLE = 'Definição Muscular',
  IMPROVE_ENDURANCE = 'Resistência',
  FLEXIBILITY = 'Mobilidade & Flexibilidade',
  TONING = 'Tonificação Total'
}

export enum ExperienceLevel {
  BEGINNER = 'Iniciante',
  INTERMEDIATE = 'Intermediário',
  ADVANCED = 'Avançado',
}

export enum ExerciseCategory {
  PUSH = 'Empurrar (Push)',
  PULL = 'Puxar (Pull)',
  LEGS = 'Pernas',
  CORE = 'Core/Abdômen',
  CARDIO = 'Cardio/Funcional',
  MOBILITY = 'Mobilidade/Alongamento',
  FULL_BODY = 'Corpo Inteiro'
}

export enum MuscleGroup {
  CHEST = 'Peito',
  BACK = 'Costas',
  LEGS = 'Pernas',
  SHOULDERS = 'Ombros',
  ARMS = 'Braços',
  ABS = 'Abdômen',
  CARDIO = 'Cardio',
  GLUTES = 'Glúteos',
  CALVES = 'Panturrilhas',
  FULL_BODY = 'Corpo Inteiro'
}

export enum Injury {
  NONE = 'Nenhuma',
  SHOULDERS = 'Ombros',
  KNEES = 'Joelhos',
  BACK = 'Costas/Lombar',
  WRISTS = 'Punhos'
}

export enum CoachStyle {
  FRIENDLY = 'Amigo Motivador',
  MILITARY = 'Sargento Hardcore',
  SCIENTIFIC = 'Cientista Analítico',
  STOIC = 'Filósofo Estoico'
}

export enum Equipment {
  NONE = 'Bodyweight',
  DUMBBELL = 'Halteres',
  BARBELL = 'Barra',
  BAND = 'Elástico'
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
  equipment: string; // Simplificado para "Bodyweight"
  injuries: Injury[];
  coachStyle: CoachStyle;
  workoutDuration: number;
  workoutFrequency: number;
  onboarded: boolean;
  xp: number;
  coins: number;
  campaignProgress: number; // Current Day in Program
  equippedSkin?: string;
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
  videoUrl: string; // Vertical video preference
  description: string;
  stepByStep: string[]; // New: Detailed steps
  commonErrors?: string[]; // New: Common mistakes
  breathingTip?: string; // New: Breathing guide
  variations?: { // New: Progressions and Regressions
      easier?: string[];
      harder?: string[];
  };
  reps?: string;
  sets?: number;
  durationSeconds?: number;
  caloriesPerMinute?: number;
  contraindications?: Injury[];
  equipmentRequired?: string[];
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
}

export interface ProgramDay {
    day: number;
    title: string;
    focus: string;
    description: string;
    workout: Exercise[]; // List of exercises for this day
    completed: boolean;
}

export interface Program {
    id: string;
    title: string;
    description: string;
    durationWeeks: number;
    days: ProgramDay[];
}

export interface HabitLog {
  date: string;
  waterIntake: number;
  sleepHours: number;
  mood: number;
}

export interface MeasurementLog {
    id: string;
    date: number;
    weight: number;
    chest?: number;
    waist?: number;
    arms?: number;
    legs?: number;
    photoFront?: string;
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

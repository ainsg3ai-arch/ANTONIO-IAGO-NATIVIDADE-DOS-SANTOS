

export enum Goal {
  LOSE_WEIGHT = 'Perder Peso',
  BUILD_MUSCLE = 'Ganhar Massa',
  IMPROVE_ENDURANCE = 'Melhorar Resistência',
  FLEXIBILITY = 'Flexibilidade',
}

export enum ExperienceLevel {
  BEGINNER = 'Iniciante',
  INTERMEDIATE = 'Intermediário',
  ADVANCED = 'Avançado',
}

export enum Equipment {
  NONE = 'Peso do Corpo',
  HOME_BASIC = 'Halteres e Elásticos',
  FULL_GYM = 'Academia Completa',
}

export enum MuscleGroup {
  CHEST = 'Peito',
  BACK = 'Costas',
  LEGS = 'Pernas',
  SHOULDERS = 'Ombros',
  ARMS = 'Braços',
  ABS = 'Abdômen',
  CARDIO = 'Cardio',
  FLEXIBILITY = 'Flexibilidade',
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

export type Gender = 'male' | 'female';

export interface UserProfile {
  name: string;
  gender: Gender;
  age: number;
  weight: number;
  height: number;
  goal: Goal;
  level: ExperienceLevel;
  equipment: Equipment;
  injuries: Injury[];
  coachStyle: CoachStyle;
  workoutDuration: number; // minutes
  workoutFrequency: number; // days per week
  onboarded: boolean;
  tiktokConnected?: boolean;
  tiktokUsername?: string;
  isTrainer?: boolean;
}

export interface TikTokVideo {
    id: string;
    url: string;
    title: string;
    thumbnail: string;
    likes: number;
    views: number;
    author: string;
    datePosted: number;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup; // Categoria Geral
  secondaryMuscles?: MuscleGroup[]; // Categoria Geral Secundária
  
  // Novos campos para detalhamento específico
  musculosPrimarios?: string[]; // Ex: "Peitoral Maior", "Vasto Lateral"
  musculosSecundarios?: string[]; // Ex: "Tríceps Braquial", "Deltoide Anterior"

  equipmentRequired: Equipment[];
  difficulty: ExperienceLevel;
  videoPlaceholder: string;
  videoUrl: string;
  description: string;
  tips?: string[];
  commonErrors?: string[];
  reps?: string;
  sets?: number;
  durationSeconds?: number;
  caloriesPerMinute?: number;
  contraindications?: Injury[];
  tiktokVideoId?: string;
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
}

export interface WorkoutTemplate {
    id: string;
    name: string;
    exercises: Exercise[];
    createdAt: number;
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

export interface PhotoEntry {
    id: string;
    date: number;
    url: string; // Base64
    type: 'front' | 'side' | 'back';
    notes?: string;
}

export interface Student {
    id: string;
    name: string;
    goal: Goal;
    lastWorkout: number;
    status: 'active' | 'inactive';
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

export interface Challenge {
    id: string;
    title: string;
    goalDescription: string;
    targetValue: number;
    currentValue: number;
    unit: 'workouts' | 'minutes' | 'calories';
    deadline: number; 
}

export interface RecoverySession {
    id: string;
    title: string;
    type: 'stretching' | 'mobility' | 'meditation';
    durationMinutes: number;
    description: string;
}

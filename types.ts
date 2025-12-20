
export enum Goal {
  LOSE_WEIGHT = 'Queimar Gordura',
  BUILD_MUSCLE = 'Hipertrofia / Força',
  SKILL_CALISTHENICS = 'Habilidades Calistenia',
  ENDURANCE = 'Resistência Infinita',
  MOBILITY = 'Mobilidade & Flexibilidade'
}

export enum ExperienceLevel {
  BEGINNER = 'Iniciante (Nível 1-2)',
  INTERMEDIATE = 'Intermediário (Nível 3)',
  ADVANCED = 'Avançado (Nível 4)',
  ELITE = 'Elite (Nível 5)'
}

export enum ExerciseCategory {
  PUSH = 'Empurrar (Push)',
  PULL = 'Puxar (Pull)',
  LEGS = 'Pernas (Legs)',
  CORE = 'Core / Abdômen',
  SKILL = 'Habilidades / Isometria',
  MOBILITY = 'Mobilidade / Flow'
}

export enum MuscleGroup {
  CHEST = 'Peitoral',
  BACK = 'Dorsais',
  LEGS = 'Pernas',
  SHOULDERS = 'Ombros',
  ARMS = 'Braços',
  ABS = 'Abdômen',
  FULL_BODY = 'Corpo Inteiro'
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
  BAR = 'Barra Fixa',
  PARALLETTES = 'Paralelas',
  RINGS = 'Argolas',
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
  levelNumber: number; 
  coins: number;
  campaignProgress: number; 
  equippedSkin?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroup: MuscleGroup;
  musculosPrimarios: string[];
  musculosSecundarios?: string[];
  difficultyScore: number; // 1 to 5
  difficultyLevel: ExperienceLevel;
  videoPlaceholder: string;
  videoUrl: string;
  description: string;
  stepByStep: string[]; 
  commonErrors: string[]; 
  breathingTip: string; 
  progressions?: string[]; // Nome de exercícios mais difíceis
  regressions?: string[]; // Nome de exercícios mais fáceis
  reps?: string; 
  sets?: number;
  durationSeconds?: number;
  equipmentRequired?: Equipment[];
}

export interface WorkoutSession {
  id: string;
  name: string;
  dateCreated: number;
  exercises: Exercise[];
  completed: boolean;
  durationTaken?: number;
  caloriesBurned?: number;
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

export interface InventoryItem {
    id: string;
    itemId: string;
    acquiredAt: number;
}

export interface StoreItem {
    id: string;
    name: string;
    type: 'skin' | 'theme';
    cost: number;
    preview: string;
    description: string;
}

/** 
 * Added missing interfaces to resolve compilation errors 
 */

export interface HabitLog {
  date: string;
  completed?: boolean;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: number;
}

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
  date: string;
  items: MealItem[];
}

export interface ExerciseSetLog {
  id?: string;
  exerciseId: string;
  reps: number;
  date: number; // Timestamp for chart compatibility
  isPR?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: number;
}

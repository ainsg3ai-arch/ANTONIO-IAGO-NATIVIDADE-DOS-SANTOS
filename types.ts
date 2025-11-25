
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

export interface UserProfile {
  name: string;
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
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipmentRequired: Equipment[];
  difficulty: ExperienceLevel;
  videoPlaceholder: string;
  videoUrl: string;
  description: string;
  reps?: string;
  sets?: number;
  durationSeconds?: number;
  caloriesPerMinute?: number;
  contraindications?: Injury[];
}

export interface WorkoutSession {
  id: string;
  name: string;
  dateCreated: number;
  exercises: Exercise[];
  completed: boolean;
  durationTaken?: number;
  caloriesBurned?: number;
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

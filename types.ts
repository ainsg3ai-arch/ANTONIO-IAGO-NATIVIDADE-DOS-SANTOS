
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

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: Goal;
  level: ExperienceLevel;
  equipment: Equipment;
  onboarded: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[]; // New: Auxiliary muscles
  equipmentRequired: Equipment[];
  difficulty: ExperienceLevel;
  videoPlaceholder: string;
  videoUrl: string;
  description: string;
  reps?: string;
  sets?: number;
  durationSeconds?: number;
  caloriesPerMinute?: number; // New: METs estimate
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

export interface HabitLog {
  date: string; // YYYY-MM-DD
  waterIntake: number; // ml
  sleepHours: number;
  mood: number; // 1-5
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

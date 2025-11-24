
import { EXERCISE_DATABASE } from '../constants';
import { UserProfile, WorkoutSession, Exercise, Equipment, MuscleGroup, Goal } from '../types';

export const generateUUID = () => {
   if (typeof crypto !== 'undefined' && crypto.randomUUID) {
     return crypto.randomUUID();
   }
   return Math.random().toString(36).substring(2, 15);
}

export const generateWorkoutAI = (profile: UserProfile): WorkoutSession => {
  const { equipment, goal, level } = profile;

  // 1. Filter Exercises based on Equipment
  let availableExercises = EXERCISE_DATABASE.filter(ex => 
    ex.equipmentRequired.includes(equipment) || ex.equipmentRequired.includes(Equipment.NONE)
  );

  // 2. Adjust Difficulty
  if (level === 'Avançado') {
      const advancedEx = availableExercises.filter(e => e.difficulty !== 'Iniciante');
      if (advancedEx.length > 5) availableExercises = advancedEx; 
  }

  const workoutPlan: Exercise[] = [];

  // Always add a cardio/warmup
  const warmups = availableExercises.filter(e => e.muscleGroup === MuscleGroup.CARDIO);
  if (warmups.length > 0) {
      workoutPlan.push({...warmups[Math.floor(Math.random() * warmups.length)], sets: 2});
  }

  // Core Logic: Select 4-5 main exercises
  const musclePriority = [MuscleGroup.LEGS, MuscleGroup.CHEST, MuscleGroup.BACK, MuscleGroup.SHOULDERS, MuscleGroup.ABS];
  
  musclePriority.forEach(group => {
      const groupExercises = availableExercises.filter(e => e.muscleGroup === group);
      if (groupExercises.length > 0) {
          const pick = groupExercises[Math.floor(Math.random() * groupExercises.length)];
          
          let adjustedReps = pick.reps;
          if (goal === Goal.BUILD_MUSCLE && !pick.durationSeconds) {
              adjustedReps = '8-12';
          } else if (goal === Goal.LOSE_WEIGHT && !pick.durationSeconds) {
              adjustedReps = '15-20';
          }

          workoutPlan.push({
              ...pick,
              reps: adjustedReps
          });
      }
  });

  return {
      id: generateUUID(),
      name: `Treino IA de ${goal}`,
      dateCreated: Date.now(),
      exercises: workoutPlan,
      completed: false,
      durationTaken: 0,
      caloriesBurned: 0 // Will be calculated upon completion
  };
};


import { EXERCISE_DATABASE } from '../constants';
import { UserProfile, WorkoutSession, Exercise, Equipment, MuscleGroup, Goal } from '../types';
import { v4 as uuidv4 } from 'uuid'; // We need a simple ID generator, but standard crypto.randomUUID works in modern browsers

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
  // If user is Advanced, remove Beginner exercises unless they are warmups
  if (level === 'Avançado') {
      const advancedEx = availableExercises.filter(e => e.difficulty !== 'Iniciante');
      if (advancedEx.length > 5) availableExercises = advancedEx; 
  }

  // 3. Select Split based on Goal
  // For simplicity in this demo, we will create a Full Body workout or Upper/Lower randomizer
  // Let's implement a smart "Daily" generator
  
  const workoutPlan: Exercise[] = [];

  // Always add a cardio/warmup
  const warmups = availableExercises.filter(e => e.muscleGroup === MuscleGroup.CARDIO);
  if (warmups.length > 0) {
      workoutPlan.push({...warmups[Math.floor(Math.random() * warmups.length)], sets: 2}); // Reduce sets for warmup
  }

  // Core Logic: Select 4-5 main exercises
  const musclePriority = [MuscleGroup.LEGS, MuscleGroup.CHEST, MuscleGroup.BACK, MuscleGroup.SHOULDERS, MuscleGroup.ABS];
  
  musclePriority.forEach(group => {
      const groupExercises = availableExercises.filter(e => e.muscleGroup === group);
      if (groupExercises.length > 0) {
          // Pick one random
          const pick = groupExercises[Math.floor(Math.random() * groupExercises.length)];
          
          // AI Adjustment: Modify reps based on goal
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
      caloriesBurned: 0
  };
};

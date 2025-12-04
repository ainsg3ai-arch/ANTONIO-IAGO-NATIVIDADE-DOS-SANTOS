
import { EXERCISE_DATABASE } from '../constants';
import { UserProfile, WorkoutSession, Exercise, Equipment, MuscleGroup, Goal, Injury, ChatMessage, CoachStyle } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const generateUUID = () => {
   return uuidv4();
}

const isExerciseSafe = (exercise: Exercise, injuries: Injury[]): boolean => {
    if (!injuries || injuries.includes(Injury.NONE)) return true;
    for (const injury of injuries) {
        if (injury === Injury.KNEES) {
            if (exercise.name.includes('Salto') || exercise.name.includes('Burpee') || exercise.name.includes('Búlgaro')) return false;
        }
        if (injury === Injury.SHOULDERS) {
            if (exercise.muscleGroup === MuscleGroup.SHOULDERS && exercise.name.includes('Desenvolvimento')) return false;
            if (exercise.name.includes('Dips')) return false;
        }
        if (injury === Injury.BACK) {
            if (exercise.name.includes('Terra') || exercise.name.includes('Curvada')) return false;
        }
    }
    return true;
};

export const generateWorkoutAI = (profile: UserProfile): WorkoutSession => {
  const { equipment, goal, level, injuries, workoutDuration } = profile;

  // 1. Filtrar Exercícios Seguros e Disponíveis
  let availableExercises = EXERCISE_DATABASE.filter(ex => {
    const required = ex.equipmentRequired || [Equipment.NONE];
    const hasEquipment = required.includes(equipment) || required.includes(Equipment.NONE);
    const safe = isExerciseSafe(ex, injuries);
    return hasEquipment && safe;
  });

  // 2. Cálculo de Volume baseado no Tempo (Algoritmo de Densidade)
  // Estima: 4 min por exercício (incluindo descanso)
  const estimatedTimePerExercise = 4; // min (execução + descanso + troca)
  const targetExerciseCount = Math.floor((workoutDuration || 45) / estimatedTimePerExercise);
  
  const finalCount = Math.max(3, targetExerciseCount); // Mínimo 3 exercícios

  const workoutPlan: Exercise[] = [];

  // 3. Estratégia de Treino (Full Body com Prioridade)
  const priorities = [MuscleGroup.LEGS, MuscleGroup.CHEST, MuscleGroup.BACK, MuscleGroup.SHOULDERS, MuscleGroup.ABS, MuscleGroup.ARMS, MuscleGroup.CARDIO];
  
  // Embaralha prioridades para variar
  priorities.sort(() => Math.random() - 0.5);

  for (const group of priorities) {
      if (workoutPlan.length >= finalCount) break;

      const candidates = availableExercises.filter(e => e.muscleGroup === group);
      if (candidates.length > 0) {
          const pick = candidates[Math.floor(Math.random() * candidates.length)];
          
          // Ajuste de Repetições
          let adjustedReps = pick.reps;
          if (goal === Goal.BUILD_MUSCLE && !pick.durationSeconds) adjustedReps = '8-12';
          if (goal === Goal.LOSE_WEIGHT && !pick.durationSeconds) adjustedReps = '15-20';

          if (!workoutPlan.find(e => e.id === pick.id)) {
              workoutPlan.push({
                  ...pick,
                  reps: adjustedReps,
                  sets: (workoutDuration && workoutDuration < 20) ? 2 : 3
              });
          }
      }
  }

  // Se ainda sobrar espaço, preencher com Cardio ou Abs
  while (workoutPlan.length < finalCount) {
      const fillers = availableExercises.filter(e => e.muscleGroup === MuscleGroup.CARDIO || e.muscleGroup === MuscleGroup.ABS);
      const pick = fillers[Math.floor(Math.random() * fillers.length)];
      if (!workoutPlan.find(e => e.id === pick.id)) {
           workoutPlan.push({...pick, sets: 2});
      } else {
          break; // Evitar loop infinito
      }
  }

  return {
      id: generateUUID(),
      name: `Treino ${goal} (${workoutDuration}min)`,
      dateCreated: Date.now(),
      exercises: workoutPlan,
      completed: false,
      durationTaken: 0,
      caloriesBurned: 0 
  };
};

export const getAIChatResponse = (message: string, profile: UserProfile): ChatMessage => {
    const lowerMsg = message.toLowerCase();
    let responseText = "";
    const style = profile.coachStyle;

    if (lowerMsg.includes('oi') || lowerMsg.includes('olá')) {
        responseText = style === CoachStyle.MILITARY ? "SENTIDO! ESTAMOS AQUI PARA TREINAR, RECRUTA!" : "E aí, campeão! Pronto para destruir hoje?";
    } else if (lowerMsg.includes('dieta') || lowerMsg.includes('comer')) {
        responseText = "Músculo se constrói na cozinha. Proteína em todas as refeições e água o dia todo. Sem desculpas.";
    } else if (lowerMsg.includes('dor') || lowerMsg.includes('lesão')) {
        responseText = "Se a dor é aguda, PARE. Não confunda desconforto de treino com lesão.";
    } else {
        responseText = "Foco no treino. Consistência vence intensidade.";
    }

    return {
        id: generateUUID(),
        sender: 'ai',
        text: responseText,
        timestamp: Date.now()
    };
};

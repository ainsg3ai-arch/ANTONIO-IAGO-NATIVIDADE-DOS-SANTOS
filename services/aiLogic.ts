
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
            if (exercise.muscleGroup === MuscleGroup.SHOULDERS && (exercise.name.includes('Plancha') || exercise.name.includes('Handstand'))) return false;
        }
        if (injury === Injury.WRISTS) {
            if (exercise.name.includes('Handstand') || exercise.name.includes('Plan')) return false;
        }
    }
    return true;
};

export const generateWorkoutAI = (profile: UserProfile): WorkoutSession => {
  const { equipment, goal, injuries, workoutDuration, levelNumber } = profile;

  // 1. Filtrar Exercícios Disponíveis e Seguros
  let availableExercises = EXERCISE_DATABASE.filter(ex => {
    const required = ex.equipmentRequired || [Equipment.NONE];
    const hasEquipment = required.every(req => req === Equipment.NONE || equipment.includes(req));
    const safe = isExerciseSafe(ex, injuries);
    
    // Filtrar por nível aproximado (até 1 nível acima do atual para desafio)
    const currentLevelScore = Math.min(5, Math.floor(levelNumber / 10) + 1);
    const suitableLevel = ex.difficultyScore <= currentLevelScore + 1;

    return hasEquipment && safe && suitableLevel;
  });

  // 2. Determinar Volume
  const timePerEx = 5; // Calistenia requer mais tempo de setup e foco na forma
  const targetCount = Math.max(4, Math.floor(workoutDuration / timePerEx));
  
  const workoutPlan: Exercise[] = [];

  // 3. Estrutura de Treino (Priorizar Progressão de Skill/Força primeiro)
  const sortedByDifficulty = [...availableExercises].sort((a, b) => b.difficultyScore - a.difficultyScore);
  
  // Escolher 1 Skill/Isometria Pesada primeiro (Fresco)
  const skills = sortedByDifficulty.filter(e => e.category.includes('Skill'));
  if (skills.length > 0) workoutPlan.push({...skills[0], sets: 4});

  // Preencher com PUSH, PULL e CORE
  const priorities = [MuscleGroup.CHEST, MuscleGroup.BACK, MuscleGroup.ABS, MuscleGroup.LEGS];
  priorities.sort(() => Math.random() - 0.5);

  for (const group of priorities) {
      if (workoutPlan.length >= targetCount) break;
      const candidates = sortedByDifficulty.filter(e => e.muscleGroup === group && !workoutPlan.find(w => w.id === e.id));
      if (candidates.length > 0) {
          const pick = candidates[0]; // Pega o mais desafiador disponível para o grupo
          
          // Ajuste dinâmico de intensidade
          let reps = pick.reps;
          if (goal === Goal.BUILD_MUSCLE) reps = '8-12';
          if (goal === Goal.LOSE_WEIGHT) reps = '15-20';

          workoutPlan.push({
              ...pick,
              reps,
              sets: 3
          });
      }
  }

  return {
      id: generateUUID(),
      name: `Protocolo ${goal} AI`,
      dateCreated: Date.now(),
      exercises: workoutPlan,
      completed: false,
      type: 'STRENGTH'
  };
};

export const getAIChatResponse = (message: string, profile: UserProfile): ChatMessage => {
    const lowerMsg = message.toLowerCase();
    let responseText = "";
    const style = profile.coachStyle;

    if (lowerMsg.includes('calistenia')) {
        responseText = "Calistenia é sobre controle. Domine seu peso corporal antes de adicionar carga externa. Foco na amplitude máxima.";
    } else if (lowerMsg.includes('dor') || lowerMsg.includes('articulação')) {
        responseText = "Na calistenia, tendões levam mais tempo para adaptar que músculos. Se sentir dor nas articulações, regresse um nível.";
    } else if (lowerMsg.includes('muscle up')) {
        responseText = "Para o Muscle Up, você precisa de uma puxada explosiva até o umbigo. Treine 'High Pull-ups' primeiro.";
    } else if (lowerMsg.includes('oi') || lowerMsg.includes('olá')) {
        responseText = style === CoachStyle.MILITARY ? "SENTIDO! ESTAMOS AQUI PARA FORJAR ELITE. QUAL A DÚVIDA?" : "E aí! Pronto para elevar o nível hoje? Como posso ajudar?";
    } else {
        responseText = "Consistência é o segredo. Um treino de 15 min hoje é melhor que um de 2 horas que nunca acontece.";
    }

    return {
        id: generateUUID(),
        sender: 'ai',
        text: responseText,
        timestamp: Date.now()
    };
};

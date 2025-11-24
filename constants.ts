
import { Exercise, Equipment, ExperienceLevel, MuscleGroup, Achievement } from './types';
import { Medal, Flame, Zap, Sunrise, Award } from 'lucide-react';

// A "Mock" database that lives in code for offline capability
// Updated with real YouTube links and Thumbnails
export const EXERCISE_DATABASE: Exercise[] = [
  // Chest
  {
    id: 'c1',
    name: 'Flexão de Braço',
    muscleGroup: MuscleGroup.CHEST,
    equipmentRequired: [Equipment.NONE, Equipment.HOME_BASIC, Equipment.FULL_GYM],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/IODxDxX7oi4/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    description: 'Mantenha o core firme e desça o peito até o chão.',
    reps: '10-15',
    sets: 3
  },
  {
    id: 'c2',
    name: 'Supino com Halteres',
    muscleGroup: MuscleGroup.CHEST,
    equipmentRequired: [Equipment.HOME_BASIC, Equipment.FULL_GYM],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/VmB1G1K7v94/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=VmB1G1K7v94',
    description: 'Empurre os halteres para cima a partir do nível do peito, convergindo no topo.',
    reps: '8-12',
    sets: 4
  },
  {
    id: 'c3',
    name: 'Supino Reto (Barra)',
    muscleGroup: MuscleGroup.CHEST,
    equipmentRequired: [Equipment.FULL_GYM],
    difficulty: ExperienceLevel.ADVANCED,
    videoPlaceholder: 'https://img.youtube.com/vi/rT7DgCr-3pg/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    description: 'Clássico para peito. Desça a barra até o meio do peito.',
    reps: '5-8',
    sets: 4
  },
  
  // Back
  {
    id: 'b1',
    name: 'Barra Fixa',
    muscleGroup: MuscleGroup.BACK,
    equipmentRequired: [Equipment.NONE, Equipment.HOME_BASIC, Equipment.FULL_GYM], 
    difficulty: ExperienceLevel.ADVANCED,
    videoPlaceholder: 'https://img.youtube.com/vi/eGo4IYlbE5g/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    description: 'Puxe o queixo acima da barra. Extensão completa na descida.',
    reps: 'Máximo',
    sets: 3
  },
  {
    id: 'b2',
    name: 'Remada Unilateral (Serrote)',
    muscleGroup: MuscleGroup.BACK,
    equipmentRequired: [Equipment.HOME_BASIC, Equipment.FULL_GYM],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/pYcpY20QaE8/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=pYcpY20QaE8',
    description: 'Apoie-se no banco, puxe o peso em direção ao quadril.',
    reps: '10-12',
    sets: 3
  },

  // Legs
  {
    id: 'l1',
    name: 'Agachamento Livre',
    muscleGroup: MuscleGroup.LEGS,
    equipmentRequired: [Equipment.NONE, Equipment.HOME_BASIC, Equipment.FULL_GYM],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/l7sF7D8z67k/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=l7sF7D8z67k',
    description: 'Quadril para trás, joelhos para fora. Desça até a paralela.',
    reps: '15-20',
    sets: 3
  },
  {
    id: 'l2',
    name: 'Avanço (Passada)',
    muscleGroup: MuscleGroup.LEGS,
    equipmentRequired: [Equipment.NONE, Equipment.HOME_BASIC, Equipment.FULL_GYM],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/QOVaHwm-Q6U/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    description: 'Dê um passo à frente, o joelho de trás quase toca o chão.',
    reps: '10 por perna',
    sets: 3
  },
  {
    id: 'l3',
    name: 'Agachamento com Barra',
    muscleGroup: MuscleGroup.LEGS,
    equipmentRequired: [Equipment.FULL_GYM],
    difficulty: ExperienceLevel.ADVANCED,
    videoPlaceholder: 'https://img.youtube.com/vi/SW_C1A-rejs/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=SW_C1A-rejs',
    description: 'O rei dos exercícios de perna. Mantenha a coluna neutra.',
    reps: '5-8',
    sets: 4
  },

  // Shoulders
  {
    id: 's1',
    name: 'Flexão Pike',
    muscleGroup: MuscleGroup.SHOULDERS,
    equipmentRequired: [Equipment.NONE, Equipment.HOME_BASIC, Equipment.FULL_GYM],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/sposDXWEB0A/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=sposDXWEB0A',
    description: 'Forme um V invertido. Baixe a cabeça em direção ao chão.',
    reps: '8-12',
    sets: 3
  },
  {
    id: 's2',
    name: 'Desenvolvimento de Ombros',
    muscleGroup: MuscleGroup.SHOULDERS,
    equipmentRequired: [Equipment.HOME_BASIC, Equipment.FULL_GYM],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/2yjwXTZQDDI/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
    description: 'Empurre o peso para cima. Core contraído.',
    reps: '8-12',
    sets: 3
  },

  // Core
  {
    id: 'co1',
    name: 'Prancha Isométrica',
    muscleGroup: MuscleGroup.ABS,
    equipmentRequired: [Equipment.NONE, Equipment.HOME_BASIC, Equipment.FULL_GYM],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/ASdvN_XEl_c/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
    description: 'Segure em linha reta. Contraia os glúteos.',
    durationSeconds: 45,
    sets: 3
  },
  {
    id: 'co2',
    name: 'Elevação de Pernas',
    muscleGroup: MuscleGroup.ABS,
    equipmentRequired: [Equipment.NONE, Equipment.HOME_BASIC, Equipment.FULL_GYM],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/JB2oyawG9KI/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
    description: 'Deite-se, levante as pernas até 90 graus.',
    reps: '12-15',
    sets: 3
  },

  // Cardio
  {
    id: 'ca1',
    name: 'Burpees',
    muscleGroup: MuscleGroup.CARDIO,
    equipmentRequired: [Equipment.NONE, Equipment.HOME_BASIC, Equipment.FULL_GYM],
    difficulty: ExperienceLevel.ADVANCED,
    videoPlaceholder: 'https://img.youtube.com/vi/TU8QYVW0gDU/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=TU8QYVW0gDU',
    description: 'Agache, flexão, salto. Explosivo.',
    reps: '10',
    sets: 4
  },
  {
    id: 'ca2',
    name: 'Polichinelos',
    muscleGroup: MuscleGroup.CARDIO,
    equipmentRequired: [Equipment.NONE, Equipment.HOME_BASIC, Equipment.FULL_GYM],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/c4DAnQ6DtF8/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
    description: 'Aquecimento cardiovascular padrão.',
    durationSeconds: 60,
    sets: 2
  }
];

export const ACHIEVEMENTS_LIST: Achievement[] = [
    {
        id: 'first_step',
        title: 'Primeiro Passo',
        description: 'Complete seu primeiro treino.',
        icon: Medal
    },
    {
        id: 'on_fire',
        title: 'Em Chamas',
        description: 'Complete 5 treinos no total.',
        icon: Flame
    },
    {
        id: 'warrior',
        title: 'Guerreiro',
        description: 'Complete 10 treinos.',
        icon: Award
    },
    {
        id: 'early_bird',
        title: 'Madrugador',
        description: 'Complete um treino antes das 8 da manhã.',
        icon: Sunrise
    },
    {
        id: 'consistency',
        title: 'Consistência',
        description: 'Treine 3 vezes em uma semana.',
        icon: Zap
    }
];

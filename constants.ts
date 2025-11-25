
import { Exercise, Equipment, ExperienceLevel, MuscleGroup, Achievement, RecoverySession, Post } from './types';
import { Medal, Flame, Zap, Sunrise, Award, Smile } from 'lucide-react';

// --- RECOVERY & MINDFULNESS ---
export const RECOVERY_SESSIONS: RecoverySession[] = [
    {
        id: 'rec_1',
        title: 'Descompressão Lombar',
        type: 'stretching',
        durationMinutes: 10,
        description: 'Série focada em aliviar a tensão na parte inferior das costas após dias de agachamento ou muito tempo sentado.'
    },
    {
        id: 'rec_2',
        title: 'Mobilidade de Quadril',
        type: 'mobility',
        durationMinutes: 15,
        description: 'Essencial para melhorar a profundidade do agachamento e evitar dores no joelho.'
    },
    {
        id: 'rec_3',
        title: 'Respiração Focada',
        type: 'meditation',
        durationMinutes: 5,
        description: 'Técnica Box Breathing (4-4-4-4) para reduzir cortisol pós-treino intenso.'
    },
    {
        id: 'rec_4',
        title: 'Devocional: Força e Espírito',
        type: 'meditation',
        durationMinutes: 5,
        description: 'Reflexão curta sobre disciplina e cuidado com o corpo.'
    }
];

export const COMMUNITY_SEED_POSTS: Post[] = [
    {
        id: 'p1',
        author: 'Treinador AINS',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        content: 'Lembre-se: Motivação é o que te faz começar. Hábito é o que te faz continuar. Bom treino a todos! 🔥',
        likes: 124,
        timestamp: Date.now() - 3600000,
        isLikedByMe: false
    },
    {
        id: 'p2',
        author: 'Julia Fit',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julia',
        content: 'Bati meu recorde no agachamento hoje! 80kg! Nunca desista dos seus objetivos.',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
        likes: 89,
        timestamp: Date.now() - 7200000,
        isLikedByMe: false
    }
];

// Banco de Dados Massivo de Exercícios
export const EXERCISE_DATABASE: Exercise[] = [
  // --- PEITO (CHEST) ---
  {
    id: 'c1',
    name: 'Flexão de Braço Clássica',
    muscleGroup: MuscleGroup.CHEST,
    secondaryMuscles: [MuscleGroup.ARMS, MuscleGroup.SHOULDERS, MuscleGroup.ABS],
    musculosPrimarios: ['Peitoral Maior'],
    musculosSecundarios: ['Tríceps Braquial', 'Deltoide Anterior', 'Serrátil Anterior'],
    equipmentRequired: [Equipment.NONE, Equipment.HOME_BASIC, Equipment.FULL_GYM],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/IODxDxX7oi4/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    description: 'O exercício fundamental da calistenia. Mantenha o corpo em linha reta, desça o peito até quase tocar o chão e empurre com explosão.',
    reps: '10-15',
    sets: 3,
    caloriesPerMinute: 8
  },
  {
    id: 'c2',
    name: 'Supino Reto com Barra',
    muscleGroup: MuscleGroup.CHEST,
    secondaryMuscles: [MuscleGroup.ARMS, MuscleGroup.SHOULDERS],
    musculosPrimarios: ['Peitoral Maior', 'Peitoral Menor'],
    musculosSecundarios: ['Tríceps', 'Deltoide Anterior'],
    equipmentRequired: [Equipment.FULL_GYM],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/rT7DgCr-3pg/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    description: 'O rei dos exercícios de peito na academia. Deite-se no banco, desça a barra controladamente até o meio do peito e empurre.',
    reps: '8-12',
    sets: 4,
    caloriesPerMinute: 6
  },
  {
    id: 'c3',
    name: 'Supino Inclinado com Halteres',
    muscleGroup: MuscleGroup.CHEST,
    secondaryMuscles: [MuscleGroup.SHOULDERS, MuscleGroup.ARMS],
    musculosPrimarios: ['Peitoral Maior (Porção Clavicular)'],
    musculosSecundarios: ['Deltoide Anterior', 'Tríceps'],
    equipmentRequired: [Equipment.HOME_BASIC, Equipment.FULL_GYM],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/8iPEnn-ltC8/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
    description: 'Foca na parte superior do peitoral. Ajuste o banco a 30-45 graus. Mantenha os cotovelos levemente fechados.',
    reps: '10-12',
    sets: 3,
    caloriesPerMinute: 6
  },
  {
    id: 'c4',
    name: 'Flexão Diamante',
    muscleGroup: MuscleGroup.CHEST,
    secondaryMuscles: [MuscleGroup.ARMS], 
    musculosPrimarios: ['Tríceps Braquial', 'Peitoral Maior (Interno)'],
    musculosSecundarios: ['Deltoide Anterior'],
    equipmentRequired: [Equipment.NONE],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/J0DnG1_S92I/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=J0DnG1_S92I',
    description: 'Junte as mãos formando um diamante. Excelente para parte interna do peito e tríceps.',
    reps: '8-12',
    sets: 3,
    caloriesPerMinute: 9
  },
  {
    id: 'c5',
    name: 'Crossover na Polia Alta',
    muscleGroup: MuscleGroup.CHEST,
    secondaryMuscles: [MuscleGroup.SHOULDERS],
    musculosPrimarios: ['Peitoral Maior (Porção Inferior/Esternal)'],
    musculosSecundarios: ['Deltoide Anterior'],
    equipmentRequired: [Equipment.FULL_GYM],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/taI4XduLpTk/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=taI4XduLpTk',
    description: 'Isolamento de peitoral. Mantenha o tronco estável e traga as polias à frente do corpo cruzando levemente.',
    reps: '12-15',
    sets: 3,
    caloriesPerMinute: 5
  },
  {
    id: 'c6',
    name: 'Flexão Declinada (Pés Elevados)',
    muscleGroup: MuscleGroup.CHEST,
    secondaryMuscles: [MuscleGroup.SHOULDERS, MuscleGroup.ARMS],
    musculosPrimarios: ['Peitoral Maior (Porção Superior)'],
    musculosSecundarios: ['Deltoide Anterior', 'Tríceps'],
    equipmentRequired: [Equipment.NONE],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/SKPab2YC8BE/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=SKPab2YC8BE',
    description: 'Apoie os pés em uma cadeira ou banco. Mantenha o corpo reto e desça o peito em direção ao chão. Foca na parte superior do peitoral.',
    reps: '10-12',
    sets: 3,
    caloriesPerMinute: 9
  },
  {
    id: 'c7',
    name: 'Flexão Explosiva',
    muscleGroup: MuscleGroup.CHEST,
    secondaryMuscles: [MuscleGroup.ARMS, MuscleGroup.CARDIO],
    musculosPrimarios: ['Peitoral Maior', 'Tríceps Braquial'],
    musculosSecundarios: ['Fibras de Contração Rápida', 'Deltoide Anterior'],
    equipmentRequired: [Equipment.NONE],
    difficulty: ExperienceLevel.ADVANCED,
    videoPlaceholder: 'https://img.youtube.com/vi/h72v81h2lVw/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=h72v81h2lVw',
    description: 'Desça controlado e empurre o chão com força máxima para tirar as mãos do solo. Ótimo para potência.',
    reps: '5-8',
    sets: 3,
    caloriesPerMinute: 12
  },

  // --- COSTAS (BACK) ---
  {
    id: 'b1',
    name: 'Barra Fixa (Pull Up)',
    muscleGroup: MuscleGroup.BACK,
    secondaryMuscles: [MuscleGroup.ARMS, MuscleGroup.ABS],
    musculosPrimarios: ['Latíssimo do Dorso (Grande Dorsal)'],
    musculosSecundarios: ['Bíceps Braquial', 'Trapézio Inferior', 'Rombóides'],
    equipmentRequired: [Equipment.NONE, Equipment.HOME_BASIC, Equipment.FULL_GYM],
    difficulty: ExperienceLevel.ADVANCED,
    videoPlaceholder: 'https://img.youtube.com/vi/eGo4IYlbE5g/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    description: 'O melhor construtor de costas. Pegada pronada (palmas para frente). Puxe até o queixo passar a barra.',
    reps: 'Máximo',
    sets: 4,
    caloriesPerMinute: 11
  },
  {
    id: 'b2',
    name: 'Remada Curvada com Barra',
    muscleGroup: MuscleGroup.BACK,
    secondaryMuscles: [MuscleGroup.LEGS, MuscleGroup.ARMS],
    musculosPrimarios: ['Latíssimo do Dorso', 'Trapézio', 'Rombóides'],
    musculosSecundarios: ['Bíceps', 'Eretores da Espinha', 'Deltoide Posterior'],
    equipmentRequired: [Equipment.FULL_GYM],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/6FZHJGzMFEc/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=6FZHJGzMFEc',
    description: 'Mantenha as costas retas, joelhos flexionados. Puxe a barra em direção ao umbigo.',
    reps: '8-10',
    sets: 4,
    caloriesPerMinute: 8
  },
  {
    id: 'b3',
    name: 'Barra Australiana (Pegada Neutra)',
    muscleGroup: MuscleGroup.BACK,
    secondaryMuscles: [MuscleGroup.ARMS],
    musculosPrimarios: ['Latíssimo do Dorso', 'Rombóides'],
    musculosSecundarios: ['Bíceps Braquial', 'Braquiorradial'],
    equipmentRequired: [Equipment.NONE, Equipment.HOME_BASIC],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/LHaC729k3gs/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=LHaC729k3gs',
    description: 'Use uma barra baixa ou argolas. Mantenha o corpo reto e puxe o peito até a barra com as palmas viradas uma para a outra.',
    reps: '10-15',
    sets: 3,
    caloriesPerMinute: 7
  },

  // --- PERNAS (LEGS) ---
  {
    id: 'l1',
    name: 'Agachamento Livre (Bodyweight)',
    muscleGroup: MuscleGroup.LEGS,
    secondaryMuscles: [MuscleGroup.ABS],
    musculosPrimarios: ['Quadríceps', 'Glúteo Máximo'],
    musculosSecundarios: ['Isquiotibiais', 'Panturrilha', 'Core'],
    equipmentRequired: [Equipment.NONE],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/aclHkVaku9U/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U',
    description: 'O básico essencial. Pés na largura dos ombros, desça como se fosse sentar em uma cadeira.',
    reps: '15-20',
    sets: 3,
    caloriesPerMinute: 7
  },
  {
    id: 'l2',
    name: 'Agachamento com Barra (Back Squat)',
    muscleGroup: MuscleGroup.LEGS,
    secondaryMuscles: [MuscleGroup.BACK, MuscleGroup.ABS],
    musculosPrimarios: ['Quadríceps', 'Glúteo Máximo'],
    musculosSecundarios: ['Adutores', 'Isquiotibiais', 'Eretores da Espinha'],
    equipmentRequired: [Equipment.FULL_GYM],
    difficulty: ExperienceLevel.ADVANCED,
    videoPlaceholder: 'https://img.youtube.com/vi/SW_C1A-rejs/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=SW_C1A-rejs',
    description: 'Rei dos exercícios de perna. Barra nas costas, desça até quebrar a paralela. Respire fundo para estabilizar o core.',
    reps: '5-8',
    sets: 4,
    caloriesPerMinute: 10
  },
  {
    id: 'l7',
    name: 'Stiff com Barra',
    muscleGroup: MuscleGroup.LEGS,
    secondaryMuscles: [MuscleGroup.BACK],
    musculosPrimarios: ['Isquiotibiais (Posterior de Coxa)', 'Glúteos'],
    musculosSecundarios: ['Eretores da Espinha', 'Antebraço'],
    equipmentRequired: [Equipment.FULL_GYM, Equipment.HOME_BASIC],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/CN_7cz3P-1U/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=CN_7cz3P-1U',
    description: 'Foco em posterior de coxa e glúteo. Mantenha as pernas semi-flexionadas e desça o tronco reto.',
    reps: '10-12',
    sets: 3,
    caloriesPerMinute: 7
  },
  {
    id: 'l8',
    name: 'Pistol Squat Assistido',
    muscleGroup: MuscleGroup.LEGS,
    secondaryMuscles: [MuscleGroup.ABS],
    musculosPrimarios: ['Quadríceps', 'Glúteos'],
    musculosSecundarios: ['Isquiotibiais', 'Core (Equilíbrio)'],
    equipmentRequired: [Equipment.NONE],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/PZilMv71Eks/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=PZilMv71Eks',
    description: 'Agachamento unilateral segurando em um apoio (parede ou poste) para equilíbrio. Excelente para força e mobilidade.',
    reps: '6-8 cada',
    sets: 3,
    caloriesPerMinute: 9
  },

  // --- OMBROS (SHOULDERS) ---
  {
    id: 's1',
    name: 'Desenvolvimento Militar',
    muscleGroup: MuscleGroup.SHOULDERS,
    secondaryMuscles: [MuscleGroup.ARMS],
    musculosPrimarios: ['Deltoide Anterior', 'Deltoide Lateral'],
    musculosSecundarios: ['Tríceps', 'Trapézio Superior', 'Serrátil Anterior'],
    equipmentRequired: [Equipment.HOME_BASIC, Equipment.FULL_GYM],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/qEwKCR5JCog/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    description: 'Empurre os pesos acima da cabeça. Mantenha o core travado para não arquear as costas.',
    reps: '8-12',
    sets: 3,
    caloriesPerMinute: 7
  },
  {
    id: 's3',
    name: 'Elevação Lateral',
    muscleGroup: MuscleGroup.SHOULDERS,
    secondaryMuscles: [],
    musculosPrimarios: ['Deltoide Lateral'],
    musculosSecundarios: ['Trapézio Superior', 'Supraespinhal'],
    equipmentRequired: [Equipment.HOME_BASIC, Equipment.FULL_GYM],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/3VcKaXpzqRo/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    description: 'Crucial para ombros largos. Levante os pesos até a altura dos ombros, cotovelos levemente dobrados.',
    reps: '12-15',
    sets: 3,
    caloriesPerMinute: 4
  },

  // --- BRAÇOS (ARMS) ---
  {
    id: 'a1',
    name: 'Rosca Direta (Barra)',
    muscleGroup: MuscleGroup.ARMS,
    secondaryMuscles: [],
    musculosPrimarios: ['Bíceps Braquial'],
    musculosSecundarios: ['Braquial', 'Braquiorradial (Antebraço)'],
    equipmentRequired: [Equipment.FULL_GYM, Equipment.HOME_BASIC],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/kwG2ipFRgfo/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
    description: 'Clássico para bíceps. Mantenha os cotovelos fixos ao lado do corpo.',
    reps: '10-12',
    sets: 3,
    caloriesPerMinute: 4
  },
  {
    id: 'a3',
    name: 'Tríceps Corda (Polia)',
    muscleGroup: MuscleGroup.ARMS,
    secondaryMuscles: [],
    musculosPrimarios: ['Tríceps Braquial (Cabeça Lateral e Longa)'],
    musculosSecundarios: ['Ancôneo'],
    equipmentRequired: [Equipment.FULL_GYM],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/kiUdbGJmcyY/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=kiUdbGJmcyY',
    description: 'Estenda o braço para baixo, abrindo a corda no final do movimento para contração máxima.',
    reps: '12-15',
    sets: 3,
    caloriesPerMinute: 4
  },

  // --- ABDÔMEN (ABS) ---
  {
    id: 'abs1',
    name: 'Prancha Abdominal',
    muscleGroup: MuscleGroup.ABS,
    secondaryMuscles: [MuscleGroup.SHOULDERS],
    musculosPrimarios: ['Reto Abdominal', 'Transverso do Abdômen'],
    musculosSecundarios: ['Oblíquos', 'Ombros', 'Glúteos'],
    equipmentRequired: [Equipment.NONE],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/ASdvN_XEl_c/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
    description: 'Isometria essencial. Contraia glúteos e abdômen. Não deixe o quadril cair.',
    durationSeconds: 45,
    sets: 3,
    caloriesPerMinute: 4
  },

  // --- CARDIO / HIIT ---
  {
    id: 'hiit1',
    name: 'Burpees',
    muscleGroup: MuscleGroup.CARDIO,
    secondaryMuscles: [MuscleGroup.CHEST, MuscleGroup.LEGS, MuscleGroup.ARMS],
    musculosPrimarios: ['Corpo Inteiro (Cardiovascular)'],
    musculosSecundarios: ['Pernas', 'Peitoral', 'Ombros', 'Core'],
    equipmentRequired: [Equipment.NONE],
    difficulty: ExperienceLevel.ADVANCED,
    videoPlaceholder: 'https://img.youtube.com/vi/TU8QYVW0gDU/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=TU8QYVW0gDU',
    description: 'O exercício mais completo de cardio. Agache, flexão, volte e salte.',
    reps: '10-15',
    sets: 4,
    caloriesPerMinute: 14
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

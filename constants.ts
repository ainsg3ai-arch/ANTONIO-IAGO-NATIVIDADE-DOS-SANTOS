
import { Exercise, ExperienceLevel, MuscleGroup, ExerciseCategory, Program, Achievement, Post, StoreItem, Equipment } from './types';
import { Medal, Flame, Zap, Sunrise, Award, Target, Crown, Shield } from 'lucide-react';

// --- STORE ITEMS ---
export const STORE_ITEMS: StoreItem[] = [
    { id: 'skin_gold', name: 'Avatar Gold', type: 'skin', cost: 500, preview: '#FFD700', description: 'Status de elite.' },
    { id: 'skin_neon', name: 'Cyber Neon', type: 'skin', cost: 300, preview: '#00F2EA', description: 'Estilo noturno.' },
    { id: 'skin_stealth', name: 'Stealth Black', type: 'skin', cost: 200, preview: '#1a1a1a', description: 'Discreto e letal.' },
    { id: 'skin_fire', name: 'Magma', type: 'skin', cost: 150, preview: '#ef4444', description: 'Intensidade máxima.' }
];

// --- EXERCISE DATABASE (CALISTHENICS & BODYWEIGHT FOCUSED) ---
export const EXERCISE_DATABASE: Exercise[] = [
    // --- INICIANTE (Beginner) ---
    {
        id: 'push_knee_pushup',
        name: 'Flexão com Joelhos',
        category: ExerciseCategory.PUSH,
        muscleGroup: MuscleGroup.CHEST,
        musculosPrimarios: ['Peitoral', 'Tríceps'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/jWc8gHl_oaE/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/jWc8gHl_oaE',
        description: 'Construa a força básica de empurrar.',
        stepByStep: ['Apoie os joelhos.', 'Mãos largura dos ombros.', 'Desça peito ao chão.'],
        reps: '10-15', sets: 3,
        equipmentRequired: [Equipment.NONE]
    },
    {
        id: 'legs_squat',
        name: 'Agachamento Air Squat',
        category: ExerciseCategory.LEGS,
        muscleGroup: MuscleGroup.LEGS,
        musculosPrimarios: ['Quadríceps', 'Glúteos'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/R0vU63614Fk/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/R0vU63614Fk',
        description: 'O rei dos exercícios de perna.',
        stepByStep: ['Pés na largura dos ombros.', 'Costas retas.', 'Desça até quebrar a paralela.'],
        reps: '15-20', sets: 3,
        breathingTip: 'Inspire descendo, expire subindo.',
        equipmentRequired: [Equipment.NONE]
    },
    {
        id: 'core_plank',
        name: 'Prancha Abdominal',
        category: ExerciseCategory.CORE,
        muscleGroup: MuscleGroup.ABS,
        musculosPrimarios: ['Core Total'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/ASdvN_XEl_c/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/ASdvN_XEl_c',
        description: 'Estabilidade blindada.',
        stepByStep: ['Cotovelos sob ombros.', 'Contraia glúteo.', 'Umbigo para dentro.'],
        durationSeconds: 30, sets: 3,
        equipmentRequired: [Equipment.NONE]
    },

    // --- INTERMEDIÁRIO (Intermediate) ---
    {
        id: 'push_classic',
        name: 'Flexão Clássica',
        category: ExerciseCategory.PUSH,
        muscleGroup: MuscleGroup.CHEST,
        musculosPrimarios: ['Peitoral Maior', 'Tríceps', 'Deltóide Anterior'],
        difficulty: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/IODxDxX7oi4/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/IODxDxX7oi4', 
        description: 'O exercício fundamental da calistenia.',
        stepByStep: [
            'Mãos alinhadas aos ombros, corpo em prancha.',
            'Cotovelos a 45º do tronco (não abra demais).',
            'Desça até o peito quase tocar o chão.',
            'Empurre o chão com explosão até estender os braços.'
        ],
        commonErrors: ['Quadril caído (banana)', 'Cotovelos muito abertos', 'Pescoço caído'],
        breathingTip: 'Inspire descendo, expire empurrando.',
        variations: {
            easier: ['Flexão com Joelhos', 'Flexão na Parede'],
            harder: ['Flexão Explosiva', 'Flexão com Peso']
        },
        reps: '12-15',
        sets: 4,
        equipmentRequired: [Equipment.NONE]
    },
    {
        id: 'push_diamond',
        name: 'Flexão Diamante',
        category: ExerciseCategory.PUSH,
        muscleGroup: MuscleGroup.ARMS,
        musculosPrimarios: ['Tríceps', 'Peitoral Interno'],
        difficulty: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/XtM1eQ4n7vQ/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/XtM1eQ4n7vQ',
        description: 'Foco total na ferradura do tríceps.',
        stepByStep: ['Una indicadores e polegares.', 'Desça no esterno.', 'Cotovelos fechados.'],
        reps: '10-12', sets: 3,
        equipmentRequired: [Equipment.NONE]
    },
    {
        id: 'pull_pullup',
        name: 'Barra Fixa (Pull Up)',
        category: ExerciseCategory.PULL,
        muscleGroup: MuscleGroup.BACK,
        musculosPrimarios: ['Latíssimo do Dorso', 'Bíceps'],
        difficulty: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/eGo4IYlbE5g/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/eGo4IYlbE5g',
        description: 'O teste definitivo de força relativa.',
        stepByStep: ['Pegada pronada (palmas para frente).', 'Deprima as escápulas.', 'Puxe o peito até a barra.'],
        commonErrors: ['Kipping (balanço) excessivo', 'Não esticar braços na descida'],
        reps: '5-8', sets: 3,
        equipmentRequired: [Equipment.BAR]
    },
    {
        id: 'legs_pistol_assist',
        name: 'Pistol Squat Assistido',
        category: ExerciseCategory.LEGS,
        muscleGroup: MuscleGroup.LEGS,
        musculosPrimarios: ['Quadríceps', 'Equilíbrio'],
        difficulty: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/PZilFYvj6fs/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/PZilFYvj6fs',
        description: 'Agachamento unilateral segurando em um apoio.',
        stepByStep: ['Segure em um poste/portal.', 'Estique uma perna.', 'Desça controlado.'],
        reps: '6-8 cada', sets: 3,
        equipmentRequired: [Equipment.NONE]
    },

    // --- AVANÇADO (Advanced) ---
    {
        id: 'push_hspu',
        name: 'Handstand Push-Up (HSPU)',
        category: ExerciseCategory.PUSH,
        muscleGroup: MuscleGroup.SHOULDERS,
        musculosPrimarios: ['Ombros', 'Tríceps', 'Core'],
        difficulty: ExperienceLevel.ADVANCED,
        videoPlaceholder: 'https://img.youtube.com/vi/h2v1Zf1N8sM/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/h2v1Zf1N8sM', // Placeholder logic
        description: 'Flexão em parada de mão na parede.',
        stepByStep: ['Chute para parada de mão na parede.', 'Desça a cabeça controlada.', 'Empurre forte.'],
        reps: '3-6', sets: 4,
        equipmentRequired: [Equipment.NONE]
    },
    {
        id: 'core_dragon_flag',
        name: 'Dragon Flag',
        category: ExerciseCategory.CORE,
        muscleGroup: MuscleGroup.ABS,
        musculosPrimarios: ['Core', 'Lats'],
        difficulty: ExperienceLevel.ADVANCED,
        videoPlaceholder: 'https://img.youtube.com/vi/mjwJp4G4-r8/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/mjwJp4G4-r8',
        description: 'O lendário exercício de Bruce Lee.',
        stepByStep: ['Deite no banco/chão segurando algo atrás da cabeça.', 'Eleve o corpo todo reto.', 'Desça controlando apenas pelos ombros.'],
        reps: '5-8', sets: 3,
        equipmentRequired: [Equipment.NONE]
    },
    {
        id: 'skill_muscle_up',
        name: 'Muscle Up',
        category: ExerciseCategory.SKILL,
        muscleGroup: MuscleGroup.FULL_BODY,
        musculosPrimarios: ['Costas', 'Tríceps', 'Explosão'],
        difficulty: ExperienceLevel.ELITE,
        videoPlaceholder: 'https://img.youtube.com/vi/N__9Zl9gI18/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/N__9Zl9gI18',
        description: 'Puxada explosiva seguida de empurrada acima da barra.',
        stepByStep: ['Puxe explosivo até o umbigo.', 'Gire os cotovelos para cima.', 'Empurre (Dips) para finalizar.'],
        reps: '1-5', sets: 5,
        equipmentRequired: [Equipment.BAR]
    },
    {
        id: 'cardio_burpee',
        name: 'Burpee Completo',
        category: ExerciseCategory.CARDIO,
        muscleGroup: MuscleGroup.FULL_BODY,
        musculosPrimarios: ['Coração', 'Pernas', 'Peito', 'Ombros'],
        difficulty: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/TU8QYVW0gDU/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/TU8QYVW0gDU',
        description: 'O queimador de gordura definitivo.',
        stepByStep: [
            'Agache e coloque as mãos no chão.',
            'Jogue os pés para trás e faça uma flexão.',
            'Volte os pés para a posição de agachamento.',
            'Salte batendo as mãos acima da cabeça.'
        ],
        reps: '12', sets: 4,
        equipmentRequired: [Equipment.NONE]
    },
    {
        id: 'cardio_climber',
        name: 'Mountain Climber',
        category: ExerciseCategory.CARDIO,
        muscleGroup: MuscleGroup.ABS,
        musculosPrimarios: ['Core', 'Flexores de Quadril', 'Ombros'],
        difficulty: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/nmwgirgXLIg/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/nmwgirgXLIg',
        description: 'Corrida horizontal.',
        stepByStep: ['Prancha alta.', 'Puxe joelho ao peito.', 'Troque rápido.'],
        durationSeconds: 40, sets: 3,
        equipmentRequired: [Equipment.NONE]
    }
];

// --- 30 DAY PROGRAM LOGIC ---
const findEx = (idPartial: string): Exercise => {
    const ex = EXERCISE_DATABASE.find(e => e.id.includes(idPartial));
    return ex || EXERCISE_DATABASE[0];
}

const WEEK_1 = {
    DAY_1: [findEx('push_classic'), findEx('push_knee'), findEx('core_plank')],
    DAY_2: [findEx('legs_squat'), findEx('legs_lunge'), findEx('core_plank')],
    DAY_3: [findEx('pull_pullup'), findEx('pull_austr'), findEx('core_hollow')],
    DAY_4: [findEx('cardio_burpee'), findEx('cardio_climber')],
    DAY_5: [findEx('push_diamond'), findEx('legs_squat'), findEx('pull_pullup')], 
    DAY_6: [findEx('cardio_burpee'), findEx('legs_squat')], 
    DAY_7: [findEx('core_plank')] 
};

export const PROGRAMS: Program[] = [
    {
        id: 'prog_start_here',
        title: 'Calistenia do Zero',
        description: 'Domine seu peso corporal em 30 dias. Construa a base sólida.',
        level: ExperienceLevel.BEGINNER,
        durationWeeks: 4,
        image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff',
        days: Array.from({ length: 30 }, (_, i) => ({
            day: i + 1,
            title: `Dia ${i+1}`,
            focus: i % 2 === 0 ? 'Força' : 'Cardio/Core',
            description: 'Foco na técnica perfeita.',
            workout: [findEx('push_classic'), findEx('legs_squat'), findEx('core_plank')],
            completed: false
        }))
    },
    {
        id: 'prog_strength_mastery',
        title: 'Força Bruta',
        description: '8 semanas para desbloquear Muscle Ups e HSPU.',
        level: ExperienceLevel.ADVANCED,
        durationWeeks: 8,
        image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5',
        days: Array.from({ length: 56 }, (_, i) => ({
            day: i + 1,
            title: `Treino ${i+1}`,
            focus: 'Hipertrofia e Força',
            description: 'Volume alto e intensidade máxima.',
            workout: [findEx('push_hspu'), findEx('skill_muscle_up'), findEx('core_dragon')],
            completed: false
        }))
    },
    {
        id: 'prog_abs_shred',
        title: 'Abdômen de Aço',
        description: 'Protocolo de 4 semanas focado apenas no core.',
        level: ExperienceLevel.INTERMEDIATE,
        durationWeeks: 4,
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
        days: Array.from({ length: 28 }, (_, i) => ({
            day: i + 1,
            title: `Core ${i+1}`,
            focus: 'Definição Abdominal',
            description: 'Alta repetição e isometria.',
            workout: [findEx('core_dragon'), findEx('core_plank'), findEx('cardio_climber')],
            completed: false
        }))
    }
];

export const ACHIEVEMENTS_LIST: Achievement[] = [
    { id: 'first_blood', title: 'Primeiro Suor', description: 'Complete 1 treino.', icon: Medal, xpReward: 100 },
    { id: 'streak_5', title: 'Imparável', description: '5 dias seguidos.', icon: Flame, xpReward: 500 },
    { id: 'master_push', title: 'Peito de Aço', description: 'Acumule 1000 flexões.', icon: Shield, xpReward: 1000 },
    { id: 'skill_unlock', title: 'Nova Skill', description: 'Registre seu primeiro Muscle Up.', icon: Crown, xpReward: 2000 },
    { id: 'early_bird', title: 'Madrugador', description: 'Treino antes das 7am.', icon: Sunrise, xpReward: 200 },
    { id: 'sniper', title: 'Técnica Pura', description: 'Use o modo Câmera IA.', icon: Target, xpReward: 300 }
];

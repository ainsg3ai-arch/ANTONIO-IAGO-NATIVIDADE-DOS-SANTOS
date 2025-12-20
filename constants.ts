
import { Exercise, ExperienceLevel, MuscleGroup, ExerciseCategory, Program, Achievement, Equipment, Goal, StoreItem } from './types';
import { Medal, Flame, Zap, Target, Crown, Shield, Star } from 'lucide-react';

export const EXERCISE_DATABASE: Exercise[] = [
    // --- PUSH ---
    {
        id: 'push_knee_pushup',
        name: 'Flexão de Joelhos',
        category: ExerciseCategory.PUSH,
        muscleGroup: MuscleGroup.CHEST,
        musculosPrimarios: ['Peito'],
        difficultyScore: 1,
        difficultyLevel: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/jWc8gHl_oaE/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/jWc8gHl_oaE',
        description: 'Mantenha os joelhos no chão e o tronco reto.',
        stepByStep: ['Joelhos no chão', 'Mãos largura dos ombros', 'Desça o peito'],
        commonErrors: ['Quadril muito alto'],
        breathingTip: 'Expire ao subir.',
        progressions: ['Flexão Clássica'],
        reps: '12', sets: 3,
        equipmentRequired: [Equipment.NONE]
    },
    {
        id: 'push_classic',
        name: 'Flexão Clássica',
        category: ExerciseCategory.PUSH,
        muscleGroup: MuscleGroup.CHEST,
        musculosPrimarios: ['Peito', 'Tríceps'],
        difficultyScore: 2,
        difficultyLevel: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/IODxDxX7oi4/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/IODxDxX7oi4',
        description: 'Corpo reto como uma prancha.',
        stepByStep: ['Mãos sob os ombros', 'Corpo reto', 'Peito quase toca o chão'],
        commonErrors: ['Lombar caída'],
        breathingTip: 'Expire na subida.',
        reps: '15', sets: 4,
        equipmentRequired: [Equipment.NONE]
    },
    {
        id: 'push_diamond',
        name: 'Flexão Diamante',
        category: ExerciseCategory.PUSH,
        muscleGroup: MuscleGroup.ARMS,
        musculosPrimarios: ['Tríceps', 'Peito'],
        difficultyScore: 3,
        difficultyLevel: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/6dALZ-H_WPY/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/6dALZ-H_WPY',
        description: 'Mãos juntas formando um diamante.',
        stepByStep: ['Junte as mãos', 'Cotovelos fechados', 'Desça controladamente'],
        commonErrors: ['Cotovelos abertos demais'],
        breathingTip: 'Mantenha o core firme.',
        reps: '10', sets: 3,
        equipmentRequired: [Equipment.NONE]
    },

    // --- PULL ---
    {
        id: 'pull_australian',
        name: 'Remada Australiana',
        category: ExerciseCategory.PULL,
        muscleGroup: MuscleGroup.BACK,
        musculosPrimarios: ['Costas'],
        difficultyScore: 1,
        difficultyLevel: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/R0vU63614Fk/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/R0vU63614Fk',
        description: 'Use uma barra baixa ou mesa resistente.',
        stepByStep: ['Segure a barra', 'Puxe o peito até ela', 'Corpo reto'],
        commonErrors: ['Pescoço tenso'],
        breathingTip: 'Expire ao puxar.',
        reps: '12', sets: 3,
        equipmentRequired: [Equipment.BAR]
    },
    {
        id: 'pull_classic',
        name: 'Barra Fixa',
        category: ExerciseCategory.PULL,
        muscleGroup: MuscleGroup.BACK,
        musculosPrimarios: ['Costas', 'Bíceps'],
        difficultyScore: 3,
        difficultyLevel: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/eGo4IYlbE5g/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/eGo4IYlbE5g',
        description: 'O rei dos exercícios de costas.',
        stepByStep: ['Puxe até o queixo passar', 'Desça devagar', 'Não use impulso'],
        commonErrors: ['Balançar as pernas'],
        breathingTip: 'Solte o ar no topo.',
        reps: '8', sets: 4,
        equipmentRequired: [Equipment.BAR]
    },

    // --- LEGS ---
    {
        id: 'legs_squat',
        name: 'Agachamento',
        category: ExerciseCategory.LEGS,
        muscleGroup: MuscleGroup.LEGS,
        musculosPrimarios: ['Quadríceps'],
        difficultyScore: 1,
        difficultyLevel: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/R0vU63614Fk/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/R0vU63614Fk',
        description: 'Como sentar em uma cadeira invisível.',
        stepByStep: ['Pés largura dos ombros', 'Peso nos calcanhares', 'Coluna reta'],
        commonErrors: ['Joelhos para dentro'],
        breathingTip: 'Inspire ao descer.',
        reps: '20', sets: 3,
        equipmentRequired: [Equipment.NONE]
    },

    // --- CORE ---
    {
        id: 'core_plank',
        name: 'Prancha',
        category: ExerciseCategory.CORE,
        muscleGroup: MuscleGroup.ABS,
        musculosPrimarios: ['Abdômen'],
        difficultyScore: 1,
        difficultyLevel: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/LlVnN_E5_O8/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/LlVnN_E5_O8',
        description: 'Estabilidade total do core.',
        stepByStep: ['Apoie antebraços', 'Corpo reto', 'Contraia o abdômen'],
        commonErrors: ['Quadril caído'],
        breathingTip: 'Respire normalmente.',
        durationSeconds: 30, sets: 3,
        equipmentRequired: [Equipment.NONE]
    }
];

export const QUICK_ROUTINES = [
    { 
        id: 'rt_full_body', 
        name: 'Corpo Inteiro', 
        icon: Zap, 
        color: 'bg-blue-600', 
        exIds: ['legs_squat', 'push_classic', 'pull_australian', 'core_plank'],
        duration: '12 min',
        level: 'Iniciante'
    },
    { 
        id: 'rt_upper', 
        name: 'Superior Brutal', 
        icon: Flame, 
        color: 'bg-orange-600', 
        exIds: ['push_classic', 'pull_classic', 'push_diamond'],
        duration: '15 min',
        level: 'Intermediário'
    },
    { 
        id: 'rt_abs', 
        name: 'Abs de Aço', 
        icon: Target, 
        color: 'bg-purple-600', 
        exIds: ['core_plank', 'core_plank', 'core_plank'], // Exemplo
        duration: '8 min',
        level: 'Avançado'
    }
];

export const PROGRAMS: Program[] = [
    {
        id: 'prog_30_days_cali',
        title: 'Calistenia 30 Dias',
        description: 'Do iniciante ao mestre do peso corporal.',
        level: ExperienceLevel.BEGINNER,
        durationWeeks: 4,
        image: 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?q=80&w=1000',
        days: Array.from({ length: 30 }, (_, i) => ({
            day: i + 1,
            title: `Dia ${i+1}`,
            focus: i % 2 === 0 ? 'Superior' : 'Inferior + Core',
            description: 'Foco na execução perfeita.',
            workout: i % 2 === 0 ? [EXERCISE_DATABASE[1], EXERCISE_DATABASE[4]] : [EXERCISE_DATABASE[5], EXERCISE_DATABASE[6]],
            completed: false
        }))
    }
];

export const ACHIEVEMENTS_LIST: Achievement[] = [
    { id: 'first_blood', title: 'Batismo', description: 'Primeiro treino.', icon: Medal, xpReward: 100 },
    { id: 'streak_3', title: 'Foco', description: '3 dias seguidos.', icon: Zap, xpReward: 300 }
];

export const STORE_ITEMS: StoreItem[] = [
    { id: 'skin_neon', name: 'Cyber Neon', type: 'skin', cost: 1000, preview: '#00AFFF', description: 'Futurista.' },
    { id: 'skin_gold', name: 'Elite Ouro', type: 'skin', cost: 2500, preview: '#FFD700', description: 'Lendário.' }
];


import { Exercise, ExperienceLevel, MuscleGroup, ExerciseCategory, Program, Achievement, Post, StoreItem } from './types';
import { Medal, Flame, Zap, Sunrise, Award } from 'lucide-react';

// --- STORE ITEMS ---
export const STORE_ITEMS: StoreItem[] = [
    { id: 'skin_gold', name: 'Avatar Gold', type: 'skin', cost: 500, preview: '#FFD700', description: 'Status de elite.' },
    { id: 'skin_neon', name: 'Cyber Neon', type: 'skin', cost: 300, preview: '#00F2EA', description: 'Estilo noturno.' },
    { id: 'skin_stealth', name: 'Stealth Black', type: 'skin', cost: 200, preview: '#1a1a1a', description: 'Discreto e letal.' },
    { id: 'skin_fire', name: 'Magma', type: 'skin', cost: 150, preview: '#ef4444', description: 'Intensidade máxima.' }
];

// --- EXERCISE DATABASE (CALISTHENICS ONLY) ---
export const EXERCISE_DATABASE: Exercise[] = [
    // 1. PEITO (PUSH)
    {
        id: 'push_1',
        name: 'Flexão Tradicional',
        category: ExerciseCategory.PUSH,
        muscleGroup: MuscleGroup.CHEST,
        musculosPrimarios: ['Peitoral Maior', 'Tríceps', 'Ombro Anterior'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/IODxDxX7oi4/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
        description: 'O exercício fundamental para força de empurrar.',
        stepByStep: [
            'Mãos alinhadas aos ombros.',
            'Corpo reto da cabeça aos pés (prancha).',
            'Desça até formar 90º nos cotovelos.',
            'Suba estendendo os braços completamente.'
        ],
        commonErrors: ['Quadril muito baixo ou alto', 'Cotovelos muito abertos'],
        breathingTip: 'Inspire ao descer, expire ao subir.',
        variations: {
            easier: ['Flexão com Joelhos', 'Flexão na Parede', 'Flexão Inclinada (mãos em banco)'],
            harder: ['Flexão Diamante', 'Flexão Arqueiro', 'Flexão Explosiva']
        },
        reps: '10-15',
        sets: 3,
        caloriesPerMinute: 8
    },
    {
        id: 'push_2',
        name: 'Flexão Aberta',
        category: ExerciseCategory.PUSH,
        muscleGroup: MuscleGroup.CHEST,
        musculosPrimarios: ['Peitoral Externo', 'Ombros'],
        difficulty: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/qQ1tD8j6i5g/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=qQ1tD8j6i5g',
        description: 'Variação para focar na parte externa do peitoral.',
        stepByStep: [
            'Mãos mais afastadas que a largura dos ombros.',
            'Desça mantendo os cotovelos apontando para fora.',
            'Suba contraindo o peitoral.'
        ],
        variations: {
            easier: ['Flexão Aberta com Joelhos'],
            harder: ['Flexão Arqueiro']
        },
        reps: '10-12',
        sets: 3,
        caloriesPerMinute: 8
    },
    {
        id: 'push_3',
        name: 'Flexão Diamante',
        category: ExerciseCategory.PUSH,
        muscleGroup: MuscleGroup.ARMS,
        musculosPrimarios: ['Tríceps', 'Peitoral Interno'],
        difficulty: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/J0DnG1_S92I/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=J0DnG1_S92I',
        description: 'Foco intenso no tríceps e parte interna do peito.',
        stepByStep: [
            'Junte as mãos formando um diamante com indicadores e polegares.',
            'Mantenha cotovelos próximos ao corpo.',
            'Desça até o peito tocar as mãos.'
        ],
        variations: {
            easier: ['Flexão Fechada', 'Flexão Diamante com Joelhos'],
            harder: ['Flexão Diamante Pés Elevados', 'Sphinx Push Up']
        },
        reps: '8-12',
        sets: 3,
        caloriesPerMinute: 9
    },
    {
        id: 'push_4',
        name: 'Flexão Declinada',
        category: ExerciseCategory.PUSH,
        muscleGroup: MuscleGroup.CHEST,
        musculosPrimarios: ['Peitoral Superior', 'Ombros'],
        difficulty: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/SKPab2YC8BE/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=SKPab2YC8BE',
        description: 'Pés elevados para atingir a parte superior do peito.',
        stepByStep: [
            'Coloque os pés em um banco ou cadeira.',
            'Mãos no chão na largura dos ombros.',
            'Desça controladamente até o rosto aproximar do chão.'
        ],
        reps: '10-12',
        sets: 3,
        caloriesPerMinute: 9
    },
    {
        id: 'push_5',
        name: 'Pike Push-Up',
        category: ExerciseCategory.PUSH,
        muscleGroup: MuscleGroup.SHOULDERS,
        musculosPrimarios: ['Ombros', 'Trapézio', 'Tríceps'],
        difficulty: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/sposDXWEB0A/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=sposDXWEB0A',
        description: 'Simula o desenvolvimento de ombros com peso corporal.',
        stepByStep: [
            'Fique em posição de V invertido (quadril alto).',
            'Desça a cabeça em direção ao chão entre as mãos.',
            'Empurre o chão afastando os ombros.'
        ],
        variations: {
            easier: ['Pike com Joelhos em Banco'],
            harder: ['Pike com Pés Elevados', 'Handstand Push Up (HSPU)']
        },
        reps: '8-12',
        sets: 3,
        caloriesPerMinute: 8
    },

    // 2. COSTAS (PULL)
    {
        id: 'pull_1',
        name: 'Remada Australiana',
        category: ExerciseCategory.PULL,
        muscleGroup: MuscleGroup.BACK,
        musculosPrimarios: ['Dorsal', 'Bíceps', 'Trapézio'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/rloXYB8M3vU/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=rloXYB8M3vU',
        description: 'Excelente para iniciar o treino de costas sem barra alta.',
        stepByStep: [
            'Deite-se sob uma barra baixa ou mesa robusta.',
            'Segure na borda e mantenha o corpo reto.',
            'Puxe o peito até a barra/mesa.'
        ],
        variations: {
            easier: ['Remada na Porta (com toalha)'],
            harder: ['Remada Australiana Unilateral', 'Pull Up (Barra Fixa)']
        },
        reps: '10-12',
        sets: 3,
        caloriesPerMinute: 7
    },
    {
        id: 'pull_2',
        name: 'Super-Homem',
        category: ExerciseCategory.PULL,
        muscleGroup: MuscleGroup.BACK,
        musculosPrimarios: ['Lombar', 'Glúteos', 'Dorsal'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/z6PJMT2y8GQ/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=z6PJMT2y8GQ',
        description: 'Fortalecimento essencial da cadeia posterior.',
        stepByStep: [
            'Deite de bruços no chão.',
            'Eleve braços e pernas simultaneamente.',
            'Segure no topo por 2 segundos e desça.'
        ],
        reps: '15',
        sets: 3,
        caloriesPerMinute: 5
    },
    {
        id: 'pull_3',
        name: 'Nadador (Swimmer)',
        category: ExerciseCategory.PULL,
        muscleGroup: MuscleGroup.BACK,
        musculosPrimarios: ['Dorsal', 'Lombar', 'Ombros'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/M7W1Jqf8f1I/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=M7W1Jqf8f1I',
        description: 'Coordenação e fortalecimento lombar.',
        stepByStep: [
            'Deitado de bruços, alterne braço direito com perna esquerda no ar.',
            'Mantenha o movimento controlado como se estivesse nadando.'
        ],
        reps: '20 total',
        sets: 3,
        caloriesPerMinute: 6
    },

    // 3. PERNAS (LEGS)
    {
        id: 'legs_1',
        name: 'Agachamento Livre',
        category: ExerciseCategory.LEGS,
        muscleGroup: MuscleGroup.LEGS,
        musculosPrimarios: ['Quadríceps', 'Glúteos'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/aclHkVaku9U/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U',
        description: 'O rei dos exercícios para pernas.',
        stepByStep: [
            'Pés na largura dos ombros.',
            'Desça jogando o quadril para trás, mantendo peito estufado.',
            'Quebre a paralela (90º) se possível.',
            'Suba empurrando o chão com o calcanhar.'
        ],
        variations: {
            easier: ['Agachamento na Cadeira (Sentar e Levantar)', 'Meio Agachamento'],
            harder: ['Agachamento com Salto', 'Pistol Squat (Unilateral)', 'Agachamento Búlgaro']
        },
        reps: '15-20',
        sets: 4,
        caloriesPerMinute: 8
    },
    {
        id: 'legs_2',
        name: 'Agachamento Sumô',
        category: ExerciseCategory.LEGS,
        muscleGroup: MuscleGroup.LEGS,
        musculosPrimarios: ['Adutores', 'Glúteos', 'Quadríceps'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/9Zu2zh10f7E/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=9Zu2zh10f7E',
        description: 'Foco na parte interna da coxa e glúteos.',
        stepByStep: [
            'Pés bem afastados, pontas para fora.',
            'Mantenha o tronco o mais vertical possível.',
            'Desça profundo e suba apertando os glúteos.'
        ],
        reps: '15',
        sets: 3,
        caloriesPerMinute: 8
    },
    {
        id: 'legs_3',
        name: 'Afundo (Lunge)',
        category: ExerciseCategory.LEGS,
        muscleGroup: MuscleGroup.LEGS,
        musculosPrimarios: ['Quadríceps', 'Glúteos'],
        difficulty: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/QOVaHwm-Q6U/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
        description: 'Unilateral para corrigir assimetrias.',
        stepByStep: [
            'Dê um passo largo à frente.',
            'Desça até o joelho de trás quase tocar o chão.',
            'Mantenha o tronco reto.'
        ],
        variations: {
            easier: ['Afundo Estático (sem passada)', 'Afundo com Apoio'],
            harder: ['Afundo com Salto (Jumping Lunge)', 'Afundo Búlgaro']
        },
        reps: '12 cada perna',
        sets: 3,
        caloriesPerMinute: 9
    },
    {
        id: 'legs_4',
        name: 'Elevação de Quadril',
        category: ExerciseCategory.LEGS,
        muscleGroup: MuscleGroup.GLUTES,
        musculosPrimarios: ['Glúteo Máximo', 'Posterior de Coxa'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/8bbE64NuDTU/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=8bbE64NuDTU',
        description: 'Isolamento de glúteos.',
        stepByStep: [
            'Deite de barriga para cima, joelhos dobrados.',
            'Empurre o chão com os calcanhares elevando o quadril.',
            'Contraia forte o glúteo no topo por 1 segundo.'
        ],
        variations: {
            easier: ['Ponte curta'],
            harder: ['Elevação Unilateral', 'Elevação com Pés Elevados']
        },
        reps: '20',
        sets: 3,
        caloriesPerMinute: 6
    },

    // 4. CORE & ABDÔMEN
    {
        id: 'core_1',
        name: 'Prancha Abdominal',
        category: ExerciseCategory.CORE,
        muscleGroup: MuscleGroup.ABS,
        musculosPrimarios: ['Transverso', 'Reto Abdominal'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/ASdvN_XEl_c/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
        description: 'Estabilidade total do corpo.',
        stepByStep: [
            'Apoie antebraços e ponta dos pés.',
            'Mantenha o corpo em linha reta.',
            'Contraia abdômen e glúteos para não arquear as costas.'
        ],
        variations: {
            easier: ['Prancha com Joelhos', 'Prancha Alta (braços estendidos)'],
            harder: ['Prancha Superman (braço/perna oposta)', 'Body Saw Plank']
        },
        durationSeconds: 45,
        sets: 3,
        caloriesPerMinute: 5
    },
    {
        id: 'core_2',
        name: 'Abdominal Bicicleta',
        category: ExerciseCategory.CORE,
        muscleGroup: MuscleGroup.ABS,
        musculosPrimarios: ['Oblíquos', 'Reto Abdominal'],
        difficulty: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/IwyvZENrusw/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=IwyvZENrusw',
        description: 'Um dos melhores para definir o abdômen.',
        stepByStep: [
            'Mãos na cabeça, pernas fora do chão.',
            'Leve o cotovelo direito ao joelho esquerdo e vice-versa.',
            'Movimento controlado, sem puxar o pescoço.'
        ],
        reps: '20 pares',
        sets: 3,
        caloriesPerMinute: 7
    },
    {
        id: 'core_3',
        name: 'Abdominal Infra',
        category: ExerciseCategory.CORE,
        muscleGroup: MuscleGroup.ABS,
        musculosPrimarios: ['Abdômen Inferior'],
        difficulty: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/Wp4BlxcFTkE/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=Wp4BlxcFTkE',
        description: 'Foco na "pochete" (parte inferior).',
        stepByStep: [
            'Deitado, mãos sob o glúteo para apoio.',
            'Pernas esticadas, eleve até 90 graus.',
            'Desça devagar sem tocar o chão.'
        ],
        variations: {
            easier: ['Infra com Joelhos Flexionados'],
            harder: ['Dragon Flag Negativa', 'Hanging Leg Raise (Barra)']
        },
        reps: '15',
        sets: 3,
        caloriesPerMinute: 6
    },

    // 5. CARDIO / HIIT
    {
        id: 'cardio_1',
        name: 'Polichinelo',
        category: ExerciseCategory.CARDIO,
        muscleGroup: MuscleGroup.CARDIO,
        musculosPrimarios: ['Corpo Inteiro', 'Panturrilha'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/c4DAnQ6DtF8/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
        description: 'Aquecimento e queima de calorias.',
        stepByStep: [
            'Salte abrindo pernas e braços acima da cabeça.',
            'Salte fechando pernas e braços ao lado do corpo.',
            'Mantenha um ritmo constante.'
        ],
        durationSeconds: 45,
        sets: 3,
        caloriesPerMinute: 10
    },
    {
        id: 'cardio_2',
        name: 'Burpee',
        category: ExerciseCategory.CARDIO,
        muscleGroup: MuscleGroup.FULL_BODY,
        musculosPrimarios: ['Corpo Inteiro'],
        difficulty: ExperienceLevel.ADVANCED,
        videoPlaceholder: 'https://img.youtube.com/vi/TU8QYVW0gDU/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=TU8QYVW0gDU',
        description: 'O exercício mais completo para queima de gordura.',
        stepByStep: [
            'Agache e coloque mãos no chão.',
            'Jogue os pés para trás (prancha).',
            'Faça uma flexão (opcional).',
            'Puxe os pés de volta e salte.'
        ],
        variations: {
            easier: ['Sprawl (Burpee sem flexão e sem salto)', 'Burpee na Cadeira'],
            harder: ['Burpee com Salto Duplo', 'Navy Seal Burpee']
        },
        reps: '10',
        sets: 3,
        caloriesPerMinute: 14
    },
    {
        id: 'cardio_3',
        name: 'Mountain Climber',
        category: ExerciseCategory.CARDIO,
        muscleGroup: MuscleGroup.ABS,
        musculosPrimarios: ['Abdômen', 'Ombros', 'Cardio'],
        difficulty: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/nmwgirgXLIg/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=nmwgirgXLIg',
        description: 'Corrida na posição de prancha.',
        stepByStep: [
            'Posição de prancha alta.',
            'Traga um joelho em direção ao peito.',
            'Troque as pernas rapidamente, como se estivesse correndo.'
        ],
        durationSeconds: 30,
        sets: 3,
        caloriesPerMinute: 11
    },

    // 6. MOBILIDADE
    {
        id: 'mob_1',
        name: 'Mobilidade de Quadril',
        category: ExerciseCategory.MOBILITY,
        muscleGroup: MuscleGroup.LEGS,
        musculosPrimarios: ['Flexores de Quadril'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/UjG19rR0aO0/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=UjG19rR0aO0',
        description: 'Essencial para liberar tensão de quem fica muito sentado.',
        stepByStep: [
            'Posição de afundo, joelho de trás no chão.',
            'Empurre o quadril para frente.',
            'Mantenha o tronco reto.'
        ],
        durationSeconds: 60,
        sets: 2,
        caloriesPerMinute: 3
    }
];

// --- 30 DAY PROGRAM LOGIC ---
// Helper to find exercise by ID (or name approximation for flexibility)
const findEx = (namePartial: string): Exercise => {
    const ex = EXERCISE_DATABASE.find(e => e.name.toLowerCase().includes(namePartial.toLowerCase()));
    if (!ex) return EXERCISE_DATABASE[0]; // Fallback
    return ex;
}

const WEEK_1_WORKOUTS = {
    DAY_1: [findEx('Flexão Tradicional'), findEx('Flexão Aberta'), findEx('Pike'), findEx('Flexão Declinada')],
    DAY_2: [findEx('Agachamento Livre'), findEx('Afundo'), findEx('Sumô'), findEx('Elevação de Quadril')],
    DAY_3: [findEx('Prancha'), findEx('Infra'), findEx('Bicicleta'), findEx('Mountain')],
    DAY_4: [findEx('Australiana'), findEx('Super-Homem'), findEx('Nadador')],
    DAY_5: [findEx('Burpee'), findEx('Flexão Tradicional'), findEx('Agachamento Livre'), findEx('Prancha')], // Full Body
    DAY_6: [findEx('Polichinelo'), findEx('Mountain'), findEx('Infra')], // HIIT
    DAY_7: [findEx('Mobilidade')] // Recovery
};

export const PROGRAM_30_DAYS: Program = {
    id: 'prog_30_toning',
    title: 'Tonificação Total 30 Dias',
    description: 'Transforme seu corpo usando apenas o peso corporal. Progressão inteligente de intensidade.',
    durationWeeks: 4,
    days: Array.from({ length: 30 }, (_, i) => {
        const dayNum = i + 1;
        const cycleDay = (dayNum - 1) % 7; // 0 = Seg, 1 = Ter...
        
        let title = '';
        let focus = '';
        let workout: Exercise[] = [];

        // Week 1 & 2 (Standard) | Week 3 & 4 (Increased Intensity logic applied in WorkoutPlayer via sets/reps scaling)
        switch(cycleDay) {
            case 0: // Seg
                title = 'Peito & Ombros'; focus = 'Push'; workout = WEEK_1_WORKOUTS.DAY_1; break;
            case 1: // Ter
                title = 'Pernas & Glúteos'; focus = 'Legs'; workout = WEEK_1_WORKOUTS.DAY_2; break;
            case 2: // Qua
                title = 'Core Blindado'; focus = 'Abs'; workout = WEEK_1_WORKOUTS.DAY_3; break;
            case 3: // Qui
                title = 'Costas & Postura'; focus = 'Pull'; workout = WEEK_1_WORKOUTS.DAY_4; break;
            case 4: // Sex
                title = 'Full Body Burn'; focus = 'Total'; workout = WEEK_1_WORKOUTS.DAY_5; break;
            case 5: // Sab
                title = 'HIIT Cardio'; focus = 'Sweat'; workout = WEEK_1_WORKOUTS.DAY_6; break;
            case 6: // Dom
                title = 'Mobilidade & Zen'; focus = 'Recovery'; workout = WEEK_1_WORKOUTS.DAY_7; break;
        }

        return {
            day: dayNum,
            title,
            focus,
            description: `Dia ${dayNum} do seu desafio. Foco em ${focus}.`,
            workout: workout.map(ex => ({...ex})), // Clone exercises
            completed: false
        };
    })
};

export const COMMUNITY_SEED_POSTS: Post[] = [
    {
        id: 'p1',
        author: 'Treinador AINS',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        content: 'Dia 15 do desafio! Quem mais está sentindo a diferença na disposição? 🔥',
        likes: 124,
        timestamp: Date.now() - 3600000,
        isLikedByMe: false
    },
    {
        id: 'p2',
        author: 'Julia Fit',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julia',
        content: 'Consegui fazer minha primeira flexão estrita hoje! O progresso é real.',
        likes: 89,
        timestamp: Date.now() - 7200000,
        isLikedByMe: false
    }
];

export const ACHIEVEMENTS_LIST: Achievement[] = [
    { id: 'first_step', title: 'Primeiro Passo', description: 'Complete seu primeiro treino.', icon: Medal },
    { id: 'week_warrior', title: 'Guerreiro Semanal', description: 'Complete 7 dias seguidos.', icon: Flame },
    { id: 'early_bird', title: 'Madrugador', description: 'Treino antes das 8am.', icon: Sunrise },
    { id: 'program_finisher', title: 'Lenda', description: 'Complete o programa de 30 dias.', icon: Award }
];

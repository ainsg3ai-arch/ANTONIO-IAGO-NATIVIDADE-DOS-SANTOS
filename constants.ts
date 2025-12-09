
import { Exercise, ExperienceLevel, MuscleGroup, ExerciseCategory, Program, Achievement, Post, StoreItem } from './types';
import { Medal, Flame, Zap, Sunrise, Award } from 'lucide-react';

// --- STORE ITEMS ---
export const STORE_ITEMS: StoreItem[] = [
    { id: 'skin_gold', name: 'Avatar Gold', type: 'skin', cost: 500, preview: '#FFD700', description: 'Status de elite.' },
    { id: 'skin_neon', name: 'Cyber Neon', type: 'skin', cost: 300, preview: '#00F2EA', description: 'Estilo noturno.' },
    { id: 'skin_stealth', name: 'Stealth Black', type: 'skin', cost: 200, preview: '#1a1a1a', description: 'Discreto e letal.' },
    { id: 'skin_fire', name: 'Magma', type: 'skin', cost: 150, preview: '#ef4444', description: 'Intensidade máxima.' }
];

// --- EXERCISE DATABASE (CALISTHENICS & BODYWEIGHT FOCUSED) ---
// Note: Using YouTube Shorts IDs for vertical video experience simulation where possible.

export const EXERCISE_DATABASE: Exercise[] = [
    // 1. EMPURRAR (PUSH) - PEITO, OMBROS, TRÍCEPS
    {
        id: 'push_classic',
        name: 'Flexão Clássica',
        category: ExerciseCategory.PUSH,
        muscleGroup: MuscleGroup.CHEST,
        musculosPrimarios: ['Peitoral Maior', 'Tríceps', 'Deltóide Anterior'],
        musculosSecundarios: ['Core', 'Serrátil'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/IODxDxX7oi4/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/IODxDxX7oi4', // Exemplo Short
        description: 'O exercício fundamental da calistenia.',
        stepByStep: [
            'Mãos alinhadas aos ombros, corpo em prancha.',
            'Cotovelos a 45º do tronco (não abra demais).',
            'Desça até o peito quase tocar o chão.',
            'Empurre o chão com explosão até estender os braços.'
        ],
        commonErrors: ['Quadril caído (banana)', 'Cotovelos muito abertos (lesão ombro)', 'Pescoço caído'],
        breathingTip: 'Inspire descendo, expire empurrando.',
        variations: {
            easier: ['Flexão com Joelhos', 'Flexão na Parede'],
            harder: ['Flexão Explosiva', 'Flexão com Peso']
        },
        reps: '10-15',
        sets: 3,
        caloriesPerMinute: 8
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
        stepByStep: [
            'Junte indicadores e polegares formando um losango.',
            'Posicione as mãos abaixo do esterno (peito).',
            'Desça controladamente mantendo cotovelos colados ao corpo.'
        ],
        commonErrors: ['Mãos muito acima (rosto)', 'Abrir cotovelos'],
        reps: '8-12',
        sets: 3,
        caloriesPerMinute: 9
    },
    {
        id: 'push_pike',
        name: 'Pike Push-Up',
        category: ExerciseCategory.PUSH,
        muscleGroup: MuscleGroup.SHOULDERS,
        musculosPrimarios: ['Deltóides', 'Trapézio Superior', 'Tríceps'],
        difficulty: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/sposDXWEB0A/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/sposDXWEB0A',
        description: 'O melhor substituto para desenvolvimento de ombros.',
        stepByStep: [
            'Posição de V invertido, quadril o mais alto possível.',
            'Olhe para seus pés.',
            'Desça a cabeça em direção ao chão (triângulo com as mãos).',
            'Empurre o chão afastando as escápulas.'
        ],
        commonErrors: ['Cotovelos para fora', 'Costas arredondadas'],
        variations: {
            easier: ['Pike com Joelhos em banco'],
            harder: ['Pés elevados (Box Pike)', 'HSPU Assistido']
        },
        reps: '8-10',
        sets: 3,
        caloriesPerMinute: 10
    },
    {
        id: 'push_dips_bench',
        name: 'Mergulho no Banco',
        category: ExerciseCategory.PUSH,
        muscleGroup: MuscleGroup.ARMS,
        musculosPrimarios: ['Tríceps', 'Ombro Anterior'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/0326dy_-CzM/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/0326dy_-CzM',
        description: 'Isolador de tríceps usando cadeira ou banco.',
        stepByStep: [
            'Mãos na borda do banco, dedos para frente.',
            'Estenda as pernas (ou dobre para facilitar).',
            'Desça o quadril próximo ao banco até 90º nos cotovelos.'
        ],
        commonErrors: ['Afastar as costas do banco', 'Descer demais (dor no ombro)'],
        reps: '12-15',
        sets: 3,
        caloriesPerMinute: 7
    },

    // 2. PUXAR (PULL) - COSTAS, BÍCEPS
    {
        id: 'pull_australian',
        name: 'Remada Australiana',
        category: ExerciseCategory.PULL,
        muscleGroup: MuscleGroup.BACK,
        musculosPrimarios: ['Latíssimo do Dorso', 'Bíceps', 'Trapézio Médio'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/OqM7FjJb_k0/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/OqM7FjJb_k0',
        description: 'Exercício de tração horizontal fundamental.',
        stepByStep: [
            'Use uma barra baixa, mesa robusta ou argolas.',
            'Corpo reto, calcanhares no chão.',
            'Puxe o peito até a barra contraindo as escápulas.',
            'Retorne controlando o movimento.'
        ],
        commonErrors: ['Impulso com quadril', 'Não completar a amplitude'],
        variations: {
            easier: ['Joelhos dobrados'],
            harder: ['Pés elevados', 'Unilateral']
        },
        reps: '10-12',
        sets: 3,
        caloriesPerMinute: 8
    },
    {
        id: 'pull_superman',
        name: 'Super-Homem',
        category: ExerciseCategory.PULL,
        muscleGroup: MuscleGroup.BACK,
        musculosPrimarios: ['Eretores da Espinha', 'Glúteos', 'Deltóide Posterior'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/z6PJMT2y8GQ/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/z6PJMT2y8GQ',
        description: 'Fortalecimento da cadeia posterior e lombar.',
        stepByStep: [
            'Deite de bruços.',
            'Eleve braços e pernas simultaneamente do chão.',
            'Segure 2 segundos no topo contraindo tudo.',
            'Desça devagar.'
        ],
        reps: '15',
        sets: 3,
        caloriesPerMinute: 5
    },
    {
        id: 'pull_door',
        name: 'Remada na Porta',
        category: ExerciseCategory.PULL,
        muscleGroup: MuscleGroup.BACK,
        musculosPrimarios: ['Costas', 'Bíceps'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/rloXYB8M3vU/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=rloXYB8M3vU',
        description: 'Sem barra? Use o batente da porta.',
        stepByStep: [
            'Segure no batente da porta ou use uma toalha na maçaneta.',
            'Incline o corpo para trás.',
            'Puxe o corpo usando as costas.'
        ],
        reps: '12-15',
        sets: 3,
        caloriesPerMinute: 6
    },

    // 3. PERNAS (LEGS)
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
        stepByStep: [
            'Pés na largura dos ombros, pontas levemente para fora.',
            'Inicie jogando o quadril para trás e para baixo.',
            'Mantenha o peito estufado e calcanhares no chão.',
            'Quebre a paralela (joelho 90º) se tiver mobilidade.'
        ],
        commonErrors: ['Tirar calcanhar do chão', 'Joelhos entrarem (valgo)', 'Arredondar coluna'],
        variations: {
            easier: ['Box Squat (sentar e levantar)'],
            harder: ['Jump Squat', 'Pistol Squat']
        },
        reps: '20',
        sets: 4,
        caloriesPerMinute: 9
    },
    {
        id: 'legs_lunge',
        name: 'Afundo Alternado',
        category: ExerciseCategory.LEGS,
        muscleGroup: MuscleGroup.LEGS,
        musculosPrimarios: ['Quadríceps', 'Glúteos'],
        difficulty: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/3D4N36X8iWw/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/3D4N36X8iWw',
        description: 'Constrói equilíbrio e força unilateral.',
        stepByStep: [
            'Dê um passo largo à frente.',
            'Desça o joelho de trás até quase tocar o chão.',
            'Ambos joelhos devem formar 90º.',
            'Empurre o chão com o pé da frente para voltar.'
        ],
        reps: '12 cada',
        sets: 3,
        caloriesPerMinute: 9
    },
    {
        id: 'legs_bulgarian',
        name: 'Agachamento Búlgaro',
        category: ExerciseCategory.LEGS,
        muscleGroup: MuscleGroup.LEGS,
        musculosPrimarios: ['Glúteos', 'Quadríceps'],
        difficulty: ExperienceLevel.ADVANCED,
        videoPlaceholder: 'https://img.youtube.com/vi/2C-uNgKWple/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/2C-uNgKWple', // Placeholder
        description: 'O exercício mais odiado (e efetivo) para pernas.',
        stepByStep: [
            'Apoie o peito do pé de trás em um banco ou sofá.',
            'Afaste a perna da frente.',
            'Desça verticalmente até o joelho de trás quase tocar o chão.',
            'Mantenha o tronco levemente inclinado para frente para focar glúteo.'
        ],
        commonErrors: ['Pé muito próximo do banco', 'Desequilíbrio lateral'],
        reps: '8-10 cada',
        sets: 3,
        caloriesPerMinute: 11
    },
    {
        id: 'legs_calf',
        name: 'Panturrilha Unilateral',
        category: ExerciseCategory.LEGS,
        muscleGroup: MuscleGroup.CALVES,
        musculosPrimarios: ['Gastrocnêmio', 'Sóleo'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/c6a65576w/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=gwLzBJYoWlI',
        description: 'Pode ser feito em qualquer degrau.',
        stepByStep: [
            'Apoie a ponta de um pé em um degrau.',
            'Cruze a outra perna atrás.',
            'Desça o calcanhar o máximo possível (alongue).',
            'Suba tudo com explosão e segure 1s.'
        ],
        reps: '15-20',
        sets: 4,
        caloriesPerMinute: 5
    },

    // 4. CORE (ABS)
    {
        id: 'core_plank',
        name: 'Prancha Abdominal',
        category: ExerciseCategory.CORE,
        muscleGroup: MuscleGroup.ABS,
        musculosPrimarios: ['Transverso', 'Reto Abdominal'],
        difficulty: ExperienceLevel.BEGINNER,
        videoPlaceholder: 'https://img.youtube.com/vi/ASdvN_XEl_c/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/ASdvN_XEl_c',
        description: 'Estabilidade total.',
        stepByStep: [
            'Cotovelos sob os ombros.',
            'Contraia glúteos e abdômen fortemente.',
            'Não deixe a lombar arquear para baixo.',
            'Respire curto e controlado.'
        ],
        durationSeconds: 45,
        sets: 3,
        caloriesPerMinute: 6
    },
    {
        id: 'core_hollow',
        name: 'Hollow Body Hold',
        category: ExerciseCategory.CORE,
        muscleGroup: MuscleGroup.ABS,
        musculosPrimarios: ['Core Total'],
        difficulty: ExperienceLevel.ADVANCED,
        videoPlaceholder: 'https://img.youtube.com/vi/LlDNef_Zwd4/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/LlDNef_Zwd4',
        description: 'A posição fundamental da ginástica olímpica.',
        stepByStep: [
            'Deite de costas e pressione a lombar contra o chão (muito importante).',
            'Tire pernas e escápulas do chão.',
            'Estenda os braços atrás da cabeça.',
            'O corpo deve formar uma "canoa".'
        ],
        commonErrors: ['Lombar saindo do chão (Gap)'],
        durationSeconds: 30,
        sets: 3,
        caloriesPerMinute: 7
    },
    {
        id: 'core_bicycle',
        name: 'Abdominal Bicicleta',
        category: ExerciseCategory.CORE,
        muscleGroup: MuscleGroup.ABS,
        musculosPrimarios: ['Oblíquos', 'Reto Abdominal'],
        difficulty: ExperienceLevel.INTERMEDIATE,
        videoPlaceholder: 'https://img.youtube.com/vi/IwyvZENrusw/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/IwyvZENrusw',
        description: 'Dinâmico e eficaz para definição.',
        stepByStep: [
            'Mãos na têmpora (não puxe o pescoço).',
            'Leve o cotovelo direito ao joelho esquerdo estendendo a outra perna.',
            'Alterne com controle, girando o tronco.'
        ],
        reps: '20 pares',
        sets: 3,
        caloriesPerMinute: 8
    },

    // 5. CARDIO / HIIT
    {
        id: 'cardio_burpee',
        name: 'Burpee Completo',
        category: ExerciseCategory.CARDIO,
        muscleGroup: MuscleGroup.FULL_BODY,
        musculosPrimarios: ['Coração', 'Pernas', 'Peito', 'Ombros'],
        difficulty: ExperienceLevel.ADVANCED,
        videoPlaceholder: 'https://img.youtube.com/vi/TU8QYVW0gDU/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/shorts/TU8QYVW0gDU',
        description: 'O queimador de gordura definitivo.',
        stepByStep: [
            'Agache e coloque as mãos no chão.',
            'Jogue os pés para trás e faça uma flexão (peito no chão).',
            'Volte os pés para a posição de agachamento.',
            'Salte batendo as mãos acima da cabeça.'
        ],
        variations: {
            easier: ['Sprawl (sem flexão e sem salto)'],
            harder: ['Navy Seal Burpee']
        },
        reps: '12',
        sets: 4,
        caloriesPerMinute: 15
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
        stepByStep: [
            'Posição de prancha alta.',
            'Puxe um joelho em direção ao peito explosivamente.',
            'Troque as pernas no ar.',
            'Mantenha o quadril baixo.'
        ],
        durationSeconds: 40,
        sets: 3,
        caloriesPerMinute: 12
    }
];

// --- 30 DAY PROGRAM LOGIC (UPDATED) ---
const findEx = (idPartial: string): Exercise => {
    const ex = EXERCISE_DATABASE.find(e => e.id.includes(idPartial));
    return ex || EXERCISE_DATABASE[0];
}

const WEEK_1 = {
    DAY_1: [findEx('push_classic'), findEx('push_dips'), findEx('push_pike'), findEx('core_plank')],
    DAY_2: [findEx('legs_squat'), findEx('legs_lunge'), findEx('legs_calf'), findEx('core_bicycle')],
    DAY_3: [findEx('pull_australian'), findEx('pull_superman'), findEx('pull_door'), findEx('core_hollow')],
    DAY_4: [findEx('cardio_burpee'), findEx('cardio_climber'), findEx('core_plank')],
    DAY_5: [findEx('push_diamond'), findEx('legs_bulgarian'), findEx('pull_australian'), findEx('core_hollow')], // Full Body
    DAY_6: [findEx('cardio_burpee'), findEx('legs_squat'), findEx('push_classic')], // Metcon
    DAY_7: [findEx('pull_superman')] // Active Recovery (Generic placeholder)
};

export const PROGRAM_30_DAYS: Program = {
    id: 'prog_calisthenics_zero',
    title: 'Calistenia do Zero',
    description: 'Domine seu peso corporal. Construa força real e definição sem equipamentos em 30 dias.',
    durationWeeks: 4,
    days: Array.from({ length: 30 }, (_, i) => {
        const dayNum = i + 1;
        const cycleDay = (dayNum - 1) % 7; 
        
        let title = '';
        let focus = '';
        let workout: Exercise[] = [];

        switch(cycleDay) {
            case 0: title = 'Empurrar (Push)'; focus = 'Peito & Tríceps'; workout = WEEK_1.DAY_1; break;
            case 1: title = 'Pernas (Legs)'; focus = 'Inferiores'; workout = WEEK_1.DAY_2; break;
            case 2: title = 'Puxar (Pull)'; focus = 'Costas & Bíceps'; workout = WEEK_1.DAY_3; break;
            case 3: title = 'Cardio & Core'; focus = 'Queima de Gordura'; workout = WEEK_1.DAY_4; break;
            case 4: title = 'Full Body Control'; focus = 'Corpo Total'; workout = WEEK_1.DAY_5; break;
            case 5: title = 'Desafio HIIT'; focus = 'Resistência'; workout = WEEK_1.DAY_6; break;
            case 6: title = 'Mobilidade'; focus = 'Recuperação'; workout = WEEK_1.DAY_7; break;
        }

        return {
            day: dayNum,
            title,
            focus,
            description: `Dia ${dayNum} - Foco: ${focus}`,
            workout: workout.map(ex => ({...ex})), 
            completed: false
        };
    })
};

export const COMMUNITY_SEED_POSTS: Post[] = [
    {
        id: 'p1',
        author: 'Treinador AINS',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        content: 'Lembre-se: na calistenia, a técnica vem antes das repetições. Controle o movimento! 🔥',
        likes: 124,
        timestamp: Date.now() - 3600000,
        isLikedByMe: false
    },
    {
        id: 'p2',
        author: 'Ana Calistenia',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julia',
        content: 'Finalmente consegui minha primeira flexão diamante! O progresso é real.',
        likes: 89,
        timestamp: Date.now() - 7200000,
        isLikedByMe: false
    }
];

export const ACHIEVEMENTS_LIST: Achievement[] = [
    { id: 'first_step', title: 'Iniciante', description: 'Complete seu primeiro treino.', icon: Medal },
    { id: 'week_warrior', title: 'Guerreiro', description: 'Complete 7 dias seguidos.', icon: Flame },
    { id: 'early_bird', title: 'Madrugador', description: 'Treino antes das 8am.', icon: Sunrise },
    { id: 'program_finisher', title: 'Mestre do Peso', description: 'Complete o programa de 30 dias.', icon: Award }
];

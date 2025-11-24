
import { Exercise, Equipment, ExperienceLevel, MuscleGroup, Achievement } from './types';
import { Medal, Flame, Zap, Sunrise, Award } from 'lucide-react';

// Banco de Dados Massivo de Exercícios
export const EXERCISE_DATABASE: Exercise[] = [
  // --- PEITO (CHEST) ---
  {
    id: 'c1',
    name: 'Flexão de Braço Clássica',
    muscleGroup: MuscleGroup.CHEST,
    secondaryMuscles: [MuscleGroup.ARMS, MuscleGroup.SHOULDERS, MuscleGroup.ABS],
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
    secondaryMuscles: [MuscleGroup.ARMS], // Triceps heavy
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
    name: 'Crossover na Polia',
    muscleGroup: MuscleGroup.CHEST,
    secondaryMuscles: [MuscleGroup.SHOULDERS],
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
    name: 'Dips (Paralelas)',
    muscleGroup: MuscleGroup.CHEST,
    secondaryMuscles: [MuscleGroup.ARMS, MuscleGroup.SHOULDERS],
    equipmentRequired: [Equipment.HOME_BASIC, Equipment.FULL_GYM, Equipment.NONE], // Parks have bars
    difficulty: ExperienceLevel.ADVANCED,
    videoPlaceholder: 'https://img.youtube.com/vi/2z8JmcrW-As/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
    description: 'Incline o tronco para frente para focar no peito. Desça até quebrar a paralela dos cotovelos.',
    reps: '8-10',
    sets: 3,
    caloriesPerMinute: 10
  },

  // --- COSTAS (BACK) ---
  {
    id: 'b1',
    name: 'Barra Fixa (Pull Up)',
    muscleGroup: MuscleGroup.BACK,
    secondaryMuscles: [MuscleGroup.ARMS, MuscleGroup.ABS],
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
    name: 'Remada Australiana',
    muscleGroup: MuscleGroup.BACK,
    secondaryMuscles: [MuscleGroup.ARMS],
    equipmentRequired: [Equipment.NONE], // Low bar/table
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/rloXYB8M3vU/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=rloXYB8M3vU',
    description: 'Ótimo para iniciantes na calistenia. Entre embaixo de uma barra baixa e puxe o peito até ela.',
    reps: '10-15',
    sets: 3,
    caloriesPerMinute: 6
  },
  {
    id: 'b4',
    name: 'Puxada Frontal (Polia)',
    muscleGroup: MuscleGroup.BACK,
    secondaryMuscles: [MuscleGroup.ARMS],
    equipmentRequired: [Equipment.FULL_GYM],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/CAwf7n6Luuc/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    description: 'Simula a barra fixa. Puxe a barra até a altura superior do peito, contraindo as escápulas.',
    reps: '10-12',
    sets: 3,
    caloriesPerMinute: 5
  },
  {
    id: 'b5',
    name: 'Levantamento Terra',
    muscleGroup: MuscleGroup.BACK,
    secondaryMuscles: [MuscleGroup.LEGS, MuscleGroup.ABS],
    equipmentRequired: [Equipment.FULL_GYM],
    difficulty: ExperienceLevel.ADVANCED,
    videoPlaceholder: 'https://img.youtube.com/vi/op9kVnSso6Q/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    description: 'Exercício composto total. Levante a barra do chão mantendo a coluna neutra. Ativa toda a cadeia posterior.',
    reps: '5',
    sets: 3,
    caloriesPerMinute: 12
  },

  // --- PERNAS (LEGS) ---
  {
    id: 'l1',
    name: 'Agachamento Livre (Bodyweight)',
    muscleGroup: MuscleGroup.LEGS,
    secondaryMuscles: [MuscleGroup.ABS],
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
    id: 'l3',
    name: 'Leg Press 45',
    muscleGroup: MuscleGroup.LEGS,
    secondaryMuscles: [],
    equipmentRequired: [Equipment.FULL_GYM],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/IZxyjW7MPJQ/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    description: 'Foco total em quadríceps e glúteos sem carregar a coluna. Não estenda totalmente os joelhos no topo.',
    reps: '10-12',
    sets: 3,
    caloriesPerMinute: 6
  },
  {
    id: 'l4',
    name: 'Pistol Squat',
    muscleGroup: MuscleGroup.LEGS,
    secondaryMuscles: [MuscleGroup.ABS, MuscleGroup.FLEXIBILITY],
    equipmentRequired: [Equipment.NONE],
    difficulty: ExperienceLevel.ADVANCED,
    videoPlaceholder: 'https://img.youtube.com/vi/zqVYUDmmPzI/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=zqVYUDmmPzI',
    description: 'Agachamento unilateral de calistenia. Exige muita força, equilíbrio e mobilidade.',
    reps: '5 por perna',
    sets: 3,
    caloriesPerMinute: 12
  },
  {
    id: 'l5',
    name: 'Afundo Búlgaro',
    muscleGroup: MuscleGroup.LEGS,
    secondaryMuscles: [MuscleGroup.ABS],
    equipmentRequired: [Equipment.NONE, Equipment.HOME_BASIC],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/2C-uNgKwPLE/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
    description: 'Apoie o pé de trás em um banco ou cadeira. Desça o joelho de trás em direção ao chão.',
    reps: '10 por perna',
    sets: 3,
    caloriesPerMinute: 9
  },
  {
    id: 'l6',
    name: 'Cadeira Extensora',
    muscleGroup: MuscleGroup.LEGS,
    secondaryMuscles: [],
    equipmentRequired: [Equipment.FULL_GYM],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/YyvSfVjQeL0/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    description: 'Isolador de quadríceps. Estenda as pernas completamente e segure 1 segundo no topo.',
    reps: '12-15',
    sets: 3,
    caloriesPerMinute: 4
  },

  // --- OMBROS (SHOULDERS) ---
  {
    id: 's1',
    name: 'Desenvolvimento Militar (Halteres)',
    muscleGroup: MuscleGroup.SHOULDERS,
    secondaryMuscles: [MuscleGroup.ARMS],
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
    id: 's2',
    name: 'Pike Push Up',
    muscleGroup: MuscleGroup.SHOULDERS,
    secondaryMuscles: [MuscleGroup.ARMS, MuscleGroup.ABS],
    equipmentRequired: [Equipment.NONE],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/sposDXWEB0A/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=sposDXWEB0A',
    description: 'A "flexão de ombro" da calistenia. Corpo em V invertido, topo da cabeça em direção ao chão.',
    reps: '8-10',
    sets: 3,
    caloriesPerMinute: 8
  },
  {
    id: 's3',
    name: 'Elevação Lateral',
    muscleGroup: MuscleGroup.SHOULDERS,
    secondaryMuscles: [],
    equipmentRequired: [Equipment.HOME_BASIC, Equipment.FULL_GYM],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/3VcKaXpzqRo/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    description: 'Crucial para ombros largos. Levante os pesos até a altura dos ombros, cotovelos levemente dobrados.',
    reps: '12-15',
    sets: 3,
    caloriesPerMinute: 4
  },
  {
    id: 's4',
    name: 'Handstand (Parada de Mão) na Parede',
    muscleGroup: MuscleGroup.SHOULDERS,
    secondaryMuscles: [MuscleGroup.ARMS, MuscleGroup.ABS],
    equipmentRequired: [Equipment.NONE],
    difficulty: ExperienceLevel.ADVANCED,
    videoPlaceholder: 'https://img.youtube.com/vi/M7pQ3fD6XKw/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=M7pQ3fD6XKw',
    description: 'Isometria avançada. Apoie os pés na parede e segure o peso do corpo nos braços.',
    durationSeconds: 30,
    sets: 3,
    caloriesPerMinute: 11
  },

  // --- BRAÇOS (ARMS) ---
  {
    id: 'a1',
    name: 'Rosca Direta (Barra)',
    muscleGroup: MuscleGroup.ARMS,
    secondaryMuscles: [],
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
    id: 'a2',
    name: 'Tríceps Banco (Mergulho)',
    muscleGroup: MuscleGroup.ARMS,
    secondaryMuscles: [MuscleGroup.SHOULDERS],
    equipmentRequired: [Equipment.NONE], // Chair/Bench
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/6kALZikXxLc/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=6kALZikXxLc',
    description: 'Use um banco ou cadeira. Desça o quadril próximo ao banco flexionando os braços.',
    reps: '12-15',
    sets: 3,
    caloriesPerMinute: 5
  },
  {
    id: 'a3',
    name: 'Tríceps Corda (Polia)',
    muscleGroup: MuscleGroup.ARMS,
    secondaryMuscles: [],
    equipmentRequired: [Equipment.FULL_GYM],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/kiUdbGJmcyY/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=kiUdbGJmcyY',
    description: 'Estenda o braço para baixo, abrindo a corda no final do movimento para contração máxima.',
    reps: '12-15',
    sets: 3,
    caloriesPerMinute: 4
  },
  {
    id: 'a4',
    name: 'Chin Up (Barra Supinada)',
    muscleGroup: MuscleGroup.ARMS,
    secondaryMuscles: [MuscleGroup.BACK],
    equipmentRequired: [Equipment.NONE, Equipment.HOME_BASIC, Equipment.FULL_GYM],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/_71h6l9eI5U/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=_71h6l9eI5U',
    description: 'Barra fixa com palmas para você. Foca muito no bíceps além das costas.',
    reps: 'Maximo',
    sets: 3,
    caloriesPerMinute: 10
  },

  // --- ABDOMEN (CORE) ---
  {
    id: 'abs1',
    name: 'Prancha Abdominal',
    muscleGroup: MuscleGroup.ABS,
    secondaryMuscles: [MuscleGroup.SHOULDERS],
    equipmentRequired: [Equipment.NONE],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/ASdvN_XEl_c/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
    description: 'Isometria essencial. Contraia glúteos e abdômen. Não deixe o quadril cair.',
    durationSeconds: 45,
    sets: 3,
    caloriesPerMinute: 4
  },
  {
    id: 'abs2',
    name: 'Hollow Body Hold',
    muscleGroup: MuscleGroup.ABS,
    secondaryMuscles: [MuscleGroup.LEGS],
    equipmentRequired: [Equipment.NONE],
    difficulty: ExperienceLevel.ADVANCED,
    videoPlaceholder: 'https://img.youtube.com/vi/44mgUselcDU/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=44mgUselcDU',
    description: 'Exercício ginástico. Lombar colada no chão, pernas e braços estendidos flutuando.',
    durationSeconds: 30,
    sets: 3,
    caloriesPerMinute: 6
  },
  {
    id: 'abs3',
    name: 'Abdominal Supra (Crunch)',
    muscleGroup: MuscleGroup.ABS,
    secondaryMuscles: [],
    equipmentRequired: [Equipment.NONE],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/Xyd_fa5zoEU/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
    description: 'Curto e controlado. Tire apenas as escápulas do chão soltando o ar.',
    reps: '15-20',
    sets: 3,
    caloriesPerMinute: 3
  },
  {
    id: 'abs4',
    name: 'Elevação de Pernas na Barra',
    muscleGroup: MuscleGroup.ABS,
    secondaryMuscles: [MuscleGroup.ARMS],
    equipmentRequired: [Equipment.HOME_BASIC, Equipment.FULL_GYM], // Needs bar
    difficulty: ExperienceLevel.ADVANCED,
    videoPlaceholder: 'https://img.youtube.com/vi/7FwGZ8qY5OU/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=7FwGZ8qY5OU',
    description: 'Pendurado na barra, eleve as pernas esticadas até tocar a barra (ou até 90 graus).',
    reps: '8-12',
    sets: 3,
    caloriesPerMinute: 8
  },

  // --- CARDIO / HIIT ---
  {
    id: 'hiit1',
    name: 'Burpees',
    muscleGroup: MuscleGroup.CARDIO,
    secondaryMuscles: [MuscleGroup.CHEST, MuscleGroup.LEGS, MuscleGroup.ARMS],
    equipmentRequired: [Equipment.NONE],
    difficulty: ExperienceLevel.ADVANCED,
    videoPlaceholder: 'https://img.youtube.com/vi/TU8QYVW0gDU/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=TU8QYVW0gDU',
    description: 'O exercício mais completo de cardio. Agache, flexão, volte e salte.',
    reps: '10-15',
    sets: 4,
    caloriesPerMinute: 14
  },
  {
    id: 'hiit2',
    name: 'Mountain Climbers',
    muscleGroup: MuscleGroup.CARDIO,
    secondaryMuscles: [MuscleGroup.ABS, MuscleGroup.SHOULDERS],
    equipmentRequired: [Equipment.NONE],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/nmwgirgXLIg/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=nmwgirgXLIg',
    description: 'Na posição de prancha, traga os joelhos alternadamente em direção ao peito em alta velocidade.',
    durationSeconds: 45,
    sets: 3,
    caloriesPerMinute: 10
  },
  {
    id: 'hiit3',
    name: 'Polichinelos (Jumping Jacks)',
    muscleGroup: MuscleGroup.CARDIO,
    secondaryMuscles: [MuscleGroup.LEGS, MuscleGroup.SHOULDERS],
    equipmentRequired: [Equipment.NONE],
    difficulty: ExperienceLevel.BEGINNER,
    videoPlaceholder: 'https://img.youtube.com/vi/c4DAnQ6DtF8/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
    description: 'Excelente para aquecimento e elevar a frequência cardíaca.',
    durationSeconds: 60,
    sets: 2,
    caloriesPerMinute: 8
  },
  {
    id: 'hiit4',
    name: 'Pular Corda',
    muscleGroup: MuscleGroup.CARDIO,
    secondaryMuscles: [MuscleGroup.LEGS],
    equipmentRequired: [Equipment.HOME_BASIC],
    difficulty: ExperienceLevel.INTERMEDIATE,
    videoPlaceholder: 'https://img.youtube.com/vi/FJmRQ5iTXKE/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=FJmRQ5iTXKE',
    description: 'Cardio de alta intensidade. Mantenha os saltos baixos e rápidos.',
    durationSeconds: 60,
    sets: 3,
    caloriesPerMinute: 12
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


import { UserProfile, WorkoutSession, HabitLog, UserAchievement, WorkoutTemplate, InventoryItem, DailyNutritionLog, MealItem, ExerciseSetLog } from '../types';
import { STORE_ITEMS } from '../constants';

const KEYS = {
  PROFILE: 'ainsfit_profile',
  HISTORY: 'ainsfit_history',
  HABITS: 'ainsfit_habits',
  CURRENT_WORKOUT: 'ainsfit_current_workout',
  ACHIEVEMENTS: 'ainsfit_achievements',
  TEMPLATES: 'ainsfit_templates',
  INVENTORY: 'ainsfit_inventory',
  PROGRAM_STATUS: 'ainsfit_program_status',
  NUTRITION_LOGS: 'ainsfit_nutrition_logs',
  EXERCISE_LOGS: 'ainsfit_exercise_logs'
};

// --- SAFE PARSE HELPER (CRITICAL FIX) ---
// Impede que o app trave (Tela Branca) se o JSON estiver corrompido.
const safeParse = <T>(key: string, fallback: T): T => {
    try {
        const data = localStorage.getItem(key);
        if (!data || data === "undefined" || data === "null") return fallback;
        return JSON.parse(data);
    } catch (e) {
        console.error(`CRITICAL: Error parsing key ${key}. Resetting to fallback.`, e);
        // Opcional: Limpar a chave corrompida para evitar erros futuros
        // localStorage.removeItem(key); 
        return fallback;
    }
};

export const saveProfile = (profile: UserProfile): void => {
  try {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
      console.error("Storage Full or Error", e);
  }
};

export const getProfile = (): UserProfile | null => {
  return safeParse<UserProfile | null>(KEYS.PROFILE, null);
};

// --- Program Tracking ---
export const getProgramStatus = () => {
    return safeParse(KEYS.PROGRAM_STATUS, { currentDay: 1, completedDays: [] });
}

export const completeProgramDay = (dayNumber: number) => {
    const status = getProgramStatus();
    if (!status.completedDays.includes(dayNumber)) {
        status.completedDays.push(dayNumber);
        status.currentDay = dayNumber + 1;
        localStorage.setItem(KEYS.PROGRAM_STATUS, JSON.stringify(status));
        return true;
    }
    return false;
}

// --- XP & Gamification ---

export const addXP = (amount: number) => {
    const profile = getProfile();
    if (profile) {
        profile.xp = (profile.xp || 0) + amount;
        profile.coins = (profile.coins || 0) + Math.floor(amount / 2);
        saveProfile(profile);
    }
}

// --- Store & Inventory ---

export const getInventory = (): InventoryItem[] => {
    return safeParse<InventoryItem[]>(KEYS.INVENTORY, []);
}

export const buyItem = (itemId: string): boolean => {
    const profile = getProfile();
    const item = STORE_ITEMS.find(i => i.id === itemId);
    
    if (!profile || !item) return false;

    if ((profile.coins || 0) >= item.cost) {
        profile.coins -= item.cost;
        saveProfile(profile);
        
        const inventory = getInventory();
        inventory.push({ id: Date.now().toString(), itemId, acquiredAt: Date.now() });
        localStorage.setItem(KEYS.INVENTORY, JSON.stringify(inventory));
        return true;
    }
    return false;
}

export const equipItem = (itemId: string) => {
    const profile = getProfile();
    if (profile) {
        const item = STORE_ITEMS.find(i => i.id === itemId);
        if (item && item.type === 'skin') {
            profile.equippedSkin = item.preview;
            saveProfile(profile);
        }
    }
}

// --- Workouts & History ---

export const saveWorkoutSession = (session: WorkoutSession): void => {
  const history = getHistory();
  history.push(session);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  
  if (session.isProgramWorkout) {
      const status = getProgramStatus();
      completeProgramDay(status.currentDay);
  }

  const xpEarned = Math.floor((session.caloriesBurned || 100));
  addXP(xpEarned);
};

export const getHistory = (): WorkoutSession[] => {
  return safeParse<WorkoutSession[]>(KEYS.HISTORY, []);
};

export const saveHabitLog = (log: HabitLog): void => {
  const habits = getHabits();
  const index = habits.findIndex(h => h.date === log.date);
  if (index >= 0) {
    habits[index] = log;
  } else {
    habits.push(log);
  }
  localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
};

export const getHabits = (): HabitLog[] => {
  return safeParse<HabitLog[]>(KEYS.HABITS, []);
};

export const saveCurrentWorkout = (workout: WorkoutSession | null) => {
    if(!workout) {
        localStorage.removeItem(KEYS.CURRENT_WORKOUT);
        return;
    }
    localStorage.setItem(KEYS.CURRENT_WORKOUT, JSON.stringify(workout));
}

export const getCurrentWorkout = (): WorkoutSession | null => {
    return safeParse<WorkoutSession | null>(KEYS.CURRENT_WORKOUT, null);
}

// --- Performance Logs & PRs ---

export const getExerciseLogs = (): ExerciseSetLog[] => {
    return safeParse<ExerciseSetLog[]>(KEYS.EXERCISE_LOGS, []);
}

export const getPersonalBest = (exerciseId: string): number => {
    const logs = getExerciseLogs();
    const exerciseLogs = logs.filter(l => l.exerciseId === exerciseId);
    if (exerciseLogs.length === 0) return 0;
    
    return Math.max(...exerciseLogs.map(l => l.reps));
}

export const saveSetResult = (log: ExerciseSetLog): boolean => {
    const logs = getExerciseLogs();
    const currentPR = getPersonalBest(log.exerciseId);
    
    let isPR = false;
    if (log.reps > currentPR) {
        isPR = true;
        log.isPR = true;
    }

    logs.push(log);
    localStorage.setItem(KEYS.EXERCISE_LOGS, JSON.stringify(logs));
    
    if(isPR) addXP(50);
    else addXP(10);

    return isPR;
}

// --- Achievement System ---

export const getUnlockedAchievements = (): UserAchievement[] => {
    return safeParse<UserAchievement[]>(KEYS.ACHIEVEMENTS, []);
}

const saveUnlockedAchievement = (achievementId: string) => {
    const current = getUnlockedAchievements();
    if (current.find(a => a.achievementId === achievementId)) return;

    current.push({ achievementId, unlockedAt: Date.now() });
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(current));
    
    addXP(200);
}

export const checkAndUnlockAchievements = (): string[] => {
    const history = getHistory();
    const existingIds = getUnlockedAchievements().map(a => a.achievementId);
    const newUnlocked: string[] = [];

    if (history.length >= 1 && !existingIds.includes('first_step')) {
        saveUnlockedAchievement('first_step');
        newUnlocked.push('Primeiro Passo');
    }

    if (history.length >= 7 && !existingIds.includes('week_warrior')) {
        saveUnlockedAchievement('week_warrior');
        newUnlocked.push('Guerreiro Semanal');
    }

    return newUnlocked;
}

// --- Custom Templates ---

export const saveTemplate = (template: WorkoutTemplate) => {
    const templates = getTemplates();
    templates.push(template);
    localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(templates));
}

export const getTemplates = (): WorkoutTemplate[] => {
    return safeParse<WorkoutTemplate[]>(KEYS.TEMPLATES, []);
}

export const deleteTemplate = (id: string) => {
    const templates = getTemplates().filter(t => t.id !== id);
    localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(templates));
}

// --- Nutrition Logs ---

export const getNutritionLogs = (): DailyNutritionLog[] => {
    return safeParse<DailyNutritionLog[]>(KEYS.NUTRITION_LOGS, []);
}

export const getDailyNutrition = (date: string): DailyNutritionLog => {
    const logs = getNutritionLogs();
    const log = logs.find(l => l.date === date);
    return log || { date, items: [] };
}

export const addMealItem = (item: MealItem) => {
    const date = new Date().toISOString().split('T')[0];
    const logs = getNutritionLogs();
    const index = logs.findIndex(l => l.date === date);
    
    if (index >= 0) {
        logs[index].items.push(item);
    } else {
        logs.push({ date, items: [item] });
    }
    
    localStorage.setItem(KEYS.NUTRITION_LOGS, JSON.stringify(logs));
    addXP(5);
}

export const removeMealItem = (itemId: string, date: string) => {
    const logs = getNutritionLogs();
    const index = logs.findIndex(l => l.date === date);
    
    if (index >= 0) {
        logs[index].items = logs[index].items.filter(i => i.id !== itemId);
        localStorage.setItem(KEYS.NUTRITION_LOGS, JSON.stringify(logs));
    }
}

// --- Data Backup & Restore ---

export const exportData = () => {
    try {
        const data = {
            profile: getProfile(),
            history: getHistory(),
            habits: getHabits(),
            achievements: getUnlockedAchievements(),
            templates: getTemplates(),
            inventory: getInventory(),
            program: getProgramStatus(),
            nutrition: getNutritionLogs(),
            logs: getExerciseLogs(),
            timestamp: Date.now()
        };
        
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AINSFIT_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        alert("Erro ao exportar dados.");
        console.error(e);
    }
};

export const importData = async (file: File): Promise<boolean> => {
    try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        // Validação básica antes de salvar
        if (data.profile) localStorage.setItem(KEYS.PROFILE, JSON.stringify(data.profile));
        if (data.history) localStorage.setItem(KEYS.HISTORY, JSON.stringify(data.history));
        if (data.habits) localStorage.setItem(KEYS.HABITS, JSON.stringify(data.habits));
        if (data.achievements) localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(data.achievements));
        if (data.templates) localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(data.templates));
        if (data.inventory) localStorage.setItem(KEYS.INVENTORY, JSON.stringify(data.inventory));
        if (data.program) localStorage.setItem(KEYS.PROGRAM_STATUS, JSON.stringify(data.program));
        if (data.nutrition) localStorage.setItem(KEYS.NUTRITION_LOGS, JSON.stringify(data.nutrition));
        if (data.logs) localStorage.setItem(KEYS.EXERCISE_LOGS, JSON.stringify(data.logs));
        
        return true;
    } catch (e) {
        console.error("Failed to import data", e);
        alert("Arquivo inválido ou corrompido.");
        return false;
    }
};

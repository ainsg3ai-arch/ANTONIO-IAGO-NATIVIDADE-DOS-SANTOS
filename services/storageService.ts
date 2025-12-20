
import { UserProfile, WorkoutSession, HabitLog, UserAchievement, WorkoutTemplate, InventoryItem, DailyNutritionLog, MealItem, ExerciseSetLog, UserRituals, MuscleGroup } from '../types';
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
  EXERCISE_LOGS: 'ainsfit_exercise_logs',
  DAILY_RITUALS: 'ainsfit_daily_rituals'
};

const safeParse = <T>(key: string, fallback: T): T => {
    try {
        const data = localStorage.getItem(key);
        if (data === null || data === undefined || data === "undefined" || data === "null" || data.trim() === "") {
            return fallback;
        }
        return JSON.parse(data);
    } catch (e) {
        console.error(`Error parsing key ${key}`, e);
        return fallback;
    }
};

export const saveProfile = (profile: UserProfile): void => {
  try {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
      console.error("Storage Error", e);
  }
};

export const getProfile = (): UserProfile | null => {
  return safeParse<UserProfile | null>(KEYS.PROFILE, null);
};

export const getRituals = (): UserRituals => {
    const today = new Date().toISOString().split('T')[0];
    const allRituals = safeParse<Record<string, UserRituals>>(KEYS.DAILY_RITUALS, {});
    return allRituals[today] || { water: 0, sleep: false, protein: false, meditation: false };
};

export const updateRitual = (key: keyof UserRituals, value: any) => {
    const today = new Date().toISOString().split('T')[0];
    const allRituals = safeParse<Record<string, UserRituals>>(KEYS.DAILY_RITUALS, {});
    const current = allRituals[today] || { water: 0, sleep: false, protein: false, meditation: false };
    
    // @ts-ignore
    current[key] = value;
    allRituals[today] = current;
    
    localStorage.setItem(KEYS.DAILY_RITUALS, JSON.stringify(allRituals));
    
    // Reward coins on ritual completion (except water, which rewards per glass)
    if (value === true) addXP(20);
    else if (key === 'water') addXP(5);
};

export const getMuscleVolumeStats = () => {
    const history = getHistory();
    const last7Days = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentWorkouts = history.filter(h => h.dateCreated > last7Days);
    
    const volume: Record<string, number> = {};
    Object.values(MuscleGroup).forEach(m => volume[m] = 0);
    
    recentWorkouts.forEach(session => {
        session.exercises.forEach(ex => {
            const sets = ex.sets || 3;
            volume[ex.muscleGroup] = (volume[ex.muscleGroup] || 0) + sets;
        });
    });
    
    return volume;
};

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

export const addXP = (amount: number) => {
    const profile = getProfile();
    if (profile) {
        profile.xp = (profile.xp || 0) + amount;
        profile.coins = (profile.coins || 0) + Math.floor(amount / 2);
        
        const newLevel = Math.floor(profile.xp / 1000);
        if (newLevel > profile.levelNumber) {
            profile.levelNumber = newLevel;
        }
        
        saveProfile(profile);
    }
}

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

export const saveWorkoutSession = (session: WorkoutSession): void => {
  const history = getHistory();
  history.push(session);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  
  if (session.isProgramWorkout) {
      const status = getProgramStatus();
      completeProgramDay(status.currentDay);
  }

  const xpEarned = 200 + (session.exercises.length * 20);
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

export const getExerciseLogs = (): ExerciseSetLog[] => {
    return safeParse<ExerciseSetLog[]>(KEYS.EXERCISE_LOGS, []);
}

export const saveSetResult = (log: ExerciseSetLog): boolean => {
    const logs = getExerciseLogs();
    logs.push(log);
    localStorage.setItem(KEYS.EXERCISE_LOGS, JSON.stringify(logs));
    addXP(15);
    return true;
}

export const getUnlockedAchievements = (): UserAchievement[] => {
    return safeParse<UserAchievement[]>(KEYS.ACHIEVEMENTS, []);
}

const saveUnlockedAchievement = (achievementId: string) => {
    const current = getUnlockedAchievements();
    if (current.find(a => a.achievementId === achievementId)) return;
    current.push({ achievementId, unlockedAt: Date.now() });
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(current));
    addXP(500);
}

export const checkAndUnlockAchievements = (): string[] => {
    const history = getHistory();
    const existingIds = getUnlockedAchievements().map(a => a.achievementId);
    const newUnlocked: string[] = [];

    if (history.length >= 1 && !existingIds.includes('first_blood')) {
        saveUnlockedAchievement('first_blood');
        newUnlocked.push('Batismo de Fogo');
    }
    return newUnlocked;
}

export const saveTemplate = (template: WorkoutTemplate) => {
    const templates = getTemplates();
    templates.push(template);
    localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(templates));
}

export const getTemplates = (): WorkoutTemplate[] => {
    return safeParse<WorkoutTemplate[]>(KEYS.TEMPLATES, []);
}

export const getDailyNutrition = (date: string): DailyNutritionLog => {
  const logs = safeParse<DailyNutritionLog[]>(KEYS.NUTRITION_LOGS, []);
  const log = logs.find(l => l.date === date);
  return log || { date, items: [] };
};

export const addMealItem = (item: MealItem): void => {
  const date = new Date().toISOString().split('T')[0];
  const logs = safeParse<DailyNutritionLog[]>(KEYS.NUTRITION_LOGS, []);
  const logIndex = logs.findIndex(l => l.date === date);
  
  if (logIndex >= 0) {
    logs[logIndex].items.push(item);
  } else {
    logs.push({ date, items: [item] });
  }
  
  localStorage.setItem(KEYS.NUTRITION_LOGS, JSON.stringify(logs));
};

export const removeMealItem = (itemId: string, date: string): void => {
  const logs = safeParse<DailyNutritionLog[]>(KEYS.NUTRITION_LOGS, []);
  const logIndex = logs.findIndex(l => l.date === date);
  
  if (logIndex >= 0) {
    logs[logIndex].items = logs[logIndex].items.filter(i => i.id !== itemId);
    localStorage.setItem(KEYS.NUTRITION_LOGS, JSON.stringify(logs));
  }
};

export const exportData = () => {
    try {
        const data = {
            profile: getProfile(),
            history: getHistory(),
            habits: getHabits(),
            achievements: getUnlockedAchievements(),
            timestamp: Date.now()
        };
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AINSFIT_DATA_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    } catch (e) {
        console.error(e);
    }
};

export const importData = async (file: File): Promise<boolean> => {
    try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.profile) localStorage.setItem(KEYS.PROFILE, JSON.stringify(data.profile));
        if (data.history) localStorage.setItem(KEYS.HISTORY, JSON.stringify(data.history));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

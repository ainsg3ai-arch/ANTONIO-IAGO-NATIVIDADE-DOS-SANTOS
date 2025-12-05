
import { UserProfile, WorkoutSession, HabitLog, UserAchievement, WorkoutTemplate, InventoryItem, DailyNutritionLog, MealItem } from '../types';
import { STORE_ITEMS, PROGRAM_30_DAYS } from '../constants';

const KEYS = {
  PROFILE: 'ainsfit_profile',
  HISTORY: 'ainsfit_history',
  HABITS: 'ainsfit_habits',
  CURRENT_WORKOUT: 'ainsfit_current_workout',
  ACHIEVEMENTS: 'ainsfit_achievements',
  TEMPLATES: 'ainsfit_templates',
  INVENTORY: 'ainsfit_inventory',
  PROGRAM_STATUS: 'ainsfit_program_status',
  NUTRITION_LOGS: 'ainsfit_nutrition_logs' // New Key
};

export const saveProfile = (profile: UserProfile): void => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
};

export const getProfile = (): UserProfile | null => {
  const data = localStorage.getItem(KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
};

// --- Program Tracking ---
export const getProgramStatus = () => {
    const data = localStorage.getItem(KEYS.PROGRAM_STATUS);
    return data ? JSON.parse(data) : { currentDay: 1, completedDays: [] };
}

export const completeProgramDay = (dayNumber: number) => {
    const status = getProgramStatus();
    if (!status.completedDays.includes(dayNumber)) {
        status.completedDays.push(dayNumber);
        status.currentDay = dayNumber + 1; // Advance to next day
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
        profile.coins = (profile.coins || 0) + Math.floor(amount / 2); // 1 Coin per 2 XP
        saveProfile(profile);
    }
}

// --- Store & Inventory ---

export const getInventory = (): InventoryItem[] => {
    const data = localStorage.getItem(KEYS.INVENTORY);
    return data ? JSON.parse(data) : [];
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
  
  // Logic to advance program if this was a program workout
  if (session.isProgramWorkout) {
      // Find which day this corresponded to. Simplified logic: assume it matches the user's current day
      const status = getProgramStatus();
      completeProgramDay(status.currentDay);
  }

  // Add XP
  const xpEarned = Math.floor((session.caloriesBurned || 100));
  addXP(xpEarned);
};

export const getHistory = (): WorkoutSession[] => {
  const data = localStorage.getItem(KEYS.HISTORY);
  return data ? JSON.parse(data) : [];
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
  const data = localStorage.getItem(KEYS.HABITS);
  return data ? JSON.parse(data) : [];
};

export const saveCurrentWorkout = (workout: WorkoutSession | null) => {
    if(!workout) {
        localStorage.removeItem(KEYS.CURRENT_WORKOUT);
        return;
    }
    localStorage.setItem(KEYS.CURRENT_WORKOUT, JSON.stringify(workout));
}

export const getCurrentWorkout = (): WorkoutSession | null => {
    const data = localStorage.getItem(KEYS.CURRENT_WORKOUT);
    return data ? JSON.parse(data) : null;
}

// --- Achievement System ---

export const getUnlockedAchievements = (): UserAchievement[] => {
    const data = localStorage.getItem(KEYS.ACHIEVEMENTS);
    return data ? JSON.parse(data) : [];
}

const saveUnlockedAchievement = (achievementId: string) => {
    const current = getUnlockedAchievements();
    if (current.find(a => a.achievementId === achievementId)) return;

    current.push({ achievementId, unlockedAt: Date.now() });
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(current));
    
    // Bonus XP for achievement
    addXP(200);
}

export const checkAndUnlockAchievements = (): string[] => {
    const history = getHistory();
    const existingIds = getUnlockedAchievements().map(a => a.achievementId);
    const newUnlocked: string[] = [];

    // 1. First Step
    if (history.length >= 1 && !existingIds.includes('first_step')) {
        saveUnlockedAchievement('first_step');
        newUnlocked.push('Primeiro Passo');
    }

    // 2. Week Warrior (simplified logic for demo)
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
    const data = localStorage.getItem(KEYS.TEMPLATES);
    return data ? JSON.parse(data) : [];
}

export const deleteTemplate = (id: string) => {
    const templates = getTemplates().filter(t => t.id !== id);
    localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(templates));
}

// --- Nutrition Logs ---

export const getNutritionLogs = (): DailyNutritionLog[] => {
    const data = localStorage.getItem(KEYS.NUTRITION_LOGS);
    return data ? JSON.parse(data) : [];
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
    addXP(5); // Small reward for tracking
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
    const data = {
        profile: getProfile(),
        history: getHistory(),
        habits: getHabits(),
        achievements: getUnlockedAchievements(),
        templates: getTemplates(),
        inventory: getInventory(),
        program: getProgramStatus(),
        nutrition: getNutritionLogs(),
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
};

export const importData = async (file: File): Promise<boolean> => {
    try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        if (data.profile) localStorage.setItem(KEYS.PROFILE, JSON.stringify(data.profile));
        if (data.history) localStorage.setItem(KEYS.HISTORY, JSON.stringify(data.history));
        if (data.habits) localStorage.setItem(KEYS.HABITS, JSON.stringify(data.habits));
        if (data.achievements) localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(data.achievements));
        if (data.templates) localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(data.templates));
        if (data.inventory) localStorage.setItem(KEYS.INVENTORY, JSON.stringify(data.inventory));
        if (data.program) localStorage.setItem(KEYS.PROGRAM_STATUS, JSON.stringify(data.program));
        if (data.nutrition) localStorage.setItem(KEYS.NUTRITION_LOGS, JSON.stringify(data.nutrition));
        
        return true;
    } catch (e) {
        console.error("Failed to import data", e);
        return false;
    }
};

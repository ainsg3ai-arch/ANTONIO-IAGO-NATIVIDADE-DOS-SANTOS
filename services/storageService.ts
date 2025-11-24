
import { UserProfile, WorkoutSession, HabitLog, UserAchievement } from '../types';
import { ACHIEVEMENTS_LIST } from '../constants';

const KEYS = {
  PROFILE: 'ainsfit_profile',
  HISTORY: 'ainsfit_history',
  HABITS: 'ainsfit_habits',
  CURRENT_WORKOUT: 'ainsfit_current_workout',
  ACHIEVEMENTS: 'ainsfit_achievements',
};

export const saveProfile = (profile: UserProfile): void => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
};

export const getProfile = (): UserProfile | null => {
  const data = localStorage.getItem(KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
};

export const saveWorkoutSession = (session: WorkoutSession): void => {
  const history = getHistory();
  history.push(session);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
};

export const getHistory = (): WorkoutSession[] => {
  const data = localStorage.getItem(KEYS.HISTORY);
  return data ? JSON.parse(data) : [];
};

export const saveHabitLog = (log: HabitLog): void => {
  const habits = getHabits();
  // Upsert logic
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
    if (current.find(a => a.achievementId === achievementId)) return; // Already unlocked

    current.push({ achievementId, unlockedAt: Date.now() });
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(current));
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

    // 2. On Fire (5 workouts)
    if (history.length >= 5 && !existingIds.includes('on_fire')) {
        saveUnlockedAchievement('on_fire');
        newUnlocked.push('Em Chamas');
    }

    // 3. Warrior (10 workouts)
    if (history.length >= 10 && !existingIds.includes('warrior')) {
        saveUnlockedAchievement('warrior');
        newUnlocked.push('Guerreiro');
    }

    // 4. Early Bird (Workout before 8am)
    // Check only the last workout for efficiency in this call context
    const lastWorkout = history[history.length - 1];
    if (lastWorkout && !existingIds.includes('early_bird')) {
        const date = new Date(lastWorkout.dateCreated);
        if (date.getHours() < 8) {
            saveUnlockedAchievement('early_bird');
            newUnlocked.push('Madrugador');
        }
    }

    // 5. Consistency (3 times in last 7 days)
    if (!existingIds.includes('consistency') && history.length >= 3) {
        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const recentWorkouts = history.filter(w => (now - w.dateCreated) < oneWeek);
        if (recentWorkouts.length >= 3) {
            saveUnlockedAchievement('consistency');
            newUnlocked.push('Consistência');
        }
    }

    return newUnlocked;
}

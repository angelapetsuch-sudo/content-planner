import AsyncStorage from '@react-native-async-storage/async-storage';

export class Storage {
  static async saveData<T>(key: string, data: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  }

  static async getData<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading data:', error);
      return null;
    }
  }

  static async removeData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  }

  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}

export const STORAGE_KEYS = {
  EXPENSES: 'expenses',
  CONTENT_IDEAS: 'content_ideas',
  SPONSORSHIPS: 'sponsorships',
  ANALYTICS: 'analytics',
  POSTS: 'posts',
  AI_CONTENT: 'ai_content',
  SUBSCRIPTION: 'subscription',
};

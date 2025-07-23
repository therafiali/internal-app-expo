import { Platform } from "react-native";

let asyncStorage: any = null;
if (Platform.OS !== "web") {
  // Dynamically require AsyncStorage only on native
  asyncStorage = require("@react-native-async-storage/async-storage").default;
}

export const getItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === "web") {
    return Promise.resolve(window.localStorage.getItem(key));
  } else {
    return asyncStorage.getItem(key);
  }
};

export const setItem = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === "web") {
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  } else {
    return asyncStorage.setItem(key, value);
  }
};

export const removeItem = async (key: string): Promise<void> => {
  if (Platform.OS === "web") {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  } else {
    return asyncStorage.removeItem(key);
  }
};

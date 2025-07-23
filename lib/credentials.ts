import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const getCredientials = async () => {
  if (Platform.OS === "web") {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    if (!username || !password) {
      throw new Error("Username or password is not set");
    }
    return { username, password };
  }
  const username = await SecureStore.getItemAsync("username");
  const password = await SecureStore.getItemAsync("password");
  if (!username || !password) {
    throw new Error("Username or password is not set");
  }
  return { username, password };
};

export const setCredientials = async (username: string, password: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    return;
  }
  await SecureStore.setItemAsync("username", username);
  await SecureStore.setItemAsync("password", password);

  if (!username || !password) {
    throw new Error("Username or password is not set");
  }
  return { username, password };
};

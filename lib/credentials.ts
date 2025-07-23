import * as SecureStore from "expo-secure-store";

export const getCredientials = async () => {
  const username = await SecureStore.getItemAsync("username");
  const password = await SecureStore.getItemAsync("password");
  if (!username || !password) {
    throw new Error("Username or password is not set");
  }
  return { username, password };
};

export const setCredientials = async (username: string, password: string) => {
  await SecureStore.setItemAsync("username", username);
  await SecureStore.setItemAsync("password", password);

  if (!username || !password) {
    throw new Error("Username or password is not set");
  }
  return { username, password };
};

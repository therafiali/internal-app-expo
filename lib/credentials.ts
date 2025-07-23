import { getItem, setItem } from "./storage";

export const getCredientials = async () => {
  const username = await getItem("username");
  const password = await getItem("password");
  if (!username || !password) {
    throw new Error("Username or password is not set");
  }
  return { username, password };
};

export const setCredientials = async (username: string, password: string) => {
  await setItem("username", username);
  await setItem("password", password);

  if (!username || !password) {
    throw new Error("Username or password is not set");
  }
  return { username, password };
};

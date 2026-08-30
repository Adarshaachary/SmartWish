import type { User } from "../types/User";

const USER_KEY = "smartwish_user_v2";

/* ============================= */
/* Save User */
/* ============================= */

export function saveUser(user: User): void {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );
}

/* ============================= */
/* Get User */
/* ============================= */

export function getUser(): User | null {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    const user = JSON.parse(storedUser);

    if (
      !user ||
      typeof user.name !== "string" ||
      typeof user.email !== "string"
    ) {
      localStorage.removeItem(USER_KEY);
      return null;
    }

    return user as User;

  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem(USER_KEY);

    return null;
  }
}

/* ============================= */
/* Remove User / Logout */
/* ============================= */

export function removeUser(): void {
  localStorage.removeItem(USER_KEY);
}

/* ============================= */
/* Check Login */
/* ============================= */

export function isLoggedIn(): boolean {
  return getUser() !== null;
}
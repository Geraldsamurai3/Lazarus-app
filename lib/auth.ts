export interface User {
  id: string
  email: string
  name: string
  role: "citizen" | "public_entity"
}

export const DEMO_USER: User = {
  id: "1",
  email: "usuario@lazarus.com",
  name: "Usuario Demo",
  role: "citizen",
}

export const DEMO_PUBLIC_ENTITY: User = {
  id: "2",
  email: "entidad@lazarus.com",
  name: "Entidad Pública Demo",
  role: "public_entity",
}

export function login(email: string, password: string, role?: "citizen" | "public_entity"): User | null {
  // Simulate authentication
  if (email === DEMO_USER.email && password === "demo123") {
    const user = role ? { ...DEMO_USER, role } : DEMO_USER
    localStorage.setItem("lazarus_user", JSON.stringify(user))
    return user
  }
  if (email === DEMO_PUBLIC_ENTITY.email && password === "admin123") {
    const user = role ? { ...DEMO_PUBLIC_ENTITY, role } : DEMO_PUBLIC_ENTITY
    localStorage.setItem("lazarus_user", JSON.stringify(user))
    return user
  }
  return null
}

export function logout(): void {
  localStorage.removeItem("lazarus_user")
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("lazarus_user")
  return userStr ? JSON.parse(userStr) : null
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

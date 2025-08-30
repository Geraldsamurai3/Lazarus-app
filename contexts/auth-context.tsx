"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type User, login as authLogin, logout as authLogout, getCurrentUser } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role?: "citizen" | "public_entity") => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  hasRole: (role: "citizen" | "public_entity") => boolean
  isPublicEntity: boolean
  isCitizen: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  const login = async (email: string, password: string, role?: "citizen" | "public_entity") => {
    const success = await authLogin(email, password, role)
    if (success) {
      const currentUser = getCurrentUser()
      setUser(currentUser)
    }
    return success
  }

  const logout = () => {
    authLogout()
    setUser(null)
  }

  const hasRole = (role: "citizen" | "public_entity") => {
    return user?.role === role
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
        isPublicEntity: user?.role === "public_entity",
        isCitizen: user?.role === "citizen",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

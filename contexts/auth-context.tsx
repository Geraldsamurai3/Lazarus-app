"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { 
  type User, 
  type RegisterDto,
  login as authLogin, 
  logout as authLogout, 
  register as authRegister,
  getCurrentUser, 
  isAuthenticated as checkAuth,
  isTokenExpired,
  getToken 
} from "@/lib/auth"

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<User | null>
  register: (userData: RegisterDto) => Promise<User | null>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
  hasRole: (role: "citizen" | "public_entity") => boolean
  isPublicEntity: boolean
  isCitizen: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Check auth status and token expiration
  const checkAuthStatus = useCallback(() => {
    // Check if token is expired before using it
    if (isTokenExpired()) {
      authLogout()
      setUser(null)
      setToken(null)
      setIsAuthenticated(false)
      return
    }

    const currentUser = getCurrentUser()
    const currentToken = getToken()
    const isAuth = checkAuth()
    
    setUser(currentUser)
    setToken(currentToken)
    setIsAuthenticated(isAuth)
  }, [])

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    checkAuthStatus()
    setIsLoading(false)
  }, [checkAuthStatus])

  // Periodically check token expiration (every minute)
  useEffect(() => {
    if (!isAuthenticated) return
    
    const interval = setInterval(() => {
      checkAuthStatus()
    }, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [isAuthenticated, checkAuthStatus])

  /**
   * Authenticate user with email and password
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const user = await authLogin(email, password)
      
      if (user) {
        setUser(user)
        setToken(getToken())
        setIsAuthenticated(true)
        return user
      }
      
      return null
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Register a new user
   */
  const register = async (userData: RegisterDto) => {
    setIsLoading(true)
    try {
      const user = await authRegister(userData)
      return user
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Clear authentication state
   */
  const logout = () => {
    authLogout()
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
  }

  /**
   * Check if user has specific role
   */
  const hasRole = (role: "citizen" | "public_entity") => {
    return user?.role === role
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated,
        isLoading,
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

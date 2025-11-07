"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { authService } from "@/lib/services/auth.service"
import {
  UserType,
  type UnifiedUser,
  type RegisterCiudadanoDto,
  type RegisterEntidadDto,
  type RegisterAdminDto
} from "@/lib/types"

interface AuthContextType {
  user: UnifiedUser | null
  token: string | null
  login: (email: string, password: string) => Promise<UnifiedUser | null>
  registerCiudadano: (userData: RegisterCiudadanoDto) => Promise<UnifiedUser | null>
  registerEntidad: (userData: RegisterEntidadDto) => Promise<UnifiedUser | null>
  registerAdmin: (userData: RegisterAdminDto) => Promise<UnifiedUser | null>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
  hasUserType: (userType: UserType) => boolean
  isCiudadano: boolean
  isEntidad: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UnifiedUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Check auth status and token expiration
  const checkAuthStatus = useCallback(() => {
    // Check if token is expired before using it
    if (authService.isTokenExpired()) {
      authService.logout()
      setUser(null)
      setToken(null)
      setIsAuthenticated(false)
      return
    }

    const currentUser = authService.getCurrentUser()
    const currentToken = authService.getToken()
    const isAuth = authService.isAuthenticated()
    
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
      const user = await authService.login(email, password)
      
      if (user) {
        setUser(user)
        setToken(authService.getToken())
        setIsAuthenticated(true)
        return user
      }
      
      return null
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Register a new CIUDADANO
   */
  const registerCiudadano = async (userData: RegisterCiudadanoDto) => {
    setIsLoading(true)
    try {
      const user = await authService.registerCiudadano(userData)
      
      if (user) {
        setUser(user)
        setToken(authService.getToken())
        setIsAuthenticated(true)
      }
      
      return user
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Register a new ENTIDAD PÚBLICA
   */
  const registerEntidad = async (userData: RegisterEntidadDto) => {
    setIsLoading(true)
    try {
      const user = await authService.registerEntidad(userData)
      
      if (user) {
        setUser(user)
        setToken(authService.getToken())
        setIsAuthenticated(true)
      }
      
      return user
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Register a new ADMIN
   */
  const registerAdmin = async (userData: RegisterAdminDto) => {
    setIsLoading(true)
    try {
      const user = await authService.registerAdmin(userData)
      
      if (user) {
        setUser(user)
        setToken(authService.getToken())
        setIsAuthenticated(true)
      }
      
      return user
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Clear authentication state
   */
  const logout = () => {
    // Limpiar primero el estado local para que la UI reaccione inmediatamente
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    
    // Luego limpiar localStorage
    authService.logout()
  }

  /**
   * Check if user has specific user type
   */
  const hasUserType = (userType: UserType) => {
    return user?.userType === userType
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        registerCiudadano,
        registerEntidad,
        registerAdmin,
        logout,
        isAuthenticated,
        isLoading,
        hasUserType,
        isCiudadano: user?.userType === UserType.CIUDADANO,
        isEntidad: user?.userType === UserType.ENTIDAD,
        isAdmin: user?.userType === UserType.ADMIN,
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

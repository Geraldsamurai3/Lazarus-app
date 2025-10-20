"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
}

export function LogoutButton({ 
  variant = "destructive", 
  size = "default",
  className = "",
  showIcon = true,
  children = "Cerrar Sesión"
}: LogoutButtonProps) {
  const { logout, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    try {
      logout()
      
      toast({
        title: "Sesión cerrada",
        description: `¡Hasta luego${user?.name ? `, ${user.name}` : ''}!`,
        variant: "default",
      })
      
      // Redirect to login page
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
      
      toast({
        title: "Error",
        description: "Hubo un problema al cerrar la sesión",
        variant: "destructive",
      })
    }
  }

  return (
    <Button 
      variant={variant} 
      size={size}
      className={className}
      onClick={handleLogout}
    >
      {showIcon && <LogOut className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  )
}
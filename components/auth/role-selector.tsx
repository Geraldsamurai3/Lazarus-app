"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface RoleSelectorProps {
  onRoleSelect: (role: "citizen" | "public_entity") => void
  selectedRole?: "citizen" | "public_entity"
}

export function RoleSelector({ onRoleSelect, selectedRole }: RoleSelectorProps) {
  const { t } = useLanguage()

  const roles = [
    {
      id: "citizen" as const,
      title: t("auth.roles.citizen.title"),
      description: t("auth.roles.citizen.description"),
      icon: Users,
      permissions: [
        t("auth.roles.citizen.permissions.create_reports"),
        t("auth.roles.citizen.permissions.view_map"),
        t("auth.roles.citizen.permissions.comment"),
      ],
    },
    {
      id: "public_entity" as const,
      title: t("auth.roles.public_entity.title"),
      description: t("auth.roles.public_entity.description"),
      icon: Building2,
      permissions: [
        t("auth.roles.public_entity.permissions.mark_attended"),
        t("auth.roles.public_entity.permissions.view_stats"),
        t("auth.roles.public_entity.permissions.admin_access"),
      ],
    },
  ]

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{t("auth.select_role")}</h3>
        <p className="text-sm text-muted-foreground">{t("auth.select_role_description")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((role) => {
          const Icon = role.icon
          const isSelected = selectedRole === role.id

          return (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-primary border-primary" : "hover:border-muted-foreground/50"
              }`}
              onClick={() => onRoleSelect(role.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{role.title}</CardTitle>
                  </div>
                  {isSelected && (
                    <Badge variant="default" className="text-xs">
                      {t("auth.selected")}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm">{role.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {t("auth.permissions")}
                  </p>
                  <ul className="space-y-1">
                    {role.permissions.map((permission, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-center">
                        <span className="w-1 h-1 bg-primary rounded-full mr-2" />
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

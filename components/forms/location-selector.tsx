"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import { costaRicaLocations } from "@/lib/services/costa-rica-locations"

interface LocationSelectorProps {
  provincia: string
  canton: string
  distrito: string
  onProvinciaChange: (value: string) => void
  onCantonChange: (value: string) => void
  onDistritoChange: (value: string) => void
  disabled?: boolean
  showLabels?: boolean
  errors?: {
    provincia?: string
    canton?: string
    distrito?: string
  }
}

export function LocationSelector({
  provincia,
  canton,
  distrito,
  onProvinciaChange,
  onCantonChange,
  onDistritoChange,
  disabled = false,
  showLabels = true,
  errors
}: LocationSelectorProps) {
  const [cantonesOptions, setCantonesOptions] = useState<{ value: string; label: string }[]>([])
  const [distritosOptions, setDistritosOptions] = useState<{ value: string; label: string }[]>([])

  // Opciones de provincias
  const provinciasOptions = costaRicaLocations.getProvincias().map(p => ({
    value: p.nombre,
    label: p.nombre
  }))

  // Actualizar cantones cuando cambia la provincia
  useEffect(() => {
    if (provincia) {
      const cantones = costaRicaLocations.getCantonesByProvincia(provincia)
      setCantonesOptions(cantones.map(c => ({
        value: c.nombre,
        label: c.nombre
      })))
      
      // Limpiar cantón y distrito si la provincia cambió
      if (canton && !cantones.find(c => c.nombre === canton)) {
        onCantonChange("")
        onDistritoChange("")
      }
    } else {
      setCantonesOptions([])
      onCantonChange("")
      onDistritoChange("")
    }
  }, [provincia])

  // Actualizar distritos cuando cambia el cantón
  useEffect(() => {
    if (canton) {
      const distritos = costaRicaLocations.getDistritosByCanton(canton)
      setDistritosOptions(distritos.map(d => ({
        value: d.nombre,
        label: d.nombre
      })))
      
      // Limpiar distrito si el cantón cambió
      if (distrito && !distritos.find(d => d.nombre === distrito)) {
        onDistritoChange("")
      }
    } else {
      setDistritosOptions([])
      onDistritoChange("")
    }
  }, [canton])

  return (
    <div className="space-y-4">
      {/* Provincia */}
      <div className="space-y-2">
        {showLabels && <Label htmlFor="provincia">Provincia *</Label>}
        <Combobox
          options={provinciasOptions}
          value={provincia}
          onValueChange={onProvinciaChange}
          placeholder="Selecciona una provincia"
          searchPlaceholder="Buscar provincia..."
          emptyText="No se encontró la provincia"
          disabled={disabled}
          className={errors?.provincia ? "border-red-500" : ""}
        />
        {errors?.provincia && (
          <p className="text-xs text-red-500 mt-1">{errors.provincia}</p>
        )}
      </div>

      {/* Cantón */}
      <div className="space-y-2">
        {showLabels && <Label htmlFor="canton">Cantón *</Label>}
        <Combobox
          options={cantonesOptions}
          value={canton}
          onValueChange={onCantonChange}
          placeholder={provincia ? "Selecciona un cantón" : "Primero selecciona provincia"}
          searchPlaceholder="Buscar cantón..."
          emptyText="No se encontró el cantón"
          disabled={disabled || !provincia}
          className={errors?.canton ? "border-red-500" : ""}
        />
        {errors?.canton && (
          <p className="text-xs text-red-500 mt-1">{errors.canton}</p>
        )}
      </div>

      {/* Distrito */}
      <div className="space-y-2">
        {showLabels && <Label htmlFor="distrito">Distrito *</Label>}
        <Combobox
          options={distritosOptions}
          value={distrito}
          onValueChange={onDistritoChange}
          placeholder={canton ? "Selecciona un distrito" : "Primero selecciona cantón"}
          searchPlaceholder="Buscar distrito..."
          emptyText="No se encontró el distrito"
          disabled={disabled || !canton}
          className={errors?.distrito ? "border-red-500" : ""}
        />
        {errors?.distrito && (
          <p className="text-xs text-red-500 mt-1">{errors.distrito}</p>
        )}
      </div>
    </div>
  )
}

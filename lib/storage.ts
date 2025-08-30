export interface Incident {
  id: string
  type: "emergency" | "infrastructure" | "security" | "environment" | "other"
  location: {
    lat: number
    lng: number
    address: string
  }
  description: string
  severity: "low" | "medium" | "high" | "critical"
  evidence: string[]
  userId: string
  userName: string
  timestamp: string
  status: "pending" | "in_progress" | "resolved"
  comments: Comment[]
}

export interface Comment {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: string
}

export interface UserPreferences {
  language: "es" | "en"
  notifications: boolean
  watchZones: Array<{
    lat: number
    lng: number
    radius: number
    name: string
  }>
}

export function saveIncident(incident: Omit<Incident, "id" | "timestamp" | "status" | "comments">): string {
  const incidents = getIncidents()
  const newIncident: Incident = {
    ...incident,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    status: "pending",
    comments: [],
  }
  incidents.push(newIncident)
  localStorage.setItem("lazarus_incidents", JSON.stringify(incidents))
  return newIncident.id
}

export function getIncidents(): Incident[] {
  if (typeof window === "undefined") return []
  const incidents = localStorage.getItem("lazarus_incidents")
  return incidents ? JSON.parse(incidents) : []
}

export function updateIncident(id: string, updates: Partial<Incident>): void {
  const incidents = getIncidents()
  const index = incidents.findIndex((i) => i.id === id)
  if (index !== -1) {
    incidents[index] = { ...incidents[index], ...updates }
    localStorage.setItem("lazarus_incidents", JSON.stringify(incidents))
  }
}

export function addComment(incidentId: string, comment: Omit<Comment, "id" | "timestamp">): void {
  const incidents = getIncidents()
  const incident = incidents.find((i) => i.id === incidentId)
  if (incident) {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }
    incident.comments.push(newComment)
    localStorage.setItem("lazarus_incidents", JSON.stringify(incidents))
  }
}

export function getUserPreferences(): UserPreferences {
  if (typeof window === "undefined") return { language: "es", notifications: true, watchZones: [] }
  const prefs = localStorage.getItem("lazarus_preferences")
  return prefs ? JSON.parse(prefs) : { language: "es", notifications: true, watchZones: [] }
}

export function saveUserPreferences(preferences: UserPreferences): void {
  localStorage.setItem("lazarus_preferences", JSON.stringify(preferences))
}

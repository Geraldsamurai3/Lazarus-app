export type Language = "es" | "en"

export interface Translations {
  // Navigation
  nav: {
    dashboard: string
    map: string
    report: string
    settings: string
    logout: string
  }

  // Authentication
  auth: {
    login: string
    email: string
    password: string
    role: string
    selectRole: string
    selectRoleDescription: string
    selectRoleTitle: string
    selected: string
    permissions: string
    welcome: string
    loginSuccess: string
    invalidCredentials: string
    loginError: string
    demoUsers: string
    roles: {
      citizen: {
        title: string
        description: string
        permissions: {
          create_reports: string
          view_map: string
          comment: string
        }
      }
      public_entity: {
        title: string
        description: string
        permissions: {
          mark_attended: string
          view_stats: string
          admin_access: string
        }
      }
    }
  }

  // Dashboard
  dashboard: {
    welcome: string
    controlPanel: string
    myReports: string
    totalReports: string
    activeUsers: string
    reportsSubmitted: string
    inCommunity: string
    reportingIncidents: string
    quickActions: string
    accessMainFunctions: string
    reportNewIncident: string
    viewIncidentMap: string
    recentReports: string
    latestIncidents: string
    noRecentReports: string
  }

  // Incident Form
  incident: {
    reportIncident: string
    completeAllFields: string
    incidentType: string
    selectIncidentType: string
    incidentLocation: string
    incidentDescription: string
    describeIncident: string
    severityLevel: string
    selectSeverityLevel: string
    visualEvidence: string
    uploadFiles: string
    maxFiles: string
    reportSummary: string
    severity: string
    filesAttached: string
    sendReport: string
    sending: string
    clear: string
    reportSent: string
    reportRegistered: string
    notificationSent: string
    authoritiesNotified: string
    incompleteForm: string
    completeRequiredFields: string
    mustLogin: string
    loginToReport: string
  }

  // Map
  map: {
    incidentMap: string
    visualizeAndFilter: string
    mapFilters: string
    incidentType: string
    allTypes: string
    severityLevel: string
    allLevels: string
    clear: string
    total: string
    incidents: string
    showing: string
    legend: string
    incidentTypes: string
    severityLevels: string
    noIncidents: string
    noMatchingIncidents: string
  }

  // Alerts and Notifications
  alerts: {
    watchZones: string
    configureGeographicZones: string
    addZone: string
    addWatchZone: string
    zoneName: string
    latitude: string
    longitude: string
    useCurrentLocation: string
    watchRadius: string
    radiusRange: string
    active: string
    inactive: string
    radius: string
    zoneAdded: string
    zoneActivated: string
    zoneDeactivated: string
    zoneDeleted: string
    noZonesConfigured: string
    addZonesToReceiveAlerts: string
    activeZones: string
    receiveNotifications: string
    notificationSettings: string
    customizeAlertsSettings: string
    notificationsEnabled: string
    receiveIncidentAlerts: string
    sound: string
    playSoundWithNotifications: string
    systemNotifications: string
    showBrowserNotifications: string
    allow: string
    testNotification: string
    permissionsGranted: string
    canReceiveNotifications: string
    permissionsDenied: string
    cannotReceiveNotifications: string
    testNotificationSent: string
    checkIfReceived: string
    incidentTypes: string
    selectIncidentTypesForAlerts: string
    severityLevels: string
    selectSeverityLevelsForAlerts: string
    saveSettings: string
    settingsSaved: string
    preferencesUpdated: string
    alertIn: string
    newIncident: string
  }

  // Community Resources
  community: {
    communityResources: string
    shareAndFindResources: string
    shareResource: string
    shareNewResource: string
    resourceTitle: string
    resourceType: string
    selectType: string
    description: string
    describeResource: string
    contact: string
    location: string
    optional: string
    cancel: string
    resourceShared: string
    sharedWithCommunity: string
    incompleteFields: string
    completeRequiredFields: string
    sharedBy: string
    moreInfo: string
  }

  // Settings
  settings: {
    settings: string
    customizeExperience: string
    notifications: string
    watchZones: string
    resources: string
    language: string
    selectLanguage: string
    accessibility: string
    accessibilityOptions: string
    largeText: string
    increaseFontSize: string
    highContrast: string
    enhanceContrast: string
    keyboardNavigation: string
    enableKeyboardShortcuts: string
    screenReader: string
    optimizeScreenReaders: string
  }

  // Accessibility
  accessibility: {
    skipToContent: string
    mainContent: string
    navigation: string
    searchLandmark: string
    complementaryContent: string
    contentInfo: string
    loading: string
    error: string
    success: string
    warning: string
    information: string
  }

  // Common
  common: {
    save: string
    cancel: string
    delete: string
    edit: string
    close: string
    back: string
    next: string
    previous: string
    continue: string
    hello: string
    search: string
    filter: string
    sort: string
    loading: string
    error: string
    success: string
    warning: string
    info: string
    yes: string
    no: string
    confirm: string
    required: string
  }
}

export const translations: Record<Language, Translations> = {
  es: {
    nav: {
      dashboard: "Dashboard",
      map: "Mapa",
      report: "Reportar",
      settings: "Configuración",
      logout: "Cerrar Sesión",
    },
    auth: {
      login: "Iniciar Sesión",
      email: "Email",
      password: "Contraseña",
      role: "Rol",
      selectRole: "Seleccionar Rol",
      selectRoleDescription: "Elige tu rol para acceder a las funcionalidades correspondientes",
      selectRoleTitle: "Selecciona tu rol en la plataforma",
      selected: "Seleccionado",
      permissions: "Permisos",
      welcome: "Bienvenido",
      loginSuccess: "has iniciado sesión correctamente",
      invalidCredentials: "Credenciales incorrectas",
      loginError: "Error al iniciar sesión",
      demoUsers: "Usuarios demo:",
      roles: {
        citizen: {
          title: "Ciudadano",
          description: "Reporta incidentes y participa en la comunidad",
          permissions: {
            create_reports: "Crear reportes de incidentes",
            view_map: "Ver mapa de incidentes",
            comment: "Comentar en reportes",
          },
        },
        public_entity: {
          title: "Entidad Pública",
          description: "Gestiona reportes y accede a herramientas administrativas",
          permissions: {
            mark_attended: "Marcar reportes como atendidos",
            view_stats: "Ver estadísticas y métricas",
            admin_access: "Acceso a panel administrativo",
          },
        },
      },
    },
    dashboard: {
      welcome: "Bienvenido",
      controlPanel: "Panel de control de la plataforma Lazarus",
      myReports: "Mis reportes",
      totalReports: "Total Reportes",
      activeUsers: "Usuarios Activos",
      reportsSubmitted: "Reportes enviados",
      inCommunity: "En la comunidad",
      reportingIncidents: "Reportando incidentes",
      quickActions: "Acciones rápidas",
      accessMainFunctions: "Accede rápidamente a las funciones principales",
      reportNewIncident: "Reportar Nuevo Incidente",
      viewIncidentMap: "Ver Mapa de Incidentes",
      recentReports: "Reportes Recientes",
      latestIncidents: "Últimos incidentes reportados en la comunidad",
      noRecentReports: "No hay reportes recientes",
    },
    incident: {
      reportIncident: "Reportar Incidente",
      completeAllFields: "Completa todos los campos para reportar un incidente en tu comunidad",
      incidentType: "Tipo de Incidente",
      selectIncidentType: "Selecciona el tipo de incidente",
      incidentLocation: "Ubicación del Incidente",
      incidentDescription: "Descripción del Incidente",
      describeIncident: "Describe detalladamente lo que está ocurriendo...",
      severityLevel: "Nivel de Gravedad",
      selectSeverityLevel: "Selecciona el nivel de gravedad",
      visualEvidence: "Evidencia Visual (Opcional)",
      uploadFiles: "Puedes subir hasta 5 fotos o videos como evidencia",
      maxFiles: "Máximo 5 archivos",
      reportSummary: "Resumen del Reporte",
      severity: "Gravedad",
      filesAttached: "archivo(s) adjunto(s)",
      sendReport: "Enviar Reporte",
      sending: "Enviando...",
      clear: "Limpiar",
      reportSent: "Reporte enviado",
      reportRegistered: "ha sido registrado exitosamente",
      notificationSent: "Notificación enviada",
      authoritiesNotified: "Las autoridades han sido notificadas del incidente",
      incompleteForm: "Formulario incompleto",
      completeRequiredFields: "Por favor completa todos los campos obligatorios",
      mustLogin: "Error",
      loginToReport: "Debes iniciar sesión para reportar incidentes",
    },
    map: {
      incidentMap: "Mapa de Incidentes",
      visualizeAndFilter: "Visualiza y filtra los reportes de incidentes en tu comunidad",
      mapFilters: "Filtros del Mapa",
      incidentType: "Tipo de Incidente",
      allTypes: "Todos los tipos",
      severityLevel: "Nivel de Gravedad",
      allLevels: "Todos los niveles",
      clear: "Limpiar",
      total: "Total",
      incidents: "incidentes",
      showing: "Mostrando",
      legend: "Leyenda",
      incidentTypes: "Tipos de Incidente",
      severityLevels: "Niveles de Gravedad",
      noIncidents: "Mapa Interactivo",
      noMatchingIncidents: "No hay incidentes que coincidan con los filtros seleccionados",
    },
    alerts: {
      watchZones: "Zonas de Vigilancia",
      configureGeographicZones: "Configura zonas geográficas para recibir alertas de incidentes",
      addZone: "Agregar Zona",
      addWatchZone: "Agregar Zona de Vigilancia",
      zoneName: "Nombre de la Zona",
      latitude: "Latitud",
      longitude: "Longitud",
      useCurrentLocation: "Usar mi ubicación actual",
      watchRadius: "Radio de Vigilancia (km)",
      radiusRange: "Entre 0.5 y 50 kilómetros",
      active: "Activa",
      inactive: "Inactiva",
      radius: "Radio",
      zoneAdded: "Zona agregada",
      zoneActivated: "Zona activada",
      zoneDeactivated: "Zona desactivada",
      zoneDeleted: "Zona eliminada",
      noZonesConfigured: "No tienes zonas de vigilancia configuradas",
      addZonesToReceiveAlerts: "Agrega zonas para recibir alertas cuando ocurran incidentes cerca",
      activeZones:
        "zona(s) de vigilancia activa(s). Recibirás notificaciones cuando ocurran incidentes en estas áreas.",
      receiveNotifications: "Recibirás notificaciones cuando ocurran incidentes en estas áreas",
      notificationSettings: "Configuración de Notificaciones",
      customizeAlertsSettings: "Personaliza cómo y cuándo recibir alertas de incidentes",
      notificationsEnabled: "Notificaciones Habilitadas",
      receiveIncidentAlerts: "Recibir alertas de incidentes en zonas vigiladas",
      sound: "Sonido",
      playSoundWithNotifications: "Reproducir sonido con las notificaciones",
      systemNotifications: "Notificaciones del Sistema",
      showBrowserNotifications: "Mostrar notificaciones del navegador",
      allow: "Permitir",
      testNotification: "Probar Notificación",
      permissionsGranted: "Permisos concedidos",
      canReceiveNotifications: "Ahora puedes recibir notificaciones del sistema Lazarus",
      permissionsDenied: "Permisos denegados",
      cannotReceiveNotifications: "No podrás recibir notificaciones del navegador",
      testNotificationSent: "Notificación enviada",
      checkIfReceived: "Revisa si recibiste la notificación del sistema",
      incidentTypes: "Tipos de Incidente",
      selectIncidentTypesForAlerts: "Selecciona los tipos de incidentes para los que quieres recibir alertas",
      severityLevels: "Niveles de Gravedad",
      selectSeverityLevelsForAlerts: "Selecciona los niveles de gravedad para los que quieres recibir alertas",
      saveSettings: "Guardar Configuración",
      settingsSaved: "Configuración guardada",
      preferencesUpdated: "Tus preferencias de notificación han sido actualizadas",
      alertIn: "Alerta en",
      newIncident: "Nuevo incidente",
    },
    community: {
      communityResources: "Recursos Comunitarios",
      shareAndFindResources: "Comparte y encuentra recursos útiles para emergencias",
      shareResource: "Compartir Recurso",
      shareNewResource: "Compartir Nuevo Recurso",
      resourceTitle: "Título del Recurso",
      resourceType: "Tipo de Recurso",
      selectType: "Seleccionar tipo",
      description: "Descripción",
      describeResource: "Describe el recurso, horarios, servicios disponibles...",
      contact: "Contacto (Opcional)",
      location: "Ubicación (Opcional)",
      optional: "Opcional",
      cancel: "Cancelar",
      resourceShared: "Recurso compartido",
      sharedWithCommunity: "Tu recurso ha sido compartido con la comunidad",
      incompleteFields: "Campos incompletos",
      completeRequiredFields: "Por favor completa al menos título, descripción y tipo de recurso",
      sharedBy: "Compartido por",
      moreInfo: "Más info",
    },
    settings: {
      settings: "Configuración",
      customizeExperience: "Personaliza tu experiencia en la plataforma Lazarus",
      notifications: "Notificaciones",
      watchZones: "Zonas de Vigilancia",
      resources: "Recursos",
      language: "Idioma",
      selectLanguage: "Seleccionar idioma",
      accessibility: "Accesibilidad",
      accessibilityOptions: "Opciones de accesibilidad",
      largeText: "Texto Grande",
      increaseFontSize: "Aumentar el tamaño de fuente para mejor legibilidad",
      highContrast: "Alto Contraste",
      enhanceContrast: "Mejorar el contraste para mejor visibilidad",
      keyboardNavigation: "Navegación por Teclado",
      enableKeyboardShortcuts: "Habilitar atajos de teclado para navegación",
      screenReader: "Lector de Pantalla",
      optimizeScreenReaders: "Optimizar para lectores de pantalla",
    },
    accessibility: {
      skipToContent: "Saltar al contenido principal",
      mainContent: "Contenido principal",
      navigation: "Navegación",
      searchLandmark: "Búsqueda",
      complementaryContent: "Contenido complementario",
      contentInfo: "Información del contenido",
      loading: "Cargando",
      error: "Error",
      success: "Éxito",
      warning: "Advertencia",
      information: "Información",
    },
    common: {
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      close: "Cerrar",
      back: "Atrás",
      next: "Siguiente",
      previous: "Anterior",
      continue: "Continuar",
      hello: "Hola",
      search: "Buscar",
      filter: "Filtrar",
      sort: "Ordenar",
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      warning: "Advertencia",
      info: "Información",
      yes: "Sí",
      no: "No",
      confirm: "Confirmar",
      required: "Requerido",
    },
  },
  en: {
    nav: {
      dashboard: "Dashboard",
      map: "Map",
      report: "Report",
      settings: "Settings",
      logout: "Logout",
    },
    auth: {
      login: "Login",
      email: "Email",
      password: "Password",
      role: "Role",
      selectRole: "Select Role",
      selectRoleDescription: "Choose your role to access the corresponding functionalities",
      selectRoleTitle: "Select your role on the platform",
      selected: "Selected",
      permissions: "Permissions",
      welcome: "Welcome",
      loginSuccess: "you have successfully logged in",
      invalidCredentials: "Invalid credentials",
      loginError: "Login error",
      demoUsers: "Demo users:",
      roles: {
        citizen: {
          title: "Citizen",
          description: "Report incidents and participate in the community",
          permissions: {
            create_reports: "Create incident reports",
            view_map: "View incident map",
            comment: "Comment on reports",
          },
        },
        public_entity: {
          title: "Public Entity",
          description: "Manage reports and access administrative tools",
          permissions: {
            mark_attended: "Mark reports as attended",
            view_stats: "View statistics and metrics",
            admin_access: "Access to administrative panel",
          },
        },
      },
    },
    dashboard: {
      welcome: "Welcome",
      controlPanel: "Lazarus platform control panel",
      myReports: "My Reports",
      totalReports: "Total Reports",
      activeUsers: "Active Users",
      reportsSubmitted: "Reports submitted",
      inCommunity: "In the community",
      reportingIncidents: "Reporting incidents",
      quickActions: "Quick Actions",
      accessMainFunctions: "Quickly access main functions",
      reportNewIncident: "Report New Incident",
      viewIncidentMap: "View Incident Map",
      recentReports: "Recent Reports",
      latestIncidents: "Latest incidents reported in the community",
      noRecentReports: "No recent reports",
    },
    incident: {
      reportIncident: "Report Incident",
      completeAllFields: "Complete all fields to report an incident in your community",
      incidentType: "Incident Type",
      selectIncidentType: "Select the type of incident",
      incidentLocation: "Incident Location",
      incidentDescription: "Incident Description",
      describeIncident: "Describe in detail what is happening...",
      severityLevel: "Severity Level",
      selectSeverityLevel: "Select the severity level",
      visualEvidence: "Visual Evidence (Optional)",
      uploadFiles: "You can upload up to 5 photos or videos as evidence",
      maxFiles: "Maximum 5 files",
      reportSummary: "Report Summary",
      severity: "Severity",
      filesAttached: "file(s) attached",
      sendReport: "Send Report",
      sending: "Sending...",
      clear: "Clear",
      reportSent: "Report sent",
      reportRegistered: "has been successfully registered",
      notificationSent: "Notification sent",
      authoritiesNotified: "Authorities have been notified of the incident",
      incompleteForm: "Incomplete form",
      completeRequiredFields: "Please complete all required fields",
      mustLogin: "Error",
      loginToReport: "You must log in to report incidents",
    },
    map: {
      incidentMap: "Incident Map",
      visualizeAndFilter: "Visualize and filter incident reports in your community",
      mapFilters: "Map Filters",
      incidentType: "Incident Type",
      allTypes: "All types",
      severityLevel: "Severity Level",
      allLevels: "All levels",
      clear: "Clear",
      total: "Total",
      incidents: "incidents",
      showing: "Showing",
      legend: "Legend",
      incidentTypes: "Incident Types",
      severityLevels: "Severity Levels",
      noIncidents: "Interactive Map",
      noMatchingIncidents: "No incidents match the selected filters",
    },
    alerts: {
      watchZones: "Watch Zones",
      configureGeographicZones: "Configure geographic zones to receive incident alerts",
      addZone: "Add Zone",
      addWatchZone: "Add Watch Zone",
      zoneName: "Zone Name",
      latitude: "Latitude",
      longitude: "Longitude",
      useCurrentLocation: "Use my current location",
      watchRadius: "Watch Radius (km)",
      radiusRange: "Between 0.5 and 50 kilometers",
      active: "Active",
      inactive: "Inactive",
      radius: "Radius",
      zoneAdded: "Zone added",
      zoneActivated: "Zone activated",
      zoneDeactivated: "Zone deactivated",
      zoneDeleted: "Zone deleted",
      noZonesConfigured: "You have no watch zones configured",
      addZonesToReceiveAlerts: "Add zones to receive alerts when incidents occur nearby",
      activeZones: "active watch zone(s). You will receive notifications when incidents occur in these areas.",
      receiveNotifications: "You will receive notifications when incidents occur in these areas",
      notificationSettings: "Notification Settings",
      customizeAlertsSettings: "Customize how and when to receive incident alerts",
      notificationsEnabled: "Notifications Enabled",
      receiveIncidentAlerts: "Receive incident alerts in watched zones",
      sound: "Sound",
      playSoundWithNotifications: "Play sound with notifications",
      systemNotifications: "System Notifications",
      showBrowserNotifications: "Show browser notifications",
      allow: "Allow",
      testNotification: "Test Notification",
      permissionsGranted: "Permissions granted",
      canReceiveNotifications: "You can now receive Lazarus system notifications",
      permissionsDenied: "Permissions denied",
      cannotReceiveNotifications: "You will not be able to receive browser notifications",
      testNotificationSent: "Notification sent",
      checkIfReceived: "Check if you received the system notification",
      incidentTypes: "Incident Types",
      selectIncidentTypesForAlerts: "Select the incident types you want to receive alerts for",
      severityLevels: "Severity Levels",
      selectSeverityLevelsForAlerts: "Select the severity levels you want to receive alerts for",
      saveSettings: "Save Settings",
      settingsSaved: "Settings saved",
      preferencesUpdated: "Your notification preferences have been updated",
      alertIn: "Alert in",
      newIncident: "New incident",
    },
    community: {
      communityResources: "Community Resources",
      shareAndFindResources: "Share and find useful resources for emergencies",
      shareResource: "Share Resource",
      shareNewResource: "Share New Resource",
      resourceTitle: "Resource Title",
      resourceType: "Resource Type",
      selectType: "Select type",
      description: "Description",
      describeResource: "Describe the resource, schedules, available services...",
      contact: "Contact (Optional)",
      location: "Location (Optional)",
      optional: "Optional",
      cancel: "Cancel",
      resourceShared: "Resource shared",
      sharedWithCommunity: "Your resource has been shared with the community",
      incompleteFields: "Incomplete fields",
      completeRequiredFields: "Please complete at least title, description and resource type",
      sharedBy: "Shared by",
      moreInfo: "More info",
    },
    settings: {
      settings: "Settings",
      customizeExperience: "Customize your experience on the Lazarus platform",
      notifications: "Notifications",
      watchZones: "Watch Zones",
      resources: "Resources",
      language: "Language",
      selectLanguage: "Select language",
      accessibility: "Accessibility",
      accessibilityOptions: "Accessibility options",
      largeText: "Large Text",
      increaseFontSize: "Increase font size for better readability",
      highContrast: "High Contrast",
      enhanceContrast: "Enhance contrast for better visibility",
      keyboardNavigation: "Keyboard Navigation",
      enableKeyboardShortcuts: "Enable keyboard shortcuts for navigation",
      screenReader: "Screen Reader",
      optimizeScreenReaders: "Optimize for screen readers",
    },
    accessibility: {
      skipToContent: "Skip to main content",
      mainContent: "Main content",
      navigation: "Navigation",
      searchLandmark: "Search",
      complementaryContent: "Complementary content",
      contentInfo: "Content information",
      loading: "Loading",
      error: "Error",
      success: "Success",
      warning: "Warning",
      information: "Information",
    },
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      back: "Back",
      next: "Next",
      previous: "Previous",
      continue: "Continue",
      hello: "Hello",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      warning: "Warning",
      info: "Information",
      yes: "Yes",
      no: "No",
      confirm: "Confirm",
      required: "Required",
    },
  },
}

export function getTranslation(language: Language, key: string): string {
  const keys = key.split(".")
  let value: any = translations[language]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}

/**
 * Servicio de ubicaciones de Costa Rica
 * Provincias, Cantones y Distritos
 */

export interface Provincia {
  id: number
  nombre: string
}

export interface Canton {
  id: number
  nombre: string
  provincia_id: number
}

export interface Distrito {
  id: number
  nombre: string
  canton_id: number
}

// Provincias de Costa Rica
export const provincias: Provincia[] = [
  { id: 1, nombre: "San José" },
  { id: 2, nombre: "Alajuela" },
  { id: 3, nombre: "Cartago" },
  { id: 4, nombre: "Heredia" },
  { id: 5, nombre: "Guanacaste" },
  { id: 6, nombre: "Puntarenas" },
  { id: 7, nombre: "Limón" }
]

// Cantones principales por provincia
export const cantones: Canton[] = [
  // San José
  { id: 1, nombre: "San José", provincia_id: 1 },
  { id: 2, nombre: "Escazú", provincia_id: 1 },
  { id: 3, nombre: "Desamparados", provincia_id: 1 },
  { id: 4, nombre: "Puriscal", provincia_id: 1 },
  { id: 5, nombre: "Tarrazú", provincia_id: 1 },
  { id: 6, nombre: "Aserrí", provincia_id: 1 },
  { id: 7, nombre: "Mora", provincia_id: 1 },
  { id: 8, nombre: "Goicoechea", provincia_id: 1 },
  { id: 9, nombre: "Santa Ana", provincia_id: 1 },
  { id: 10, nombre: "Alajuelita", provincia_id: 1 },
  { id: 11, nombre: "Vázquez de Coronado", provincia_id: 1 },
  { id: 12, nombre: "Acosta", provincia_id: 1 },
  { id: 13, nombre: "Tibás", provincia_id: 1 },
  { id: 14, nombre: "Moravia", provincia_id: 1 },
  { id: 15, nombre: "Montes de Oca", provincia_id: 1 },
  { id: 16, nombre: "Turrubares", provincia_id: 1 },
  { id: 17, nombre: "Dota", provincia_id: 1 },
  { id: 18, nombre: "Curridabat", provincia_id: 1 },
  { id: 19, nombre: "Pérez Zeledón", provincia_id: 1 },
  { id: 20, nombre: "León Cortés Castro", provincia_id: 1 },

  // Alajuela
  { id: 21, nombre: "Alajuela", provincia_id: 2 },
  { id: 22, nombre: "San Ramón", provincia_id: 2 },
  { id: 23, nombre: "Grecia", provincia_id: 2 },
  { id: 24, nombre: "San Mateo", provincia_id: 2 },
  { id: 25, nombre: "Atenas", provincia_id: 2 },
  { id: 26, nombre: "Naranjo", provincia_id: 2 },
  { id: 27, nombre: "Palmares", provincia_id: 2 },
  { id: 28, nombre: "Poás", provincia_id: 2 },
  { id: 29, nombre: "Orotina", provincia_id: 2 },
  { id: 30, nombre: "San Carlos", provincia_id: 2 },
  { id: 31, nombre: "Zarcero", provincia_id: 2 },
  { id: 32, nombre: "Sarchí", provincia_id: 2 },
  { id: 33, nombre: "Upala", provincia_id: 2 },
  { id: 34, nombre: "Los Chiles", provincia_id: 2 },
  { id: 35, nombre: "Guatuso", provincia_id: 2 },
  { id: 36, nombre: "Río Cuarto", provincia_id: 2 },

  // Cartago
  { id: 37, nombre: "Cartago", provincia_id: 3 },
  { id: 38, nombre: "Paraíso", provincia_id: 3 },
  { id: 39, nombre: "La Unión", provincia_id: 3 },
  { id: 40, nombre: "Jiménez", provincia_id: 3 },
  { id: 41, nombre: "Turrialba", provincia_id: 3 },
  { id: 42, nombre: "Alvarado", provincia_id: 3 },
  { id: 43, nombre: "Oreamuno", provincia_id: 3 },
  { id: 44, nombre: "El Guarco", provincia_id: 3 },

  // Heredia
  { id: 45, nombre: "Heredia", provincia_id: 4 },
  { id: 46, nombre: "Barva", provincia_id: 4 },
  { id: 47, nombre: "Santo Domingo", provincia_id: 4 },
  { id: 48, nombre: "Santa Bárbara", provincia_id: 4 },
  { id: 49, nombre: "San Rafael", provincia_id: 4 },
  { id: 50, nombre: "San Isidro", provincia_id: 4 },
  { id: 51, nombre: "Belén", provincia_id: 4 },
  { id: 52, nombre: "Flores", provincia_id: 4 },
  { id: 53, nombre: "San Pablo", provincia_id: 4 },
  { id: 54, nombre: "Sarapiquí", provincia_id: 4 },

  // Guanacaste
  { id: 55, nombre: "Liberia", provincia_id: 5 },
  { id: 56, nombre: "Nicoya", provincia_id: 5 },
  { id: 57, nombre: "Santa Cruz", provincia_id: 5 },
  { id: 58, nombre: "Bagaces", provincia_id: 5 },
  { id: 59, nombre: "Carrillo", provincia_id: 5 },
  { id: 60, nombre: "Cañas", provincia_id: 5 },
  { id: 61, nombre: "Abangares", provincia_id: 5 },
  { id: 62, nombre: "Tilarán", provincia_id: 5 },
  { id: 63, nombre: "Nandayure", provincia_id: 5 },
  { id: 64, nombre: "La Cruz", provincia_id: 5 },
  { id: 65, nombre: "Hojancha", provincia_id: 5 },

  // Puntarenas
  { id: 66, nombre: "Puntarenas", provincia_id: 6 },
  { id: 67, nombre: "Esparza", provincia_id: 6 },
  { id: 68, nombre: "Buenos Aires", provincia_id: 6 },
  { id: 69, nombre: "Montes de Oro", provincia_id: 6 },
  { id: 70, nombre: "Osa", provincia_id: 6 },
  { id: 71, nombre: "Quepos", provincia_id: 6 },
  { id: 72, nombre: "Golfito", provincia_id: 6 },
  { id: 73, nombre: "Coto Brus", provincia_id: 6 },
  { id: 74, nombre: "Parrita", provincia_id: 6 },
  { id: 75, nombre: "Corredores", provincia_id: 6 },
  { id: 76, nombre: "Garabito", provincia_id: 6 },

  // Limón
  { id: 77, nombre: "Limón", provincia_id: 7 },
  { id: 78, nombre: "Pococí", provincia_id: 7 },
  { id: 79, nombre: "Siquirres", provincia_id: 7 },
  { id: 80, nombre: "Talamanca", provincia_id: 7 },
  { id: 81, nombre: "Matina", provincia_id: 7 },
  { id: 82, nombre: "Guácimo", provincia_id: 7 }
]

// Distritos principales por cantón (selección más común)
export const distritos: Distrito[] = [
  // San José (Canton 1)
  { id: 1, nombre: "Carmen", canton_id: 1 },
  { id: 2, nombre: "Merced", canton_id: 1 },
  { id: 3, nombre: "Hospital", canton_id: 1 },
  { id: 4, nombre: "Catedral", canton_id: 1 },
  { id: 5, nombre: "Zapote", canton_id: 1 },
  { id: 6, nombre: "San Francisco de Dos Ríos", canton_id: 1 },
  { id: 7, nombre: "Uruca", canton_id: 1 },
  { id: 8, nombre: "Mata Redonda", canton_id: 1 },
  { id: 9, nombre: "Pavas", canton_id: 1 },
  { id: 10, nombre: "Hatillo", canton_id: 1 },
  { id: 11, nombre: "San Sebastián", canton_id: 1 },

  // Escazú (Canton 2)
  { id: 12, nombre: "Escazú", canton_id: 2 },
  { id: 13, nombre: "San Antonio", canton_id: 2 },
  { id: 14, nombre: "San Rafael", canton_id: 2 },

  // Desamparados (Canton 3)
  { id: 15, nombre: "Desamparados", canton_id: 3 },
  { id: 16, nombre: "San Miguel", canton_id: 3 },
  { id: 17, nombre: "San Juan de Dios", canton_id: 3 },
  { id: 18, nombre: "San Rafael Arriba", canton_id: 3 },
  { id: 19, nombre: "San Antonio", canton_id: 3 },
  { id: 20, nombre: "Frailes", canton_id: 3 },
  { id: 21, nombre: "Patarrá", canton_id: 3 },
  { id: 22, nombre: "San Cristóbal", canton_id: 3 },
  { id: 23, nombre: "Rosario", canton_id: 3 },
  { id: 24, nombre: "Damas", canton_id: 3 },
  { id: 25, nombre: "San Rafael Abajo", canton_id: 3 },
  { id: 26, nombre: "Gravilias", canton_id: 3 },
  { id: 27, nombre: "Los Guido", canton_id: 3 },

  // Goicoechea (Canton 8)
  { id: 28, nombre: "Guadalupe", canton_id: 8 },
  { id: 29, nombre: "San Francisco", canton_id: 8 },
  { id: 30, nombre: "Calle Blancos", canton_id: 8 },
  { id: 31, nombre: "Mata de Plátano", canton_id: 8 },
  { id: 32, nombre: "Ipís", canton_id: 8 },
  { id: 33, nombre: "Rancho Redondo", canton_id: 8 },
  { id: 34, nombre: "Purral", canton_id: 8 },

  // Santa Ana (Canton 9)
  { id: 35, nombre: "Santa Ana", canton_id: 9 },
  { id: 36, nombre: "Salitral", canton_id: 9 },
  { id: 37, nombre: "Pozos", canton_id: 9 },
  { id: 38, nombre: "Uruca", canton_id: 9 },
  { id: 39, nombre: "Piedades", canton_id: 9 },
  { id: 40, nombre: "Brasil", canton_id: 9 },

  // Alajuela (Canton 21)
  { id: 41, nombre: "Alajuela", canton_id: 21 },
  { id: 42, nombre: "San José", canton_id: 21 },
  { id: 43, nombre: "Carrizal", canton_id: 21 },
  { id: 44, nombre: "San Antonio", canton_id: 21 },
  { id: 45, nombre: "Guácima", canton_id: 21 },
  { id: 46, nombre: "San Isidro", canton_id: 21 },
  { id: 47, nombre: "Sabanilla", canton_id: 21 },
  { id: 48, nombre: "San Rafael", canton_id: 21 },
  { id: 49, nombre: "Río Segundo", canton_id: 21 },
  { id: 50, nombre: "Desamparados", canton_id: 21 },
  { id: 51, nombre: "Turrúcares", canton_id: 21 },
  { id: 52, nombre: "Tambor", canton_id: 21 },
  { id: 53, nombre: "Garita", canton_id: 21 },
  { id: 54, nombre: "Sarapiquí", canton_id: 21 },

  // Cartago (Canton 37)
  { id: 55, nombre: "Oriental", canton_id: 37 },
  { id: 56, nombre: "Occidental", canton_id: 37 },
  { id: 57, nombre: "Carmen", canton_id: 37 },
  { id: 58, nombre: "San Nicolás", canton_id: 37 },
  { id: 59, nombre: "Aguacaliente (San Francisco)", canton_id: 37 },
  { id: 60, nombre: "Guadalupe (Arenilla)", canton_id: 37 },
  { id: 61, nombre: "Corralillo", canton_id: 37 },
  { id: 62, nombre: "Tierra Blanca", canton_id: 37 },
  { id: 63, nombre: "Dulce Nombre", canton_id: 37 },
  { id: 64, nombre: "Llano Grande", canton_id: 37 },
  { id: 65, nombre: "Quebradilla", canton_id: 37 },

  // Heredia (Canton 45)
  { id: 66, nombre: "Heredia", canton_id: 45 },
  { id: 67, nombre: "Mercedes", canton_id: 45 },
  { id: 68, nombre: "San Francisco", canton_id: 45 },
  { id: 69, nombre: "Ulloa", canton_id: 45 },
  { id: 70, nombre: "Varablanca", canton_id: 45 },

  // Liberia (Canton 55)
  { id: 71, nombre: "Liberia", canton_id: 55 },
  { id: 72, nombre: "Cañas Dulces", canton_id: 55 },
  { id: 73, nombre: "Mayorga", canton_id: 55 },
  { id: 74, nombre: "Nacascolo", canton_id: 55 },
  { id: 75, nombre: "Curubandé", canton_id: 55 },

  // Puntarenas (Canton 66)
  { id: 76, nombre: "Puntarenas", canton_id: 66 },
  { id: 77, nombre: "Pitahaya", canton_id: 66 },
  { id: 78, nombre: "Chomes", canton_id: 66 },
  { id: 79, nombre: "Lepanto", canton_id: 66 },
  { id: 80, nombre: "Paquera", canton_id: 66 },
  { id: 81, nombre: "Manzanillo", canton_id: 66 },
  { id: 82, nombre: "Guacimal", canton_id: 66 },
  { id: 83, nombre: "Barranca", canton_id: 66 },
  { id: 84, nombre: "Monte Verde", canton_id: 66 },
  { id: 85, nombre: "Isla del Coco", canton_id: 66 },
  { id: 86, nombre: "Cóbano", canton_id: 66 },
  { id: 87, nombre: "Chacarita", canton_id: 66 },
  { id: 88, nombre: "Chira", canton_id: 66 },
  { id: 89, nombre: "Acapulco", canton_id: 66 },
  { id: 90, nombre: "El Roble", canton_id: 66 },
  { id: 91, nombre: "Arancibia", canton_id: 66 },

  // Limón (Canton 77)
  { id: 92, nombre: "Limón", canton_id: 77 },
  { id: 93, nombre: "Valle La Estrella", canton_id: 77 },
  { id: 94, nombre: "Río Blanco", canton_id: 77 },
  { id: 95, nombre: "Matama", canton_id: 77 },

  // Puriscal (Canton 4)
  { id: 96, nombre: "Santiago", canton_id: 4 },
  { id: 97, nombre: "Mercedes Sur", canton_id: 4 },
  { id: 98, nombre: "Barbacoas", canton_id: 4 },
  { id: 99, nombre: "Grifo Alto", canton_id: 4 },
  { id: 100, nombre: "San Rafael", canton_id: 4 },
  { id: 101, nombre: "Candelarita", canton_id: 4 },
  { id: 102, nombre: "Desamparaditos", canton_id: 4 },
  { id: 103, nombre: "San Antonio", canton_id: 4 },
  { id: 104, nombre: "Chires", canton_id: 4 },

  // Aserrí (Canton 6)
  { id: 105, nombre: "Aserrí", canton_id: 6 },
  { id: 106, nombre: "Tarbaca", canton_id: 6 },
  { id: 107, nombre: "Vuelta de Jorco", canton_id: 6 },
  { id: 108, nombre: "San Gabriel", canton_id: 6 },
  { id: 109, nombre: "Legua", canton_id: 6 },
  { id: 110, nombre: "Monterrey", canton_id: 6 },
  { id: 111, nombre: "Salitrillos", canton_id: 6 },

  // Mora (Canton 7)
  { id: 112, nombre: "Colón", canton_id: 7 },
  { id: 113, nombre: "Guayabo", canton_id: 7 },
  { id: 114, nombre: "Tabarcia", canton_id: 7 },
  { id: 115, nombre: "Piedras Negras", canton_id: 7 },
  { id: 116, nombre: "Picagres", canton_id: 7 },

  // Alajuelita (Canton 10)
  { id: 117, nombre: "Alajuelita", canton_id: 10 },
  { id: 118, nombre: "San Josecito", canton_id: 10 },
  { id: 119, nombre: "San Antonio", canton_id: 10 },
  { id: 120, nombre: "Concepción", canton_id: 10 },
  { id: 121, nombre: "San Felipe", canton_id: 10 },

  // Vázquez de Coronado (Canton 11)
  { id: 122, nombre: "San Isidro", canton_id: 11 },
  { id: 123, nombre: "San Rafael", canton_id: 11 },
  { id: 124, nombre: "Dulce Nombre de Jesús", canton_id: 11 },
  { id: 125, nombre: "Patalillo", canton_id: 11 },
  { id: 126, nombre: "Cascajal", canton_id: 11 },

  // Tibás (Canton 13)
  { id: 127, nombre: "San Juan", canton_id: 13 },
  { id: 128, nombre: "Cinco Esquinas", canton_id: 13 },
  { id: 129, nombre: "Anselmo Llorente", canton_id: 13 },
  { id: 130, nombre: "León XIII", canton_id: 13 },
  { id: 131, nombre: "Colima", canton_id: 13 },

  // Moravia (Canton 14)
  { id: 132, nombre: "San Vicente", canton_id: 14 },
  { id: 133, nombre: "San Jerónimo", canton_id: 14 },
  { id: 134, nombre: "La Trinidad", canton_id: 14 },

  // Montes de Oca (Canton 15)
  { id: 135, nombre: "San Pedro", canton_id: 15 },
  { id: 136, nombre: "Sabanilla", canton_id: 15 },
  { id: 137, nombre: "Mercedes", canton_id: 15 },
  { id: 138, nombre: "San Rafael", canton_id: 15 },

  // Curridabat (Canton 18)
  { id: 139, nombre: "Curridabat", canton_id: 18 },
  { id: 140, nombre: "Granadilla", canton_id: 18 },
  { id: 141, nombre: "Sánchez", canton_id: 18 },
  { id: 142, nombre: "Tirrases", canton_id: 18 },

  // Pérez Zeledón (Canton 19)
  { id: 143, nombre: "San Isidro de El General", canton_id: 19 },
  { id: 144, nombre: "El General", canton_id: 19 },
  { id: 145, nombre: "Daniel Flores", canton_id: 19 },
  { id: 146, nombre: "Rivas", canton_id: 19 },
  { id: 147, nombre: "San Pedro", canton_id: 19 },
  { id: 148, nombre: "Platanares", canton_id: 19 },
  { id: 149, nombre: "Pejibaye", canton_id: 19 },
  { id: 150, nombre: "Cajón", canton_id: 19 },

  // San Ramón (Canton 22)
  { id: 151, nombre: "San Ramón", canton_id: 22 },
  { id: 152, nombre: "Santiago", canton_id: 22 },
  { id: 153, nombre: "San Juan", canton_id: 22 },
  { id: 154, nombre: "Piedades Norte", canton_id: 22 },
  { id: 155, nombre: "Piedades Sur", canton_id: 22 },
  { id: 156, nombre: "San Rafael", canton_id: 22 },
  { id: 157, nombre: "San Isidro", canton_id: 22 },

  // Grecia (Canton 23)
  { id: 158, nombre: "Grecia", canton_id: 23 },
  { id: 159, nombre: "San Isidro", canton_id: 23 },
  { id: 160, nombre: "San José", canton_id: 23 },
  { id: 161, nombre: "San Roque", canton_id: 23 },
  { id: 162, nombre: "Tacares", canton_id: 23 },
  { id: 163, nombre: "Puente de Piedra", canton_id: 23 },
  { id: 164, nombre: "Bolívar", canton_id: 23 },

  // Atenas (Canton 25)
  { id: 165, nombre: "Atenas", canton_id: 25 },
  { id: 166, nombre: "Jesús", canton_id: 25 },
  { id: 167, nombre: "Mercedes", canton_id: 25 },
  { id: 168, nombre: "San Isidro", canton_id: 25 },
  { id: 169, nombre: "Concepción", canton_id: 25 },
  { id: 170, nombre: "San José", canton_id: 25 },
  { id: 171, nombre: "Santa Eulalia", canton_id: 25 },

  // Naranjo (Canton 26)
  { id: 172, nombre: "Naranjo", canton_id: 26 },
  { id: 173, nombre: "San Miguel", canton_id: 26 },
  { id: 174, nombre: "San José", canton_id: 26 },
  { id: 175, nombre: "Cirrí Sur", canton_id: 26 },
  { id: 176, nombre: "San Jerónimo", canton_id: 26 },

  // San Carlos (Canton 30)
  { id: 177, nombre: "Quesada", canton_id: 30 },
  { id: 178, nombre: "Florencia", canton_id: 30 },
  { id: 179, nombre: "Buenavista", canton_id: 30 },
  { id: 180, nombre: "Aguas Zarcas", canton_id: 30 },
  { id: 181, nombre: "Venecia", canton_id: 30 },
  { id: 182, nombre: "Pital", canton_id: 30 },
  { id: 183, nombre: "La Fortuna", canton_id: 30 },
  { id: 184, nombre: "La Tigra", canton_id: 30 },

  // Paraíso (Canton 38)
  { id: 185, nombre: "Paraíso", canton_id: 38 },
  { id: 186, nombre: "Santiago", canton_id: 38 },
  { id: 187, nombre: "Orosi", canton_id: 38 },
  { id: 188, nombre: "Cachí", canton_id: 38 },
  { id: 189, nombre: "Llanos de Santa Lucía", canton_id: 38 },

  // La Unión (Canton 39)
  { id: 190, nombre: "Tres Ríos", canton_id: 39 },
  { id: 191, nombre: "San Diego", canton_id: 39 },
  { id: 192, nombre: "San Juan", canton_id: 39 },
  { id: 193, nombre: "San Rafael", canton_id: 39 },
  { id: 194, nombre: "Concepción", canton_id: 39 },
  { id: 195, nombre: "Dulce Nombre", canton_id: 39 },
  { id: 196, nombre: "San Ramón", canton_id: 39 },
  { id: 197, nombre: "Río Azul", canton_id: 39 },

  // Turrialba (Canton 41)
  { id: 198, nombre: "Turrialba", canton_id: 41 },
  { id: 199, nombre: "La Suiza", canton_id: 41 },
  { id: 200, nombre: "Peralta", canton_id: 41 },
  { id: 201, nombre: "Santa Cruz", canton_id: 41 },
  { id: 202, nombre: "Santa Teresita", canton_id: 41 },

  // Oreamuno (Canton 43)
  { id: 203, nombre: "San Rafael", canton_id: 43 },
  { id: 204, nombre: "Cot", canton_id: 43 },
  { id: 205, nombre: "Potrero Cerrado", canton_id: 43 },
  { id: 206, nombre: "Cipreses", canton_id: 43 },
  { id: 207, nombre: "Santa Rosa", canton_id: 43 },

  // El Guarco (Canton 44)
  { id: 208, nombre: "El Tejar", canton_id: 44 },
  { id: 209, nombre: "San Isidro", canton_id: 44 },
  { id: 210, nombre: "Tobosi", canton_id: 44 },
  { id: 211, nombre: "Patio de Agua", canton_id: 44 },

  // Barva (Canton 46)
  { id: 212, nombre: "Barva", canton_id: 46 },
  { id: 213, nombre: "San Pedro", canton_id: 46 },
  { id: 214, nombre: "San Pablo", canton_id: 46 },
  { id: 215, nombre: "San Roque", canton_id: 46 },
  { id: 216, nombre: "Santa Lucía", canton_id: 46 },
  { id: 217, nombre: "San José de la Montaña", canton_id: 46 },

  // Santo Domingo (Canton 47)
  { id: 218, nombre: "Santo Domingo", canton_id: 47 },
  { id: 219, nombre: "San Vicente", canton_id: 47 },
  { id: 220, nombre: "San Miguel", canton_id: 47 },
  { id: 221, nombre: "Paracito", canton_id: 47 },
  { id: 222, nombre: "Santo Tomás", canton_id: 47 },
  { id: 223, nombre: "Santa Rosa", canton_id: 47 },
  { id: 224, nombre: "Tures", canton_id: 47 },
  { id: 225, nombre: "Pará", canton_id: 47 },

  // Santa Bárbara (Canton 48)
  { id: 226, nombre: "Santa Bárbara", canton_id: 48 },
  { id: 227, nombre: "San Pedro", canton_id: 48 },
  { id: 228, nombre: "San Juan", canton_id: 48 },
  { id: 229, nombre: "Jesús", canton_id: 48 },
  { id: 230, nombre: "Santo Domingo", canton_id: 48 },
  { id: 231, nombre: "Purabá", canton_id: 48 },

  // San Rafael (Canton 49)
  { id: 232, nombre: "San Rafael", canton_id: 49 },
  { id: 233, nombre: "San Josecito", canton_id: 49 },
  { id: 234, nombre: "Santiago", canton_id: 49 },
  { id: 235, nombre: "Ángeles", canton_id: 49 },
  { id: 236, nombre: "Concepción", canton_id: 49 },

  // San Isidro (Canton 50)
  { id: 237, nombre: "San Isidro", canton_id: 50 },
  { id: 238, nombre: "San José", canton_id: 50 },
  { id: 239, nombre: "Concepción", canton_id: 50 },
  { id: 240, nombre: "San Francisco", canton_id: 50 },

  // Belén (Canton 51)
  { id: 241, nombre: "San Antonio", canton_id: 51 },
  { id: 242, nombre: "La Ribera", canton_id: 51 },
  { id: 243, nombre: "La Asunción", canton_id: 51 },

  // Flores (Canton 52)
  { id: 244, nombre: "San Joaquín", canton_id: 52 },
  { id: 245, nombre: "Barrantes", canton_id: 52 },
  { id: 246, nombre: "Llorente", canton_id: 52 },

  // San Pablo (Canton 53)
  { id: 247, nombre: "San Pablo", canton_id: 53 },
  { id: 248, nombre: "Rincón de Sabanilla", canton_id: 53 },

  // Sarapiquí (Canton 54)
  { id: 249, nombre: "Puerto Viejo", canton_id: 54 },
  { id: 250, nombre: "La Virgen", canton_id: 54 },
  { id: 251, nombre: "Horquetas", canton_id: 54 },
  { id: 252, nombre: "Llanuras del Gaspar", canton_id: 54 },
  { id: 253, nombre: "Cureña", canton_id: 54 },

  // Nicoya (Canton 56)
  { id: 254, nombre: "Nicoya", canton_id: 56 },
  { id: 255, nombre: "Mansión", canton_id: 56 },
  { id: 256, nombre: "San Antonio", canton_id: 56 },
  { id: 257, nombre: "Quebrada Honda", canton_id: 56 },
  { id: 258, nombre: "Sámara", canton_id: 56 },
  { id: 259, nombre: "Nosara", canton_id: 56 },
  { id: 260, nombre: "Belén de Nosarita", canton_id: 56 },

  // Santa Cruz (Canton 57)
  { id: 261, nombre: "Santa Cruz", canton_id: 57 },
  { id: 262, nombre: "Bolsón", canton_id: 57 },
  { id: 263, nombre: "Veintisiete de Abril", canton_id: 57 },
  { id: 264, nombre: "Tempate", canton_id: 57 },
  { id: 265, nombre: "Cartagena", canton_id: 57 },
  { id: 266, nombre: "Cuajiniquil", canton_id: 57 },
  { id: 267, nombre: "Diriá", canton_id: 57 },
  { id: 268, nombre: "Cabo Velas", canton_id: 57 },
  { id: 269, nombre: "Tamarindo", canton_id: 57 },

  // Pococí (Canton 78)
  { id: 270, nombre: "Guápiles", canton_id: 78 },
  { id: 271, nombre: "Jiménez", canton_id: 78 },
  { id: 272, nombre: "La Rita", canton_id: 78 },
  { id: 273, nombre: "Roxana", canton_id: 78 },
  { id: 274, nombre: "Cariari", canton_id: 78 },
  { id: 275, nombre: "Colorado", canton_id: 78 },

  // Siquirres (Canton 79)
  { id: 276, nombre: "Siquirres", canton_id: 79 },
  { id: 277, nombre: "Pacuarito", canton_id: 79 },
  { id: 278, nombre: "Florida", canton_id: 79 },
  { id: 279, nombre: "Germania", canton_id: 79 },
  { id: 280, nombre: "Cairo", canton_id: 79 },
  { id: 281, nombre: "Alegría", canton_id: 79 },

  // Talamanca (Canton 80)
  { id: 282, nombre: "Bratsi", canton_id: 80 },
  { id: 283, nombre: "Sixaola", canton_id: 80 },
  { id: 284, nombre: "Cahuita", canton_id: 80 },
  { id: 285, nombre: "Telire", canton_id: 80 },

  // Matina (Canton 81)
  { id: 286, nombre: "Matina", canton_id: 81 },
  { id: 287, nombre: "Batán", canton_id: 81 },
  { id: 288, nombre: "Carrandi", canton_id: 81 },

  // Guácimo (Canton 82)
  { id: 289, nombre: "Guácimo", canton_id: 82 },
  { id: 290, nombre: "Mercedes", canton_id: 82 },
  { id: 291, nombre: "Pocora", canton_id: 82 },
  { id: 292, nombre: "Río Jiménez", canton_id: 82 },

  // Quepos (Canton 71)
  { id: 293, nombre: "Quepos", canton_id: 71 },
  { id: 294, nombre: "Savegre", canton_id: 71 },
  { id: 295, nombre: "Naranjito", canton_id: 71 },

  // Esparza (Canton 67)
  { id: 296, nombre: "Espíritu Santo", canton_id: 67 },
  { id: 297, nombre: "San Juan Grande", canton_id: 67 },
  { id: 298, nombre: "Macacona", canton_id: 67 },
  { id: 299, nombre: "San Rafael", canton_id: 67 },
  { id: 300, nombre: "San Jerónimo", canton_id: 67 }
]

/**
 * Clase para manejar ubicaciones de Costa Rica
 */
class CostaRicaLocationsService {
  /**
   * Obtener todas las provincias
   */
  getProvincias(): Provincia[] {
    return provincias
  }

  /**
   * Obtener cantones por provincia
   */
  getCantonesByProvincia(provinciaNombre: string): Canton[] {
    const provincia = provincias.find(p => p.nombre === provinciaNombre)
    if (!provincia) return []
    
    return cantones.filter(c => c.provincia_id === provincia.id)
  }

  /**
   * Obtener distritos por cantón
   */
  getDistritosByCanton(cantonNombre: string): Distrito[] {
    const canton = cantones.find(c => c.nombre === cantonNombre)
    if (!canton) return []
    
    return distritos.filter(d => d.canton_id === canton.id)
  }

  /**
   * Buscar provincias (autocompletado)
   */
  searchProvincias(query: string): Provincia[] {
    if (!query) return provincias
    
    const lowerQuery = query.toLowerCase()
    return provincias.filter(p => 
      p.nombre.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Buscar cantones (autocompletado)
   */
  searchCantones(query: string, provinciaNombre?: string): Canton[] {
    let filtered = cantones
    
    if (provinciaNombre) {
      const provincia = provincias.find(p => p.nombre === provinciaNombre)
      if (provincia) {
        filtered = cantones.filter(c => c.provincia_id === provincia.id)
      }
    }
    
    if (!query) return filtered
    
    const lowerQuery = query.toLowerCase()
    return filtered.filter(c => 
      c.nombre.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Buscar distritos (autocompletado)
   */
  searchDistritos(query: string, cantonNombre?: string): Distrito[] {
    let filtered = distritos
    
    if (cantonNombre) {
      const canton = cantones.find(c => c.nombre === cantonNombre)
      if (canton) {
        filtered = distritos.filter(d => d.canton_id === canton.id)
      }
    }
    
    if (!query) return filtered
    
    const lowerQuery = query.toLowerCase()
    return filtered.filter(d => 
      d.nombre.toLowerCase().includes(lowerQuery)
    )
  }
}

// Exportar instancia única
export const costaRicaLocations = new CostaRicaLocationsService()

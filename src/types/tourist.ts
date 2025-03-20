// src/types/tourist.ts
export interface TouristProfile {
    id: string; // links to users.id
    nationality: string;
    languages: string[];
    interests: Record<string, any>; // JSON object with tourist interests
    createdAt: string; // ISO 8601 timestamp
    updatedAt: string; // ISO 8601 timestamp
  }
  
  export interface TouristPreferences {
    userId: string;
    preferredServices: string[]; // List of preferred services (service names)
    preferredDuration: number; // Preferred duration for services in minutes
    preferredBudget: number; // Preferred budget in the respective currency
    preferredLanguages: string[]; // Preferred languages for communication
    createdAt: string; // ISO 8601 timestamp
    updatedAt: string; // ISO 8601 timestamp
  }
  
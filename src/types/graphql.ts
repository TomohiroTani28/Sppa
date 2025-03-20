// src/types/graphql.ts
export interface TherapistsQuery {
    therapist_profiles: Array<{
      user: {
        id: string;
        name: string;
        profile_picture: string;
        therapistProfile?: {
          bio: string;
          experience_years: number;
          location: string;
          languages: string[];
          working_hours: string;
        };
        average_rating: number;
        hourly_rate: number;
        services: Array<{
          id: string;
          service_name: string;
          description: string;
          duration: number;
          price: number;
          currency: string;
          category: string;
        }>;
        reviews: Array<{ id: string }>;
      };
    }>;
  }
  
  export interface TherapistsQueryVariables {
    location?: string;
    service?: string;
    language?: string;
    category?: string;
  }
  
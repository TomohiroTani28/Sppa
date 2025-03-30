// src/app/hooks/api/useTherapistData.tsx
"use client";

import { useState, useEffect } from "react";
import supabase from "@/app/lib/supabase-client";

// Define interfaces for the returned data types
export interface TherapistData {
  id: string;
  user_id: string;
  bio: string;
  user: {
    id: string;
    name: string;
    profile_picture: string;
    role: string;
  };
}

// Define interface for raw Supabase response
interface SupabaseUserData {
  id: any;
  name: any;
  profile_picture: any;
  role: any;
}

interface UseTherapistDataReturn {
  therapistData: TherapistData | null;
  loading: boolean;
  error: Error | null;
}

// Implement the hook with proper return types and error handling
export default function useTherapistData(
  userId?: string | null,
  authLoading?: boolean,
  role?: string | null
): UseTherapistDataReturn {
  const [therapistData, setTherapistData] = useState<TherapistData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Skip fetch if user is not logged in or auth is still loading
    if (!userId || authLoading) {
      setLoading(false);
      return;
    }

    // Skip fetch if user is not a therapist
    if (role !== "therapist") {
      setLoading(false);
      return;
    }

    const fetchTherapistData = async () => {
      try {
        setLoading(true);
        
        const { data, error: supabaseError } = await supabase
          .from("therapists")
          .select(`
            id,
            user_id,
            bio,
            user:user_id (
              id,
              name,
              profile_picture,
              role
            )
          `)
          .eq("user_id", userId)
          .single();

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        // Handle the case when data is null
        if (!data) {
          setTherapistData(null);
          return;
        }

        // Handle different formats of user data
        const processUserData = () => {
          // Default empty user object
          const defaultUser: TherapistData['user'] = {
            id: '',
            name: '',
            profile_picture: '',
            role: ''
          };
          
          // If user is an array and has items
          if (Array.isArray(data.user) && data.user.length > 0) {
            // Explicitly type the first user to avoid 'never' type issues
            const firstUser = data.user[0] as SupabaseUserData;
            
            return {
              id: String(firstUser.id || ''),
              name: String(firstUser.name || ''),
              profile_picture: String(firstUser.profile_picture || ''),
              role: String(firstUser.role || '')
            };
          } 
          // If user is an object but not an array
          else if (data.user && typeof data.user === 'object' && !Array.isArray(data.user)) {
            const userObj = data.user as SupabaseUserData;
            
            return {
              id: String(userObj.id || ''),
              name: String(userObj.name || ''),
              profile_picture: String(userObj.profile_picture || ''),
              role: String(userObj.role || '')
            };
          }
          
          // Return default user if none of the above conditions match
          return defaultUser;
        };
        
        // Create the final transformed data with proper typing
        const transformedData: TherapistData = {
          id: String(data.id || ''),
          user_id: String(data.user_id || ''),
          bio: String(data.bio || ''),
          user: processUserData()
        };

        setTherapistData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch therapist data"));
      } finally {
        setLoading(false);
      }
    };

    fetchTherapistData();
  }, [userId, authLoading, role]);

  return { therapistData, loading, error };
}
// src/app/tourist/preferences/components/PreferenceForm.tsx
"use client";
import { useState } from "react";
import { useUserPreferences } from "@/hooks/useUserPreferences";

// Define the Preferences interface
interface Preferences {
  language?: string;
  timeZone?: string;
}

const PreferenceForm = () => {
  // Correctly type the destructured hook return value
  const { preferences, saveUserPreferences }: { 
    preferences: Preferences | null; 
    saveUserPreferences: (prefs: Partial<Preferences>) => Promise<boolean>; 
  } = useUserPreferences();

  // Initialize state, handling the null case
  const [newPreferences, setNewPreferences] = useState<Preferences>(preferences || {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPreferences((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await saveUserPreferences(newPreferences);
    if (success) {
      console.log("Preferences saved successfully");
    } else {
      console.error("Failed to save preferences");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Preferences</h2>
      <div className="form-group">
        <label htmlFor="language">Preferred Language</label>
        <input
          type="text"
          id="language"
          name="language"
          value={newPreferences.language ?? ""}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="timeZone">Time Zone</label>
        <input
          type="text"
          id="timeZone"
          name="timeZone"
          value={newPreferences.timeZone ?? ""}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Save Preferences</button>
    </form>
  );
};

export default PreferenceForm;
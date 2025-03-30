// src/app/(common)/preferences/components/PreferenceForm.tsx
"use client";
import { useState } from "react";
import { useUserPreferences } from "@/app/tourist/hooks/useUserPreferences";

const PreferenceForm = () => {
  const { preferences, saveUserPreferences } = useUserPreferences();
  const [newPreferences, setNewPreferences] = useState(preferences || {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPreferences((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveUserPreferences(newPreferences);
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
          value={newPreferences.language || ""}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="timeZone">Time Zone</label>
        <input
          type="text"
          id="timeZone"
          name="timeZone"
          value={newPreferences.timeZone || ""}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Save Preferences</button>
    </form>
  );
};

export default PreferenceForm;

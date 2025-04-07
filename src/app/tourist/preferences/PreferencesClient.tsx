"use client";
// src/app/tourist/preferences/PreferencesClient.tsx
import PreferenceForm from "./components/PreferenceForm";

const PreferencesClient = () => {
  return (
    <div className="preferences-page">
      <h1>Manage Your Preferences</h1>
      <PreferenceForm />
    </div>
  );
};

export default PreferencesClient;
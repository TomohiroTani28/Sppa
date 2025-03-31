// src/app/(common)/preferences/page.tsx
import PreferenceForm from "./components/PreferenceForm";

const PreferencesPage = () => {
  return (
    <div className="preferences-page">
      <h1>Manage Your Preferences</h1>
      <PreferenceForm />
    </div>
  );
};

export default PreferencesPage;

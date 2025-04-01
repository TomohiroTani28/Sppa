// src/app/tourist/profile/components/ProfileForm.tsx
"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useTranslation } from "next-i18next";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Upload } from "lucide-react";

interface ProfileFormProps {
  userId: string;
}

type ProfileFormData = {
  name: string;
  email: string;
  phone_number: string;
  nationality: string;
  languages: string[];
  profilePicture?: File | null;
  backgroundImage?: File | null;
};

const countries = [
  { code: "US", name: "United States" },
  { code: "JP", name: "Japan" },
  { code: "ID", name: "Indonesia" },
];

const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "id", name: "Indonesian" },
  { code: "ja", name: "Japanese" },
];

const ProfileForm: React.FC<ProfileFormProps> = ({ userId }) => {
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    phone_number: "",
    nationality: "",
    languages: [],
    profilePicture: null,
    backgroundImage: null,
  });
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      setFormData({
        name: "John Doe",
        email: "john@example.com",
        phone_number: "+1234567890",
        nationality: "US",
        languages: ["en"],
        profilePicture: null,
        backgroundImage: null,
      });
    };
    fetchUserData();
  }, [userId]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value,
    );
    setFormData((prev) => ({ ...prev, languages: selectedOptions }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      const url = URL.createObjectURL(files[0]);
      if (name === "profilePicture") setProfilePreview(url);
      if (name === "backgroundImage") setBackgroundPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      console.log("Updating user profile with:", formData);
      setSuccessMessage(t("profile.updateSuccess"));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage(t("profile.updateError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {errorMessage}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">{t("profile.name")}</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="border-gray-300 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("profile.email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          disabled
          className="bg-gray-100"
        />
        <p className="text-sm text-gray-500">
          {t("profile.emailCannotChange")}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone_number">{t("profile.phoneNumber")}</Label>
        <Input
          id="phone_number"
          name="phone_number"
          type="tel"
          value={formData.phone_number}
          onChange={handleInputChange}
          placeholder="+6281234567890"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nationality">{t("profile.nationality")}</Label>
        <select
          id="nationality"
          name="nationality"
          value={formData.nationality}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500"
        >
          <option value="">{t("profile.selectNationality")}</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="languages">{t("profile.languages")}</Label>
        <select
          id="languages"
          name="languages"
          multiple
          value={formData.languages}
          onChange={handleLanguageChange}
          className="w-full border border-gray-300 rounded-md p-2 h-32 focus:border-blue-500"
        >
          {supportedLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500">
          {t("profile.multipleLanguagesHint")}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="profilePicture">{t("profile.profilePicture")}</Label>
        <div className="flex items-center space-x-4">
          <Input
            id="profilePicture"
            name="profilePicture"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <label
            htmlFor="profilePicture"
            className="flex items-center cursor-pointer"
          >
            <Button variant="outline" className="flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              {t("profile.upload")}
            </Button>
          </label>
          {profilePreview && (
            <img
              src={profilePreview}
              alt="Profile Preview"
              className="w-16 h-16 object-cover rounded-full"
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="backgroundImage">{t("profile.backgroundImage")}</Label>
        <div className="flex items-center space-x-4">
          <Input
            id="backgroundImage"
            name="backgroundImage"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <label
            htmlFor="backgroundImage"
            className="flex items-center cursor-pointer"
          >
            <Button variant="outline" className="flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              {t("profile.upload")}
            </Button>
          </label>
          {backgroundPreview && (
            <img
              src={backgroundPreview}
              alt="Background Preview"
              className="w-32 h-16 object-cover rounded-md"
            />
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? <Spinner className="w-5 h-5" /> : t("profile.saveChanges")}
      </Button>
    </form>
  );
};

export default ProfileForm;

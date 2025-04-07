// src/app/tourist/profile/components/ProfileForm.tsx
"use client";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Spinner } from "@/components/ui/Spinner";
import { profileFormSchema } from "@/lib/validations/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  userId: string;
}

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
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      setValue("name", "John Doe");
      setValue("email", "john@example.com");
      setValue("phone_number", "+1234567890");
      setValue("nationality", "US");
      setValue("languages", ["en"]);
    };
    fetchUserData();
  }, [userId, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setValue(name as keyof ProfileFormData, files[0]);
      const url = URL.createObjectURL(files[0]);
      if (name === "profilePicture") setProfilePreview(url);
      if (name === "backgroundImage") setBackgroundPreview(url);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      console.log("Updating user profile with:", data);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      <FormField
        id="name"
        label={t("profile.name")}
        error={errors.name?.message}
        {...register("name")}
      />

      <FormField
        id="email"
        label={t("profile.email")}
        type="email"
        error={errors.email?.message}
        disabled
        helperText={t("profile.emailCannotChange")}
        {...register("email")}
      />

      <FormField
        id="phone_number"
        label={t("profile.phoneNumber")}
        type="tel"
        error={errors.phone_number?.message}
        placeholder="+6281234567890"
        {...register("phone_number")}
      />

      <div className="space-y-2">
        <label htmlFor="nationality" className="block text-sm font-medium">
          {t("profile.nationality")}
        </label>
        <select
          id="nationality"
          className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500"
          {...register("nationality")}
        >
          <option value="">{t("profile.selectNationality")}</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        {errors.nationality?.message && (
          <p className="text-sm text-red-500">{errors.nationality.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="languages" className="block text-sm font-medium">
          {t("profile.languages")}
        </label>
        <select
          id="languages"
          multiple
          className="w-full border border-gray-300 rounded-md p-2 h-32 focus:border-blue-500"
          {...register("languages")}
        >
          {supportedLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        {errors.languages?.message && (
          <p className="text-sm text-red-500">{errors.languages.message}</p>
        )}
        <p className="text-sm text-gray-500">
          {t("profile.multipleLanguagesHint")}
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          {t("profile.profilePicture")}
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            className="hidden"
            {...register("profilePicture", {
              onChange: handleFileChange
            })}
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
        <label className="block text-sm font-medium">
          {t("profile.backgroundImage")}
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            id="backgroundImage"
            accept="image/*"
            className="hidden"
            {...register("backgroundImage", {
              onChange: handleFileChange
            })}
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

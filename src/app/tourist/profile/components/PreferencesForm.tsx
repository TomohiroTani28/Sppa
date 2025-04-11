import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { useUser } from "@/hooks/api/useUser";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import React from "react";
import { Control, Controller, useForm } from "react-hook-form";

// Placeholder for toast notifications
const toast = {
  success: (msg: string) => console.log(msg),
  error: (msg: string) => console.error(msg),
};

// GraphQL queries and mutations
const GET_USER_PREFERENCES = gql`
  query GetUserPreferences($userId: UUID!) {
    user_preferences_by_pk(user_id: $userId) {
      language
      notifications
      currency
      serviceCategories
    }
  }
`;

const GET_SERVICE_CATEGORIES = gql`
  query GetServiceCategories {
    service_categories {
      id
      name
    }
  }
`;

const UPDATE_USER_PREFERENCES = gql`
  mutation UpdateUserPreferences($userId: UUID!, $preferences: user_preferences_set_input!) {
    update_user_preferences_by_pk(pk_columns: { user_id: $userId }, _set: $preferences) {
      user_id
    }
  }
`;

// Static lists
const LANGUAGES = ["en", "id"];
const CURRENCIES = ["USD", "IDR"];

// Type definitions
interface UserPreferences {
  language: string;
  notifications: { email: boolean; push: boolean };
  currency: string;
  serviceCategories: string[];
}

// Reusable SelectField component
interface SelectFieldProps {
  name: keyof UserPreferences;
  control: Control<UserPreferences>;
  options: { value: string; label: string }[];
  placeholder: string;
  label: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ name, control, options, placeholder, label }) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value as string}>
          <SelectTrigger id={name}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  </div>
);

// NotificationSettings component
interface NotificationSettingsProps {
  control: Control<UserPreferences>;
  t: (key: string) => string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ control, t }) => (
  <div className="space-y-2">
    <Label>{t("preferences.notifications")}</Label>
    <div className="flex items-center space-x-2">
      <Controller
        name="notifications.email"
        control={control}
        render={({ field }) => (
          <Checkbox id="email" checked={field.value} onCheckedChange={field.onChange} />
        )}
      />
      <Label htmlFor="email">{t("preferences.email")}</Label>
    </div>
    <div className="flex items-center space-x-2">
      <Controller
        name="notifications.push"
        control={control}
        render={({ field }) => (
          <Checkbox id="push" checked={field.value} onCheckedChange={field.onChange} />
        )}
      />
      <Label htmlFor="push">{t("preferences.push")}</Label>
    </div>
  </div>
);

// ServiceCategorySelector component
interface ServiceCategorySelectorProps {
  control: Control<UserPreferences>;
  t: (key: string) => string;
  serviceCategories: { id: string; name: string }[];
}

const ServiceCategorySelector: React.FC<ServiceCategorySelectorProps> = ({ control, t, serviceCategories }) => (
  <div className="space-y-2">
    <Label htmlFor="serviceCategories">{t("preferences.serviceCategories")}</Label>
    <Controller
      name="serviceCategories"
      control={control}
      render={({ field }) => {
        const selectedValue = field.value?.length > 0 ? field.value[0] : "";
        return (
          <Select onValueChange={(value) => field.onChange([value])} value={selectedValue || ""}>
            <SelectTrigger id="serviceCategories">
              <SelectValue placeholder={t("preferences.select_service_categories")} />
            </SelectTrigger>
            <SelectContent>
              {serviceCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }}
    />
    {/* Single-select implemented; replace with multi-select if needed */}
  </div>
);

// Main component
export function PreferencesForm() {
  const { t } = useTranslation("common");
  const CURRENT_USER_ID = "123"; // Replace with actual auth context
  const { user } = useUser(CURRENT_USER_ID);

  const {
    data: preferencesData,
    loading: preferencesLoading,
    error: preferencesError,
  } = useQuery(GET_USER_PREFERENCES, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const {
    data: serviceCategoriesData,
    loading: serviceCategoriesLoading,
    error: serviceCategoriesError,
  } = useQuery(GET_SERVICE_CATEGORIES);

  const [updatePreferences, { loading: updateLoading }] = useMutation(UPDATE_USER_PREFERENCES);

  const { control, handleSubmit, reset } = useForm<UserPreferences>({
    defaultValues: preferencesData?.user_preferences_by_pk || {
      language: "",
      notifications: { email: false, push: false },
      currency: "",
      serviceCategories: [],
    },
  });

  React.useEffect(() => {
    if (preferencesData?.user_preferences_by_pk) {
      reset(preferencesData.user_preferences_by_pk);
    }
  }, [preferencesData, reset]);

  const onSubmit = async (data: UserPreferences) => {
    try {
      await updatePreferences({
        variables: {
          userId: user?.id,
          preferences: data,
        },
      });
      toast.success(t("preferences.success_message"));
    } catch (error) {
      toast.error(t("preferences.error_message"));
      console.error("Failed to update preferences:", error);
    }
  };

  const serviceCategories = serviceCategoriesData?.service_categories || [];

  const renderContent = () => {
    if (preferencesLoading || serviceCategoriesLoading) {
      return <Spinner className="mx-auto mt-4" />;
    }
    if (preferencesError || serviceCategoriesError) {
      return <div className="text-red-500 text-center">{t("preferences.error_loading")}</div>;
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">{t("preferences.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SelectField
              name="language"
              control={control}
              options={LANGUAGES.map((lang) => ({ value: lang, label: lang.toUpperCase() }))}
              placeholder={t("preferences.select_language")}
              label={t("preferences.language")}
            />
            <NotificationSettings control={control} t={t} />
            <SelectField
              name="currency"
              control={control}
              options={CURRENCIES.map((currency) => ({ value: currency, label: currency }))}
              placeholder={t("preferences.select_currency")}
              label={t("preferences.currency")}
            />
            <ServiceCategorySelector control={control} t={t} serviceCategories={serviceCategories} />
          </CardContent>
        </Card>
        <Button
          type="submit"
          disabled={updateLoading}
          className="w-full bg-[#007aff] hover:bg-[#005bb5] text-white"
        >
          {updateLoading ? <Spinner className="mr-2" /> : null}
          {t("preferences.save")}
        </Button>
      </form>
    );
  };

  return <>{renderContent()}</>;
}
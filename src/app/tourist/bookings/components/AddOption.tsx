// src/app/tourist/bookings/components/AddOption.tsx
"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/app/components/ui/Checkbox";
import { Label } from "@/app/components/ui/Label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";

interface AdditionalOption {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
}

const AddOption = () => {
  const { t } = useTranslation("bookings");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Mock additional options - in real app, this would come from an API
  const additionalOptions: AdditionalOption[] = [
    {
      id: "aroma_oil",
      name: t("aroma_oil"),
      description: t("aroma_oil_description"),
      price: 10,
      currency: "USD",
    },
    {
      id: "extra_30_min",
      name: t("extra_30_min"),
      description: t("extra_30_min_description"),
      price: 25,
      currency: "USD",
    },
    {
      id: "hot_stone",
      name: t("hot_stone"),
      description: t("hot_stone_description"),
      price: 20,
      currency: "USD",
    },
  ];

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    );
  };

  const calculateTotalAdditional = () => {
    return selectedOptions.reduce((total, optionId) => {
      const option = additionalOptions.find((opt) => opt.id === optionId);
      return total + (option ? option.price : 0);
    }, 0);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{t("additional_options")}</CardTitle>
      </CardHeader>
      <CardContent>
        {additionalOptions.map((option) => (
          <div
            key={option.id}
            className="flex items-center space-x-4 mb-4 p-3 border rounded-lg"
          >
            <Checkbox
              id={`option-${option.id}`}
              checked={selectedOptions.includes(option.id)}
              onCheckedChange={() => toggleOption(option.id)}
            />
            <div className="flex-grow">
              <Label htmlFor={`option-${option.id}`} className="font-medium">
                {option.name}
              </Label>
              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            </div>
            <Badge variant="outline">
              {option.price} {option.currency}
            </Badge>
          </div>
        ))}

        {selectedOptions.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <span className="font-semibold">{t("total_additional_cost")}</span>
            <Badge variant="secondary">{calculateTotalAdditional()} USD</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddOption;

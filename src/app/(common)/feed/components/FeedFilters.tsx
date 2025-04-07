import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import React from "react";

interface FeedFiltersProps {
  selectedTab: "tourist" | "therapist";
  onTabChange: (tab: "tourist" | "therapist") => void;
  userRole?: string;
}

export const FeedFilters: React.FC<FeedFiltersProps> = ({
  selectedTab,
  onTabChange,
  userRole,
}) => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <Button
        variant={selectedTab === "tourist" ? "default" : "outline"}
        onClick={() => onTabChange("tourist")}
        className={cn(
          "px-6 py-2 rounded-full transition-colors",
          selectedTab === "tourist" && "bg-primary text-primary-foreground"
        )}
      >
        Tourist Feed
      </Button>
      {userRole === "therapist" && (
        <Button
          variant={selectedTab === "therapist" ? "default" : "outline"}
          onClick={() => onTabChange("therapist")}
          className={cn(
            "px-6 py-2 rounded-full transition-colors",
            selectedTab === "therapist" && "bg-primary text-primary-foreground"
          )}
        >
          Therapist Feed
        </Button>
      )}
    </div>
  );
}; 
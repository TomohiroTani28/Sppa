// src/app/tourist/home/components/WelcomeMessage.tsx
"use client";
import React from "react";
import Text from "@/app/components/ui/Text";

interface WelcomeMessageProps {
  user: { email: string } | null;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ user }) => {
  if (!user) {
    return <Text tag="h1">ようこそ、ゲストさん</Text>;
  }
  return (
    <Text tag="div">
      <Text tag="h1">ようこそ, {user.email} さん</Text>
    </Text>
  );
};

export default WelcomeMessage;
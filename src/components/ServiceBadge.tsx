// src/app/components/common/ServiceBadge.tsx
import React from "react";

interface ServiceBadgeProps {
  service: string;
}

const ServiceBadge: React.FC<ServiceBadgeProps> = ({ service }) => {
  return (
    <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
      {service}
    </span>
  );
};

export default ServiceBadge;

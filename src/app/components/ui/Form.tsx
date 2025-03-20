// src/app/components/ui/Form.tsx
import React, { FC, ReactNode } from "react";

interface BaseProps {
  children?: ReactNode;
  [key: string]: any;
}

export const Form: FC<BaseProps> = ({ children, ...props }) => {
  return <form {...props}>{children}</form>;
};

export const FormControl: FC<BaseProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export const FormField: FC<BaseProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export const FormItem: FC<BaseProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export const FormLabel: FC<BaseProps> = ({ children, ...props }) => {
  return <label {...props}>{children}</label>;
};

export const FormMessage: FC<BaseProps> = ({ children, ...props }) => {
  return <p {...props}>{children}</p>;
};

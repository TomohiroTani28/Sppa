// src/app/components/ui/Label.tsx
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label"; // 修正: 名前空間を適用
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/app/lib/utils";

// ラベルのスタイルバリエーションを定義
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

// ラベルコンポーネントのprops型定義
export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  className?: string;
  children?: React.ReactNode;
  htmlFor?: string; // ✅ 追加
}

// ラベルコンポーネント
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, children, htmlFor, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    htmlFor={htmlFor} // ✅ 追加
    {...props}
  >
    {children}
  </LabelPrimitive.Root>
));

Label.displayName = "Label";

export { Label };

// src/app/ApolloWrapper.tsx
import dynamic from "next/dynamic";

interface ApolloWrapperProps {
  readonly children: React.ReactNode;
}

const ApolloClientWrapper = dynamic(() => import("./ApolloClientWrapper"), { ssr: false });

export default function ApolloWrapper({ children }: ApolloWrapperProps) {
  return <ApolloClientWrapper>{children}</ApolloClientWrapper>;
}
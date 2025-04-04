// src/app/ApolloWrapper.tsx
import ApolloClientWrapper from "./ApolloClientWrapper";

interface ApolloWrapperProps {
  readonly children: React.ReactNode;
}

export default function ApolloWrapper({ children }: ApolloWrapperProps) {
  return <ApolloClientWrapper>{children}</ApolloClientWrapper>;
}
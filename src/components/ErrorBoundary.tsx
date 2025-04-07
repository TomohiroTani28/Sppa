"use client";
// src/components/ErrorBoundary.tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { AppError, createAppError } from '@/utils/error-handling';
import { RefreshCw } from 'lucide-react';
import React from 'react';

interface ErrorBoundaryState {
  error: AppError | null;
  hasError: boolean;
}

interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
  onReset?: () => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: null,
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      error: createAppError(error),
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', {
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.props.onReset?.();
    this.setState({
      error: null,
      hasError: false,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Alert variant="error" className="m-4">
          <AlertTitle>エラーが発生しました</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">{this.state.error?.message}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={this.handleReset}
              className="mt-2"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              再試行
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

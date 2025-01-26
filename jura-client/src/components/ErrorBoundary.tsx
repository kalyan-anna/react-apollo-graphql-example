import {} from "@heroicons/react/24/solid";

import {
  Alert,
  Button,
  ButtonGroup,
  Typography,
} from "@material-tailwind/react";
import React, { PropsWithChildren } from "react";

import { UnprotectedTemplate } from "../templates/UnprotectedTemplate";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  PropsWithChildren,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const errors = this.state.error?.message.split(", ");
      return (
        <UnprotectedTemplate>
          <div className="flex flex-col gap-8">
            <Typography variant="h1">Something went wrong.</Typography>
            <Alert variant="ghost" color="red" className="flex flex-col gap-1">
              <Typography className="font-medium">
                The following error occured:
              </Typography>
              {errors?.map((message, index) => (
                <pre key={index}>{message}</pre>
              ))}
            </Alert>
            <ButtonGroup className="gap-4">
              <Button onClick={() => window.location.reload()}>Refresh</Button>
              <Button onClick={() => window.location.replace("/login")}>
                Login
              </Button>
            </ButtonGroup>
          </div>
        </UnprotectedTemplate>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

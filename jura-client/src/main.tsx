import "normalize.css";
import "./index.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { ActiveSprintPage } from "./pages/ActiveSprintPage.tsx";
import { ApolloProvider } from "@apollo/client";
import { DashboardPage } from "./pages/DashboardPage.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { IndexPage } from "./pages/IndexPage.tsx";
import { IssuesPage } from "./pages/IssuesPage.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { ProjectPage } from "./pages/ProjectPage.tsx";
import { StrictMode } from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { client } from "./utils/client.helper.ts";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <ErrorBoundary>
          <ThemeProvider>
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/project/:projectId" element={<ProjectPage />}>
                <Route index element={<Navigate to="issues" replace />} />
                <Route path="issues" element={<IssuesPage />} />
                <Route path="active" element={<ActiveSprintPage />} />
              </Route>
            </Routes>
          </ThemeProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
);

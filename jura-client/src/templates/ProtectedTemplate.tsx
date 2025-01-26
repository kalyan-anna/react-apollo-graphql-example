import { PropsWithChildren, useEffect } from "react";

import { useNavigate } from "react-router";
import { useGqlErrorHandler } from "../hooks/useGqlErrorHandler";
import { useAuthState } from "../state/auth";
import { MainNav } from "./MainNav";
import { SideNav } from "./SideNav";
import { ToastContainer } from "../components/design-system/ToastContainer";

interface ProtectedTemplateProps extends PropsWithChildren {
  withSideNav?: boolean;
}

export const ProtectedTemplate = ({ children, withSideNav = false }: ProtectedTemplateProps) => {
  useGqlErrorHandler();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthState();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <MainNav />
      </header>
      <main className="flex flex-1">
        {withSideNav && (
          <div>
            <SideNav />
          </div>
        )}
        <ToastContainer />
        <div className="px-8 md:px-8 py-8 w-full">{children}</div>
      </main>
    </div>
  );
};

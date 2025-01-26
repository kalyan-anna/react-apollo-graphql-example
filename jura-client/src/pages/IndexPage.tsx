import { Spinner } from "@material-tailwind/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthState } from "../state/auth";

export const IndexPage = () => {
  const { isAuthenticated } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Spinner className="h-16 w-16 text-gray-900/50" />
    </div>
  );
};

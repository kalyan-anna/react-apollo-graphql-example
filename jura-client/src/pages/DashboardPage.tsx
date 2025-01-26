import { Typography } from "@material-tailwind/react";
import ProjectList from "../components/ProjectList";
import { useAuthState } from "../state/auth";
import { ProtectedTemplate } from "../templates/ProtectedTemplate";
import { useUIPreferenceState } from "../state/ui-preference";
import { useEffect } from "react";

export const DashboardPage = () => {
  const { authUserFirstName } = useAuthState();
  const { setLastVisitedProjectId } = useUIPreferenceState();

  useEffect(() => {
    setLastVisitedProjectId("");
  }, [setLastVisitedProjectId]);

  return (
    <ProtectedTemplate>
      <div className="flex flex-col gap-8 md:px-52">
        <div>
          <Typography variant="h1" color="blue-gray" className="mb-4 md:mb-8">
            Welcome, {authUserFirstName}!
          </Typography>
        </div>
        <ProjectList />
      </div>
    </ProtectedTemplate>
  );
};

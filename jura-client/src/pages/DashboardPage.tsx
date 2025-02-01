import { Typography } from "@material-tailwind/react";
import { useEffect } from "react";
import ProjectList from "../components/ProjectList";
import { useUIPreferenceState } from "../state/ui-preference";
import { useCurrentUserQuery } from "../state/user";
import { ProtectedTemplate } from "../templates/ProtectedTemplate";

export const DashboardPage = () => {
  const { data, loading } = useCurrentUserQuery();
  const { setLastVisitedProjectId } = useUIPreferenceState();

  useEffect(() => {
    setLastVisitedProjectId("");
  }, [setLastVisitedProjectId]);

  return (
    <ProtectedTemplate>
      <div className="flex flex-col gap-8 md:px-52">
        <div>
          <Typography variant="h1" color="blue-gray" className="mb-4 md:mb-8">
            Welcome{!loading && <span>, {data.firstName}!</span>}
          </Typography>
        </div>
        <ProjectList />
      </div>
    </ProtectedTemplate>
  );
};

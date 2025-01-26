import { Outlet, useParams } from "react-router";
import { IssueUpsertDialog } from "../components/IssueUpsertDialog";
import { SprintCompleteWarningDialog } from "../components/SprintCompleteWarningDialog";
import { SprintCreateDialog } from "../components/SprintCreateDialog";
import { SprintStartWarningDialog } from "../components/SprintStartWarningDialog";
import { ProtectedTemplate } from "../templates/ProtectedTemplate";
import { useUIPreferenceState } from "../state/ui-preference";
import { useEffect } from "react";

export const ProjectPage = () => {
  const { setLastVisitedProjectId } = useUIPreferenceState();
  const { projectId } = useParams();

  useEffect(() => {
    setLastVisitedProjectId(projectId);
  }, [projectId, setLastVisitedProjectId]);

  return (
    <ProtectedTemplate withSideNav>
      <Outlet />
      <IssueUpsertDialog />
      <SprintCreateDialog />
      <SprintCompleteWarningDialog />
      <SprintStartWarningDialog />
    </ProtectedTemplate>
  );
};

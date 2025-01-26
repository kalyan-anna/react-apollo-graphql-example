import { useNavigate, useParams } from "react-router";

import { KanbanBoard } from "../components/KanbanBoard";
import { KanbanBoardSkeleton } from "../components/KanbanBoardSkeleton";
import { useActiveSprintQuery } from "../state/sprint";
import { useEffect } from "react";

export const ActiveSprintPage = () => {
  const { projectId } = useParams();
  const { data, loading } = useActiveSprintQuery({
    projectId: projectId ?? "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !data) {
      navigate("../issues");
    }
  }, [data, loading, navigate]);

  return <>{loading ? <KanbanBoardSkeleton /> : <KanbanBoard />}</>;
};

import { Card, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  QueueListIcon,
} from "@heroicons/react/24/solid";
import { useLocation, useNavigate, useParams } from "react-router";

import { useActiveSprintQuery } from "../state/sprint";

export function SideNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pathNode = pathname.split("/").pop();
  const { projectId } = useParams();
  const { data } = useActiveSprintQuery({ projectId: projectId ?? "" });

  const handleActive = () => {
    navigate("./active");
  };

  const handleIssuesClick = () => {
    navigate("./issues");
  };

  return (
    <Card className="h-full w-full p-2 rounded-none mt-0.5 min-h-100">
      <List className="w-full">
        <ListItem
          onClick={handleActive}
          selected={pathNode === "active"}
          disabled={!data}
        >
          <ListItemPrefix>
            <PresentationChartBarIcon className="h-5 w-5" />
          </ListItemPrefix>
          Active Sprint
        </ListItem>
        <ListItem onClick={handleIssuesClick} selected={pathNode === "issues"}>
          <ListItemPrefix>
            <QueueListIcon className="h-5 w-5" />
          </ListItemPrefix>
          Issues
        </ListItem>
      </List>
    </Card>
  );
}

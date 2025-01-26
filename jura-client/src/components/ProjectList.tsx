import { Typography } from "@material-tailwind/react";
import { useProjectsQuery } from "../state/project";
import { Divider } from "./design-system/Divider";
import { ProjectItemCard } from "./ProjectItemCard";
import { ProjectItemSkeleton } from "./ProjectItemSkeleton";

const ProjectList = () => {
  const { ownedProjects, otherProjects, loading, error } = useProjectsQuery();

  return (
    <>
      <div className="flex flex-col gap-2">
        <Typography variant="h2" color="blue-gray">
          Projects Owned by You
        </Typography>
        {!loading && !error && ownedProjects.length === 0 && (
          <Typography as="p" color="gray" variant="lead" className="mt-2">
            No projects found.
          </Typography>
        )}
        {loading && !error && (
          <div className="flex flex-wrap gap-4 animate-pulse">
            <ProjectItemSkeleton />
            <ProjectItemSkeleton />
          </div>
        )}
        <div className="flex flex-wrap gap-4">
          {ownedProjects.map((p) => (
            <ProjectItemCard name={p.name} subTitle={p.subTitle} key={p.id} id={p.id} />
          ))}
        </div>
      </div>
      <Divider />
      <div className="flex flex-col gap-2">
        <Typography variant="h2" color="blue-gray">
          Projects You Are Associated With
        </Typography>
        {!loading && otherProjects.length === 0 && (
          <Typography as="p" color="gray" variant="lead" className="mt-2">
            No projects found.
          </Typography>
        )}
        {loading && !error && (
          <div className="flex flex-wrap gap-4 animate-pulse">
            <ProjectItemSkeleton />
            <ProjectItemSkeleton />
          </div>
        )}
        <div className="flex flex-wrap gap-4">
          {otherProjects.map((p) => (
            <ProjectItemCard name={p.name} subTitle={p.subTitle} key={p.id} id={p.id} />
          ))}
        </div>
      </div>
      <Divider />
    </>
  );
};

export default ProjectList;

import { Typography } from "@material-tailwind/react";

export const SprintContainerSkeleton = () => {
  return (
    <div className="p-4 bg-gray-200 flex flex-col gap-1 animate-pulse">
      <Typography
        as="div"
        variant="h1"
        className="mb-4 h-3 rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
      <Typography
        as="div"
        variant="paragraph"
        className="mb-2 h-2 rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
      <Typography
        as="div"
        variant="paragraph"
        className="mb-2 h-2 rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
      <Typography
        as="div"
        variant="paragraph"
        className="mb-2 h-2 rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
      <Typography
        as="div"
        variant="paragraph"
        className="mb-2 h-2 rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
    </div>
  );
};

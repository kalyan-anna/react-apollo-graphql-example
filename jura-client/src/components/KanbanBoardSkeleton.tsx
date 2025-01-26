import { Typography } from "@material-tailwind/react";

const ColumnSkeleton = ({ itemCount = 0 }: { itemCount?: number }) => {
  return (
    <div className="flex flex-col w-1/4 bg-gray-100 rounded-lg p-4 shadow-md h-full gap-4">
      &nbsp;
      {Array.from({ length: itemCount }).map((_, index) => (
        <Typography
          as="div"
          variant="paragraph"
          className="mb-2 h-24 max-w-72 rounded-md shadow-md bg-gray-300"
          key={index}
        >
          &nbsp;
        </Typography>
      ))}
    </div>
  );
};

export const KanbanBoardSkeleton = () => {
  return (
    <div className="w-full h-full animate-pulse">
      <Typography
        as="div"
        variant="h1"
        className="mb-4 h-3 w-96 rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
      <Typography
        as="div"
        variant="paragraph"
        className="mb-2 h-2 w-72 rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
      <div className="h-4/5 mt-8 flex gap-4">
        <ColumnSkeleton itemCount={2} />
        <ColumnSkeleton />
        <ColumnSkeleton />
        <ColumnSkeleton itemCount={1} />
      </div>
    </div>
  );
};

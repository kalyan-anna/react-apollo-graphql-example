import { Card, CardBody, Typography } from "@material-tailwind/react";

export const ProjectItemSkeleton = () => {
  return (
    <Card className="mt-6 w-96">
      <CardBody>
        <Typography
          as="div"
          variant="h5"
          className="mb-4 h-3 rounded-full bg-gray-300"
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
      </CardBody>
    </Card>
  );
};

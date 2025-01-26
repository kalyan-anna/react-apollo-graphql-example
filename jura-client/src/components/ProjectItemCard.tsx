import { Card, CardBody, Typography } from "@material-tailwind/react";

import { useNavigate } from "react-router";

interface ProjectItemCardProps {
  id: string;
  name: string;
  subTitle: string;
}

export const ProjectItemCard = ({
  name,
  subTitle,
  id,
}: ProjectItemCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/project/${id}`);
  };

  return (
    <Card className="mt-6 w-96 cursor-pointer" onClick={handleClick}>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          {name}
        </Typography>
        <Typography>{subTitle}</Typography>
      </CardBody>
    </Card>
  );
};

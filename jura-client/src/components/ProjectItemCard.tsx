import { Card, CardBody, Typography } from '@material-tailwind/react';

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useIssuesCountByProjectId } from '../state/issue';

interface ProjectItemCardProps {
  id: string;
  name: string;
  subTitle: string;
}

export const ProjectItemCard = ({ name, subTitle, id }: ProjectItemCardProps) => {
  const navigate = useNavigate();
  const { data, refetch } = useIssuesCountByProjectId(id);
  const hasRefetchedRef = useRef(data ? false : true);

  useEffect(() => {
    if (!hasRefetchedRef.current) {
      refetch();
      hasRefetchedRef.current = true;
    }
  }, [refetch]);

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

        <div className="flex gap-1 mt-1 justify-end">
          <Typography variant="small" className="italic">
            Issue Count:
          </Typography>
          {data && (
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal bg-gray-500 w-6 text-center rounded-full"
            >
              {data ?? 0}
            </Typography>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

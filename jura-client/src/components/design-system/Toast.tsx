import { Alert } from "@material-tailwind/react";
import { useEffect } from "react";
import { useToastState } from "../../state/ui-toast";

export const Toast = ({ message, id }: { message: string; id: string }) => {
  const { removeToast } = useToastState();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [id, removeToast]);

  return (
    <Alert
      className="w-72 shadow-lg"
      open={true}
      onClose={() => removeToast(id)}
      animate={{
        mount: { y: 0, x: 0 },
        unmount: { y: 100 },
      }}
    >
      {message}
    </Alert>
  );
};

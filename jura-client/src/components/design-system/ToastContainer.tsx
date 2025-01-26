import { useToastState } from "../../state/ui-toast";
import { Toast } from "./Toast";

export const ToastContainer = () => {
  const { toasts } = useToastState();

  return (
    <div className="fixed top-5 right-5 flex flex-col gap-4">
      {toasts.map(({ id, message }) => (
        <Toast key={id} id={id} message={message} />
      ))}
    </div>
  );
};

import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { sprintStartWarningDialog } from "../state/ui-dialog";

export function SprintStartWarningDialog() {
  const { isOpen, closeDialog } = sprintStartWarningDialog.useDialogState();

  return (
    <Dialog open={isOpen} handler={closeDialog}>
      <DialogHeader>
        <Typography variant="h5" color="blue-gray" className="text-center w-full">
          Warning
        </Typography>
        <IconButton size="sm" variant="text" className="!absolute right-3.5 top-3.5" onClick={closeDialog}>
          <XMarkIcon className="h-4 w-4 stroke-2" />
        </IconButton>
      </DialogHeader>
      <DialogBody divider className="grid place-items-center gap-4">
        <ExclamationCircleIcon className="h-12 w-12 stroke-2" />
        <Typography variant="h4">Sprint can't be started!</Typography>
        <Typography className="text-center font-normal">
          There is already an active sprint. Complete the sprint first before starting one.
        </Typography>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button variant="gradient" onClick={closeDialog}>
          Ok, Got it
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

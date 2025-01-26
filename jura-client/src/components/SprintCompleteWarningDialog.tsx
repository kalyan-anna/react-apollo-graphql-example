import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { sprintCompleteWarningDialog } from "../state/ui-dialog";
import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function SprintCompleteWarningDialog() {
  const { isOpen, closeDialog } = sprintCompleteWarningDialog.useDialogState();

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
        <Typography variant="h4">Sprint can't be completed!</Typography>
        <Typography className="text-center font-normal">
          There are pending issues in the sprint. Complete them or move them to another sprint.
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

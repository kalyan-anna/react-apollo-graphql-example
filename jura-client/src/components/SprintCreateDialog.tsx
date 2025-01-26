import { XMarkIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import * as yup from "yup";
import { useCreateSprintMutation } from "../state/sprint/mutations";
import DatePicker from "./design-system/DatePicker";
import { sprintDialog } from "../state/ui-dialog";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  goal: yup.string().required("Goal is required"),
  startDate: yup.date().required("Start date is required"),
  endDate: yup.date().required("End date is required"),
});

type FormValues = yup.InferType<typeof schema>;

const CreateSprintForm = () => {
  const { closeDialog } = sprintDialog.useDialogState();
  const { projectId = "" } = useParams();
  const [createSprint, { loading }] = useCreateSprintMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    disabled: loading,
  });
  const selectedStartDate = watch("startDate");
  const selectedEndDate = watch("endDate");

  const onSubmit = (data: FormValues) => {
    createSprint({
      ...data,
      projectId,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="false">
      <DialogHeader className="relative m-0 block">
        <Typography variant="h4" color="blue-gray">
          Create Sprint
        </Typography>
        <IconButton
          size="sm"
          variant="text"
          className="!absolute right-3.5 top-3.5"
          onClick={closeDialog}
          disabled={loading}
        >
          <XMarkIcon className="h-4 w-4 stroke-2" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="space-y-8 pb-6">
        <div>
          <Input
            label="Summary"
            error={!!errors.name}
            {...register("name")}
            containerProps={{ className: "min-w-full" }}
          />
          {errors?.name && <p className="text-sm text-red-500 mt-2">{errors.name?.message}</p>}
        </div>

        <div>
          <Textarea
            rows={7}
            label="Goals"
            error={!!errors.goal}
            {...register("goal")}
            containerProps={{ className: "min-w-full" }}
          />
          {errors?.goal && <p className="text-sm text-red-500 mt-2">{errors.goal?.message}</p>}
        </div>

        <div>
          <DatePicker
            label="Start date"
            value={selectedStartDate}
            onChange={(value) => setValue("startDate", value ?? new Date())}
            error={!!errors.startDate}
            disabled={loading}
          />
          {errors?.startDate && <p className="text-sm text-red-500 mt-2">{errors.startDate?.message}</p>}
        </div>

        <div>
          <DatePicker
            label="End date"
            value={selectedEndDate}
            onChange={(value) => setValue("endDate", value ?? new Date())}
            error={!!errors.endDate}
            disabled={loading}
          />
          {errors?.endDate && <p className="text-sm text-red-500 mt-2">{errors.endDate?.message}</p>}
        </div>

        <div className="flex gap-4 justify-end">
          <Button onClick={closeDialog} variant="text" disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={loading}>
            Create
          </Button>
        </div>
      </DialogBody>
    </form>
  );
};

export const SprintCreateDialog = () => {
  const { isOpen, closeDialog } = sprintDialog.useDialogState();

  return (
    <Dialog size="sm" open={isOpen} handler={closeDialog} className="p-4" dismiss={{ outsidePress: false }}>
      <CreateSprintForm />
    </Dialog>
  );
};

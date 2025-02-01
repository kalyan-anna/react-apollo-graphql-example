import { Button, Card, Input, Typography } from "@material-tailwind/react";
import * as yup from "yup";
import { useCurrentUserQuery } from "../state/user";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUpdateUserMutation } from "../state/user/mutations";
import { useAuthState } from "../state/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const schema = yup.object({
  email: yup.string(),
  name: yup.string().required("Name is required"),
});

type FormValues = yup.InferType<typeof schema>;

export function ProfileForm() {
  const { data } = useCurrentUserQuery();
  const [updateUser, { loading }] = useUpdateUserMutation();
  const { currentUserId } = useAuthState();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: data?.user?.email,
      name: data?.user?.name,
    },
    disabled: loading,
  });

  useEffect(() => {
    if (data) {
      reset({
        email: data?.user?.email,
        name: data?.user?.name,
      });
    }
  }, [data, reset]);

  const onSubmit = (data: FormValues) => {
    updateUser(
      {
        id: currentUserId ?? "",
        name: data.name,
      },
      {
        onCompleted: () => {
          navigate("/dashboard");
        },
      }
    );
  };

  const handleCancelClick = () => {
    navigate("/dashboard");
  };

  return (
    <Card color="transparent" shadow={false}>
      <Typography variant="h4" color="blue-gray">
        Profile
      </Typography>
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Your Name
          </Typography>
          <div>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              error={!!errors.name}
              {...register("name")}
              disabled={loading}
            />
            {errors?.name && <p className="text-sm text-red-500 mt-2">{errors.name?.message}</p>}
          </div>

          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Your Email
          </Typography>
          <Input
            size="lg"
            placeholder="name@mail.com"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            {...register("email", { disabled: true })}
          />
        </div>
        <div className="flex gap-4">
          <Button className="mt-6" fullWidth variant="outlined" onClick={handleCancelClick} disabled={loading}>
            Cancel
          </Button>
          <Button className="mt-6" fullWidth type="submit" loading={loading} disabled={loading}>
            Save
          </Button>
        </div>
      </form>
    </Card>
  );
}

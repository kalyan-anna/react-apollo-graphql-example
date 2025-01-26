import * as yup from "yup";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Typography,
} from "@material-tailwind/react";

import { useForm } from "react-hook-form";
import { useLoginMutation } from "../state/auth";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters long")
    .required("Password is required"),
});

type FormValues = yup.InferType<typeof schema>;

export const LoginForm = () => {
  const [loginMutation, { loading, error: apiError }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "johndoe@example.com",
      password: "Summertime2025",
    },
  });

  const onSubmit = (data: FormValues) => {
    loginMutation({
      variables: {
        email: data.email,
        password: data.password,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="false">
      <Card className="w-96">
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            Login In
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          {apiError?.message && (
            <p className="text-sm text-red-500 mb-2">{apiError.message}</p>
          )}
          <div>
            <Input
              type="email"
              label="Email"
              className="mb-4"
              error={!!errors.email}
              {...register("email")}
              disabled={loading}
            />
            {errors?.email && (
              <p className="text-sm text-red-500 mt-2">
                {errors.email?.message}
              </p>
            )}
          </div>
          <div>
            <Input
              type="password"
              label="Password"
              className="mb-4"
              error={!!errors.password}
              {...register("password")}
              disabled={loading}
            />
            {errors?.password && (
              <p className="text-sm text-red-500 mt-2">
                {errors.password?.message}
              </p>
            )}
          </div>
        </CardBody>
        <CardFooter className="pt-0">
          <Button variant="gradient" fullWidth type="submit" loading={loading}>
            Login In
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

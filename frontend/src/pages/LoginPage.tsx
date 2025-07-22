import React from "react";
import { useForm } from "react-hook-form";
import { Box, Typography, Alert } from "@mui/material";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../features/auth/useAuth";
import { useLoginMutation } from "../api/authApi";

interface LoginFormInputs {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [loginMutation, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const result = await loginMutation(data).unwrap();
      login(result.token);
    } catch (err: any) {
      setError("root", {
        message: err?.data?.message || err?.message || "Login failed",
      });
    }
  };

  return (
    <Box
      maxWidth={400}
      mx="auto"
      mt={8}
      p={4}
      boxShadow={3}
      borderRadius={2}
      bgcolor="background.paper"
    >
      <Typography variant="h4" mb={2} fontWeight={700}>
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Username"
          fullWidth
          margin="normal"
          {...register("username", { required: "Username is required" })}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        <Input
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          {...register("password", { required: "Password is required" })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        {errors.root && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errors.root.message}
          </Alert>
        )}
        <Button
          type="submit"
          color="primary"
          variant="contained"
          fullWidth
          size="large"
          disabled={isLoading}
          sx={{ mt: 3 }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;

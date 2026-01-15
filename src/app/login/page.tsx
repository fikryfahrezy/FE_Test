"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useLogin } from "@/services/use-highway-service";
import { useAuth } from "@/contexts/auth-context";
import { Redirect } from "@/components/utils/redirect";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, token, isLoading: authLoading } = useAuth();
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        if (data.token) {
          login(data.token);
          router.replace("/");
        }
      },
    });
  };

  if (authLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (token) {
    return <Redirect to="/" />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 4,
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <img
            src="/app-logo.png"
            alt="App Logo"
            style={{
              width: "100%",
              height: 150,
              objectFit: "contain",
              marginBottom: 24,
            }}
          />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mb: 3 }}>
              <Typography
                component="label"
                htmlFor="username"
                sx={{ display: "block", mb: 1, color: "text.primary" }}
              >
                Username
              </Typography>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="username"
                    placeholder="Username"
                    fullWidth
                    size="small"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    autoComplete="username"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "grey.100",
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                component="label"
                htmlFor="password"
                sx={{ display: "block", mb: 1, color: "text.primary" }}
              >
                Password
              </Typography>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="password"
                    type="password"
                    placeholder="******"
                    fullWidth
                    size="small"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    autoComplete="current-password"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "grey.100",
                      },
                    }}
                  />
                )}
              />
            </Box>

            {loginMutation.isError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {loginMutation.error.message}
              </Alert>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Login"}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          backgroundImage: 'url("/login-page-bg.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </Box>
  );
}

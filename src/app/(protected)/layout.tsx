"use client";

import { useAuth } from "@/contexts/auth-context";
import { Box, CircularProgress } from "@mui/material";
import { MainLayout } from "@/components/layout/main-layout";
import { Redirect } from "@/components/utils/redirect";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
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

  if (!token) {
    return <Redirect to="/login" />;
  }

  return <MainLayout>{children}</MainLayout>;
}

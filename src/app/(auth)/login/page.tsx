
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/common/AuthProvider";
import { fetchApi } from "@/lib/api";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionExpired = searchParams?.get("session") === "expired";
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (response.success) {
        login(response.data);
        if (response.data.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/engineer/profile");
        }
      } else {
        setError(response.message || "??? ??? ????? ????? ??????");
      }
    } catch (err: any) {
      setError(err.message || "??? ??? ????? ????? ??????");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {sessionExpired && (
            <Typography color="error" sx={{ mb: 2 }}>
              ????? ??????? ???? ?????? ?? ????
            </Typography>
          )}
          <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
            ????? ??????
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="??? ????????"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="???? ??????"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: "1.1rem" }}
              disabled={loading}
            >
              {loading ? "???? ??????..." : "????"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>???? ???????...</div>}>
      <LoginForm />
    </Suspense>
  );
}

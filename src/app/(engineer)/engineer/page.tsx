
"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Grid, Card, CardContent, TextField, Paper, Skeleton, Alert, List, ListItem, ListItemText } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "@/components/common/AuthProvider";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EngineerHomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      fetchApi("/visits/mine/summary"),
      fetchApi("/visits/mine?limit=5")
    ]).then(([resSum, resRec]) => {
      setSummary(resSum.data);
      setRecent(resRec.data?.slice(0, 5) || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (search.trim()) router.push(`/engineer/companies?search=${search.trim()}`);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }} data-testid="engineer-greeting">
        ??????? {user?.fullName?.split(" ")[0] || "?? ?????"}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{xs: 6}}>
          <Button component={Link} href="/engineer/visits/new" variant="contained" color="primary" fullWidth sx={{ py: 2, display: "flex", flexDirection: "column" }}>
            <AddIcon sx={{ fontSize: 32, mb: 1 }} />
            ????? ?????
          </Button>
        </Grid>
        <Grid size={{xs: 6}}>
          <Button component={Link} href="/engineer/companies?new=1" variant="contained" color="secondary" fullWidth sx={{ py: 2, display: "flex", flexDirection: "column" }}>
            <BusinessIcon sx={{ fontSize: 32, mb: 1 }} />
            ????? ????
          </Button>
        </Grid>
      </Grid>

      <Box component="form" onSubmit={(e: any) => handleSearch(e)} sx={{ display: "flex", gap: 1, mb: 4 }}>
        <TextField fullWidth size="small" placeholder="??? ?? ????..." value={search} onChange={(e: any) => setSearch(e.target.value)} />
        <Button type="submit" variant="outlined"><SearchIcon /></Button>
      </Box>

      {loading ? <Skeleton variant="rectangular" height={100} sx={{ mb: 4 }} /> : summary && (
        <Grid container spacing={2} sx={{ mb: 4 }} data-testid="engineer-summary">
          <Grid size={{xs: 6}}>
            <Card sx={{ bgcolor: "primary.50" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="caption">?????? ?????</Typography>
                <Typography variant="h5" color="primary.main">{summary.today}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{xs: 6}}>
            <Card sx={{ bgcolor: "success.50" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="caption">?????? ?????</Typography>
                <Typography variant="h5" color="success.main">{summary.month}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Typography variant="h6" gutterBottom>??? 5 ??????</Typography>
      {loading ? <Skeleton variant="rectangular" height={150} /> : recent.length > 0 ? (
        <Paper data-testid="engineer-recent-visits">
          <List>
            {recent.map((v, i) => (
              <ListItem key={v._id} divider={i < recent.length - 1} component={Link} href={`/engineer/visits/${v._id}`} sx={{ color: "inherit", textDecoration: "none" }}>
                <ListItemText
                  primary={v.company?.nameAr}
                  secondary={new Date(v.visitDate).toLocaleDateString("ar-EG") + " - " + (v.type === "completed" ? "??????" : v.type === "planned" ? "???? ???" : "?????")}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : (
        <Alert severity="info">?? ???? ?????? ?????</Alert>
      )}
    </Box>
  );
}

"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Chip, Button } from "@mui/material";
import { fetchApi } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { displayName } from "@/lib/helpers";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface FollowUpVisit {
  _id: string;
  company: any;
  followUp: { dueDate: string; note?: string; status?: string };
}

const statusLabel = (s?: string) => (s === "overdue" ? "متأخرة" : s === "today" ? "اليوم" : "قادمة");
const statusColor = (s?: string): "error" | "warning" | "primary" => (s === "overdue" ? "error" : s === "today" ? "warning" : "primary");

function FollowUpsList() {
  const [visits, setVisits] = useState<FollowUpVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "";

  useEffect(() => {
    setLoading(true);
    fetchApi(`/visits/follow-ups/mine${status ? `?status=${status}` : ""}`)
      .then((res) => setVisits(res?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [status]);

  const handleDone = async (id: string) => {
    if (!confirm("هل تم الانتهاء من المتابعة؟")) return;
    try {
      await fetchApi(`/visits/${id}/follow-up`, { method: "PATCH", body: JSON.stringify({ done: true }) });
      setVisits((prev) => prev.filter((v) => v._id !== id));
    } catch {
      alert("خطأ في التحديث");
    }
  };

  if (loading) return <Box sx={{ p: 3 }}><Typography>جاري التحميل...</Typography></Box>;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        المتابعات {status === "today" ? "(اليوم)" : status === "overdue" ? "(متأخرة)" : status === "upcoming" ? "(قادمة)" : ""}
      </Typography>

      {visits.length === 0 ? (
        <Typography color="text.secondary">لا توجد متابعات هنا.</Typography>
      ) : (
        visits.map((v) => (
          <Card key={v._id} elevation={0} data-testid="followup-card" sx={{ border: "1px solid #e0e0e0", mb: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "primary.main", cursor: "pointer" }} onClick={() => router.push(`/engineer/visits/${v._id}`)}>
                    {displayName(v.company)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    تاريخ المتابعة: {new Date(v.followUp.dueDate).toLocaleDateString("ar-EG")}
                  </Typography>
                  <Chip size="small" label={statusLabel(v.followUp.status)} color={statusColor(v.followUp.status)} sx={{ mb: 2 }} />
                  {v.followUp.note && (
                    <Typography variant="body2" sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}>{v.followUp.note}</Typography>
                  )}
                </Box>
                <Button variant="outlined" size="small" color="success" startIcon={<CheckCircleIcon />} onClick={() => handleDone(v._id)}>
                  تمت
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}

export default function FollowUpsPage() {
  return (
    <Suspense fallback={<Box sx={{ p: 3 }}><Typography>جاري التحميل...</Typography></Box>}>
      <FollowUpsList />
    </Suspense>
  );
}

"use client";
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Chip, Button, IconButton } from "@mui/material";
import { fetchApi } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { displayName, formatDateTime } from "@/lib/helpers";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function FollowUpsPage() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || '';

  useEffect(() => {
    fetchApi(`/visits/follow-ups/mine${status ? `?status=${status}` : ''}`)
      .then(res => setVisits(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [status]);

  const handleDone = async (id) => {
    if (!confirm('هل تم الانتهاء من المتابعة؟')) return;
    try {
      await fetchApi(`/visits/${id}/follow-up`, { method: 'PATCH', body: JSON.stringify({ done: true }) });
      setVisits(visits.filter(v => v._id !== id));
    } catch(err) {
      alert('خطأ في التحديث');
    }
  };

  if (loading) return <Box sx={{ p: 3 }}><Typography>جاري التحميل...</Typography></Box>;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          المتابعات {status === 'today' ? '(اليوم)' : status === 'overdue' ? '(متأخرة)' : status === 'upcoming' ? '(قادمة)' : ''}
        </Typography>
      </Box>

      {visits.length === 0 ? (
        <Typography color="text.secondary">لا توجد متابعات هنا.</Typography>
      ) : (
        visits.map(v => (
          <Card key={v._id} elevation={0} sx={{ border: "1px solid #e0e0e0", mb: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "primary.main", cursor: "pointer" }} onClick={() => router.push(`/engineer/visits/${v._id}`)}>
                    {displayName(v.company)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    تاريخ المتابعة: {new Date(v.followUp.dueDate).toLocaleDateString('ar-EG')}
                  </Typography>
                  <Chip size="small" label={v.followUp.status === 'overdue' ? 'متأخرة' : v.followUp.status === 'today' ? 'اليوم' : 'قادمة'} color={v.followUp.status === 'overdue' ? 'error' : v.followUp.status === 'today' ? 'warning' : 'primary'} sx={{ mb: 2 }} />
                  {v.followUp.note && (
                    <Typography variant="body2" sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}>
                      {v.followUp.note}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button variant="outlined" size="small" color="success" startIcon={<CheckCircleIcon />} onClick={() => handleDone(v._id)}>
                    تمت
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}

"use client";
import React, { useState } from "react";
import { VisitForm } from "./VisitForm";
import { displayName } from "@/lib/helpers";
import { formatDateTime } from "@/lib/helpers";
import { Box, Card, CardContent, Typography, Button, Grid, Chip, Divider, List, ListItem } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import HistoryIcon from "@mui/icons-material/History";

interface VisitDetailsProps {
  visit: any;
  onUpdate: (data: any) => Promise<void>;
  onDelete: () => Promise<void>;
  isAdmin?: boolean;
}

export function VisitDetails({ visit, onUpdate, onDelete, isAdmin }: VisitDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذه الزيارة؟")) return;
    try {
      setIsDeleting(true);
      await onDelete();
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء الحذف");
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    await onUpdate(data);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>تعديل الزيارة</Typography>
          <VisitForm initialData={visit} onSubmit={handleUpdate} />
          <Box sx={{ mt: 2 }}>
            <Button onClick={() => setIsEditing(false)} color="inherit">
              إلغاء التعديل
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const boxedText = { p: 1.5, bgcolor: "grey.50", border: "1px solid #eee", borderRadius: 1, minHeight: 60 };

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      {errorMsg && (
        <Box sx={{ mb: 2, p: 1.5, bgcolor: "error.light", color: "error.contrastText", borderRadius: 1 }}>{errorMsg}</Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3, borderBottom: "1px solid #eee", pb: 2 }}>
        <Box>
          <Typography variant="h5" color="text.primary" sx={{ fontWeight: "bold" }}>
            {displayName(visit.company)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            المهندس المسؤول: {visit.engineer?.fullName}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {!visit.canEdit ? (
             <Chip label="لا يمكن تعديل الزيارة (انقضت 24 ساعة)" size="small" variant="outlined" />
          ) : (
             <Button variant="outlined" color="primary" onClick={() => setIsEditing(true)}>تعديل</Button>
          )}
          {visit.canDelete && (
             <Button variant="contained" color="error" disabled={isDeleting} onClick={handleDelete}>حذف</Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>تفاصيل الزيارة</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            <Box sx={{ display: "flex" }}><Typography variant="body2" color="text.secondary" sx={{ width: 100 }}>التاريخ:</Typography> <Typography variant="body2" sx={{ fontWeight: "medium" }}>{formatDateTime(visit.visitDate)}</Typography></Box>
            <Box sx={{ display: "flex" }}>
              <Typography variant="body2" color="text.secondary" sx={{ width: 100 }}>النوع:</Typography>
              <Chip
                size="small"
                label={visit.type === "planned" ? "مخطط لها" : visit.type === "completed" ? "مكتملة" : "ملغاة"}
                color={visit.type === "planned" ? "warning" : visit.type === "completed" ? "success" : "error"}
              />
            </Box>
            <Box sx={{ display: "flex" }}><Typography variant="body2" color="text.secondary" sx={{ width: 100 }}>المنطقة:</Typography> <Typography variant="body2" sx={{ fontWeight: "medium" }}>{visit.company?.region?.name || "غير محدد"}</Typography></Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>تفاصيل المتابعة</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>ملاحظات:</Typography>
              <Box sx={boxedText}>
                <Typography variant="body2">{visit.notes || "لا يوجد ملاحظات"}</Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>الخطوة القادمة:</Typography>
              <Box sx={boxedText}>
                <Typography variant="body2">{visit.nextStep || "لم يتم التحديد"}</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {visit.attendees && visit.attendees.length > 0 && (
        <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #eee" }}>
          <Typography variant="h6" gutterBottom>الحاضرون في الزيارة</Typography>
          <Grid container spacing={2}>
            {visit.attendees.map((att: any, idx: number) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{att.name}</Typography>
                  {att.jobTitle && <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{att.jobTitle}</Typography>}
                  {att.phone && (
                    <Box sx={{ mt: "auto", pt: 1.5, borderTop: "1px solid #eee" }}>
                      <Box component="a" href={`tel:${att.phone}`} dir="ltr" sx={{ display: "flex", alignItems: "center", textDecoration: 'none', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}>
                        <PhoneIcon fontSize="small" sx={{ ml: 1 }} />
                        <Typography variant="body2">{att.phone}</Typography>
                      </Box>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #eee" }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">صور الزيارة</Typography>
          <Button variant="outlined" component="label">
            رفع صور
            <input type="file" hidden multiple accept="image/*" onChange={async (e) => {
              if (!e.target.files?.length) return;
              const files = Array.from(e.target.files);
              
              const resizedFiles = await Promise.all(files.map(file => {
                return new Promise<Blob>((resolve) => {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                      const canvas = document.createElement("canvas");
                      const MAX_SIZE = 1600;
                      let width = img.width;
                      let height = img.height;
                      if (width > height && width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                      } else if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                      }
                      canvas.width = width;
                      canvas.height = height;
                      const ctx = canvas.getContext("2d");
                      ctx?.drawImage(img, 0, 0, width, height);
                      canvas.toBlob((blob) => {
                        if (blob) resolve(blob);
                      }, "image/jpeg", 0.8);
                    };
                    img.src = event.target?.result as string;
                  };
                  reader.readAsDataURL(file);
                });
              }));

              const formData = new FormData();
              resizedFiles.forEach((blob, i) => formData.append("photos", blob, `photo-${i}.jpg`));
              
              try {
                 const { fetchApi } = await import('@/lib/api');
                 const res = await fetchApi(`/visits/${visit._id}/photos`, { method: 'POST', body: formData });
                 // update the visit prop with new photos (simulate)
                 onUpdate(res.data);
              } catch (err) {
                 alert("حدث خطأ أثناء رفع الصور");
              }
            }} />
          </Button>
        </Box>
        {visit.photos && visit.photos.length > 0 ? (
          <Grid container spacing={2}>
            {visit.photos.map((photoUrl: string, idx: number) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={idx}>
                <img src={photoUrl} alt="Visit Photo" style={{ width: '100%', borderRadius: 8, objectFit: 'cover', aspectRatio: '1/1' }} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">لا توجد صور مرفقة</Typography>
        )}
      </Box>

      {isAdmin && visit.editHistory && visit.editHistory.length > 0 && (
        <Box sx={{ mt: 4, p: 3, bgcolor: "grey.50", borderRadius: 1, border: "1px solid #eee" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <HistoryIcon sx={{ ml: 1, color: 'text.secondary' }} />
            <Typography variant="h6">سجل التعديلات</Typography>
          </Box>
          <List disablePadding>
            {visit.editHistory.map((history: any, idx: number) => (
              <React.Fragment key={idx}>
                <ListItem sx={{ px: 0, py: 1, flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    تم التعديل بواسطة <strong>{history.editedBy?.fullName || "مجهول"}</strong> بتاريخ {formatDateTime(history.editedAt)}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, pl: 2 }}>
                    {history.changes.map((c: any, cidx: number) => (
                      <Typography variant="body2" key={cidx}>
                        • تغيير <strong>{c.field}</strong> من <Chip size="small" label={c.from || 'فارغ'} sx={{ mx: 0.5, bgcolor: 'error.50', color: 'error.main' }} /> إلى <Chip size="small" label={c.to || 'فارغ'} sx={{ mx: 0.5, bgcolor: 'success.50', color: 'success.main' }} />
                      </Typography>
                    ))}
                  </Box>
                </ListItem>
                {idx < visit.editHistory.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}
    </Card>
  );
}

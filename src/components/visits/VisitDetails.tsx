// @ts-nocheck
"use client";
import React, { useState } from "react";
import { VisitForm } from "./VisitForm";
import { displayName } from "@/lib/helpers";
import { formatDateTime } from "@/lib/helpers";
import { Box, Card, CardContent, Typography, Button, Grid, Chip, Divider, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import AddIcon from "@mui/icons-material/Add";
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
          <Box mt={2}>
            <Button onClick={() => setIsEditing(false)} color="inherit">
              إلغاء التعديل
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      {errorMsg && <Box mb={2} p={1.5} bgcolor="error.light" color="error.contrastText" borderRadius={1}>{errorMsg}</Box>}
      
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} borderBottom="1px solid #eee" pb={2}>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            {displayName(visit.company)}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            المهندس المسؤول: {visit.engineer?.fullName}
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
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
        <Grid item xs={12} md={6}>
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
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>تفاصيل المتابعة</Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>ملاحظات:</Typography> 
              <Box p={1.5} bgcolor="grey.50" border="1px solid #eee" borderRadius={1} minHeight={60}>
                <Typography variant="body2">{visit.notes || "لا يوجد ملاحظات"}</Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>الخطوة القادمة:</Typography> 
              <Box p={1.5} bgcolor="grey.50" border="1px solid #eee" borderRadius={1} minHeight={60}>
                <Typography variant="body2">{visit.nextStep || "لم يتم التحديد"}</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {visit.attendees && visit.attendees.length > 0 && (
        <Box mt={4} pt={3} borderTop="1px solid #eee">
          <Typography variant="h6" gutterBottom>الحاضرون في الزيارة</Typography>
          <Grid container spacing={2}>
            {visit.attendees.map((att: any, idx: number) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{att.name}</Typography>
                  {att.jobTitle && <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{att.jobTitle}</Typography>}
                  {att.phone && (
                    <Box mt="auto" pt={1.5} borderTop="1px solid #eee">
                      <Box display="flex" alignItems="center" component="a" href={`tel:${att.phone}`} sx={{ textDecoration: 'none', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }} dir="ltr">
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

      {isAdmin && visit.editHistory && visit.editHistory.length > 0 && (
        <Box mt={4} p={3} bgcolor="grey.50" borderRadius={1} border="1px solid #eee">
          <Box display="flex" alignItems="center" mb={2}>
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
                  <Box display="flex" flexDirection="column" gap={0.5} pl={2}>
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

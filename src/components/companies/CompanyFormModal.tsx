"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, CircularProgress, Alert, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchApi } from "@/lib/api";

const companySchema = z.object({
  nameAr: z.string().optional(),
  nameEn: z.string().optional(),
  region: z.string().optional(),
  address: z.string().optional(),
  industry: z.string().optional(),
  notes: z.string().optional(),
}).refine(data => data.nameAr || data.nameEn, {
  message: "يجب إدخال الاسم بالعربية أو الإنجليزية",
  path: ["nameAr"]
});

type FormData = z.infer<typeof companySchema>;

interface CompanyFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
  isAdmin: boolean;
}

export default function CompanyFormModal({ open, onClose, onSuccess, initialData, isAdmin }: CompanyFormModalProps) {
  const [regions, setRegions] = useState<any[]>([]);
  const [regionsLoading, setRegionsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [similarConfirm, setSimilarConfirm] = useState<{show: boolean, payload: any, similarName: string}>({show: false, payload: null, similarName: ""});

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(companySchema),
    defaultValues: { nameAr: "", nameEn: "", region: "", address: "", industry: "", notes: "" }
  });

  useEffect(() => {
    if (open) {
      setSubmitError("");
      setSimilarConfirm({show: false, payload: null, similarName: ""});
      if (initialData) {
        reset({
          nameAr: initialData.nameAr || "",
          nameEn: initialData.nameEn || "",
          region: initialData.region?._id || initialData.region || "",
          address: initialData.address || "",
          industry: initialData.industry || "",
          notes: initialData.notes || "",
        });
      } else {
        reset({ nameAr: "", nameEn: "", region: "", address: "", industry: "", notes: "" });
      }
      
      if (isAdmin && regions.length === 0) {
        setRegionsLoading(true);
        fetchApi("/regions").then(res => setRegions(res.data)).catch(() => {}).finally(() => setRegionsLoading(false));
      }
    }
  }, [open, initialData, isAdmin, reset]);

  const onSubmit = async (data: FormData, confirmSimilar = false) => {
    try {
      setSubmitError("");
      const payload = { ...data };
      if (!isAdmin) delete payload.region;
      
      const endpoint = initialData ? `/companies/${initialData._id}` : "/companies";
      const method = initialData ? "PATCH" : "POST";
      const query = confirmSimilar ? "?confirmSimilar=true" : "";

      await fetchApi(endpoint + query, {
        method,
        body: JSON.stringify(payload)
      });
      
      onSuccess();
      reset();
      setSimilarConfirm({show: false, payload: null, similarName: ""});
      onClose();
    } catch (err: any) {
              if (err.status === 409 && err.message.includes("مشابهة")) {
        setSimilarConfirm({ show: true, payload: data, similarName: "" }); 
      } else {
        setSubmitError(err.message || "حدث خطأ");
      }
    }
  };

  return (
    <>
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "تعديل شركة" : "إضافة شركة"}</DialogTitle>
      <form onSubmit={handleSubmit((d) => onSubmit(d, false))}>
        <DialogContent dividers>
          {submitError && <Alert severity="error" sx={{ mb: 2 }} data-testid="duplicate-error">{submitError}</Alert>}
          <Controller
            name="nameAr"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="الاسم بالعربي" fullWidth margin="normal" error={!!errors.nameAr} helperText={errors.nameAr?.message} />
            )}
          />
          <Controller
            name="nameEn"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="الاسم بالإنجليزي" fullWidth margin="normal" error={!!errors.nameEn} helperText={errors.nameEn?.message} />
            )}
          />
          {isAdmin && (
            <Controller
              name="region"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="المنطقة" fullWidth margin="normal" error={!!errors.region} helperText={errors.region?.message} disabled={regionsLoading}>
                  {regions.map(r => (
                    <MenuItem key={r._id} value={r._id}>{r.name}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          )}
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="الصناعة" fullWidth margin="normal" />
            )}
          />
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="العنوان" fullWidth margin="normal" />
            )}
          />
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="ملاحظات" fullWidth margin="normal" multiline rows={3} />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>إلغاء</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : "حفظ"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>

      <Dialog open={similarConfirm.show} onClose={() => setSimilarConfirm({show: false, payload: null, similarName: ""})} data-testid="similar-dialog">
        <DialogTitle>تأكيد الإضافة</DialogTitle>
        <DialogContent>
          <Typography>فيه شركات مشابهة.. متأكد؟</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSimilarConfirm({show: false, payload: null, similarName: ""})}>إلغاء</Button>
          <Button onClick={() => onSubmit(similarConfirm.payload, true)} variant="contained" color="primary" data-testid="similar-confirm">
            متأكد
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

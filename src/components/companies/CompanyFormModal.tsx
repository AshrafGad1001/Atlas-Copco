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
  message: "\u064a\u062c\u0628 \u0625\u062f\u062e\u0627\u0644 \u0627\u0644\u0627\u0633\u0645 \u0628\u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0623\u0648 \u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629",
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
      onClose();
    } catch (err: any) {
      if (err.status === 409 && err.message === "\u0634\u0631\u0643\u0629 \u0645\u0634\u0627\u0628\u0647\u0629 \u0645\u0648\u062c\u0648\u062f\u0629") {
        setSimilarConfirm({ show: true, payload: data, similarName: "" }); 
      } else {
        setSubmitError(err.message || "\u062d\u062f\u062b \u062e\u0637\u0623");
      }
    }
  };

  if (similarConfirm.show) {
    return (
      <Dialog open={open} onClose={() => setSimilarConfirm({show: false, payload: null, similarName: ""})}>
        <DialogTitle>\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0625\u0636\u0627\u0641\u0629</DialogTitle>
        <DialogContent>
          <Typography>\u0641\u064a\u0647 \u0634\u0631\u0643\u0627\u062a \u0645\u0634\u0627\u0628\u0647\u0629.. \u0645\u062a\u0623\u0643\u062f\u061f</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSimilarConfirm({show: false, payload: null, similarName: ""})}>\u0625\u0644\u063a\u0627\u0621</Button>
          <Button onClick={() => onSubmit(similarConfirm.payload, true)} variant="contained" color="primary">
            \u0645\u062a\u0623\u0643\u062f
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "\u062a\u0639\u062f\u064a\u0644 \u0634\u0631\u0643\u0629" : "\u0625\u0636\u0627\u0641\u0629 \u0634\u0631\u0643\u0629"}</DialogTitle>
      <form onSubmit={handleSubmit((d) => onSubmit(d, false))}>
        <DialogContent dividers>
          {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
          <Controller
            name="nameAr"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="\u0627\u0644\u0627\u0633\u0645 \u0628\u0627\u0644\u0639\u0631\u0628\u064a" fullWidth margin="normal" error={!!errors.nameAr} helperText={errors.nameAr?.message} />
            )}
          />
          <Controller
            name="nameEn"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="\u0627\u0644\u0627\u0633\u0645 \u0628\u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a" fullWidth margin="normal" error={!!errors.nameEn} helperText={errors.nameEn?.message} />
            )}
          />
          {isAdmin && (
            <Controller
              name="region"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="\u0627\u0644\u0645\u0646\u0637\u0642\u0629" fullWidth margin="normal" error={!!errors.region} helperText={errors.region?.message} disabled={regionsLoading}>
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
              <TextField {...field} label="\u0627\u0644\u0635\u0646\u0627\u0639\u0629" fullWidth margin="normal" />
            )}
          />
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="\u0627\u0644\u0639\u0646\u0648\u0627\u0646" fullWidth margin="normal" />
            )}
          />
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="\u0645\u0644\u0627\u062d\u0638\u0627\u062a" fullWidth margin="normal" multiline rows={3} />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>\u0625\u0644\u063a\u0627\u0621</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : "\u062d\u0641\u0638"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

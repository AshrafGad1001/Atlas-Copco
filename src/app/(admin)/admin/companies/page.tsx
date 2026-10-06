// @ts-nocheck
"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Pagination, Select } from "@mui/material";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/components/common/AuthProvider";
import CompanyFormModal from "@/components/companies/CompanyFormModal";
import { useDebouncedValue } from "@/app/(engineer)/engineer/companies/page"; // Exported from engineer page or move to hooks

import ExportButton from "@/components/common/ExportButton";
export default function AdminCompaniesPage() {
  const searchParams = useSearchParams();
  const [companies, setCompanies] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);
  const [regionFilter, setRegionFilter] = useState("");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [targetMergeId, setTargetMergeId] = useState("");

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<any>(null);

  const limit = 10;

  const loadCompanies = () => {
    let query = `?page=${page}&limit=${limit}`;
    if (debouncedSearch) query += `&search=${encodeURIComponent(debouncedSearch)}`;
    if (regionFilter) query += `&region=${regionFilter}`;
    fetchApi(`/companies${query}`).then(res => {
      setCompanies(res.data);
      setTotal(res.pagination?.pages || 1);
    }).catch(console.error);
  };

  useEffect(() => {
    fetchApi("/regions").then(res => setRegions(res.data)).catch(() => {});
  }, []);
  useEffect(() => {
    if (searchParams?.get("new") === "1") {
      setModalOpen(true);
    }
    if (searchParams?.get("search")) {
      setSearch(searchParams.get("search") || "");
    }
  }, [searchParams]);


  useEffect(() => {
    loadCompanies();
  }, [debouncedSearch, regionFilter, page]);

  const handleEdit = (comp: any) => {
    setSelectedCompany(comp);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCompany(null);
    setModalOpen(true);
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleMerge = async () => {
    if (!targetMergeId) return;
    const sources = selectedIds.filter(id => id !== targetMergeId);
    if (sources.length === 0) return;
    try {
      await fetchApi(`/admin/companies/${targetMergeId}/merge`, {
        method: "POST",
        body: JSON.stringify({ sourceIds: sources })
      });
      setMergeModalOpen(false);
      setSelectedIds([]);
      setTargetMergeId("");
      loadCompanies();
    } catch (e) {
      console.error(e);
    }
  };

  const handleImport = async (isDryRun = false) => {
    if (!importFile) return;
    setImporting(true);
    const formData = new FormData();
    formData.append("file", importFile);
    if (isDryRun) formData.append("dryRun", "true");
    try {
      const res = await fetchApi("/admin/companies/import", {
        method: "POST",
        body: formData
      });
      if (isDryRun) {
        setImportPreview(res.data);
      } else {
        alert(`تم إضافة ${res.data.added} وتجاهل ${res.data.ignored}`);
        setImportModalOpen(false);
        setImportFile(null);
        setImportPreview(null);
        loadCompanies();
      }
    } catch (e: any) {
      alert(e.message || "خطأ");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          إدارة الشركات
        </Typography>
        <div>
          <Button variant="outlined" onClick={() => setImportModalOpen(true)} sx={{ mr: 1 }}>
            استيراد Excel
          </Button>
          <Button variant="contained" onClick={handleAdd}>
            إضافة شركة
          </Button>
        </div>
      </div>
      
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <TextField 
          label="بحث" 
          variant="outlined" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
        />
        <TextField
          select
          label="المنطقة"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="">الكل</MenuItem>
          {regions.map(r => <MenuItem key={r._id} value={r._id}>{r.name}</MenuItem>)}
        </TextField>
      </div>

      {selectedIds.length > 1 && (
        <div style={{ marginBottom: 16 }}>
          <Button variant="contained" color="warning" onClick={() => setMergeModalOpen(true)} data-testid="merge-company-btn">
            دمج الشركات المحددة ({selectedIds.length})
          </Button>
        </div>
      )}

      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>الاسم</TableCell>
                  <TableCell>المنطقة</TableCell>
                  <TableCell>الصناعة</TableCell>
                  <TableCell>إجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selectedIds.includes(row._id)} onChange={() => toggleSelect(row._id)} />
                    </TableCell>
                    <TableCell>{row.nameAr || row.nameEn}</TableCell>
                    <TableCell>{row.region?.name || "-"}</TableCell>
                    <TableCell>{row.industry || "-"}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => handleEdit(row)}>تعديل</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <Pagination count={total} page={page} onChange={(e, v) => setPage(v)} />
          </div>
        </CardContent>
      </Card>

      {modalOpen && (
        <CompanyFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={loadCompanies}
          initialData={selectedCompany}
          isAdmin={true}
        />
      )}

      <Dialog open={mergeModalOpen} onClose={() => setMergeModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>دمج الشركات</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>اختر الشركة الأساسية:</Typography>
          <Select fullWidth value={targetMergeId} onChange={(e) => setTargetMergeId(e.target.value)}>
            {selectedIds.map(id => {
              const comp = companies.find(c => c._id === id);
              return <MenuItem key={id} value={id}>{comp?.nameAr || comp?.nameEn}</MenuItem>
            })}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMergeModalOpen(false)}>إلغاء</Button>
          <Button onClick={handleMerge} variant="contained" color="warning" disabled={!targetMergeId} data-testid="confirm-merge-btn">
            دمج
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={importModalOpen} onClose={() => { setImportModalOpen(false); setImportPreview(null); setImportFile(null); }}>
        <DialogTitle>استيراد شركات</DialogTitle>
        <DialogContent dividers>
          <input type="file" accept=".xlsx" onChange={(e) => { setImportFile(e.target.files?.[0] || null); setImportPreview(null); }} />
          {importing && <Typography>جاري الاستيراد...</Typography>}
          {importPreview && (
            <div data-testid="import-preview">
              <Typography>سيتم إضافة {importPreview.added} شركة</Typography>
              <Typography>سيتم تجاهل {importPreview.ignored} شركة</Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setImportModalOpen(false); setImportPreview(null); setImportFile(null); }}>إلغاء</Button>
          {!importPreview ? (
            <Button onClick={() => handleImport(true)} variant="contained" disabled={!importFile || importing} data-testid="import-preview-btn">
              معاينة
            </Button>
          ) : (
            <Button onClick={() => handleImport(false)} variant="contained" color="primary" disabled={!importFile || importing} data-testid="import-confirm-btn">
              تأكيد
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

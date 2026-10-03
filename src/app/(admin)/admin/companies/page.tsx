"use client";

import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Pagination, Select } from "@mui/material";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/components/common/AuthProvider";
import CompanyFormModal from "@/components/companies/CompanyFormModal";
import { useDebouncedValue } from "@/app/(engineer)/engineer/companies/page"; // Exported from engineer page or move to hooks

export default function AdminCompaniesPage() {
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
        alert(`\u062a\u0645 \u0625\u0636\u0627\u0641\u0629 ${res.data.added} \u0648\u062a\u062c\u0627\u0647\u0644 ${res.data.ignored}`);
        setImportModalOpen(false);
        setImportFile(null);
        setImportPreview(null);
        loadCompanies();
      }
    } catch (e: any) {
      alert(e.message || "\u062e\u0637\u0623");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          \u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0634\u0631\u0643\u0627\u062a
        </Typography>
        <div>
          <Button variant="outlined" onClick={() => setImportModalOpen(true)} sx={{ mr: 1 }}>
            \u0627\u0633\u062a\u064a\u0631\u0627\u062f Excel
          </Button>
          <Button variant="contained" onClick={handleAdd}>
            \u0625\u0636\u0627\u0641\u0629 \u0634\u0631\u0643\u0629
          </Button>
        </div>
      </div>
      
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <TextField 
          label="\u0628\u062d\u062b" 
          variant="outlined" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
        />
        <TextField
          select
          label="\u0627\u0644\u0645\u0646\u0637\u0642\u0629"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="">\u0627\u0644\u0643\u0644</MenuItem>
          {regions.map(r => <MenuItem key={r._id} value={r._id}>{r.name}</MenuItem>)}
        </TextField>
      </div>

      {selectedIds.length > 1 && (
        <div style={{ marginBottom: 16 }}>
          <Button variant="contained" color="warning" onClick={() => setMergeModalOpen(true)}>
            \u062f\u0645\u062c \u0627\u0644\u0634\u0631\u0643\u0627\u062a \u0627\u0644\u0645\u062d\u062f\u062f\u0629 ({selectedIds.length})
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
                  <TableCell>\u0627\u0644\u0627\u0633\u0645</TableCell>
                  <TableCell>\u0627\u0644\u0645\u0646\u0637\u0642\u0629</TableCell>
                  <TableCell>\u0627\u0644\u0635\u0646\u0627\u0639\u0629</TableCell>
                  <TableCell>\u0625\u062c\u0631\u0627\u0621\u0627\u062a</TableCell>
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
                      <Button size="small" onClick={() => handleEdit(row)}>\u062a\u0639\u062f\u064a\u0644</Button>
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
        <DialogTitle>\u062f\u0645\u062c \u0627\u0644\u0634\u0631\u0643\u0627\u062a</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>\u0627\u062e\u062a\u0631 \u0627\u0644\u0634\u0631\u0643\u0629 \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629:</Typography>
          <Select fullWidth value={targetMergeId} onChange={(e) => setTargetMergeId(e.target.value)}>
            {selectedIds.map(id => {
              const comp = companies.find(c => c._id === id);
              return <MenuItem key={id} value={id}>{comp?.nameAr || comp?.nameEn}</MenuItem>
            })}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMergeModalOpen(false)}>\u0625\u0644\u063a\u0627\u0621</Button>
          <Button onClick={handleMerge} variant="contained" color="warning" disabled={!targetMergeId}>
            \u062f\u0645\u062c
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={importModalOpen} onClose={() => { setImportModalOpen(false); setImportPreview(null); setImportFile(null); }}>
        <DialogTitle>\u0627\u0633\u062a\u064a\u0631\u0627\u062f \u0634\u0631\u0643\u0627\u062a</DialogTitle>
        <DialogContent dividers>
          <input type="file" accept=".xlsx" onChange={(e) => { setImportFile(e.target.files?.[0] || null); setImportPreview(null); }} />
          {importing && <Typography>\u062c\u0627\u0631\u064a \u0627\u0644\u0627\u0633\u062a\u064a\u0631\u0627\u062f...</Typography>}
          {importPreview && (
            <div data-testid="import-preview">
              <Typography>\u0633\u064a\u062a\u0645 \u0625\u0636\u0627\u0641\u0629 {importPreview.added} \u0634\u0631\u0643\u0629</Typography>
              <Typography>\u0633\u064a\u062a\u0645 \u062a\u062c\u0627\u0647\u0644 {importPreview.ignored} \u0634\u0631\u0643\u0629</Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setImportModalOpen(false); setImportPreview(null); setImportFile(null); }}>\u0625\u0644\u063a\u0627\u0621</Button>
          {!importPreview ? (
            <Button onClick={() => handleImport(true)} variant="contained" disabled={!importFile || importing} data-testid="import-preview-btn">
              \u0645\u0639\u0627\u064a\u0646\u0629
            </Button>
          ) : (
            <Button onClick={() => handleImport(false)} variant="contained" color="primary" disabled={!importFile || importing} data-testid="import-confirm-btn">
              \u062a\u0623\u0643\u064a\u062f
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

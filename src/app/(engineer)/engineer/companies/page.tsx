"use client";

import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from "@mui/material";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/components/common/AuthProvider";
import CompanyFormModal from "@/components/companies/CompanyFormModal";

// useDebouncedValue hook
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function EngineerCompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const { user } = useAuth();
  
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);

  const loadCompanies = () => {
    const query = debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : "";
    fetchApi(`/companies${query}`).then(res => setCompanies(res.data)).catch(console.error);
  };

  useEffect(() => {
    loadCompanies();
  }, [debouncedSearch]);

  const handleEdit = (comp: any) => {
    setSelectedCompany(comp);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCompany(null);
    setModalOpen(true);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          \u0627\u0644\u0634\u0631\u0643\u0627\u062a
        </Typography>
        <Button variant="contained" onClick={handleAdd} data-testid="add-company-btn">
          \u0625\u0636\u0627\u0641\u0629 \u0634\u0631\u0643\u0629
        </Button>
      </div>
      
      <TextField 
        label="\u0628\u062d\u062b" 
        variant="outlined" 
        fullWidth 
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>\u0627\u0644\u0627\u0633\u0645</TableCell>
                  <TableCell>\u0627\u0644\u0645\u0646\u0637\u0642\u0629</TableCell>
                  <TableCell>\u0627\u0644\u0635\u0646\u0627\u0639\u0629</TableCell>
                  <TableCell>\u0625\u062c\u0631\u0627\u0621\u0627\u062a</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.map((row) => (
                  <TableRow key={row._id}>
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
        </CardContent>
      </Card>

      {modalOpen && (
        <CompanyFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={loadCompanies}
          initialData={selectedCompany}
          isAdmin={false}
        />
      )}
    </div>
  );
}

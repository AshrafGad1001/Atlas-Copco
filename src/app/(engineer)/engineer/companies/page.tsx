// @ts-nocheck
"use client";

import { useSearchParams } from "next/navigation";
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

import ExportButton from "@/components/common/ExportButton";
export default function EngineerCompaniesPage() {
  const searchParams = useSearchParams();
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
          الشركات
        </Typography>
        <Button variant="contained" onClick={handleAdd} data-testid="add-company-btn">
          إضافة شركة
        </Button>
      </div>
      
      <TextField 
        label="بحث" 
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
                  <TableCell>الاسم</TableCell>
                  <TableCell>المنطقة</TableCell>
                  <TableCell>الصناعة</TableCell>
                  <TableCell>إجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.map((row) => (
                  <TableRow key={row._id}>
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

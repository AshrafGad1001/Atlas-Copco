'use client';

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { fetchApi } from '@/lib/api';

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  
  const [users, setUsers] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    role: "engineer",
    region: ""
  });

  const loadUsers = () => {
    fetchApi('/users').then(res => setUsers(res.data || [])).catch(console.error);
  };

  useEffect(() => {
    loadUsers();
    fetchApi('/regions').then(res => setRegions(res.data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (searchParams?.get("new") === "1") {
      setModalOpen(true);
    }
  }, [searchParams]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await fetchApi('/users', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          username: form.username.toLowerCase(),
          phones: [{ number: "01000000000" }]
        })
      });
      setModalOpen(false);
      setForm({ fullName: "", username: "", email: "", password: "", role: "engineer", region: "" });
      loadUsers();
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ");
    }
  };

  const handleEdit = (u: any) => {
    setEditingUser(u);
    setForm({
      fullName: u.fullName || "",
      username: u.username || "",
      email: u.email || "",
      password: "",
      role: u.role || "engineer",
      region: u.region?._id || u.region || ""
    });
    setSuccessMsg("");
    setEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await fetchApi(`/users/${editingUser._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          fullName: form.fullName,
          username: form.username,
          email: form.email,
          role: form.role,
          region: form.region
        })
      });
      setSuccessMsg("تم التحديث");
      loadUsers();
      setTimeout(() => {
        setEditModalOpen(false);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          إدارة المستخدمين
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => { setForm({ fullName: "", username: "", email: "", password: "", role: "engineer", region: "" }); setModalOpen(true); }}
        >
          إضافة مستخدم
        </Button>
      </div>

      {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <TableContainer component={Paper} elevation={0} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>إجراءات</TableCell>
                  <TableCell>الاسم</TableCell>
                  <TableCell>اسم المستخدم</TableCell>
                  <TableCell>المنطقة</TableCell>
                  <TableCell>الحالة</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>
                      <Button size="small" data-testid="edit-user-btn" onClick={() => handleEdit(row)}>
                        تعديل
                      </Button>
                    </TableCell>
                    <TableCell>{row.fullName}</TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.region?.name || 'غير محدد'}</TableCell>
                    <TableCell>{row.isActive ? 'نشط' : 'معطل'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>إضافة مستخدم</DialogTitle>
        <form onSubmit={handleCreate}>
          <DialogContent dividers>
            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
            <div style={{ marginBottom: 12 }}>
              <input name="fullName" placeholder="الاسم بالكامل" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} style={{ width: '100%', padding: 8 }} required />
            </div>
            <div style={{ marginBottom: 12 }}>
              <input name="username" placeholder="اسم المستخدم" value={form.username} onChange={e => setForm({...form, username: e.target.value})} style={{ width: '100%', padding: 8 }} required />
            </div>
            <div style={{ marginBottom: 12 }}>
              <input name="email" type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: '100%', padding: 8 }} required />
            </div>
            <div style={{ marginBottom: 12 }}>
              <input name="password" type="password" placeholder="كلمة المرور" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{ width: '100%', padding: 8 }} required />
            </div>
            <div style={{ marginBottom: 12 }}>
              <select name="role" value={form.role} onChange={e => setForm({...form, role: e.target.value})} style={{ width: '100%', padding: 8 }}>
                <option value="engineer">engineer</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <select name="region" value={form.region} onChange={e => setForm({...form, region: e.target.value})} style={{ width: '100%', padding: 8 }}>
                <option value="">اختر المنطقة</option>
                {regions.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)}>إلغاء</Button>
            <Button type="submit" variant="contained">حفظ</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>تعديل مستخدم</DialogTitle>
        <form onSubmit={handleUpdate}>
          <DialogContent dividers>
            {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
            <div style={{ marginBottom: 12 }}>
              <select name="region" value={form.region} onChange={e => setForm({...form, region: e.target.value})} style={{ width: '100%', padding: 8 }}>
                <option value="">اختر المنطقة</option>
                {regions.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModalOpen(false)}>إلغاء</Button>
            <Button type="submit" variant="contained">حفظ</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

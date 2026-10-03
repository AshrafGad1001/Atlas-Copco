'use client';

import React, { useEffect, useState } from 'react';
import { 
  TextField, Button, MenuItem, Box, IconButton, Autocomplete, Typography, Grid 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/common/AuthProvider';

export interface Attendee {
  name: string;
  jobTitle?: string;
  phone?: string;
}

interface VisitFormProps {
  initialData?: {
    company?: string;
    status?: string;
    notes?: string;
    nextStep?: string;
    attendees?: Attendee[];
  };
  onSubmit: (data: any) => Promise<void>;
  submitText: string;
}

export default function VisitForm({ initialData, onSubmit, submitText }: VisitFormProps) {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState(initialData?.company || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [status, setStatus] = useState(initialData?.status || 'completed');
  const [nextStep, setNextStep] = useState(initialData?.nextStep || '');
  const [attendees, setAttendees] = useState<Attendee[]>(initialData?.attendees || []);
  
  const [suggestions, setSuggestions] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.region?._id) {
      fetchApi(`/companies?region=${user.region._id}`)
        .then(res => setCompanies(res.data))
        .catch(console.error);
    } else {
      fetchApi(`/companies`)
        .then(res => setCompanies(res.data))
        .catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    if (companyId) {
      fetchApi(`/companies/${companyId}/attendees`)
        .then(res => setSuggestions(res.data))
        .catch(console.error);
    } else {
      setSuggestions([]);
    }
  }, [companyId]);

  const handleAddAttendee = () => {
    if (attendees.length < 10) {
      setAttendees([...attendees, { name: '', jobTitle: '', phone: '' }]);
    }
  };

  const handleRemoveAttendee = (index: number) => {
    setAttendees(attendees.filter((_, i) => i !== index));
  };

  const handleAttendeeChange = (index: number, field: keyof Attendee, value: string) => {
    const newAttendees = [...attendees];
    newAttendees[index] = { ...newAttendees[index], [field]: value };
    setAttendees(newAttendees);
  };

  const handleAttendeeSelect = (index: number, selected: Attendee | string | null) => {
    const newAttendees = [...attendees];
    if (typeof selected === 'string') {
      newAttendees[index] = { ...newAttendees[index], name: selected };
    } else if (selected) {
      newAttendees[index] = { 
        name: selected.name, 
        jobTitle: selected.jobTitle || newAttendees[index].jobTitle, 
        phone: selected.phone || newAttendees[index].phone 
      };
    } else {
      newAttendees[index] = { ...newAttendees[index], name: '' };
    }
    setAttendees(newAttendees);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        company: companyId,
        notes,
        status,
        nextStep,
        attendees: attendees.filter(a => a.name.trim() !== '')
      };
      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        select
        fullWidth
        label="الشركة"
        value={companyId}
        onChange={(e) => setCompanyId(e.target.value)}
        margin="normal"
        required
      >
        <MenuItem value="" disabled>اختر الشركة</MenuItem>
        {companies.map((c) => (
          <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="الحالة"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        margin="normal"
        required
      >
        <MenuItem value="completed">مكتملة</MenuItem>
        <MenuItem value="planned">مخطط لها</MenuItem>
        <MenuItem value="cancelled">ملغاة</MenuItem>
      </TextField>

      <TextField
        fullWidth
        label="ملاحظات الزيارة"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        margin="normal"
        multiline
        rows={3}
      />

      <TextField
        fullWidth
        label="الخطوة القادمة"
        value={nextStep}
        onChange={(e) => setNextStep(e.target.value)}
        margin="normal"
      />

      <Box sx={{ mt: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">الأشخاص المقابلين (اختياري)</Typography>
          <Button 
            startIcon={<AddIcon />} 
            onClick={handleAddAttendee} 
            disabled={attendees.length >= 10 || !companyId}
            variant="outlined"
            size="small"
          >
            إضافة شخص
          </Button>
        </Box>
        
        {!companyId && attendees.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            الرجاء اختيار الشركة أولاً لإضافة أشخاص
          </Typography>
        )}

        {attendees.map((attendee, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Autocomplete
                  freeSolo
                  options={suggestions}
                  getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                  value={attendee.name}
                  onChange={(e, val) => handleAttendeeSelect(index, val)}
                  onInputChange={(e, val) => handleAttendeeChange(index, 'name', val)}
                  renderInput={(params) => (
                    <TextField {...params} label="الاسم" required size="small" />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="المسمى الوظيفي"
                  size="small"
                  value={attendee.jobTitle || ''}
                  onChange={(e) => handleAttendeeChange(index, 'jobTitle', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="الموبايل"
                  size="small"
                  value={attendee.phone || ''}
                  onChange={(e) => handleAttendeeChange(index, 'phone', e.target.value)}
                />
              </Grid>
            </Grid>
            <IconButton color="error" onClick={() => handleRemoveAttendee(index)} sx={{ mt: 0.5 }}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>

      <Button 
        type="submit" 
        variant="contained" 
        size="large" 
        fullWidth 
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {submitText}
      </Button>
    </form>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { 
  Typography, Card, CardContent, Box, Chip, Avatar, CircularProgress, Alert, Button
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import { fetchApi } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { formatDate } from "@/lib/helpers";

export default function CompanyHistoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchApi(`/companies/${id}/history`)
        .then(res => setData({ company: res.company || { name: 'Unknown' }, visits: res.data || [] }))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data) return <Alert severity="info">لا توجد بيانات</Alert>;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mr: 2 }}>
          رجوع
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          سجل زيارات: {data.company.name}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          {data.visits.length === 0 ? (
            <Typography color="text.secondary">لا توجد زيارات سابقة لهذه الشركة.</Typography>
          ) : (
            <Timeline
              sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                  flex: 0.2,
                },
              }}
            >
              {data.visits.map((visit: any, index: number) => (
                <TimelineItem key={visit._id}>
                  <TimelineOppositeContent color="text.secondary">
                    {formatDate(visit.visitDate)}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color={visit.status === 'completed' ? 'success' : visit.status === 'planned' ? 'warning' : 'error'} />
                    {index < data.visits.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent sx={{ pb: 4 }}>
                    <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={visit.engineer.profileImage?.url} sx={{ width: 24, height: 24 }}>
                        {visit.engineer.fullName.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle2" component="span">
                        {visit.engineer.fullName}
                      </Typography>
                    </Box>
                    <Typography>{visit.notes || 'لا توجد ملاحظات'}</Typography>
                    
                    {visit.attendees && visit.attendees.length > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {visit.attendees.map((attendee: any, i: number) => (
                          <Chip 
                            key={i} 
                            size="small" 
                            label={<span>{attendee.name}{attendee.jobTitle ? ` (${attendee.jobTitle})` : ""}{attendee.phone && <a href={`tel:${attendee.phone}`} dir="ltr" style={{marginLeft: 8, textDecoration: "underline"}} onClick={e=>e.stopPropagation()}>{attendee.phone}</a>}</span>} 
                            variant="outlined" 
                          />
                        ))}
                      </Box>
                    )}

                    {visit.nextStep && (
                      <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                        الخطوة القادمة: {visit.nextStep}
                      </Typography>
                    )}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

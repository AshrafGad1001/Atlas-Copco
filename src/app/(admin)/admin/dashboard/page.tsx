'use client';

import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import MapIcon from '@mui/icons-material/Map';
import { fetchApi } from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchApi('/reports/stats').then(res => setStats(res.data)).catch(console.error);
  }, []);

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="overline" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
            <Typography variant="h3" color="text.primary">
              {value}
            </Typography>
          </Box>
          <Box sx={{ 
            backgroundColor: `${color}.50`, 
            color: `${color}.main`,
            p: 2, 
            borderRadius: 2 
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        لوحة التحكم
      </Typography>
      
      {stats ? (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard 
              title="إجمالي المهندسين" 
              value={stats.totalEngineers} 
              icon={<PeopleIcon fontSize="large" />} 
              color="primary" 
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard 
              title="إجمالي الشركات" 
              value={stats.totalCompanies} 
              icon={<BusinessIcon fontSize="large" />} 
              color="secondary" 
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard 
              title="إجمالي الزيارات" 
              value={stats.totalVisits} 
              icon={<MapIcon fontSize="large" />} 
              color="success" 
            />
          </Grid>
        </Grid>
      ) : (
        <Typography>جاري تحميل الإحصائيات...</Typography>
      )}
    </div>
  );
}

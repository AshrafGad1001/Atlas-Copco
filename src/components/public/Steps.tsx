import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import { LANDING_CONTENT } from '@/constants/landing';

export default function Steps() {
  return (
    <Box sx={{ py: 8, bgcolor: 'common.white' }}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h2" align="center" fontWeight={700} gutterBottom sx={{ mb: 6 }}>
          كيف يعمل النظام؟
        </Typography>
        <Grid container spacing={4}>
          {LANDING_CONTENT.steps.map((step, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%', 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: 24, 
                  fontWeight: 'bold',
                  mx: 'auto',
                  mb: 2
                }}>
                  {index + 1}
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SpeedIcon from '@mui/material/Icon';
import * as MuiIcons from '@mui/icons-material';
import { LANDING_CONTENT } from '@/constants/landing';

export default function Features() {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, mb: 6 }}>
          لماذا نظام أطلس كوبكو؟
        </Typography>
        <Grid container spacing={4}>
          {LANDING_CONTENT.features.map((feature, index) => {
            const IconComponent = (MuiIcons as any)[feature.icon] || SpeedIcon;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 2 }}>
                  <Box sx={{ 
                    bgcolor: 'primary.50', 
                    color: 'primary.main', 
                    borderRadius: '50%', 
                    p: 2, 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComponent sx={{ fontSize: 40 }} />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}

'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LANDING_CONTENT } from '@/constants/landing';

export default function Footer() {
  return (
    <Box sx={{ py: 3, textAlign: 'center', bgcolor: 'primary.900', color: 'common.white' }}>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        {LANDING_CONTENT.footer.text}
      </Typography>
    </Box>
  );
}

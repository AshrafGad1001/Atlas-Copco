'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { LANDING_CONTENT } from '@/constants/landing';

export default function Hero() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #3368A0 0%, #133458 100%)',
        color: 'primary.contrastText',
        py: { xs: 8, md: 12 },
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '2rem', md: '3rem' } }}>
          {LANDING_CONTENT.hero.title}
        </Typography>
        <Typography variant="h6" component="p" sx={{ mb: 4, opacity: 0.9, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
          {LANDING_CONTENT.hero.subtitle}
        </Typography>
        <Button
          component={Link}
          href="/login"
          variant="contained"
          size="large"
          sx={{
            backgroundColor: 'common.white',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'grey.100',
            },
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
          }}
        >
          {LANDING_CONTENT.hero.cta}
        </Button>
      </Container>
    </Box>
  );
}

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from 'next/link';
import { APP_NAME } from '@/constants/app';
import { cookies } from 'next/headers';

export default async function Navbar() {
  const cookieStore = await cookies();
  const hasToken = cookieStore.has('token');

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {APP_NAME}
          </Typography>
          <Button
            component={Link}
            href={hasToken ? '/login' : '/login'}
            variant="contained"
            color="primary"
          >
            {hasToken ? 'دخول للنظام' : 'تسجيل الدخول'}
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

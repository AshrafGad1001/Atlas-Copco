import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import EmotionCache from '@/lib/EmotionCache';
import theme from '@/lib/theme';
import './globals.css';

const cairo = Cairo({ 
  subsets: ['latin', 'arabic'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'متابعة الزيارات | أطلس كوبكو',
  description: 'نظام إدارة وتتبع زيارات مهندسي المبيعات في أطلس كوبكو',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body>
        <EmotionCache>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </EmotionCache>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import EmotionCache from '@/lib/EmotionCache';
import AppThemeProvider from '@/components/common/AppThemeProvider';
import { AuthProvider } from '@/components/common/AuthProvider';
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
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <EmotionCache>
          <AppThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </AppThemeProvider>
        </EmotionCache>
      
      {process.env.NODE_ENV === 'production' && (
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        ` }} />
      )}
  
      </body>
    </html>
  );
}

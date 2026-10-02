import React from 'react';
import Navbar from '@/components/public/Navbar';
import Hero from '@/components/public/Hero';
import Features from '@/components/public/Features';
import Steps from '@/components/public/Steps';
import Footer from '@/components/public/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Steps />
      <Footer />
    </>
  );
}

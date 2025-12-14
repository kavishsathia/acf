"use client";
import React, { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Solution } from "@/components/Solution";
import { Comparison } from "@/components/Comparison";
import { Observability } from "@/components/Observability";
import { Footer } from "@/components/Footer";

function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <Layout>
      <Hero />
      <Problem />
      <Solution />
      <Comparison />
      <Observability />
      <Footer />
    </Layout>
  );
}

export default App;

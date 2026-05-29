"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { TemplateSelection, type Template } from "@/components/TemplateSelection";
import { CardEditor } from "@/components/CardEditor";
import { ParticleBackground } from "@/components/ParticleBackground";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  return (
    <main className="min-h-screen relative flex flex-col">
      <ParticleBackground />
      <Header />
      
      <div className="flex-1">
        <Hero />
        
        <TemplateSelection onSelectTemplate={setSelectedTemplate} />
        
        <AnimatePresence>
          {selectedTemplate && (
            <CardEditor 
              template={selectedTemplate} 
              onClose={() => setSelectedTemplate(null)} 
            />
          )}
        </AnimatePresence>
        
        <div className="py-10"></div>
      </div>
      
      <Footer />
    </main>
  );
}

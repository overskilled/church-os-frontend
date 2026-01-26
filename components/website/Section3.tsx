"use client";

import { useState, useEffect, useRef } from "react";
import { Home, Users, Church, BookOpen, Heart, ChevronDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const sections = [
  {
    id: 1,
    icon: Church,
    tooltip: "Gestion d'église simplifiée",
    title: "Gestion complète",
    description: "Centralisez toutes les activités de votre communauté : membres, événements, finances et communications en un seul endroit.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 2,
    icon: Users,
    tooltip: "Suivi des membres",
    title: "Communauté connectée",
    description: "Maintenez le lien avec chaque membre de votre communauté et suivez leur implication dans les différentes activités.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 3,
    icon: BookOpen,
    tooltip: "Planification des cultes",
    title: "Cultes organisés",
    description: "Planifiez et organisez vos cultes, assignez les rôles et partagez les ressources avec votre équipe de manière efficace.",
    image: "https://images.unsplash.com/photo-1518834103328-4dbb0d8400de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 4,
    icon: Heart,
    tooltip: "Engagement communautaire",
    title: "Mission et service",
    description: "Coordonnez les activités missionnaires, les groupes de prière et les services communautaires de votre église.",
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 5,
    icon: Home,
    tooltip: "Administration transparente",
    title: "Transparence financière",
    description: "Gérez les dîmes, les offrandes et les dépenses avec une comptabilité claire et accessible aux responsables.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  }
];

export default function Section3() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isInSection, setIsInSection] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const scrollToSection = (index: number) => {
    if (isScrolling.current || !containerRef.current) return;
    
    isScrolling.current = true;
    setCurrentSection(index);
    
    const section = containerRef.current.children[index] as HTMLElement;
    section.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start'
    });
    
    setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  };

  const handleScroll = () => {
    if (!containerRef.current || isScrolling.current) return;
    
    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const sectionHeight = container.clientHeight;
    const index = Math.round(scrollTop / sectionHeight);
    
    if (index !== currentSection) {
      setCurrentSection(index);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Vérifier si on est dans la section snap
    if (!isInSection) return;
    
    e.preventDefault();
    
    if (isScrolling.current) return;
    
    const direction = e.deltaY > 0 ? 1 : -1;
    const nextSection = Math.max(0, Math.min(sections.length - 1, currentSection + direction));
    
    if (nextSection !== currentSection) {
      scrollToSection(nextSection);
    }
  };

  // Observer pour détecter quand on entre/sort de la section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInSection(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [currentSection]);

  return (
    <div 
      ref={sectionRef}
      className="w-full min-h-screen bg-background relative"
    >
      {/* Navigation verticale à gauche */}
      <div className="absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 z-50">
        <div className="flex flex-col items-center gap-4 bg-slate-800 rounded-2xl p-3 shadow-2xl border border-slate-700">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Tooltip key={section.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => scrollToSection(index)}
                    className={`relative group cursor-pointer transition-all duration-300 ${
                      currentSection === index 
                        ? 'transform scale-110' 
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                      currentSection === index 
                        ? `bg-purple-600` 
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}>
                      <Icon className={`w-6 h-6 transition-colors duration-300 ${
                        currentSection === index 
                          ? 'text-white'
                          : 'text-slate-300 group-hover:text-white'
                      }`} />
                    </div>
                    
                    {/* Indicateur actif */}
                    {currentSection === index && (
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-purple-500" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="border border-slate-700 bg-slate-800">
                  <p className="font-semibold text-white">{section.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Conteneur principal avec snap vertical */}
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        className="w-full h-screen overflow-y-auto snap-y snap-mandatory scrollbar-none"
      >
        {sections.map((section, index) => (
          <section 
            key={section.id}
            className="relative w-full h-screen snap-start flex items-center justify-center p-4 md:p-8"
          >
            {/* Background avec overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-purple-900/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            </div>

            {/* Contenu */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
                {/* Partie gauche - Texte */}
                <div className="space-y-6 md:space-y-8">
                  <div className="inline-flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-purple-600/20`}>
                      <section.icon className={`w-8 h-8 text-purple-400`} />
                    </div>
                    <span className={`text-sm font-semibold tracking-wider uppercase text-purple-400`}>
                      Fonctionnalité {index + 1}
                    </span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    {section.title.split(' ').map((word, i) => (
                      <span key={i} className="block">
                        <span className={`${i === 0 ? 'text-purple-400' : 'text-white'}`}>
                          {word}
                        </span>
                      </span>
                    ))}
                  </h2>
                  
                  <p className="text-lg md:text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-2xl">
                    {section.description}
                  </p>
                  
                  <div className="pt-4">
                    <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300 font-medium">
                      En savoir plus
                      <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Partie droite - Image focus */}
                <div className="relative">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-700 border border-slate-700">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-[400px] md:h-[500px] object-cover"
                    />
                    {/* Overlay doré subtil */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-500/5 to-purple-400/10" />
                  </div>
                </div>
              </div>
            </div>

            {/* Indicateur de scroll vers le bas */}
            {index < sections.length - 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                <button
                  onClick={() => scrollToSection(index + 1)}
                  className="p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm transition-colors border border-slate-700 group"
                  aria-label="Section suivante"
                >
                  <ChevronDown className="w-6 h-6 text-purple-400 group-hover:text-purple-300 group-hover:translate-y-1 transition-all" />
                </button>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
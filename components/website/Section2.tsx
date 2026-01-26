"use client";

import { useEffect, useRef, useState } from "react";

export default function Section2() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isManual, setIsManual] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const liste1 = [
    {
      title: "Service Web",
      subtitle: "Développement de sites web modernes et responsives",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop",
    },
    {
      title: "Applications Mobile",
      subtitle: "Applications iOS et Android performantes",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop",
    },
    {
      title: "Design UX/UI",
      subtitle: "Interfaces utilisateur intuitives et esthétiques",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
    },
    {
      title: "Consulting",
      subtitle: "Accompagnement stratégique digital",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop",
    },
  ];

  // Gestion du cycle automatique
  useEffect(() => {
    if (isManual) return; // Si contrôle manuel, on arrête le cycle automatique

    const cycleDuration = 10000; // 10 secondes
    const progressInterval = 50; // Mise à jour du progrès toutes les 50ms

    // Nettoyer les intervalles existants
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          const nextIndex = (activeIndex + 1) % liste1.length;
          setActiveIndex(nextIndex);
          return 0;
        }
        return prev + (progressInterval / cycleDuration) * 100;
      });
    }, progressInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeIndex, liste1.length, isManual]);

  // Réinitialiser le progrès quand on change manuellement
  const handleAccordionClick = (index: number) => {
    // Arrêter le cycle automatique temporairement
    setIsManual(true);

    // Réinitialiser l'état
    setActiveIndex(index);
    setProgress(0);

    // Nettoyer les timeouts existants
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reprendre le cycle automatique après un délai
    timeoutRef.current = setTimeout(() => {
      setIsManual(false);
    }, 10000); // Reprendre après 10 secondes
  };

  // Nettoyage
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const data = [
    {
      title: "Créez votre espace église",
      description: "Inscrivez-vous, configurez vos branches et départements",
    },
    {
      title: "Invitez vos membres a vous rejoindre",
      description: "Partagez le lien, ils téléchargent l'app et rejoignent",
    },
    {
      title: "Lancez vos premiers cultes",
      description: "Créez des événements, activez les notifications, regardez",
    },
  ];
  return (
    <div className="w-full text-center 2xl: min-h-screen bg-foreground text-background py-15">
      <div className="max-w-[1600px] min-h-full px-4 flex flex-col gap-8 items-center justify-between mx-auto">
        <div className="w-full flex flex-col gap-4 items-center">
          <span className="rounded-2xl px-4 py-0.5 bg-white/20 border w-max border-secondary">
            simple
          </span>
          <h2 className="text-5xl text-center max-w-1/2 mx-auto leading-18">
            Utiliser Church <strong>O.S</strong> en trois Etapes
          </h2>
        </div>
        <div className="flex gap-10 lg:h-[60vh] 2xl:h-auto lg:mt-20">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col gap-2 w-[33%] text-start">
              <div className="rounded-xl min-w-full shadow bg-muted min-h-90"></div>
              <div className="pl-2 flex flex-col text-center h-full">
                <span className="text-3xl font-bold mb-2 ">{`0${index + 1}. ${item.title}`}</span>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// <div className="min-h-screen w-full my-20 max-w-[1600px] mx-auto px-4 @min-3xl:px-0 flex flex-col gap-10 py-10">

//   <div className="w-full p-2 px-4 h-screen border border-secondary flex flex-row-reverse rounded-lg bg-background">
//     <div className="flex w-[30%] flex-col justify-between">
//       <div className="py-4">
//         <p className="text-2xl font-bold text-foreground">
//           Ce que nous proposons
//         </p>
//         <p className="text-muted-foreground mt-2">
//           Découvrez nos services innovants
//         </p>
//       </div>

//       <div className="h-[80%] w-full flex flex-col justify-end gap-4">
//         {liste1.map((item, index) => (
//           <div
//             key={index}
//             className={`border rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
//               activeIndex === index
//                 ? "border-foreground bg-foreground/10 shadow-lg"
//                 : "border-border hover:border-foreground"
//             }`}
//             onClick={() => handleAccordionClick(index)}
//           >
//             {/* Séparateur avec barre de progression */}
//             <div className="h-1 w-full relative overflow-hidden">
//               {activeIndex === index && (
//                 <div
//                   className="h-full bg-gradient-to-r from-foreground to-foreground/70 transition-all duration-300 ease-linear"
//                   style={{ width: `${progress}%` }}
//                 />
//               )}
//             </div>

//             {/* Contenu de l'accordéon */}
//             <div className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="font-bold text-lg text-muted-foreground">
//                     {item.title}
//                   </h3>
//                   <p className="text-foreground text-sm mt-1">
//                     {item.subtitle}
//                   </p>
//                 </div>

//                 {/* Indicateur visuel */}
//                 <div className="flex items-center space-x-2">
//                   <div
//                     className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                       activeIndex === index
//                         ? "bg-accent scale-125"
//                         : "bg-foreground"
//                     }`}
//                   />
//                   <div className="relative w-8 h-8 overflow-hidden rounded-md border border-border">
//                     <img
//                       src={item.image}
//                       alt={item.title}
//                       className={`w-full h-full object-cover transition-all duration-500 ${
//                         activeIndex === index
//                           ? "opacity-100"
//                           : "opacity-40 grayscale"
//                       }`}
//                     />
//                     {/* Overlay de progression */}
//                     {activeIndex === index && (
//                       <div
//                         className="absolute top-0 left-0 h-full bg-accent/10 transition-all duration-300"
//                         style={{ width: `${progress}%` }}
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Contenu détaillé (visible uniquement quand actif) */}
//               {activeIndex === index && (
//                 <div className="mt-4 pt-4 border-t border-border">
//                   <p className="text-foreground">
//                     Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//                     Sed do eiusmod tempor incididunt ut labore et dolore
//                     magna aliqua.
//                   </p>
//                   <button className="mt-3 px-4 py-2 bg-foreground text-background rounded-lg text-sm hover:bg-foreground/90 transition-colors">
//                     En savoir plus
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Indicateur de cycle en bas */}
//       {/* <div className="py-4">
//           <div className="flex items-center justify-between text-sm text-foreground">
//             <span>Cycle automatique toutes les 10 secondes</span>
//             <span className="font-medium">
//               {activeIndex + 1} / {liste1.length}
//             </span>
//           </div>
//         </div> */}
//     </div>

//     {/* Image principale */}
//     <div className="flex w-[70%] rounded-lg h-full overflow-hidden ml-4 relative">
//       <img
//         src={liste1[activeIndex].image}
//         className="w-full h-full object-cover transition-all duration-700 ease-in-out"
//         alt={liste1[activeIndex].title}
//       />

//       {/* Overlay de progression sur l'image principale */}
//       <div className="absolute top-0 left-0 w-full h-1 bg-foreground/10">
//         <div
//           className="h-full bg-gradient-to-r from-foreground to-foreground/70 transition-all duration-300 ease-linear"
//           style={{ width: `${progress}%` }}
//         />
//       </div>

//       {/* Légende de l'image */}
//       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
//         <h3 className="text-2xl font-bold">{liste1[activeIndex].title}</h3>
//         <p className="mt-2 opacity-90">{liste1[activeIndex].subtitle}</p>
//       </div>
//     </div>
//   </div>
// </div>

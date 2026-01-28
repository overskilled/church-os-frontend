"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useScopedI18n } from "@/locale/client";

export default function Section2() {
  const t = useScopedI18n("website.section2");
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isManual, setIsManual] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const liste1 = [
    {
      title: t("services.web.title"),
      subtitle: t("services.web.subtitle"),
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop",
    },
    {
      title: t("services.mobile.title"),
      subtitle: t("services.mobile.subtitle"),
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop",
    },
    {
      title: t("services.design.title"),
      subtitle: t("services.design.subtitle"),
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
    },
    {
      title: t("services.consulting.title"),
      subtitle: t("services.consulting.subtitle"),
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop",
    },
  ];

  // Gestion du cycle automatique
  useEffect(() => {
    if (isManual) return;

    const cycleDuration = 10000;
    const progressInterval = 50;

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

  const handleAccordionClick = (index: number) => {
    setIsManual(true);
    setActiveIndex(index);
    setProgress(0);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsManual(false);
    }, 10000);
  };

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
      title: t("steps.create.title"),
      description: t("steps.create.description"),
    },
    {
      title: t("steps.invite.title"),
      description: t("steps.invite.description"),
    },
    {
      title: t("steps.launch.title"),
      description: t("steps.launch.description"),
    },
  ];

  // Carousel states and functions
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Auto slide for mobile carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div className="w-full text-center 2xl: min-h-screen bg-foreground text-background py-15">
      <div className="max-w-[1600px] min-h-full px-4 flex flex-col gap-8 items-center justify-between mx-auto">
        <div className="w-full flex flex-col gap-4 items-center">
          <span className="rounded-2xl px-4 py-0.5 bg-white/20 border w-max border-secondary">
            {t("simple")}
          </span>
          <h2 className="text-5xl text-center md:max-w-1/2 mx-auto leading-18">
            {t("title")} <strong>O.S</strong> {t("threeSteps")}
          </h2>
        </div>

        {/* Version desktop (hidden on mobile) */}
        <div className="md:flex hidden gap-10 lg:h-[60vh] 2xl:h-auto lg:mt-20">
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

        {/* Version mobile carousel (visible on mobile) */}
        <div className="md:hidden w-full mt-8">
          <div className="relative overflow-hidden rounded-xl">
            {/* Carousel container */}
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {data.map((item, index) => (
                <div key={index} className="w-full flex-shrink-0 relative px-4">
                  <div className="flex flex-col gap-4 items-center">
                    {/* Card */}
                    <div className="w-full rounded-xl shadow bg-muted min-h-80 p-6 flex flex-col justify-center items-center">
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-primary">
                          {/* 0{index + 1} */}
                        </span>
                      </div>
                      <div className="text-end absolute bottom-0 right-6 w-2/3">
                        <h3 className="text-xl text-muted-foreground font-bold mb-3">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm text-end">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="absolute left-2 bottom-0 flex gap-4 -translate-y-1/2">
              <button
                onClick={prevSlide}
                className="bg-foreground text-muted rounded-full p-2 hover:bg-background transition-colors"
                aria-label={t("previousSlide")}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="bg-foreground text-muted rounded-full p-2 hover:bg-background transition-colors"
                aria-label={t("nextSlide")}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {data.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === index
                      ? "bg-background w-8"
                      : "bg-background/40"
                  }`}
                  aria-label={`${t("goToSlide")} ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
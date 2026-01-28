"use client";

import { ChartBarBig } from "lucide-react";
import { Separator } from "../ui/separator";
import { useEffect, useRef, useState } from "react";
import { useScopedI18n } from "@/locale/client";

export default function Section1() {
  const t = useScopedI18n("website.section1");

  const liste = [
    {
      title: t("features.fullyCustomizable.title"),
      text: t("features.fullyCustomizable.description"),
      icone: ChartBarBig,
    },
    {
      title: t("features.autoPolicies.title"),
      text: t("features.autoPolicies.description"),
      icone: ChartBarBig,
    },
    {
      title: t("features.absoluteFlexibility.title"),
      text: t("features.absoluteFlexibility.description"),
      icone: ChartBarBig,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isManual, setIsManual] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const liste1 = [
    {
      title: t("benefits.timeSaving.title"),
      subtitle: t("benefits.timeSaving.subtitle"),
      descript: t("benefits.timeSaving.description"),
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop",
    },
    {
      title: t("benefits.offlineAccess.title"),
      subtitle: t("benefits.offlineAccess.subtitle"),
      descript: t("benefits.offlineAccess.description"),
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop",
    },
    {
      title: t("benefits.multilingual.title"),
      subtitle: t("benefits.multilingual.subtitle"),
      descript: t("benefits.multilingual.description"),
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
    },
    {
      title: t("benefits.privacy.title"),
      subtitle: t("benefits.privacy.subtitle"),
      descript: t("benefits.privacy.description"),
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

  return (
    <div className="w-full min-h-screen max-w-[1600px] mx-auto mt-10 flex lg:px-4 @min-3xl:px-0 flex-col gap-16 lg:gap-32 py-10 overflow-hidden">
      <div className="w-full flex md:flex-row flex-col gap-8 md:gap-0 pl-4 md:pl-0 md:justify-between md:h-30 lg:px-8 @min-3xl:px-0">
        <div className="md:w-1/2 ">
          <div className="max-w-80 text-xl">
            {t("intro")}
          </div>
        </div>
        <div className="max-w-full md:w-1/2 borde flex md:flex-row mt20 flex-col justify-end gap-8 ">
          <div className="flex h-full lg:max-w-1/2 lg:pr-8">
            <Separator orientation="vertical" className="min-h-full" />
            <div className="pl-2 mb-2 wmax space-y-2">
              <h2>{t("stats.screenTime.label")}</h2>
              <div className="inline-flex items-end">
                <p className="text-5xl">99%</p> {t("stats.screenTime.unit")}
              </div>
            </div>
          </div>
          <div className="flex h-full lg:max-w-1/2 lg:pr-8">
            <Separator orientation="vertical" className="min-h-full" />
            <div className="pl-2 mb-2 space-y-2">
              <h2>{t("stats.verseAverage.label")}</h2>
              <div className="inline-flex items-end">
                <p className="text-5xl">99%</p> {t("stats.verseAverage.unit")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen w-full space-y-16 border-secondary">
        <div className="w-full h-max flex flex-col gap-8 md:gap-4 md:flex-row md:justify-between md:items-center px-4 lg:px4 @min-3xl:px-0 overflow-hidden">
          <div className="flex max-w-120 flex-col gap-2 ">
            <div className="text-foreground flex gap-2 pl-2 items-center">
              <div className="rounded-full w-2 h-2 bg-secondary"></div>
              <p>{t("personalizedAgents")}</p>
            </div>
            <h2 className="text-4xl md:text-5xl leading-10 lg:leading-16 font-extralight">
              {t("designedForComfort")}
            </h2>
          </div>
          <div className="md:max-w-1/2 justify-end gap-6 md:gap-4 flex flex-col md:flex-row">
            {liste.map((item, index) => (
              <div key={index} className="flex pl-2 w-max h-full">
                <Separator
                  orientation="vertical"
                  className="min-h-full flex w-1 bg-foreground"
                />
                <div className="flex flex-col gap-2 text-foreground">
                  <item.icone className="text-foreground" />
                  <p className="text-sm font-bold ">{item.title}</p>
                  <p className="text-sm font-semibold text-foreground">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full p-2 px-4 h-screen md:border border-secondary flex rounded-lg bg-background">
          <div className="flex w-full md:w-[30%] flex-col justify-between">
            <div className="py-4">
              <p className="text-4xl md:text-2xl font-bold text-foreground">
                {t("whyChoose")} <strong>O.S</strong>?
              </p>
              <p className="text-muted-foreground mt-2">
                {t("platformDescription")}
              </p>
            </div>

            <div className="h-[80%] w-full flex flex-col justify-end gap-4">
              {liste1.map((item, index) => (
                <div
                  key={index}
                  className={`border rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                    activeIndex === index
                      ? "border-foreground bg-foreground/10 shadow-lg"
                      : "border-border hover:border-foreground"
                  }`}
                  onClick={() => handleAccordionClick(index)}
                >
                  <div className="h-1 w-full relative overflow-hidden">
                    {activeIndex === index && (
                      <div
                        className="h-full bg-gradient-to-r from-foreground to-foreground/70 transition-all duration-300 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-muted-foreground">
                          {item.title}
                        </h3>
                        <p className="text-foreground text-sm mt-1">
                          {item.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            activeIndex === index
                              ? "bg-accent scale-125"
                              : "bg-foreground"
                          }`}
                        />
                        <div className="relative w-8 h-8 overflow-hidden rounded-md border border-border">
                          <img
                            src={item.image}
                            alt={item.title}
                            className={`w-full h-full object-cover transition-all duration-500 ${
                              activeIndex === index
                                ? "opacity-100"
                                : "opacity-40 grayscale"
                            }`}
                          />
                          {activeIndex === index && (
                            <div
                              className="absolute top-0 left-0 h-full bg-accent/10 transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {activeIndex === index && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-foreground">{item.descript}</p>
                        <button className="mt-3 px-4 py-2 bg-foreground text-background rounded-lg text-sm hover:bg-foreground/90 transition-colors">
                          {t("learnMore")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex w-[70%] rounded-lg h-full overflow-hidden ml-4 relative">
            <img
              src={liste1[activeIndex].image}
              className="w-full h-full object-cover transition-all duration-700 ease-in-out"
              alt={liste1[activeIndex].title}
            />

            <div className="absolute top-0 left-0 w-full h-1 bg-foreground/10">
              <div
                className="h-full bg-gradient-to-r from-foreground to-foreground/70 transition-all duration-300 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
              <h3 className="text-2xl font-bold">
                {liste1[activeIndex].title}
              </h3>
              <p className="mt-2 opacity-90">{liste1[activeIndex].subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
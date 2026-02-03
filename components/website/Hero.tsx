"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import ChangeLanguage from "../ChangeLanguage";
import { ChevronLeft, Menu } from "lucide-react";
import Link from "next/link";
import { useScopedI18n } from "@/locale/client";

export default function Hero() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const t = useScopedI18n("website.hero");
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY >= 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const [rounded, setRounded] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  
  const scroll = useRef(scrollY)
  useEffect(() => {
    if(scroll.current <= 50){
      setRounded(true)
    }
    else{
      document.addEventListener("scroll",() => setRounded(false))
    }
  },[scroll.current])
  return (
    <div className="h-screen w-full bg-[url('/hero.png')] bg-cover bg-center overflow-hidden">
      <div className="bg-gradient-b to-slate-950/20 from-transparent"></div>
      <div className="w-full h-full bg-slate-950/30">
        <div className="w-full h-full flex flex-col items-center  group font-sans relative">
          <nav
            className={`w-[95%] rounded-lg  flex justify-between items-center fixed z-20  md:bg-transparent mt-4 mx-auto md:mx-0 md:mt-0 ${isScrolled ? "bg-foreground" : ""} `}
          >
            <div
              className={`${isScrolled ? "bg-slate-900/30 " : "bg-transparent"} text-background *:cursor-pointer p-2 text-md flex gap-4 ${isScrolled ? "rounded-md shadow-md" : ""} items-center transition-all duration-300`}
            >
              <Image
                src="/https://placehold.co/100x50"
                alt="Logo"
                width={80}
                height={50}
              />
            </div>
            <div className={`${isScrolled ? "bg-slate-900/30 " : "bg-transparent text-background"} hidden md:flex p-2 w-max transition  rounded-lg ${rounded === false ? "rounded-md p-0.5":"px-4 py-2"} ${isScrolled ? "rounded-md shadow-md" : ""} items-center transition-all duration-300 z-40`}>
              <div
                className={`${rounded == false ? "max-w-0 overflow-hidden hidden" : "w-max"} text-black flex gap-2`}
              >
                <ChangeLanguage />
              <Button variant={"hero1"}>
                <Link href={"/userRegister"}>{t("signIn")}</Link>
              </Button>
              <Button variant={"hero2"}>
                <Link href={"/churchRegister"}>{t("talkToUs")}</Link>
              </Button>
              </div>
              <ChevronLeft
                className={`${rounded == false ? "flex w-max" : " hidden"} text-black cursor-pointer`}
                
                onClick={() => {setRounded(true)
                  console.log(rounded)
                }}
              />
            </div>
            <Menu
              className="mr-2 flex md:hidden"
              onClick={() => setOpen((prev) => !prev)}
            />
            {open && (
              <div className="flex flex-col pl-4 pt-4 absolute space-y-4 -top-4 -left-4 -right-4 z-50 h-screen bottom-0 gap-4 transition-all duration-500 bg-foreground">
                <Menu
                  className="mr-2 absolute right-2 text-muted"
                  onClick={() => setOpen((prev) => !prev)}
                />
                <div className="flex flex-col gap-4">
                  <h2 className="text-muted">product</h2>
                  <div className="space-y-2 text-muted">
                    <p>smart dig</p>
                    <p>smart dig</p>
                    <p>smart dig</p>
                  </div>
                </div>
                <ChangeLanguage />
                <div className="flex gap-4 *:rounded-md">
                  <Button variant={"hero2"}>
                    <Link href={"/login"}>{t("signIn")}</Link>
                  </Button>
                  <Button variant={"hero2"}>
                    <Link href={"/register"}>{t("talkToUs")}</Link>
                  </Button>
                </div>
              </div>
            )}
          </nav>
          <div className="px-8 py-4 w-full h-full gap-8 md:gap-4 flex flex-col justify-center items-center   text-center  transition-transform duration-300">
            <h2 className="text-6xl font-bold text-background drop-shadow-lg">
              {t("title")} <strong className="font-black">O.S</strong>
            </h2>
            <p className="text-xl text-background">
              {t("subtitle")} <br />
              <strong>{t("verse")}</strong>
            </p>
            <Button variant={"hero2"}>{t("talkToUs")}</Button>
          </div>
          <div className="absolute lg:hidden h-40 rounded-xl overflow-hidden bg-black bottom-2 w-[94%]">
            <video src="/" className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

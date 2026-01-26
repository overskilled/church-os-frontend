"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import ChangeLanguage from "../ChangeLanguage";

export default function Hero() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

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

  return (
    <div className="h-screen w-full bg-[url('/hero.png')] bg-cover bg-center overflow-hidden">
      <div className="w-full h-full bg-slate-950/30">
        <div className="w-full h-full flex flex-col items-center  group font-sans">
          <nav className="w-full flex justify-between items-center p-8 fixed z-20">
            <div
              className={`${isScrolled ? "bg-slate-900/30 " : "bg-transparent"} text-background *:cursor-pointer p-2 text-md flex gap-4 ${isScrolled ? "rounded-md shadow-md" : ""} items-center transition-all duration-300`}
            >
              <Image
                src="/https://placehold.co/100x50"
                alt="Logo"
                width={80}
                height={50}
              />
              {/* <span>questionnaire</span>
              <span>verser</span> */}
            </div>
            <div
              className={`${isScrolled ? "bg-slate-900/30 " : "bg-transparent text-background"} flex p-2 gap-4 ${isScrolled ? "rounded-md shadow-md" : ""} items-center transition-all duration-300`}
            >
              <ChangeLanguage />
              <Button variant={"hero1"}>Sign in</Button>
              <Button variant={"hero2"}>Talk to us</Button>
            </div>
          </nav>
          <div className="px-8 py-4 w-full h-full gap-4 flex flex-col justify-center items-center   text-center  transition-transform duration-300">
            <h2 className="text-6xl font-bold text-background drop-shadow-lg">
              welcome to Church <strong className="font-black">O.S</strong>
            </h2>
            <p className="text-xl text-background">
              let all things be done decently and in order. <br />
              <strong>Corintians 14:40</strong> 
            </p>
            <Button variant={"hero2"}>Talk to us</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

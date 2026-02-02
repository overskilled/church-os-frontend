"use client";

import { useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos"

export default function AOSProvider() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }, []);

  return null;
}

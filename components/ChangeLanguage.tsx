// "use client";

import { Button } from "./ui/button";
import { useChangeLocale, useCurrentLocale } from "@/locale/client";

type Locale = "fr" | "en";

export default function ChangeLanguage() {
  const language = useCurrentLocale();
  const changeLocale = useChangeLocale();

  const handleChangeLanguage = (lang: Locale) => {
    changeLocale(lang);
  };
  return (
    <div className="flex gap-2 p-0 ">
      <Button
        variant={"hero1"}
        className={`${language === "en" ? "bg-background text-foreground hover:text-background" : "text-background"} `}
        onClick={() => handleChangeLanguage("en")}
      >
        En
      </Button>
      <Button
        variant={"hero1"}
        className={`${language === "fr" ? "bg-background text-foreground" : "text-background"} `}
        onClick={() => handleChangeLanguage("fr")}
      >
        Fr
      </Button>
    </div>
  );
}

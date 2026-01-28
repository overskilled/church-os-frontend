"use client"


import { useScopedI18n } from "@/locale/client";
import { Linkedin, Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const t = useScopedI18n("website.footer");

  return (
    <div className="w-full bg-foreground text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Logo et description */}
          <div className="md:col-span-1">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-3">
                <span className="text-white text-2xl font-bold">
                  {t("logo.part1")} <strong>{t("logo.part2")}</strong>
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {t("description")}
              </p>
              
              {/* Social Media */}
              <div className="flex items-center gap-4 mt-4 text-foreground">
                <a 
                  href="#" 
                  className="p-2 rounded-full bg-background hover:bg-muted transition-colors"
                  aria-label={t("social.linkedin")}
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="p-2 rounded-full bg-background hover:bg-muted transition-colors"
                  aria-label={t("social.facebook")}
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="p-2 rounded-full bg-background hover:bg-muted transition-colors"
                  aria-label={t("social.instagram")}
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Liens rapides */}
          <div className="hidden md:flex md:col-span-1">
            {/* Vous pouvez ajouter des liens rapides ici si nécessaire */}
          </div>

          {/* Ressources */}
          <div className="hidden md:flex md:col-span-1">
            {/* Vous pouvez ajouter des ressources ici si nécessaire */}
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-6">
              {t("contact.title")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-background mt-0.5" />
                <span className="text-gray-400">{t("contact.email")}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-background mt-0.5" />
                <span className="text-gray-400">{t("contact.phone")}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-background mt-0.5" />
                <span className="text-gray-400">{t("contact.address")}</span>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="text-white font-medium mb-4">
                {t("newsletter.title")}
              </h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={t("newsletter.placeholder")}
                  className="flex-1 px-4 py-2 bg-muted border border-muted rounded-lg text-black placeholder-foreground focus:outline-none focus:border-muted"
                />
                <button className="px-4 py-2 bg-background rounded-lg hover:bg-muted text-foreground transition-colors">
                  {t("newsletter.button")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {t("copyright")}
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              {t("links.privacy")}
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              {t("links.terms")}
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              {t("links.legal")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
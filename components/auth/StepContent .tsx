"use client";

import {
  Building2,
  User,
  Package,
  CheckCircle2,
  Shield,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Lock,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Wallet,
  AlertCircleIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useMemo, memo } from "react";
// import { PaymentMethod } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";

interface Liste {
  title: string;
  description: string;
  attouts: string[];
}
interface StepContentProps {
  step: number;
  formData: {
    phone: string;
    email: string;
    lastName: string;
    password: string;
    firstName: string;
    organizationName: string;
    organizationAddress: string;
  };
  selectedModules: string[];
  message: string;
  setMessage: (e: string) => void;
  PaymentMethod: string | null;
  selectedPlan: "Enterprise" | "Scale" | "Growth" | "Essentials" | null;
  open: string | null;
  modules: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
    category: string;
    mandatory?: boolean;
    tags?: string[];
    recommended?: boolean;
  }>;
  onSelectMode: (e: any) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onModuleToggle: (moduleId: string) => void;
  onSelectPlan: (
    plan: "Enterprise" | "Scale" | "Growth" | "Essentials" | null
  ) => void;
  onOpenChange: (value: string | null) => void;
  onSubmit: () => void;
  plans?: any[];
  errors?: Record<string, string>;
  loading?: boolean;
}

// Memoized decorative element for better performance
const StepHeader = memo(
  ({
    icon: Icon,
    title,
    description,
    step,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
    step: number;
  }) => {
    return (
      <div className="w-full mb-8 md:mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/20 flex items-center justify-center">
                <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge
                className="absolute -top-2 -right-2 bg-blue-600 text-white"
                variant="default"
              >
                Étape {step}
              </Badge>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

StepHeader.displayName = "StepHeader";

// Enhanced input component with validation
const FormField = memo(
  ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder,
    required = false,
    icon: Icon,
    error,
    disabled = false,
    autoFocus = false,
    autoComplete,
  }: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    icon?: React.ElementType;
    error?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    autoComplete?: string;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="flex items-center gap-2">
        {label}
        {required && <span className="text-red-500">*</span>}
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
      </Label>

      <div className="relative">
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          className={cn(
            "h-12 pl-10 pr-4 transition-all duration-200",
            "border-gray-300 dark:border-gray-700",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          )}
        />
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  )
);

FormField.displayName = "FormField";

// Module category filter
const CategoryFilter = memo(
  ({
    categories,
    activeCategory,
    onCategoryChange,
  }: {
    categories: string[];
    activeCategory: string | null;
    onCategoryChange: (category: string | null) => void;
  }) => (
    <div className="flex flex-wrap gap-2 mb-6">
      <Badge
        variant={activeCategory === null ? "default" : "outline"}
        className="cursor-pointer px-4 py-2"
        onClick={() => onCategoryChange(null)}
      >
        Tous
      </Badge>
      {categories.map((category) => (
        <Badge
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          className="cursor-pointer px-4 py-2 capitalize"
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  )
);

CategoryFilter.displayName = "CategoryFilter";

export function StepContent({
  step,
  formData,
  message,
  setMessage,
  errors = {},
  loading = false,
  selectedModules,
  onModuleToggle,
  onInputChange,
  PaymentMethod,
  onSelectPlan,
  onSelectMode,
  onOpenChange,
  selectedPlan,
  onSubmit,
  plans,
  modules,
  open,
}: StepContentProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const liste: Liste[] = useMemo(() => {
    if (!plans || plans.length === 0) {
      return [
        {
          title: "Essentials",
          description: "Idéal pour les micro-entreprises, les détaillants à site unique et les startups.",
          attouts: ["Jusqu'à 5 utilisateurs", "1 site actif", "Plateforme de base + 1 module", "Support standard"],
        },
        {
          title: "Growth",
          description: "Conçu pour les PME en croissance.",
          attouts: ["Jusqu'à 25 utilisateurs", "Jusqu'à 5 sites", "Plateforme de base + 3 modules", "Support prioritaire"],
        },
        {
          title: "Scale",
          description: "Pour les entreprises établies.",
          attouts: ["Jusqu'à 100 utilisateurs", "Jusqu'à 20 sites", "Plateforme de base + 5 modules", "Onboarding dédié"],
        },
        {
          title: "Enterprise",
          description: "Pour les grandes entreprises.",
          attouts: ["Utilisateurs illimités", "Sites illimités", "Tout inclus", "Support 24/7"],
        },
      ];
    }

    return plans.map(p => {
      // Map backend names to frontend display names if needed
      const displayTitle = p.name === 'Starter' ? 'Growth' : p.name === 'Professional' ? 'Scale' : p.name;
      
      return {
        title: displayTitle,
        description: p.description,
        attouts: [
          `Jusqu'à ${p.maxUsers} utilisateurs`,
          `${p.maxSites} site(s) actif(s)`,
          `${p.storageGB} GB de stockage`,
          p.tier === 'ENTERPRISE' ? 'Modules illimités' : `Modules inclus`,
        ]
      };
    });
  }, [plans]);

  const moduleLimit = useMemo(() => {
    switch (selectedPlan) {
      case 'Essentials': return 1;
      case 'Growth': return 3;
      case 'Scale': return 5;
      case 'Enterprise': return 99;
      default: return 0;
    }
  }, [selectedPlan]);

  const isModuleSelectionDisabled = useMemo(() => {
    // core is always included and doesn't count towards the limit
    return (selectedModules.length - 1) >= moduleLimit && selectedPlan !== 'Enterprise';
  }, [selectedModules, moduleLimit, selectedPlan]);

  const [plan, setPlan] = useState<Liste>(liste[0]);

  useEffect(() => {
     if (liste.length > 0 && selectedPlan) {
        const found = liste.find(l => l.title === selectedPlan);
        if (found) setPlan(found);
     }
  }, [selectedPlan, liste]);

  const handlechange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }
  // Extract unique categories from modules
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(modules.map((m) => m.category))
    );
    return uniqueCategories.sort();
  }, [modules]);

  // Filter modules by active category
  const filteredModules = useMemo(() => {
    if (!activeCategory) return modules;
    return modules.filter((module) => module.category === activeCategory);
  }, [modules, activeCategory]);

  // Calculate module stats
  const moduleStats = useMemo(() => {
    const mandatory = modules.filter((m) => m.mandatory).length;
    const optional = modules.filter((m) => !m.mandatory).length;
    const selected = selectedModules.length;

    return { mandatory, optional, selected };
  }, [modules, selectedModules]);

  // Step 1: Organization Information
  if (step === 1) {
    return (
      <div className="w-full">
        <StepHeader
          icon={Building2}
          title="Informations de votre organisation"
          description="Commençons par en savoir plus sur votre entreprise"
          step={step}
        />

        <form className="max-w-2xl mx-auto space-y-6">
          <Card className="border-blue-100 dark:border-blue-900/30 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Informations légales
              </CardTitle>
              <CardDescription>
                Ces informations seront utilisées pour la facturation et les
                documents officiels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                label="Nom de l'organisation"
                name="organizationName"
                value={formData.organizationName}
                onChange={onInputChange}
                placeholder="Ex: Entreprise XYZ SARL"
                required
                icon={Briefcase}
                error={errors.organizationName}
                autoFocus
                autoComplete="organization"
              />

              <FormField
                label="Adresse de l'organisation"
                name="organizationAddress"
                value={formData.organizationAddress}
                onChange={onInputChange}
                placeholder="Ex: Rue 123, Quartier, Ville"
                required
                icon={MapPin}
                error={errors.organizationAddress}
                autoComplete="street-address"
              />

              <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">
                      Information confidentielle
                    </p>
                    <p>
                      Vos informations sont sécurisées et cryptées. Nous ne
                      partageons jamais vos données avec des tiers.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    );
  }

  // Step 2: Admin Profile
  if (step === 2) {
    return (
      <div className="w-full">
        <StepHeader
          icon={User}
          title="Votre profil administrateur"
          description="Créez votre compte administrateur principal"
          step={step}
        />

        <form className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Ces informations vous permettront de vous connecter à votre
                espace d'administration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Prénom"
                  name="firstName"
                  value={formData.firstName}
                  onChange={onInputChange}
                  placeholder="Votre prénom"
                  required
                  error={errors.firstName}
                  autoComplete="given-name"
                />

                <FormField
                  label="Nom"
                  name="lastName"
                  value={formData.lastName}
                  onChange={onInputChange}
                  placeholder="Votre nom"
                  required
                  error={errors.lastName}
                  autoComplete="family-name"
                />
              </div>

              <FormField
                label="Email professionnel"
                name="email"
                type="email"
                value={formData.email}
                onChange={onInputChange}
                placeholder="exemple@votresociete.com"
                required
                icon={Mail}
                error={errors.email}
                autoComplete="email"
              />

              <FormField
                label="Mot de passe"
                name="password"
                type="password"
                value={formData.password}
                onChange={onInputChange}
                placeholder="Minimum 8 caractères avec chiffres et lettres"
                required
                icon={Lock}
                error={errors.password}
                autoComplete="new-password"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormField
                    label="Téléphone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={onInputChange}
                    placeholder="+237 XX XX XX XX"
                    icon={Phone}
                    error={errors.phone}
                    autoComplete="tel"
                  />
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Force du mot de passe
                            </p>
                            <div className="mt-2 flex gap-1">
                              {[1, 2, 3, 4].map((i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "h-1 flex-1 rounded-full",
                                    formData.password.length >= i * 2
                                      ? formData.password.length >= 8
                                        ? "bg-green-500"
                                        : "bg-yellow-500"
                                      : "bg-gray-200 dark:bg-gray-700"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          {formData.password.length >= 8 && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Minimum 8 caractères avec majuscules, minuscules et
                        chiffres
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    );
  }

  // Step 3: Module Selection
  if (step === 3) {
    return (
      <div className="w-full">
        <StepHeader
          icon={Package}
          title="choose your plan"
          description="Choose how you'd like to complete your plan"
          step={step}
        />
        <div className="flex gap-6 w-full">
          {/* GAUCHE */}
          <div className="w-1/2 space-y-3">
            {liste.map((el) => {
              // const data:Liste[] = liste.find((el) => el.title == selectedPlan)
              return (
                <button
                  key={el.title}
                  onClick={() => {
                    setPlan(el);
                    onSelectPlan(
                      el.title as
                        | "Enterprise"
                        | "Scale"
                        | "Growth"
                        | "Essentials"
                    );
                  }}
                  className={`w-full text-left rounded-lg border p-4 transition-all cursor-pointer ${
                    selectedPlan === el.title
                      ? "border-primary bg-primary text-white"
                      : "border-border hover:bg-muted"
                  }
        `}
                >
                  <h3 className="font-semibold text-lg">{el.title}</h3>
                  <p
                    className={`text-sm ${
                      plan.title === el.title
                        ? "text-neutral-200"
                        : "text-muted-foreground"
                    }`}
                  >
                    {el.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* DROITE */}
          <div className="w-1/2 rounded-xl border p-6">
            <h2 className="text-2xl font-bold mb-2">{plan.title}</h2>

            <p className="text-muted-foreground mb-4">{plan.description}</p>

            <ul className="list-disc pl-5 space-y-2">
              {plan.attouts.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
    // }
  }

  if (step === 4) {
    if (selectedPlan === "Enterprise") {
      return (
        <>
          <StepHeader
            icon={Package}
            title="choose your plan"
            description="Choose how you'd like to complete your plan"
            step={step}
          />
          <div className=" h-full w-1/2 space-y-4">
            <span>Laisser Nous votre message</span>
            <Textarea onChange={handlechange} value={message} className="mt-2 " />
            <div className="p-4 w-full h-full border-2 border-primary text-primary bg-primary/10 rounded-lg flex">
              <AlertCircleIcon />
              <div className="pl-4 list-disc capitalize">
                <legend>ce que dois posseder votre mail</legend>
                <ul className="pl-4 list-disc capitalize">
                  <li>Votre Nom</li>
                  <li>Votre Prenom</li>
                  <li>Le Nom de votre entreprise</li>
                  <li>Le besoin de votre entreprise</li>
                  <li>Le media sur lequel vous etes le plus allaise</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div className="w-full">
          <StepHeader
            icon={Package}
            title="Personnalisez votre plateforme"
            description="Sélectionnez les modules adaptés à vos besoins métier"
            step={step}
          />

          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Modules sélectionnés
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    {moduleStats.mandatory} module(s) obligatoire(s)
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    {moduleStats.selected - moduleStats.mandatory} module(s)
                    optionnel(s)
                  </Badge>
                </div>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">
                  {selectedModules.length} module(s) au total
                </span>
              </div>
            </div>

            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          <div className="relative">
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2"
              style={{
                maxHeight: "calc(85vh - 250px)",
                scrollbarWidth: "thin",
                scrollbarColor: "var(--scrollbar-thumb) var(--scrollbar-track)",
              }}
            >
              {/* {filteredModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isSelected={selectedModules.includes(module.id)}
                  onToggle={() => {
                    if (!selectedModules.includes(module.id) && isModuleSelectionDisabled) {
                      return; // Limit reached
                    }
                    onModuleToggle(module.id);
                  }}
                  disabled={!selectedModules.includes(module.id) && isModuleSelectionDisabled}
                />
              ))} */}
            </div>

            {filteredModules.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Aucun module trouvé
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Essayez de sélectionner une autre catégorie
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  // Step 5: Summary / Review
  if (step === 5) {
    return (
      <>
        <StepHeader
          icon={CheckCircle2}
          title="Résumé de votre commande"
          description="Vérifiez vos choix avant de finaliser"
          step={step}
        />
        <div className="flex gap-4 w-full h-full flex-col lg:flex-row p-4">
          <Card className="w-1/2 border-none shadow-lg z-20">
            <CardHeader className="pb-2">
              <Badge className="w-fit mb-2">{plan.title}</Badge>
              <CardTitle>{plan.title}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold text-sm uppercase text-gray-500 mb-2">Inclus dans votre forfait :</h4>
              <ul className="list-disc pl-4 space-y-1 text-sm">
                {plan.attouts.map((items, index) => (
                  <li key={index}>{items}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <div className="w-1/2 space-y-4">
            <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Modules sélectionnés</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  {selectedModules.map((id, index) => {
                    const mod = modules.find(m => m.id === id);
                    return <li key={index}>{mod ? mod.name : id}</li>
                  })}
                </ul>
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total estimé</span>
                    <span className="text-blue-600">Calcul à l'étape suivante</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // Step 6: Payment Method selection
  if (step === 6) {
    return (
      <div className="w-full">
        <StepHeader
          icon={Wallet}
          title="Mode de paiement"
          description="Choisissez comment vous souhaitez régler votre abonnement"
          step={step}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {/* PayPal */}
          <Card
            onClick={() => onSelectMode("paypal")}
            className={`flex flex-col p-6 cursor-pointer transition-all hover:shadow-md ${
              PaymentMethod === "paypal" ? "border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/20" : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl ${PaymentMethod === "paypal" ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800"}`}>
                <Wallet className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold">PayPal / Carte</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Paiement sécurisé via PayPal ou carte bancaire internationale.</p>
            {PaymentMethod === 'paypal' && (
              <div className="mt-4 flex gap-2">
                 <Image src="/paypalIcon.png" alt="paypal" width={40} height={30} className="opacity-80" />
                 <Image src="/paypal.svg" alt="paypal text" width={80} height={30} className="opacity-80" />
              </div>
            )}
          </Card>

          {/* Mobile payment */}
          <Card
            onClick={() => onSelectMode("mobile")}
            className={`flex flex-col p-6 cursor-pointer transition-all hover:shadow-md ${
              PaymentMethod === "mobile" ? "border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/20" : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl ${PaymentMethod === "mobile" ? "bg-orange-500 text-white" : "bg-gray-100 dark:bg-gray-800"}`}>
                <Phone className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold">Mobile Money</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">MTN Money ou Orange Money (Cameroun & Afrique Centrale).</p>
            {PaymentMethod === 'mobile' && (
              <div className="mt-4 flex gap-4">
                 <Badge variant="outline" className="bg-yellow-400/10 border-yellow-400 text-yellow-700">MTN</Badge>
                 <Badge variant="outline" className="bg-orange-500/10 border-orange-500 text-orange-700">Orange</Badge>
              </div>
            )}
          </Card>
        </div>
        
        <div className="mt-8 px-4">
           <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                  Avez-vous un code promotionnel ?
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Utiliser un code d'accès</DialogTitle>
                  <DialogDescription>
                    Entrez votre code pour débloquer votre accès.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-4 flex-col mt-4">
                  <Label htmlFor="Access">Code d'accès</Label>
                  <Input id="Access" placeholder="XYZ-PROMO-2024" className="w-full rounded-md" />
                  <Button onClick={() => {}}>Appliquer le code</Button>
                </div>
              </DialogContent>
            </Dialog>
        </div>
      </div>
    );
  }

  // Step 5: Success
  if (step === 7) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <Card className="max-w-2xl mx-auto text-center border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/10">
          <CardContent className="pt-12 pb-10">
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-16 h-16 text-white" />
              </div>
              {/* <div className="absolute -top-2 -right-2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-6 h-6 text-white" />
              </div> */}
            </div>

            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Configuration terminée !
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
              Votre espace{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                ZyLo Platform
              </span>{" "}
              est prêt à l'emploi
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {selectedModules.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Modules activés
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-4000 mb-2">
                  {selectedPlan}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Forfait sélectionné
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {formData.organizationName.split(" ")[0]}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Organisation
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 text-base font-semibold"
                onClick={() => (window.location.href = "/dashboard")}
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Accéder au Dashboard
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base"
                onClick={() => window.location.reload()}
              >
                Modifier la configuration
              </Button>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Un email de confirmation a été envoyé à{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {formData.email}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
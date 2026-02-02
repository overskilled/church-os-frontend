"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChurchFormData, CompteType, UserFormData } from "@/types/auth";
import { Search } from "@/components/Search";

// Animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

const buttonVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hover: {
    y: -8,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
  },
};

export default function Login() {
  const liste = [
    {
      value: "ChurchCompte",
      title: "Compte église",
      subtitle: "Ici, vous créerez une église, dont vous serez administratif",
      explication:
        "Ou vous pourriez émettre le suivi de vos fidèles et l'organisation des événements",
      liste: [
        "Le nom de l'eglise",
        "La localisation de l'eglise",
        "L'estimation de la taille de l'eglise",
        "Un scan de votre diplôme d'esglise",
        "etc ...",
      ],
      boutton: "Cliquez ici",
    },
    {
      value: "UserCompte",
      title: "Compte Utilisateur",
      subtitle: "Ici, vous créerez votre compte personnel",
      explication:
        "Où vous pourrez recevoir des notifications des programmes et de votre suivi",
      liste: [
        "votre nom",
        "votre genre",
        "votre eglise",
        "Votre email",
        "etc ...",
      ],
      boutton: "Cliquez ici",
    },
  ];

  const liste1 = [
    {
      code: "CDR",
      value: "Cite des Rois",
      continent: "Afrique",
      label: "Cite des Rois",
    },
    {
      code: "CCN",
      value: "Communaute chretienne des nations",
      label: "Communaute chretienne des nations",
      continent: "Afrique",
    },
  ];
  const liste2 = [
    {
      code: "500",
      value: "500",
      continent: "500",
      label: "500",
    },
    {
      code: "100",
      value: "100",
      continent: "100",
      label: "100",
    },
    {
      code: "300",
      value: "300",
      continent: "300",
      label: "300",
    },
  ];

  const [steps, setSteps] = useState<number>(0);
  const [compte, setCompte] = useState<CompteType | null>(null);
  
  // Correction du UserFormData selon ton nouveau schéma
  const [userFormData, setUserFormData] = useState<UserFormData>({
    fullName: "",
    phone: "",
    password: "",
    churchId: "",
    email: "",
    role: "MEMBER",
    gender: undefined,
    department: undefined,
    dateOfBirth: "",
    placeOfBirth: "",
  });

  // Correction du ChurchFormData selon la structure demandée
  const [churchFormData, setChurchFormData] = useState<ChurchFormData>({
    name: "",
    city: "",
    address: "",
    email: "",
    phone: "",
    slogan: "",
    size: "",
    password: "",
    website: "",
  });

  const validateStep = (): boolean => {
    switch (steps) {
      case 0:
        return !!compte;
      case 1:
        if (compte === "UserCompte") {
          // Seul le fullName est requis pour l'étape 1 (selon ton nouveau schéma)
          return !!(userFormData.fullName);
        } else {
          // Pour Church: name, slogan, city, address sont requis
          return !!(
            churchFormData.name &&
            churchFormData.slogan &&
            churchFormData.city &&
            churchFormData.address
          );
        }
      case 2:
        if (compte === "UserCompte") {
          // Pour User: phone, password, churchId sont requis
          // email est optionnel mais unique
          return !!(
            userFormData.phone &&
            userFormData.password &&
            userFormData.churchId &&
            userFormData.password.length >= 8
          );
        } else {
          // Pour Church: email, phone, password sont requis
          // website est optionnel
          return !!(
            churchFormData.email &&
            churchFormData.phone &&
            churchFormData.password &&
            churchFormData.password.length >= 8
          );
        }
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (compte === "UserCompte") {
      if (steps < 2) {
        setSteps(steps + 1);
      } else {
        try {
          // Préparer les données pour l'API
          const userData = {
            fullName: userFormData.fullName,
            phone: userFormData.phone,
            password: userFormData.password,
            churchId: userFormData.churchId,
            email: userFormData.email || undefined, // Optionnel
            role: userFormData.role || "MEMBER",
            gender: userFormData.gender || undefined,
            department: userFormData.department || undefined,
            dateOfBirth: userFormData.dateOfBirth || undefined,
            placeOfBirth: userFormData.placeOfBirth || undefined,
          };

          console.log("Données User à envoyer:", userData);

          const res = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });

          const data = await res.json();
          
          if (data.success) {
            alert("Inscription réussie !");
            // Redirection ou reset du formulaire
            setSteps(0);
            setCompte(null);
            setUserFormData({
              fullName: "",
              phone: "",
              password: "",
              churchId: "",
              email: "",
              role: "MEMBER",
              gender: undefined,
              department: undefined,
              dateOfBirth: "",
              placeOfBirth: "",
            });
          } else {
            alert(`Erreur: ${data.error || "Inscription échouée"}`);
          }
        } catch (error) {
          console.error("Erreur lors de l'inscription:", error);
          alert("Une erreur est survenue lors de l'inscription");
        }
      }
    } else if (compte === "ChurchCompte") {
      if (steps < 2) {
        setSteps(steps + 1);
      } else {
        try {
          // Préparer les données EXACTEMENT comme tu les veux
          const churchData = {
            name: churchFormData.name,
            slogan: churchFormData.slogan,
            city: churchFormData.city,
            address: churchFormData.address,
            size: churchFormData.size,
            email: churchFormData.email,
            phone: churchFormData.phone,
            password: churchFormData.password,
            website: churchFormData.website || undefined, // Optionnel
          };

          console.log("Données Church à envoyer:", churchData);

          const res = await fetch("http://localhost:3000/auth/church/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(churchData),
          });

          const data = await res.json();
          
          if (data.success) {
            alert("Église créée avec succès !");
            // Redirection ou reset du formulaire
            setSteps(0);
            setCompte(null);
            setChurchFormData({
              name: "",
              city: "",
              address: "",
              email: "",
              phone: "",
              slogan: "",
              size: "",
              password: "",
              website: "",
            });
          } else {
            alert(`Erreur: ${data.error || "Création échouée"}`);
          }
        } catch (error) {
          console.error("Erreur lors de la création de l'église:", error);
          alert("Une erreur est survenue lors de la création de l'église");
        }
      }
    }
  };

  const handlePrevious = () => {
    if (steps > 0) {
      setSteps(steps - 1);
    }
  };

  // Handler pour User
  const handleUserInputChange = (field: keyof UserFormData, value: string) => {
    setUserFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handler pour Church
  const handleChurchInputChange = (field: keyof ChurchFormData, value: string) => {
    setChurchFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderStep0 = () => (
    <motion.div
      key="step0"
      // variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      className="w-full min-h-screen flex flex-col justify-center items-center gap-8 p-4"
    >
      <motion.h2
        className="text-4xl font-bold text-center"
        data-aos="fade-down"
        data-aos-duration="1000"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Bienvenue dans la page d'enregistrement de Church O.S
      </motion.h2>

      <motion.span
        className="text-lg text-muted-foreground"
        data-aos-delay="1000"
        data-aos="fade-down"
        data-aos-duration="1000"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Une question
      </motion.span>

      <motion.p
        className="text-xl text-center max-w-2xl"
        data-aos="fade-down"
        data-aos-delay="1500"
        data-aos-duration="1000"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        Voulez-vous créer un compte église ou un compte utilisateur ?
      </motion.p>

      <div
        className="flex gap-8 flex-col md:flex-row mt-8"
        data-aos="fade-up"
        data-aos-delay="2000"
        data-aos-duration="1000"
      >
        {liste.map((el, index) => (
          <motion.div
            key={index}
            // variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
          >
            <Card
              className={cn(
                "cursor-pointer max-w-md transition-all duration-300 border-2 hover:shadow-xl",
                compte === el.value
                  ? "border-primary shadow-lg scale-[1.02]"
                  : "border-transparent hover:border-primary/50",
              )}
              onClick={() => setCompte(el.value as CompteType)}
            >
              <CardHeader>
                <CardTitle className="text-xl">{el.title}</CardTitle>
                <CardDescription>{el.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="gap-4 flex flex-col">
                <p className="text-sm text-muted-foreground">
                  {el.explication}
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  {el.liste.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-primary font-semibold mt-2">{el.boutton}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderStep1 = () => {
    if (compte === "UserCompte") {
      return (
        <motion.div
          key="step1"
          // variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          className="w-full min-h-screen flex flex-col items-center justify-center gap-8 p-4"
        >
          <motion.h2
            className="text-4xl font-bold text-center"
            data-aos="fade-down"
            data-aos-duration="1000"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Entrez vos informations personnelles
          </motion.h2>

          <motion.div
            className="flex gap-4 flex-col min-w-full *:rounded-none md:min-w-[500px] max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Input
              type="text"
              value={userFormData.fullName}
              onChange={(e) => handleUserInputChange("fullName", e.target.value)}
              placeholder={"Nom complet: Jean Dupont"}
              data-aos="fade-up"
              data-aos-delay="200"
            />
            
            <div className="flex items-center gap-2 *:rounded-none">
              <Input
                type="date"
                value={userFormData.dateOfBirth}
                onChange={(e) => handleUserInputChange("dateOfBirth", e.target.value)}
                placeholder={"Date de naissance: 2000-11-22"}
                data-aos="fade-up"
                data-aos-delay="200"
              />
              <Input
                type="text"
                value={userFormData.placeOfBirth}
                onChange={(e) => handleUserInputChange("placeOfBirth", e.target.value)}
                placeholder={"Lieu de naissance: Douala"}
                data-aos="fade-up"
                data-aos-delay="200"
              />
            </div>
            
            <div data-aos="fade-up" data-aos-delay="500">
              <Select
                value={userFormData.gender || ""}
                onValueChange={(value) => handleUserInputChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOMME">Homme</SelectItem>
                  <SelectItem value="FEMME">Femme</SelectItem>
                  <SelectItem value="AUTRE">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </motion.div>
      );
    } else if (compte === "ChurchCompte") {
      return (
        <motion.div
          key="step1"
          // variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          className="w-full min-h-screen flex flex-col items-center justify-center gap-8 p-4"
        >
          <motion.h2
            className="text-4xl font-bold text-center"
            data-aos="fade-down"
            data-aos-duration="1000"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Informations de l'église
          </motion.h2>

          <motion.div
            className="flex gap-4 flex-col min-w-full *:rounded-none md:min-w-[500px] max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Input
              type="text"
              value={churchFormData.name}
              onChange={(e) => handleChurchInputChange("name", e.target.value)}
              placeholder={"Nom de l'église: Cité des Rois"}
              data-aos="fade-up"
              data-aos-delay="200"
            />
            
            <Input
              type="text"
              value={churchFormData.slogan}
              onChange={(e) => handleChurchInputChange("slogan", e.target.value)}
              placeholder={"Slogan: Roi un jour, Roi toujours"}
              data-aos="fade-up"
              data-aos-delay="300"
            />
            
            <div className="flex items-center gap-2 *:rounded-none">
              <Input
                type="text"
                value={churchFormData.city}
                onChange={(e) => handleChurchInputChange("city", e.target.value)}
                placeholder={"Ville: Yaoundé"}
                data-aos="fade-up"
                data-aos-delay="400"
              />
              
              <Input
                type="text"
                value={churchFormData.address}
                onChange={(e) => handleChurchInputChange("address", e.target.value)}
                placeholder={"Adresse: Awae Esqualier"}
                data-aos="fade-up"
                data-aos-delay="400"
              />
            </div>
            
            <div data-aos="fade-up" data-aos-delay="500">
              <Search
                liste={liste2}
                onSelect={(value) => handleChurchInputChange("size", value)}
                placeholder="Nombre de fidèles: 500"
              />
            </div>
          </motion.div>
        </motion.div>
      );
    }
  };

  const renderStep2 = () => {
    if (compte === "UserCompte") {
      return (
        <motion.div
          key="step2"
          // variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          className="w-full min-h-screen flex flex-col items-center justify-center gap-8 p-4"
        >
          <motion.h2
            className="text-4xl font-bold text-center"
            data-aos="fade-down"
            data-aos-duration="1000"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Informations digitales
          </motion.h2>

          <motion.div
            className="flex gap-4 flex-col min-w-full *:rounded-none md:min-w-[500px] max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Input
              value={userFormData.phone}
              type="tel"
              onChange={(e) => handleUserInputChange("phone", e.target.value)}
              placeholder={"Numéro de téléphone: 0123456789"}
              data-aos="fade-up"
              data-aos-delay="300"
            />
            
            <Input
              type="email"
              value={userFormData.email}
              onChange={(e) => handleUserInputChange("email", e.target.value)}
              placeholder={"Email (optionnel): jean@example.com"}
              data-aos="fade-up"
              data-aos-delay="400"
            />
            
            <Input
              type="password"
              value={userFormData.password}
              onChange={(e) => handleUserInputChange("password", e.target.value)}
              placeholder={"Mot de passe (min 8 caractères)"}
              data-aos="fade-up"
              data-aos-delay="500"
            />
            
            <div data-aos="fade-up" data-aos-delay="600">
              <Search
                liste={liste1}
                onSelect={(value) => handleUserInputChange("churchId", value)}
                placeholder="Sélectionnez votre église"
              />
            </div>
            
            <div data-aos="fade-up" data-aos-delay="700">
              <Select
                value={userFormData.role}
                onValueChange={(value) => handleUserInputChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">Membre</SelectItem>
                  <SelectItem value="PASTORAL">Pastoral</SelectItem>
                  <SelectItem value="FIDEL">Fidèle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div data-aos="fade-up" data-aos-delay="800">
              <Select
                value={userFormData.department || ""}
                onValueChange={(value) => handleUserInputChange("department", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Département (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CHORALE">Chorale</SelectItem>
                  <SelectItem value="PROTOCOLE">Protocole</SelectItem>
                  <SelectItem value="INTERCESSION">Intercession</SelectItem>
                  <SelectItem value="PRESENTIELLE">Présentielle</SelectItem>
                  <SelectItem value="AUTRE">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </motion.div>
      );
    } else if (compte === "ChurchCompte") {
      return (
        <motion.div
          key="step2"
          // variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          className="w-full min-h-screen flex flex-col items-center justify-center gap-8 p-4"
        >
          <motion.h2
            className="text-4xl font-bold text-center"
            data-aos="fade-down"
            data-aos-duration="1000"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Informations digitales de l'église
          </motion.h2>

          <motion.div
            className="flex gap-4 flex-col min-w-full *:rounded-none md:min-w-[500px] max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Input
              value={churchFormData.email}
              type="email"
              onChange={(e) => handleChurchInputChange("email", e.target.value)}
              placeholder={"Email de l'église: citedesrois@gmail.com"}
              data-aos="fade-up"
              data-aos-delay="300"
            />
            
            <Input
              type="password"
              value={churchFormData.password}
              onChange={(e) => handleChurchInputChange("password", e.target.value)}
              placeholder={"Mot de passe (min 8 caractères)"}
              data-aos="fade-up"
              data-aos-delay="400"
            />
            
            <Input
              type="tel"
              value={churchFormData.phone}
              onChange={(e) => handleChurchInputChange("phone", e.target.value)}
              placeholder={"Téléphone: 0123456789"}
              data-aos="fade-up"
              data-aos-delay="500"
            />
            
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="hasWebsite" 
                className="w-4 h-4"
                checked={!!churchFormData.website}
                onChange={(e) => {
                  if (!e.target.checked) {
                    handleChurchInputChange("website", "");
                  }
                }}
              />
              <Label htmlFor="hasWebsite" className="text-sm">
                L'église a-t-elle un site web ?
              </Label>
            </div>
            
            {churchFormData.website !== undefined && (
              <Input
                type="url"
                value={churchFormData.website}
                onChange={(e) => handleChurchInputChange("website", e.target.value)}
                placeholder={"Site web: https://citedesrois.com"}
                data-aos="fade-up"
                data-aos-delay="600"
              />
            )}
          </motion.div>
        </motion.div>
      );
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {steps === 0 && renderStep0()}
        {steps === 1 && renderStep1()}
        {steps === 2 && renderStep2()}
      </AnimatePresence>

      {/* Navigation buttons - Toujours en bas */}
      <AnimatePresence>
        {(compte !== null || steps > 0) && (
          <motion.div
            // variants={buttonVariants}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="flex gap-4 p-4 bg-background/80 backdrop-blur-sm rounded-lg border shadow-lg">
              {steps > 0 && (
                <motion.div whileHover={{ x: -4 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Retour
                  </Button>
                </motion.div>
              )}

              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSubmit}
                  disabled={!validateStep()}
                  className={cn(
                    "gap-2 transition-all",
                    !validateStep() && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {steps < 2 ? (
                    <>
                      Suivant
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : compte === "UserCompte" ? (
                    "S'inscrire"
                  ) : (
                    "Créer l'église"
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicateur de progression */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border">
          <div className="flex gap-1">
            {[0, 1, 2].map((stepIndex) => (
              <div
                key={stepIndex}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  stepIndex === steps
                    ? "bg-primary w-8"
                    : stepIndex < steps
                      ? "bg-primary/50"
                      : "bg-muted",
                )}
              />
            ))}
          </div>
          <span className="text-xs ml-2 font-medium">
            Étape {steps + 1} sur 3
          </span>
        </div>
      </motion.div>
    </div>
  );
}
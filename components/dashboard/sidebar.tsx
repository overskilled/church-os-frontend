"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  Users, 
  GitBranch, 
  Calendar, 
  BarChart3, 
  Layers, 
  HeartHandshake, 
  Coins, 
  FileText,
  Home,
  Settings,
  Bell,
  Shield,
  UserCircle,
  Church,
  Speaker
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar() {
  const pathname = usePathname();
  
  // Fonction pour vérifier si le lien est actif sans la locale
  const isActive = (link: string) => {
    // Enlever la locale du pathname (ex: "/fr/dashboard" -> "/dashboard")
    const normalizedPathname = pathname.replace(/^\/[a-z]{2}/, '');
    // Enlever le slash initial si présent
    const normalizedLink = link.startsWith('/') ? link : `/${link}`;
    
    // Si c'est la page d'accueil
    if (link === "/" || link === "") {
      return normalizedPathname === "" || normalizedPathname === "/";
    }
    
    // Vérifier si le pathname commence par le lien
    return normalizedPathname.startsWith(normalizedLink);
  };
  
  const menuItems = [
    { 
      name: "Gestion des Membres", 
      link: "/churchDashboard", 
      icon: Users 
    },
    { 
      name: "Annonces et sermon", 
      link: "/churchDashboard/Annonces", 
      icon: Speaker 
    },
    { 
      name: "Branches & Ministères", 
      link: "/churchDashboard/branches", 
      icon: GitBranch 
    },
    { 
      name: "temoignage", 
      link: "/churchDashboard/temoignage", 
      icon: Calendar 
    },
    { 
      name: "Gestion des Événements", 
      link: "/churchDashboard/events", 
      icon: Calendar 
    },
    { 
      name: "Présence & Statistiques", 
      link: "/attendance", 
      icon: BarChart3 
    },
    { 
      name: "Départements & Planning", 
      link: "/departments", 
      icon: Layers 
    },
    { 
      name: "Suivi Pastoral & Care", 
      link: "/pastoral", 
      icon: HeartHandshake 
    },
    { 
      name: "Dons & Finances", 
      link: "/finances", 
      icon: Coins 
    },
    { 
      name: "Rapports Automatisés", 
      link: "/reports", 
      icon: FileText 
    },
    { 
      name: "Sécurité & Rôles", 
      link: "/security", 
      icon: Shield 
    },
    { 
      name: "Paramètres", 
      link: "/settings", 
      icon: Settings 
    },
  ];

  const user = {
    name: "Pasteur Jean Martin",
    role: "Administrateur Principal",
    email: "jean.martin@eglise.fr",
    avatar: "/avatar.jpg"
  };

  return (
    <Sidebar className="border-r bg-foreground">
      <SidebarHeader className="p-6 bg-foreground">
        <div className="flex items-center gap-3 text-muted">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
            <Church className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Church O.S</h1>
            <p className="text-sm">Votre église plus près de vous</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 bg-foreground">
        <SidebarMenu className="space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item.link);
            const Icon = item.icon;
            
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  isActive={active}
                  className={`w-full justify-start gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors
                    ${active 
                      ? 'bg-background  text-foreground shadow-sm' 
                      : 'text-muted hover:bg-accent hover:text-foreground'
                    }`}
                >
                  <Link href={item.link} className=" ">
                    <Icon className="h-5 w-5 text-muted" />
                    <span className="">{item.name}</span>
                    {active && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-purple-600" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 bg-foreground">
        <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0 text-muted">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted truncate">{user.role}</p>
            <p className="text-xs text-muted truncate">{user.email}</p>
          </div>
          
          <button className="ml-auto rounded-md p-1.5 hover:bg-accent">
            <Bell className="h-4 w-4 text-muted" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
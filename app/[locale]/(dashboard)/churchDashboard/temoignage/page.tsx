"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Eye, Edit, Send, Trash, User, Filter, Plus, Forward } from "lucide-react";
import { useState } from "react";

// Interface TypeScript
interface Annonce {
  id: number;
  titre: string;
  destinataire: string;
  contenu: string;
  verset: string;
  date: string;
  auteur: string;
  statut: 'Publiée' | 'Brouillon' | 'Archivée';
  vue: boolean; // Nouveau champ pour gérer si l'annonce a été vue
}

// Données fictives d'annonces
const annoncesInitiales: Annonce[] = [
  {
    id: 1,
    titre: "Culte de dimanche spécial",
    destinataire: "Tous les fidèles",
    contenu: "Venez nombreux pour le culte spécial de dimanche avec l'orateur invité Pasteur Jacques",
    verset: "Hébreux 10:25",
    date: "15/12/2023",
    auteur: "Pasteur Andy",
    statut: "Publiée",
    vue: true
  },
  {
    id: 2,
    titre: "Réunion de prière",
    destinataire: "Tous les membres",
    contenu: "Réunion de prière ce mercredi à 19h pour les besoins de l'église",
    verset: "Philippiens 4:6-7",
    date: "14/12/2023",
    auteur: "Pasteur Andy",
    statut: "Publiée",
    vue: false
  },
  {
    id: 3,
    titre: "Collecte missionnaire",
    destinataire: "Toutes les branches",
    contenu: "Collecte spéciale pour soutenir nos missions en Afrique",
    verset: "2 Corinthiens 9:7",
    date: "13/12/2023",
    auteur: "Pasteur Andy",
    statut: "Brouillon",
    vue: false
  },
  {
    id: 4,
    titre: "Camp jeunesse",
    destinataire: "Département spécifique",
    contenu: "Inscriptions ouvertes pour le camp jeunesse de Noël",
    verset: "1 Timothée 4:12",
    date: "12/12/2023",
    auteur: "Pasteur Andy",
    statut: "Publiée",
    vue: true
  },
  {
    id: 5,
    titre: "Nettoyage de l'église",
    destinataire: "Tous les membres",
    contenu: "Samedi prochain, journée de nettoyage et d'entretien des locaux",
    verset: "1 Corinthiens 14:40",
    date: "11/12/2023",
    auteur: "Pasteur Andy",
    statut: "Publiée",
    vue: false
  },
  {
    id: 6,
    titre: "Étude biblique",
    destinataire: "Tous les fidèles",
    contenu: "Nouvelle série d'étude biblique sur le livre des Actes",
    verset: "2 Timothée 3:16-17",
    date: "10/12/2023",
    auteur: "Pasteur Andy",
    statut: "Archivée",
    vue: true
  },
  {
    id: 7,
    titre: "Concert de louange",
    destinataire: "Toutes les branches",
    contenu: "Soirée de louange avec le groupe 'Chants d'Espérance'",
    verset: "Psaume 150:6",
    date: "09/12/2023",
    auteur: "Pasteur Andy",
    statut: "Publiée",
    vue: true
  },
  {
    id: 8,
    titre: "Formation des serviteurs",
    destinataire: "Département spécifique",
    contenu: "Formation pour tous les serviteurs d'accueil et de sécurité",
    verset: "1 Pierre 4:10",
    date: "08/12/2023",
    auteur: "Pasteur Andy",
    statut: "Brouillon",
    vue: false
  },
];

export default function AnnoncesPage() {
  const [annonces, setAnnonces] = useState<Annonce[]>(annoncesInitiales);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Filtrer les annonces selon l'onglet actif
  const getFilteredAnnonces = (): Annonce[] => {
    let filtered = annonces.filter(annonce =>
      annonce.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annonce.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annonce.destinataire.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (activeTab) {
      case "see":
        return filtered.filter(annonce => annonce.vue);
      case "no-see":
        return filtered.filter(annonce => !annonce.vue);
      default:
        return filtered;
    }
  };

  const filteredAnnonces = getFilteredAnnonces();

  // Fonctions d'action (simulées)
  const previsualiserAnnonce = (annonce: Annonce): void => {
    alert(`Prévisualisation: ${annonce.titre}\n${annonce.contenu}`);
  };

  const editerAnnonce = (annonce: Annonce): void => {
    alert(`Édition de: ${annonce.titre}`);
  };

  const publierAnnonce = (id: number): void => {
    setAnnonces(annonces.map(a => 
      a.id === id ? { ...a, statut: 'Publiée' } : a
    ));
    alert("Annonce publiée !");
  };

  const supprimerAnnonce = (id: number): void => {
    if (confirm("Supprimer cette annonce ?")) {
      setAnnonces(annonces.filter(a => a.id !== id));
    }
  };

  const marquerCommeVue = (id: number): void => {
    setAnnonces(annonces.map(a => 
      a.id === id ? { ...a, vue: true } : a
    ));
  };

  const getBadgeClass = (statut: Annonce['statut']): string => {
    switch (statut) {
      case 'Publiée':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Brouillon':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'Archivée':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold">Cher Pasteur Andy</h2>
        <p className="text-gray-600">
          Vous pouvez faire des annonces, les modifier, ainsi que les supprimer
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex gap-2">
        <Input 
          placeholder="Rechercher des annonces..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Button>
          <Forward className="h-4 w-4 mr-2" />
          partager
        </Button>
      </div>

      {/* Tabs et Contenu */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="see">Vues</TabsTrigger>
          <TabsTrigger value="no-see">Non vues</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Toutes les annonces</CardTitle>
              <CardDescription>
                {filteredAnnonces.length} annonce{filteredAnnonces.length > 1 ? 's' : ''} au total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableauAnnonces 
                annonces={filteredAnnonces}
                onPreview={previsualiserAnnonce}
                onEdit={editerAnnonce}
                onPublish={publierAnnonce}
                onDelete={supprimerAnnonce}
                onMarkAsSeen={marquerCommeVue}
                getBadgeClass={getBadgeClass}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="see" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Annonces vues</CardTitle>
              <CardDescription>
                {filteredAnnonces.length} annonce{filteredAnnonces.length > 1 ? 's' : ''} vue{filteredAnnonces.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableauAnnonces 
                annonces={filteredAnnonces}
                onPreview={previsualiserAnnonce}
                onEdit={editerAnnonce}
                onPublish={publierAnnonce}
                onDelete={supprimerAnnonce}
                onMarkAsSeen={marquerCommeVue}
                getBadgeClass={getBadgeClass}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="no-see" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Annonces non vues</CardTitle>
              <CardDescription>
                {filteredAnnonces.length} annonce{filteredAnnonces.length > 1 ? 's' : ''} non vue{filteredAnnonces.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableauAnnonces 
                annonces={filteredAnnonces}
                onPreview={previsualiserAnnonce}
                onEdit={editerAnnonce}
                onPublish={publierAnnonce}
                onDelete={supprimerAnnonce}
                onMarkAsSeen={marquerCommeVue}
                getBadgeClass={getBadgeClass}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Composant TableauAnnonces séparé pour éviter la duplication
interface TableauAnnoncesProps {
  annonces: Annonce[];
  onPreview: (annonce: Annonce) => void;
  onEdit: (annonce: Annonce) => void;
  onPublish: (id: number) => void;
  onDelete: (id: number) => void;
  onMarkAsSeen: (id: number) => void;
  getBadgeClass: (statut: Annonce['statut']) => string;
}

function TableauAnnonces({ 
  annonces, 
  onPreview, 
  onEdit, 
  onPublish, 
  onDelete, 
  onMarkAsSeen,
  getBadgeClass 
}: TableauAnnoncesProps) {
  if (annonces.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune annonce trouvée
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Titre</TableHead>
            <TableHead>Destinataire</TableHead>
            <TableHead>Verset</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {annonces.map((annonce) => (
            <TableRow key={annonce.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{annonce.titre}</p>
                    {!annonce.vue && (
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1">{annonce.contenu}</p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{annonce.destinataire}</span>
              </TableCell>
              <TableCell>
                {annonce.verset && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3 w-3 text-gray-500" />
                    <span className="text-xs italic">{annonce.verset.split(' - ')[0]}</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-gray-500" />
                  <span className="text-sm">{annonce.date}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getBadgeClass(annonce.statut)}>
                  {annonce.statut}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  {!annonce.vue && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onMarkAsSeen(annonce.id)}
                      title="Marquer comme vue"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onPreview(annonce)}
                    title="Prévisualiser"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEdit(annonce)}
                    title="Éditer"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  {annonce.statut === 'Brouillon' && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onPublish(annonce.id)}
                      title="Publier"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDelete(annonce.id)}
                    title="Supprimer"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="font-medium">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Total
              </div>
            </TableCell>
            <TableCell className="text-right font-medium">
              {annonces.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
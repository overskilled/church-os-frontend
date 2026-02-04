"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Plus, 
  Trash, 
  Edit, 
  UserPlus, 
  Users, 
  Church, 
  MapPin, 
  Phone, 
  Mail,
  UserCheck,
  UserX
} from "lucide-react";

// Interfaces TypeScript
interface Fidele {
  id: number;
  nomComplet: string;
  telephone: string;
  email: string;
  sexe: 'M' | 'F';
  statut: 'Actif' | 'Inactif' | 'Nouveau';
  dateAdhesion: string;
  brancheId: number;
}

interface Branche {
  id: number;
  nom: string;
  localisation: string;
  pasteurResponsable: string;
  telephone: string;
  dateCreation: string;
  nombreFideles: number;
  statut: 'Active' | 'Inactive';
}

// Données de simulation
const branchesInitiales: Branche[] = [
  {
    id: 1,
    nom: "Ekiee",
    localisation: "derriere IPS",
    pasteurResponsable: "Pasteur Jean",
    telephone: "+243 81 123 4567",
    dateCreation: "15/01/2018",
    nombreFideles: 250,
    statut: 'Active'
  },
  {
    id: 2,
    nom: "Nvog mbi",
    localisation: "en face marcher",
    pasteurResponsable: "Pasteur Paul",
    telephone: "+243 82 234 5678",
    dateCreation: "20/05/2020",
    nombreFideles: 180,
    statut: 'Active'
  },
  {
    id: 3,
    nom: "Nkoabang",
    localisation: "carriere",
    pasteurResponsable: "Pasteur Samuel",
    telephone: "+243 83 345 6789",
    dateCreation: "10/09/2021",
    nombreFideles: 120,
    statut: 'Inactive'
  },
  {
    id: 4,
    nom: "Ngona",
    localisation: "vie continue",
    pasteurResponsable: "Pasteur David",
    telephone: "+243 84 456 7890",
    dateCreation: "05/03/2022",
    nombreFideles: 95,
    statut: 'Active'
  }
];

const fidelesInitiaux: Fidele[] = [
  { id: 1, nomComplet: "Jean Kabasele", telephone: "+243 81 111 1111", email: "jean@email.com", sexe: 'M', statut: 'Actif', dateAdhesion: "15/01/2020", brancheId: 1 },
  { id: 2, nomComplet: "Marie Lumumba", telephone: "+243 81 222 2222", email: "marie@email.com", sexe: 'F', statut: 'Actif', dateAdhesion: "20/02/2020", brancheId: 1 },
  { id: 3, nomComplet: "Paul Tshisekedi", telephone: "+243 81 333 3333", email: "paul@email.com", sexe: 'M', statut: 'Nouveau', dateAdhesion: "10/12/2023", brancheId: 1 },
  { id: 4, nomComplet: "Sarah Kabila", telephone: "+243 81 444 4444", email: "sarah@email.com", sexe: 'F', statut: 'Inactif', dateAdhesion: "05/06/2021", brancheId: 1 },
  { id: 5, nomComplet: "David Mobutu", telephone: "+243 82 555 5555", email: "david@email.com", sexe: 'M', statut: 'Actif', dateAdhesion: "15/03/2021", brancheId: 2 },
  { id: 6, nomComplet: "Esther Nkunda", telephone: "+243 82 666 6666", email: "esther@email.com", sexe: 'F', statut: 'Actif', dateAdhesion: "20/04/2021", brancheId: 2 },
  { id: 7, nomComplet: "Samuel Tshibangu", telephone: "+243 83 777 7777", email: "samuel@email.com", sexe: 'M', statut: 'Actif', dateAdhesion: "10/10/2021", brancheId: 3 },
  { id: 8, nomComplet: "Rachel Mbuyi", telephone: "+243 84 888 8888", email: "rachel@email.com", sexe: 'F', statut: 'Actif', dateAdhesion: "05/04/2022", brancheId: 4 },
  { id: 9, nomComplet: "Daniel Ndaye", telephone: "+243 84 999 9999", email: "daniel@email.com", sexe: 'M', statut: 'Nouveau', dateAdhesion: "15/11/2023", brancheId: 4 },
];

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branche[]>(branchesInitiales);
  const [fideles, setFideles] = useState<Fidele[]>(fidelesInitiaux);
  const [activeBranch, setActiveBranch] = useState<number>(branches[0]?.id || 0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const [nouveauFidele, setNouveauFidele] = useState<Partial<Fidele>>({
    nomComplet: "",
    telephone: "",
    email: "",
    sexe: 'M',
    statut: 'Nouveau',
    brancheId: activeBranch
  });
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);

  const fidelesBranche = fideles.filter(fidele => fidele.brancheId === activeBranch);

  const filteredFideles = fidelesBranche.filter(fidele =>
    fidele.nomComplet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fidele.telephone.includes(searchTerm) ||
    fidele.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const brancheActive = branches.find(b => b.id === activeBranch);

  const ajouterFidele = () => {
    if (!nouveauFidele.nomComplet?.trim()) {
      alert("Le nom complet est requis");
      return;
    }

    const nouveauFideleComplet: Fidele = {
      id: Math.max(...fideles.map(f => f.id)) + 1,
      nomComplet: nouveauFidele.nomComplet,
      telephone: nouveauFidele.telephone || "",
      email: nouveauFidele.email || "",
      sexe: nouveauFidele.sexe || 'M',
      statut: nouveauFidele.statut || 'Nouveau',
      dateAdhesion: new Date().toLocaleDateString('fr-FR'),
      brancheId: activeBranch
    };

    setFideles([...fideles, nouveauFideleComplet]);
    
    setBranches(branches.map(b => 
      b.id === activeBranch 
        ? { ...b, nombreFideles: b.nombreFideles + 1 }
        : b
    ));

    setNouveauFidele({
      nomComplet: "",
      telephone: "",
      email: "",
      sexe: 'M',
      statut: 'Nouveau',
      brancheId: activeBranch
    });
    setIsAddDialogOpen(false);
    
    alert("Fidèle ajouté avec succès !");
  };

  const supprimerFidele = (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce fidèle ?")) return;

    const fideleASupprimer = fideles.find(f => f.id === id);
    setFideles(fideles.filter(f => f.id !== id));
    
    if (fideleASupprimer) {
      setBranches(branches.map(b => 
        b.id === fideleASupprimer.brancheId 
          ? { ...b, nombreFideles: Math.max(0, b.nombreFideles - 1) }
          : b
      ));
    }
    
    alert("Fidèle supprimé avec succès !");
  };

  const changerStatutFidele = (id: number, nouveauStatut: Fidele['statut']) => {
    setFideles(fideles.map(f => 
      f.id === id ? { ...f, statut: nouveauStatut } : f
    ));
  };

  return (
    <div className="p-4 space-y-6">
      {branches.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <h2 className="text-2xl font-bold">Cher pasteur</h2>
          <p>Vous n'avez pas de branches</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">Branches</h2>
            <p className="text-gray-600">Gérez vos branches et leurs fidèles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Nombre de branches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Church className="h-4 w-4" />
                  <span className="text-xl font-bold">{branches.length}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fidèles totaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-xl font-bold">
                    {branches.reduce((acc, b) => acc + b.nombreFideles, 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Branches actives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-xl font-bold">
                    {branches.filter(b => b.statut === 'Active').length}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fidèles nouveaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span className="text-xl font-bold">
                    {fideles.filter(f => f.statut === 'Nouveau').length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue={branches[0]?.id.toString()} className="w-full">
            <TabsList className="w-full">
              {branches.map((branche) => (
                <TabsTrigger 
                  key={branche.id} 
                  value={branche.id.toString()}
                  onClick={() => setActiveBranch(branche.id)}
                  className="flex items-center gap-2"
                >
                  <Church className="h-4 w-4" />
                  {branche.nom}
                </TabsTrigger>
              ))}
            </TabsList>

            {branches.map((branche) => (
              <TabsContent key={branche.id} value={branche.id.toString()} className="overflow-auto max-w-full">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Church className="h-5 w-5" />
                          <CardTitle>{branche.nom}</CardTitle>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            <span>{branche.localisation}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-3 w-3" />
                            <span>Pasteur: {branche.pasteurResponsable}</span>
                          </div>
                          {/* <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            <span>{branche.telephone}</span>
                          </div> */}
                          {/* <div className="flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            <span>{branche.nombreFideles} fidèles • Créée le {branche.dateCreation}</span>
                          </div> */}
                        </div>
                      </div>
                      
                      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Ajouter un fidèle
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Ajouter un nouveau fidèle</DialogTitle>
                            <DialogDescription>
                              Ajoutez un fidèle à la branche {branche.nom}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Nom complet *</label>
                              <Input 
                                placeholder="Nom et prénom"
                                value={nouveauFidele.nomComplet || ""}
                                onChange={(e) => setNouveauFidele({...nouveauFidele, nomComplet: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Téléphone</label>
                              <Input 
                                placeholder="+243 00 000 0000"
                                value={nouveauFidele.telephone || ""}
                                onChange={(e) => setNouveauFidele({...nouveauFidele, telephone: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Email</label>
                              <Input 
                                placeholder="email@example.com"
                                value={nouveauFidele.email || ""}
                                onChange={(e) => setNouveauFidele({...nouveauFidele, email: e.target.value})}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Sexe</label>
                                <Select 
                                  value={nouveauFidele.sexe}
                                  onValueChange={(value: 'M' | 'F') => setNouveauFidele({...nouveauFidele, sexe: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="M">Masculin</SelectItem>
                                    <SelectItem value="F">Féminin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Statut</label>
                                <Select 
                                  value={nouveauFidele.statut}
                                  onValueChange={(value: Fidele['statut']) => setNouveauFidele({...nouveauFidele, statut: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Nouveau">Nouveau</SelectItem>
                                    <SelectItem value="Actif">Actif</SelectItem>
                                    <SelectItem value="Inactif">Inactif</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                              Annuler
                            </Button>
                            <Button onClick={ajouterFidele}>
                              Ajouter le fidèle
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <Input 
                        placeholder="Rechercher un fidèle..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                      />
                    </div>

                    <div className="border rounded">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nom complet</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Sexe</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Date d'adhésion</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredFideles.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8">
                                Aucun fidèle trouvé
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredFideles.map((fidele) => (
                              <TableRow key={fidele.id}>
                                <TableCell className="font-medium">
                                  {fidele.nomComplet}
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    {fidele.telephone && (
                                      <div className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        <span className="text-sm">{fidele.telephone}</span>
                                      </div>
                                    )}
                                    {fidele.email && (
                                      <div className="flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        <span className="text-sm">{fidele.email}</span>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {fidele.sexe === 'M' ? 'Homme' : 'Femme'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={
                                    fidele.statut === 'Actif' ? 'default' :
                                    fidele.statut === 'Inactif' ? 'destructive' : 'outline'
                                  }>
                                    {fidele.statut}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {fidele.dateAdhesion}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    {fidele.statut !== 'Actif' && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => changerStatutFidele(fidele.id, 'Actif')}
                                        title="Marquer comme Actif"
                                      >
                                        <UserCheck className="h-4 w-4" />
                                      </Button>
                                    )}
                                    {fidele.statut !== 'Inactif' && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => changerStatutFidele(fidele.id, 'Inactif')}
                                        title="Marquer comme Inactif"
                                      >
                                        <UserX className="h-4 w-4" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => supprimerFidele(fidele.id)}
                                      title="Supprimer"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-4 text-sm">
                      {filteredFideles.length} fidèle{filteredFideles.length > 1 ? 's' : ''} dans cette branche
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
}
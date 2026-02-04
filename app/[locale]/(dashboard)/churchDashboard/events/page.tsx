"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Plus, Search, Clock, MapPin, Users } from "lucide-react";

// Interfaces TypeScript
interface Evenement {
  id: number;
  titre: string;
  description: string;
  date: string; // Format: YYYY-MM-DD
  heure: string;
  lieu: string;
  type: 'Culte' | 'Réunion' | 'Événement spécial' | 'Formation' | 'Autre';
  branche: string;
  statut: 'À venir' | 'En cours' | 'Terminé' | 'Annulé';
}

// Données de simulation
const evenementsInitiaux: Evenement[] = [
  {
    id: 1,
    titre: "Culte dominical",
    description: "Culte de louange et d'adoration avec Sainte Cène",
    date: new Date().toISOString().split('T')[0], // Aujourd'hui
    heure: "10:00",
    lieu: "Église Centrale",
    type: "Culte",
    branche: "Toutes les branches",
    statut: "À venir"
  },
  {
    id: 2,
    titre: "Réunion de prière",
    description: "Réunion de prière pour les besoins de l'église",
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Demain
    heure: "19:00",
    lieu: "Salle de prière",
    type: "Réunion",
    branche: "Branche Centrale",
    statut: "À venir"
  },
  {
    id: 3,
    titre: "Formation des serviteurs",
    description: "Formation pour les nouveaux serviteurs d'accueil",
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Après-demain
    heure: "15:00",
    lieu: "Salle de formation",
    type: "Formation",
    branche: "Toutes les branches",
    statut: "À venir"
  },
  {
    id: 4,
    titre: "Mariage de Jean et Marie",
    description: "Célébration du mariage avec réception",
    date: "2024-02-15",
    heure: "14:00",
    lieu: "Église Centrale",
    type: "Événement spécial",
    branche: "Branche Centrale",
    statut: "À venir"
  },
  {
    id: 5,
    titre: "Concert de louange",
    description: "Soirée de louange avec groupe musical",
    date: "2024-02-20",
    heure: "18:00",
    lieu: "Auditorium principal",
    type: "Événement spécial",
    branche: "Toutes les branches",
    statut: "À venir"
  },
  {
    id: 6,
    titre: "Réunion des jeunes",
    description: "Rencontre des jeunes pour étude biblique",
    date: "2024-02-08",
    heure: "17:00",
    lieu: "Salle des jeunes",
    type: "Réunion",
    branche: "Branche Sud",
    statut: "À venir"
  }
];

export default function EvenementsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [evenements, setEvenements] = useState<Evenement[]>(evenementsInitiaux);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  
  // État pour le nouvel événement
  const [nouvelEvenement, setNouvelEvenement] = useState<Partial<Evenement>>({
    titre: "",
    description: "",
    date: selectedDate,
    heure: "10:00",
    lieu: "",
    type: "Culte",
    branche: "Toutes les branches",
    statut: "À venir"
  });

  // Obtenir la date actuelle
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  // Obtenir le premier jour du mois
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startingDay = firstDayOfMonth.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
  
  // Obtenir le nombre de jours dans le mois
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Noms des mois
  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  
  // Noms des jours
  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  // Filtrer les événements
  const evenementsFiltres = searchTerm 
    ? evenements.filter(evenement =>
        evenement.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evenement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evenement.lieu.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : selectedDate
    ? evenements.filter(evenement => evenement.date === selectedDate)
    : evenements;

  // Obtenir les événements pour une date spécifique
  const getEvenementsPourDate = (date: string) => {
    return evenements.filter(e => e.date === date);
  };

  // Formater la date pour l'affichage
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Ajouter un événement
  const ajouterEvenement = () => {
    if (!nouvelEvenement.titre?.trim() || !nouvelEvenement.date) {
      alert("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    const nouvelEvent: Evenement = {
      id: evenements.length + 1,
      titre: nouvelEvenement.titre,
      description: nouvelEvenement.description || "",
      date: nouvelEvenement.date,
      heure: nouvelEvenement.heure || "10:00",
      lieu: nouvelEvenement.lieu || "",
      type: nouvelEvenement.type || "Culte",
      branche: nouvelEvenement.branche || "Toutes les branches",
      statut: "À venir"
    };

    setEvenements([...evenements, nouvelEvent]);
    setNouvelEvenement({
      titre: "",
      description: "",
      date: selectedDate,
      heure: "10:00",
      lieu: "",
      type: "Culte",
      branche: "Toutes les branches",
      statut: "À venir"
    });
    setIsDialogOpen(false);
    
    alert("Événement ajouté avec succès !");
  };

  // Gérer le clic sur une date du calendrier
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
    setNouvelEvenement(prev => ({
      ...prev,
      date: date
    }));
  };

  // Rendu du calendrier
  const renderCalendar = () => {
    const days = [];
    
    // Jours vides au début du mois
    for (let i = 0; i < startingDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 p-1 border border-gray-100 bg-gray-50"></div>
      );
    }
    
    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dateEvenements = getEvenementsPourDate(dateStr);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;
      const isSelected = selectedDate === dateStr;
      
      days.push(
        <div 
          key={day}
          onClick={() => handleDateClick(dateStr)}
          className={`h-24 p-1 border cursor-pointer transition-colors hover:bg-gray-50 ${
            isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
          } ${isSelected ? 'bg-blue-100 border-blue-300' : ''}`}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
              {day}
            </span>
            {isToday && (
              <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            )}
          </div>
          
          {/* Événements pour ce jour */}
          <div className="space-y-1 max-h-16 overflow-y-auto">
            {dateEvenements.slice(0, 2).map(event => (
              <div 
                key={event.id}
                className="text-xs p-1 rounded truncate"
                style={{
                  backgroundColor: getEventColor(event.type),
                  color: 'white'
                }}
                title={event.titre}
              >
                {event.heure} - {event.titre}
              </div>
            ))}
            {dateEvenements.length > 2 && (
              <div className="text-xs text-gray-500 text-center">
                +{dateEvenements.length - 2} autres
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  // Couleur selon le type d'événement
  const getEventColor = (type: Evenement['type']) => {
    switch(type) {
      case 'Culte': return '#10B981'; // vert
      case 'Réunion': return '#3B82F6'; // bleu
      case 'Événement spécial': return '#8B5CF6'; // violet
      case 'Formation': return '#F59E0B'; // jaune
      default: return '#6B7280'; // gris
    }
  };

  return (
    <div className="w-full p-4 space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold">Cher Pasteur Andy</h2>
        <p className="text-gray-600">
          Vous pouvez voir et gérer les événements de votre église et ses différentes branches
        </p>
      </div>

      {/* Barre de recherche et bouton */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un événement..."
            className="pl-10"
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedDate("");
              setNouvelEvenement(prev => ({
                ...prev,
                date: new Date().toISOString().split('T')[0]
              }));
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un événement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedDate ? `Ajouter un événement pour le ${formatDate(selectedDate)}` : 'Ajouter un nouvel événement'}
              </DialogTitle>
              <DialogDescription>
                Remplissez les informations de l'événement
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Titre *</label>
                  <Input 
                    placeholder="Titre de l'événement"
                    value={nouvelEvenement.titre || ""}
                    onChange={(e) => setNouvelEvenement({...nouvelEvenement, titre: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date *</label>
                  <Input 
                    type="date"
                    value={nouvelEvenement.date || ""}
                    onChange={(e) => setNouvelEvenement({...nouvelEvenement, date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Heure *</label>
                  <Input 
                    type="time"
                    value={nouvelEvenement.heure || "10:00"}
                    onChange={(e) => setNouvelEvenement({...nouvelEvenement, heure: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lieu</label>
                  <Input 
                    placeholder="Lieu de l'événement"
                    value={nouvelEvenement.lieu || ""}
                    onChange={(e) => setNouvelEvenement({...nouvelEvenement, lieu: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type *</label>
                  <Select 
                    value={nouvelEvenement.type}
                    onValueChange={(value: Evenement['type']) => setNouvelEvenement({...nouvelEvenement, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Culte">Culte</SelectItem>
                      <SelectItem value="Réunion">Réunion</SelectItem>
                      <SelectItem value="Événement spécial">Événement spécial</SelectItem>
                      <SelectItem value="Formation">Formation</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Branche</label>
                  <Select 
                    value={nouvelEvenement.branche}
                    onValueChange={(value: string) => setNouvelEvenement({...nouvelEvenement, branche: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Toutes les branches">Toutes les branches</SelectItem>
                      <SelectItem value="Branche Centrale">Branche Centrale</SelectItem>
                      <SelectItem value="Branche Sud">Branche Sud</SelectItem>
                      <SelectItem value="Branche Nord">Branche Nord</SelectItem>
                      <SelectItem value="Branche Est">Branche Est</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  placeholder="Description détaillée de l'événement..."
                  value={nouvelEvenement.description || ""}
                  onChange={(e) => setNouvelEvenement({...nouvelEvenement, description: e.target.value})}
                  className="min-h-24"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={ajouterEvenement}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter l'événement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contenu principal */}
      {searchTerm ? (
        // Vue recherche
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            Résultats pour "{searchTerm}"
          </h3>
          
          {evenementsFiltres.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun événement trouvé pour "{searchTerm}"</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {evenementsFiltres.map(event => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{event.titre}</CardTitle>
                      <Badge 
                        style={{ backgroundColor: getEventColor(event.type) }}
                        className="text-white"
                      >
                        {event.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarDays className="h-4 w-4 text-gray-500" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{event.heure}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{event.lieu}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{event.branche}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : selectedDate ? (
        // Vue événements d'une date spécifique
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              Événements du {formatDate(selectedDate)}
            </h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedDate("")}
            >
              Retour au calendrier
            </Button>
          </div>
          
          {evenementsFiltres.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun événement prévu pour cette date</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un événement
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {evenementsFiltres.map(event => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{event.titre}</CardTitle>
                      <Badge 
                        style={{ backgroundColor: getEventColor(event.type) }}
                        className="text-white"
                      >
                        {event.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Heure:</span>
                          <span>{event.heure}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Lieu:</span>
                          <span>{event.lieu}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Branche:</span>
                          <span>{event.branche}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Description:</p>
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Vue calendrier
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#10B981' }}></div>
                <span className="text-sm">Culte</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#3B82F6' }}></div>
                <span className="text-sm">Réunion</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#8B5CF6' }}></div>
                <span className="text-sm">Événement spécial</span>
              </div>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-4">
              {/* En-tête des jours */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center font-medium text-gray-700 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Grille du calendrier */}
              <div className="grid grid-cols-7 gap-1 border rounded-lg overflow-hidden">
                {renderCalendar()}
              </div>
              
              {/* Légende */}
              <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                <p>Cliquez sur un jour pour voir les événements ou ajouter un nouvel événement.</p>
                <p className="mt-1">Aujourd'hui est mis en évidence en bleu.</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Événements du mois */}
          <Card>
            <CardHeader>
              <CardTitle>Événements du mois</CardTitle>
            </CardHeader>
            <CardContent>
              {evenements.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Aucun événement prévu ce mois-ci
                </p>
              ) : (
                <div className="space-y-3">
                  {evenements
                    .filter(event => {
                      const eventDate = new Date(event.date);
                      return eventDate.getMonth() === currentMonth && 
                             eventDate.getFullYear() === currentYear;
                    })
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map(event => (
                      <div key={event.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div 
                          className="h-12 w-12 rounded-lg flex flex-col items-center justify-center text-white font-bold"
                          style={{ backgroundColor: getEventColor(event.type) }}
                        >
                          <div className="text-sm">{new Date(event.date).getDate()}</div>
                          <div className="text-xs">
                            {monthNames[new Date(event.date).getMonth()].slice(0, 3)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold">{event.titre}</h4>
                            <Badge variant="outline">{event.statut}</Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.heure}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.lieu}
                            </span>
                            <span>{event.branche}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
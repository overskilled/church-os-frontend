"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Plus, 
  Trash, 
  Calendar, 
  User, 
  Eye, 
  Send, 
  BookOpen, 
  Mic, 
  MicOff,
  Play,
  StopCircle,
  Download,
  Pause
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Interfaces TypeScript
interface Annonce {
  id: number;
  titre: string;
  destinataire: string;
  contenu: string;
  verset: string;
  date: string;
  auteur: string;
  statut: 'Publiée' | 'Brouillon' | 'Archivée';
  type: 'annonce' | 'sermon';
  chapitre?: string;
  theme?: string;
  duree?: string;
  audioUrl?: string;
  audioDuration?: string;
}

interface NouvelleAnnonce {
  titre: string;
  destinataire: string;
  contenu: string;
  verset: string;
  type: 'annonce' | 'sermon';
  chapitre?: string;
  theme?: string;
  duree?: string;
  audioUrl?: string;
  audioDuration?: string;
}

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
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
    type: "annonce"
  },
  {
    id: 2,
    titre: "La puissance de la prière",
    destinataire: "Tous les membres",
    contenu: "Sermon sur l'importance de la prière constante dans la vie du croyant",
    verset: "Philippiens 4:6-7",
    date: "14/12/2023",
    auteur: "Pasteur Andy",
    statut: "Publiée",
    type: "sermon",
    chapitre: "Philippiens 4",
    theme: "La prière",
    duree: "45 min",
    audioUrl: "https://example.com/sermon1.mp3",
    audioDuration: "45:20"
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
    type: "annonce"
  },
  {
    id: 4,
    titre: "L'amour de Dieu",
    destinataire: "Tous les fidèles",
    contenu: "Sermon sur la grandeur de l'amour de Dieu pour l'humanité",
    verset: "Jean 3:16",
    date: "12/12/2023",
    auteur: "Pasteur Andy",
    statut: "Publiée",
    type: "sermon",
    chapitre: "Jean 3",
    theme: "L'amour divin",
    duree: "50 min",
    audioUrl: "https://example.com/sermon2.mp3",
    audioDuration: "50:15"
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
    type: "annonce"
  },
];

export default function AnnoncesPage() {
  // États pour la gestion des annonces
  const [annonces, setAnnonces] = useState<Annonce[]>(annoncesInitiales);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterType, setFilterType] = useState<'all' | 'annonce' | 'sermon'>('all');
  
  // États pour la création
  const [newAnnonce, setNewAnnonce] = useState<NouvelleAnnonce>({
    titre: "",
    destinataire: "",
    contenu: "",
    verset: "",
    type: "annonce",
    chapitre: "",
    theme: "",
    duree: "",
    audioUrl: "",
    audioDuration: ""
  });
  
  // États pour l'édition
  const [editingAnnonce, setEditingAnnonce] = useState<Annonce | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  
  // États pour la Bible
  const [selectedBibleVerse, setSelectedBibleVerse] = useState<string>("");
  const [isBibleDialogOpen, setIsBibleDialogOpen] = useState<boolean>(false);
  const [bibleSearch, setBibleSearch] = useState<string>("");
  
  // États pour l'enregistrement audio
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    mediaRecorder: null,
    audioChunks: []
  });

  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filtrer les annonces
  const filteredAnnonces = annonces.filter(annonce => {
    const matchesSearch = annonce.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annonce.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annonce.destinataire.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (annonce.theme && annonce.theme.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || annonce.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Fonction pour formater le temps d'enregistrement
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Démarrer l'enregistrement
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioPreview(audioUrl);
        
        // Mettre à jour le formulaire avec l'audio enregistré
        const duration = formatTime(recordingState.recordingTime);
        setNewAnnonce(prev => ({
          ...prev,
          audioUrl: audioUrl,
          audioDuration: duration,
          duree: duration
        }));
      };

      mediaRecorder.start();
      
      setRecordingState({
        isRecording: true,
        isPaused: false,
        recordingTime: 0,
        mediaRecorder,
        audioChunks
      });

      // Timer pour le temps d'enregistrement
      timerRef.current = setInterval(() => {
        setRecordingState(prev => ({
          ...prev,
          recordingTime: prev.recordingTime + 1
        }));
      }, 1000);

    } catch (error) {
      console.error("Erreur lors de l'accès au microphone:", error);
      alert("Impossible d'accéder au microphone. Veuillez vérifier vos permissions.");
    }
  };

  // Arrêter l'enregistrement
  const stopRecording = () => {
    if (recordingState.mediaRecorder && recordingState.isRecording) {
      recordingState.mediaRecorder.stop();
      
      // Arrêter tous les tracks du stream
      recordingState.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      setRecordingState(prev => ({
        ...prev,
        isRecording: false,
        isPaused: false
      }));
    }
  };

  // Pause/reprise de l'enregistrement
  const togglePauseRecording = () => {
    if (recordingState.mediaRecorder) {
      if (recordingState.isPaused) {
        recordingState.mediaRecorder.resume();
        // Redémarrer le timer
        timerRef.current = setInterval(() => {
          setRecordingState(prev => ({
            ...prev,
            recordingTime: prev.recordingTime + 1
          }));
        }, 1000);
      } else {
        recordingState.mediaRecorder.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      
      setRecordingState(prev => ({
        ...prev,
        isPaused: !prev.isPaused
      }));
    }
  };

  // Annuler l'enregistrement
  const cancelRecording = () => {
    if (recordingState.mediaRecorder && recordingState.isRecording) {
      recordingState.mediaRecorder.stop();
      recordingState.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      setRecordingState({
        isRecording: false,
        isPaused: false,
        recordingTime: 0,
        mediaRecorder: null,
        audioChunks: []
      });
      
      setAudioPreview(null);
    }
  };

  // Jouer l'audio de prévisualisation
  const playPreview = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recordingState.mediaRecorder && recordingState.isRecording) {
        recordingState.mediaRecorder.stop();
        recordingState.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Fonction pour ajouter une annonce/sermon
  const ajouterAnnonce = (): void => {
    if (!newAnnonce.titre.trim()) {
      alert("Veuillez ajouter un titre !");
      return;
    }

    if (newAnnonce.type === 'sermon' && !audioPreview && !newAnnonce.audioUrl) {
      alert("Veuillez enregistrer un audio pour le sermon !");
      return;
    }

    const nouvelleAnnonce: Annonce = {
      id: annonces.length + 1,
      titre: newAnnonce.titre,
      destinataire: newAnnonce.destinataire || "Tous les fidèles",
      contenu: newAnnonce.contenu,
      verset: selectedBibleVerse || newAnnonce.verset,
      date: new Date().toLocaleDateString('fr-FR'),
      auteur: "Pasteur Andy",
      statut: "Brouillon",
      type: newAnnonce.type,
      chapitre: newAnnonce.chapitre || undefined,
      theme: newAnnonce.theme || undefined,
      duree: newAnnonce.duree || undefined,
      audioUrl: audioPreview || newAnnonce.audioUrl || undefined,
      audioDuration: newAnnonce.audioDuration || undefined
    };

    setAnnonces([nouvelleAnnonce, ...annonces]);
    setNewAnnonce({ 
      titre: "", 
      destinataire: "", 
      contenu: "", 
      verset: "", 
      type: "annonce",
      chapitre: "",
      theme: "",
      duree: "",
      audioUrl: "",
      audioDuration: ""
    });
    setSelectedBibleVerse("");
    setAudioPreview(null);
    
    alert(`${newAnnonce.type === 'sermon' ? 'Sermon' : 'Annonce'} ajouté(e) avec succès !`);
  };

  // Fonction pour supprimer une annonce/sermon
  const supprimerAnnonce = (id: number): void => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      const annoncesApresSuppression = annonces.filter(annonce => annonce.id !== id);
      setAnnonces(annoncesApresSuppression);
      alert("Élément supprimé avec succès !");
    }
  };

  // Fonction pour éditer une annonce/sermon
  const editerAnnonce = (annonce: Annonce): void => {
    setEditingAnnonce({...annonce});
    setSelectedBibleVerse(annonce.verset || "");
    setIsEditDialogOpen(true);
  };

  // Fonction pour sauvegarder les modifications
  const sauvegarderModifications = (): void => {
    if (!editingAnnonce?.titre?.trim()) {
      alert("Veuillez ajouter un titre !");
      return;
    }

    const annoncesModifiees = annonces.map(annonce =>
      annonce.id === editingAnnonce?.id ? { ...editingAnnonce, verset: selectedBibleVerse } : annonce
    );

    setAnnonces(annoncesModifiees);
    setEditingAnnonce(null);
    setSelectedBibleVerse("");
    setIsEditDialogOpen(false);
    
    alert("Élément modifié avec succès !");
  };

  // Fonction pour publier une annonce/sermon
  const publierAnnonce = (id: number): void => {
    const annoncesPubliees = annonces.map(annonce =>
      annonce.id === id ? { ...annonce, statut: "Publiée" } : annonce
    );
    setAnnonces(annoncesPubliees);
    alert("Élément publié avec succès !");
  };

  // Fonction pour rechercher un verset (simulée)
  const searchBibleVerse = async (): Promise<void> => {
    try {
      setSelectedBibleVerse(`${bibleSearch || "Jean 3:16"} - Car Dieu a tant aimé le monde qu'il a donné son Fils unique...`);
      setIsBibleDialogOpen(false);
      alert("Verset trouvé et ajouté !");
    } catch (error) {
      alert("Erreur lors de la recherche du verset.");
      setSelectedBibleVerse("Jean 3:16 - Car Dieu a tant aimé le monde qu'il a donné son Fils unique...");
      setIsBibleDialogOpen(false);
    }
  };

  // Fonction pour prévisualiser une annonce/sermon
  const previsualiserAnnonce = (annonce: Annonce): void => {
    const preview = `
📢 ${annonce.type === 'sermon' ? 'SERMON' : 'ANNONCE'} : ${annonce.titre}
👥 Destinataires: ${annonce.destinataire}
📅 Date: ${annonce.date}
✍️ Auteur: ${annonce.auteur}
📖 Verset: ${annonce.verset || "Aucun"}
${annonce.type === 'sermon' ? `📚 Chapitre: ${annonce.chapitre}\n🎯 Thème: ${annonce.theme}\n⏱️ Durée: ${annonce.duree}\n🎤 Audio: ${annonce.audioUrl ? 'Disponible' : 'Non disponible'}` : ''}
📝 Contenu: ${annonce.contenu}
✅ Statut: ${annonce.statut}
    `;
    alert(`Prévisualisation:\n\n${preview}`);
  };

  // Options pour les destinataires
  const destinatairesOptions = [
    "Tous les fidèles",
    "Tous les membres",
    "Toutes les branches",
    "Département spécifique",
  ] as const;

  // Fonction pour obtenir la couleur du badge selon le statut
  const getBadgeClass = (statut: Annonce['statut']): string => {
    switch (statut) {
      case 'Publiée':
        return 'bg-green-500 hover:bg-green-600';
      case 'Brouillon':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Archivée':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="p-4 space-y-8">
      <div className="flex flex-col">
        <h2 className="text-3xl">Cher Pasteur Andy</h2>
        <p className="text-gray-600">
          Vous pouvez faire des annonces et sermons, les modifier, ainsi que les supprimer
        </p>
      </div>
      
      {/* Barre de recherche, filtres et boutons d'ajout */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <Input 
            placeholder="Rechercher..." 
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Select value={filterType} onValueChange={(value: 'all' | 'annonce' | 'sermon') => setFilterType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="annonce">Annonces</SelectItem>
              <SelectItem value="sermon">Sermons</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Mic className="h-4 w-4" />
                Nouveau sermon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl justify-start text-left overflow-auto min-h-screen">
              <DialogHeader className="text-left">
                <DialogTitle className="text-left">Créer un sermon audio</DialogTitle>
                <DialogDescription className="text-left">
                  Enregistrez un sermon audio pour votre communauté
                </DialogDescription>
              </DialogHeader>
                
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 items-center gap-4">
                  <p className="font-medium">Type *</p>
                  <Select 
                    value="sermon"
                    disabled
                  >
                    <SelectTrigger>
                      <SelectValue>Sermon audio</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sermon">Sermon audio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 items-center gap-4">
                  <p className="font-medium">Titre du sermon *</p>
                  <Input 
                    placeholder="Titre du sermon" 
                    value={newAnnonce.titre}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setNewAnnonce({...newAnnonce, titre: e.target.value, type: 'sermon'})
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chapitre</label>
                    <Input 
                      placeholder="Ex: Jean 3"
                      value={newAnnonce.chapitre || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setNewAnnonce({...newAnnonce, chapitre: e.target.value})
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Thème</label>
                    <Input 
                      placeholder="Ex: L'amour de Dieu"
                      value={newAnnonce.theme || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setNewAnnonce({...newAnnonce, theme: e.target.value})
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Durée estimée</label>
                    <Input 
                      placeholder="Ex: 45 min"
                      value={newAnnonce.duree || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setNewAnnonce({...newAnnonce, duree: e.target.value})
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Destinataire</label>
                    <Select 
                      value={newAnnonce.destinataire}
                      onValueChange={(value: string) => setNewAnnonce({...newAnnonce, destinataire: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le destinataire" />
                      </SelectTrigger>
                      <SelectContent>
                        {destinatairesOptions.map((el, index) => (
                          <SelectItem key={index} value={el}>
                            {el}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Enregistrement audio */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mic className="h-5 w-5" />
                      <p className="font-medium">Enregistrement audio *</p>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {recordingState.isRecording && (
                        <span className="animate-pulse text-red-500">● Enregistrement en cours...</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Contrôles d'enregistrement */}
                    <div className="flex flex-col items-center gap-4">
                      {!recordingState.isRecording ? (
                        <>
                          {!audioPreview ? (
                            <Button 
                              onClick={startRecording}
                              className="gap-2 w-full"
                              variant="destructive"
                            >
                              <Mic className="h-4 w-4" />
                              Démarrer l'enregistrement
                            </Button>
                          ) : (
                            <div className="w-full space-y-4">
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Play className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium">Audio enregistré</p>
                                    <p className="text-sm text-gray-500">Durée: {newAnnonce.audioDuration}</p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={playPreview}
                                >
                                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                </Button>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={startRecording}
                                  className="flex-1"
                                >
                                  <Mic className="h-4 w-4 mr-2" />
                                  Réenregistrer
                                </Button>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full space-y-4">
                          {/* Timer d'enregistrement */}
                          <div className="text-center">
                            <div className="text-3xl font-bold text-red-600">
                              {formatTime(recordingState.recordingTime)}
                            </div>
                            <p className="text-sm text-gray-500">Temps d'enregistrement</p>
                          </div>
                          
                          {/* Contrôles pendant l'enregistrement */}
                          <div className="flex justify-center gap-4">
                            <Button
                              variant={recordingState.isPaused ? "default" : "outline"}
                              onClick={togglePauseRecording}
                              size="lg"
                            >
                              {recordingState.isPaused ? (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Reprendre
                                </>
                              ) : (
                                <>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pause
                                </>
                              )}
                            </Button>
                            
                            <Button
                              variant="destructive"
                              onClick={stopRecording}
                              size="lg"
                            >
                              <StopCircle className="h-4 w-4 mr-2" />
                              Arrêter
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            onClick={cancelRecording}
                            className="w-full"
                          >
                            Annuler l'enregistrement
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <audio 
                      ref={audioRef}
                      src={audioPreview || undefined}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Insertion de verset biblique */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      <p className="font-medium">Verset biblique principal *</p>
                    </div>
                    
                    <Dialog open={isBibleDialogOpen} onOpenChange={setIsBibleDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          {selectedBibleVerse ? "Changer" : "Ajouter un verset"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="justify-start text-left">
                        <DialogHeader className="text-left">
                          <DialogTitle className="text-left">Rechercher un verset</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input 
                            placeholder="Ex: Jean 3:16, Psaume 23:1"
                            value={bibleSearch}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBibleSearch(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button onClick={searchBibleVerse} className="flex-1">
                              Rechercher
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => {
                                setSelectedBibleVerse("Jean 3:16 - Car Dieu a tant aimé le monde qu'il a donné son Fils unique...");
                                setIsBibleDialogOpen(false);
                              }}
                            >
                              Utiliser un exemple
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {selectedBibleVerse && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">Verset sélectionné:</p>
                          <p className="italic mt-1">{selectedBibleVerse}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedBibleVerse("")}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes du sermon */}
                <div className="space-y-2">
                  <p className="font-medium">Notes du sermon (optionnel)</p>
                  <Textarea 
                    className="min-h-24" 
                    placeholder="Notes importantes, points principaux, références..."
                    value={newAnnonce.contenu}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      setNewAnnonce({...newAnnonce, contenu: e.target.value})
                    }
                  />
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => {
                    setNewAnnonce({ 
                      titre: "", 
                      destinataire: "", 
                      contenu: "", 
                      verset: "", 
                      type: "annonce",
                      chapitre: "",
                      theme: "",
                      duree: "",
                      audioUrl: "",
                      audioDuration: ""
                    });
                    setSelectedBibleVerse("");
                    setAudioPreview(null);
                  }}>
                    Annuler
                  </Button>
                  <Button onClick={ajouterAnnonce} disabled={recordingState.isRecording}>
                    <Mic className="h-4 w-4 mr-2" />
                    Créer le sermon
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle annonce
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl justify-start text-left">
              <DialogHeader className="text-left">
                <DialogTitle className="text-left">Créer une annonce</DialogTitle>
                <DialogDescription className="text-left">
                  Ajoutez une annonce pour votre communauté
                </DialogDescription>
              </DialogHeader>
                
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 items-center gap-4">
                  <p className="font-medium">Destinataire</p>
                  <Select 
                    value={newAnnonce.destinataire}
                    onValueChange={(value: string) => setNewAnnonce({...newAnnonce, destinataire: value, type: 'annonce'})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le destinataire" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinatairesOptions.map((el, index) => (
                        <SelectItem key={index} value={el}>
                          {el}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 items-center gap-4">
                  <p className="font-medium">Titre *</p>
                  <Input 
                    placeholder="Titre de l'annonce" 
                    value={newAnnonce.titre}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setNewAnnonce({...newAnnonce, titre: e.target.value, type: 'annonce'})
                    }
                  />
                </div>

                {/* Insertion de verset biblique */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      <p className="font-medium">Verset biblique (optionnel)</p>
                    </div>
                    
                    <Dialog open={isBibleDialogOpen} onOpenChange={setIsBibleDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          {selectedBibleVerse ? "Changer" : "Ajouter un verset"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="justify-start text-left">
                        <DialogHeader className="text-left">
                          <DialogTitle className="text-left">Rechercher un verset</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input 
                            placeholder="Ex: Jean 3:16, Psaume 23:1"
                            value={bibleSearch}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBibleSearch(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button onClick={searchBibleVerse} className="flex-1">
                              Rechercher
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => {
                                setSelectedBibleVerse("Jean 3:16 - Car Dieu a tant aimé le monde qu'il a donné son Fils unique...");
                                setIsBibleDialogOpen(false);
                              }}
                            >
                              Utiliser un exemple
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {selectedBibleVerse && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">Verset sélectionné:</p>
                          <p className="italic mt-1">{selectedBibleVerse}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedBibleVerse("")}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contenu de l'annonce */}
                <div className="space-y-2">
                  <p className="font-medium">Contenu *</p>
                  <Textarea 
                    className="min-h-32" 
                    placeholder="Détails de l'annonce..."
                    value={newAnnonce.contenu}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      setNewAnnonce({...newAnnonce, contenu: e.target.value})
                    }
                  />
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => {
                    setNewAnnonce({ 
                      titre: "", 
                      destinataire: "", 
                      contenu: "", 
                      verset: "", 
                      type: "annonce",
                      chapitre: "",
                      theme: "",
                      duree: "",
                      audioUrl: "",
                      audioDuration: ""
                    });
                    setSelectedBibleVerse("");
                  }}>
                    Annuler
                  </Button>
                  <Button onClick={ajouterAnnonce}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer l'annonce
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tableau des annonces/sermons */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Titre</TableHead>
              <TableHead className="font-semibold">Destinataire</TableHead>
              <TableHead className="font-semibold">Détails</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Statut</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnnonces.map((annonce) => (
              <TableRow key={annonce.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center justify-center">
                    <Badge variant={annonce.type === 'sermon' ? 'default' : 'outline'} className="whitespace-nowrap">
                      {annonce.type === 'sermon' ? (
                        <>
                          <Mic className="h-3 w-3 mr-1" />
                          Sermon
                        </>
                      ) : 'Annonce'}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <p className="font-semibold">{annonce.titre}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{annonce.contenu}</p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {annonce.destinataire}
                  </Badge>
                </TableCell>
                <TableCell>
                  {annonce.type === 'sermon' ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-3 w-3 text-gray-500" />
                        <span className="text-xs">{annonce.chapitre || "Non spécifié"}</span>
                      </div>
                      {annonce.theme && (
                        <div className="text-xs text-gray-600">Thème: {annonce.theme}</div>
                      )}
                      {annonce.duree && (
                        <div className="text-xs text-gray-600">Durée: {annonce.duree}</div>
                      )}
                      {annonce.audioUrl && (
                        <div className="flex items-center gap-1 mt-1">
                          <Mic className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600">Audio disponible</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {annonce.verset && (
                        <>
                          <BookOpen className="h-3 w-3 text-gray-500" />
                          <span className="text-xs italic">{annonce.verset.split(' - ')[0]}</span>
                        </>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {annonce.date}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getBadgeClass(annonce.statut)}>
                    {annonce.statut}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => previsualiserAnnonce(annonce)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => editerAnnonce(annonce)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {annonce.statut === 'Brouillon' && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => publierAnnonce(annonce.id)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => supprimerAnnonce(annonce.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-muted/50">
            <TableRow>
              <TableCell colSpan={6} className="font-semibold">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Total des éléments
                </div>
              </TableCell>
              <TableCell colSpan={1} className="text-right font-bold text-lg">
                {filteredAnnonces.length} élément{filteredAnnonces.length > 1 ? 's' : ''}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Dialog d'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl justify-start text-left">
          <DialogHeader className="text-left">
            <DialogTitle className="text-left">Modifier l'élément</DialogTitle>
            <DialogDescription className="text-left">
              Modifiez les détails {editingAnnonce?.type === 'sermon' ? 'du sermon' : "de l'annonce"}
            </DialogDescription>
          </DialogHeader>
          
          {editingAnnonce && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <p className="font-medium">Destinataire</p>
                <Select 
                  value={editingAnnonce.destinataire}
                  onValueChange={(value: string) => setEditingAnnonce({...editingAnnonce, destinataire: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {destinatairesOptions.map((el) => (
                      <SelectItem key={el} value={el}>{el}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 items-center gap-4">
                <p className="font-medium">Titre *</p>
                <Input 
                  value={editingAnnonce.titre}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setEditingAnnonce({...editingAnnonce, titre: e.target.value})
                  }
                />
              </div>

              {editingAnnonce.type === 'sermon' && (
                <div className="grid grid-cols-3 gap-4 overflow-auto min-h-screen">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chapitre</label>
                    <Input 
                      value={editingAnnonce.chapitre || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setEditingAnnonce({...editingAnnonce, chapitre: e.target.value})
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Thème</label>
                    <Input 
                      value={editingAnnonce.theme || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setEditingAnnonce({...editingAnnonce, theme: e.target.value})
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Durée</label>
                    <Input 
                      value={editingAnnonce.duree || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setEditingAnnonce({...editingAnnonce, duree: e.target.value})
                      }
                    />
                  </div>
                </div>
              )}

              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <p className="font-medium">Verset biblique</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedBibleVerse("Jean 3:16 - Car Dieu a tant aimé le monde...")}
                  >
                    {selectedBibleVerse ? "Changer" : "Ajouter un verset"}
                  </Button>
                </div>
                {selectedBibleVerse && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">Verset sélectionné:</p>
                        <p className="italic mt-1">{selectedBibleVerse}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedBibleVerse("")}>
                        Supprimer
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="font-medium">Contenu *</p>
                <Textarea 
                  className="min-h-32" 
                  value={editingAnnonce.contenu}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                    setEditingAnnonce({...editingAnnonce, contenu: e.target.value})
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={sauvegarderModifications}>
                  <Edit className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
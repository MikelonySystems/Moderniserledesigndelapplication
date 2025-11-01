import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Upload, FileText, Loader2, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface AddAttestationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ExtractedData {
  siret: string;
  nomEmployeur: string;
  nom: string;
  prenom: string;
  debutContrat: string;
  finContrat: string;
  nombreJours: string;
  nombreHeures: string;
  salaireBrut: string;
  annexe: string;
}

interface PageData {
  pageNumber: number;
  extractedData: ExtractedData;
  fileUrl: string;
}

type PageStatus = 'pending' | 'added' | 'skipped';

export function AddAttestationDialog({ open, onOpenChange }: AddAttestationDialogProps) {
  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Gestion multi-pages
  const [pages, setPages] = useState<PageData[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageStatuses, setPageStatuses] = useState<Map<number, PageStatus>>(new Map());

  // États pour les champs modifiables de la page courante
  const [siret, setSiret] = useState("");
  const [nomEmployeur, setNomEmployeur] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [debutContrat, setDebutContrat] = useState("");
  const [finContrat, setFinContrat] = useState("");
  const [nombreJours, setNombreJours] = useState("");
  const [nombreHeures, setNombreHeures] = useState("");
  const [salaireBrut, setSalaireBrut] = useState("");
  const [annexe, setAnnexe] = useState("");

  const currentPage = pages[currentPageIndex];
  const totalPages = pages.length;
  const currentStatus = pageStatuses.get(currentPageIndex) || 'pending';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsProcessing(true);

      // TODO: Remplacer par votre appel API réel qui sépare les pages et fait l'OCR
      setTimeout(() => {
        // Simulation de 3 pages extraites
        const mockPages: PageData[] = [
          {
            pageNumber: 1,
            fileUrl: URL.createObjectURL(file),
            extractedData: {
              siret: "12345678901234",
              nomEmployeur: "Théâtre National de Paris",
              nom: "Dupont",
              prenom: "Jean",
              debutContrat: "2025-01-15",
              finContrat: "2025-01-20",
              nombreJours: "5",
              nombreHeures: "40",
              salaireBrut: "2400.00",
              annexe: "8",
            }
          },
          {
            pageNumber: 2,
            fileUrl: URL.createObjectURL(file),
            extractedData: {
              siret: "98765432109876",
              nomEmployeur: "Opéra de Lyon",
              nom: "Dupont",
              prenom: "Jean",
              debutContrat: "2025-02-01",
              finContrat: "2025-02-05",
              nombreJours: "4",
              nombreHeures: "32",
              salaireBrut: "1920.00",
              annexe: "8",
            }
          },
          {
            pageNumber: 3,
            fileUrl: URL.createObjectURL(file),
            extractedData: {
              siret: "11223344556677",
              nomEmployeur: "Zénith de Lille",
              nom: "Dupont",
              prenom: "Jean",
              debutContrat: "2025-02-10",
              finContrat: "2025-02-12",
              nombreJours: "3",
              nombreHeures: "24",
              salaireBrut: "1440.00",
              annexe: "10",
            }
          }
        ];

        setPages(mockPages);
        setCurrentPageIndex(0);
        
        // Initialiser avec les données de la première page
        const firstPage = mockPages[0];
        loadPageData(firstPage.extractedData);
        
        setIsProcessing(false);
      }, 2000);
    }
  };

  const loadPageData = (data: ExtractedData) => {
    setSiret(data.siret);
    setNomEmployeur(data.nomEmployeur);
    setNom(data.nom);
    setPrenom(data.prenom);
    setDebutContrat(data.debutContrat);
    setFinContrat(data.finContrat);
    setNombreJours(data.nombreJours);
    setNombreHeures(data.nombreHeures);
    setSalaireBrut(data.salaireBrut);
    setAnnexe(data.annexe);
  };

  const handleNavigateToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setCurrentPageIndex(pageIndex);
      loadPageData(pages[pageIndex].extractedData);
    }
  };

  const handleSkipPage = () => {
    const newStatuses = new Map(pageStatuses);
    newStatuses.set(currentPageIndex, 'skipped');
    setPageStatuses(newStatuses);
    
    toast.info(`Page ${currentPageIndex + 1} ignorée`);
    
    // Passer à la page suivante si disponible
    if (currentPageIndex < totalPages - 1) {
      handleNavigateToPage(currentPageIndex + 1);
    } else {
      // Fermer si c'était la dernière page
      handleClose();
    }
  };

  const handleAddCurrentPage = () => {
    // TODO: Logique de sauvegarde de la page courante
    const dataToSave = {
      pageNumber: currentPageIndex + 1,
      siret,
      nomEmployeur,
      nom,
      prenom,
      debutContrat,
      finContrat,
      nombreJours,
      nombreHeures,
      salaireBrut,
      annexe,
      fileName,
    };
    
    console.log("Données de la page à sauvegarder:", dataToSave);
    
    const newStatuses = new Map(pageStatuses);
    newStatuses.set(currentPageIndex, 'added');
    setPageStatuses(newStatuses);
    
    toast.success(`Page ${currentPageIndex + 1} ajoutée avec succès !`);
    
    // Passer à la page suivante si disponible
    if (currentPageIndex < totalPages - 1) {
      handleNavigateToPage(currentPageIndex + 1);
    } else {
      // Fermer si c'était la dernière page
      handleClose();
    }
  };

  const handleAddAllRemainingPages = () => {
    // TODO: Logique de sauvegarde de toutes les pages restantes
    const pagesToAdd = [];
    for (let i = currentPageIndex; i < totalPages; i++) {
      if (pageStatuses.get(i) !== 'added') {
        // Utiliser les données modifiées pour la page courante, sinon les données extraites
        const pageData = i === currentPageIndex 
          ? {
              pageNumber: i + 1,
              siret,
              nomEmployeur,
              nom,
              prenom,
              debutContrat,
              finContrat,
              nombreJours,
              nombreHeures,
              salaireBrut,
              annexe,
              fileName,
            }
          : {
              pageNumber: i + 1,
              ...pages[i].extractedData,
              fileName,
            };
        
        pagesToAdd.push(pageData);
      }
    }
    
    console.log("Toutes les pages à sauvegarder:", pagesToAdd);
    
    // Marquer toutes les pages restantes comme ajoutées
    const newStatuses = new Map(pageStatuses);
    for (let i = currentPageIndex; i < totalPages; i++) {
      newStatuses.set(i, 'added');
    }
    setPageStatuses(newStatuses);
    
    toast.success(`${pagesToAdd.length} page(s) ajoutée(s) avec succès !`);
    handleClose();
  };

  const handleReset = () => {
    setFileName("");
    setPages([]);
    setCurrentPageIndex(0);
    setPageStatuses(new Map());
    setIsProcessing(false);
    setSiret("");
    setNomEmployeur("");
    setNom("");
    setPrenom("");
    setDebutContrat("");
    setFinContrat("");
    setNombreJours("");
    setNombreHeures("");
    setSalaireBrut("");
    setAnnexe("");
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  const getRemainingPagesCount = () => {
    let count = 0;
    for (let i = currentPageIndex; i < totalPages; i++) {
      if (pageStatuses.get(i) !== 'added') {
        count++;
      }
    }
    return count;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={pages.length > 0 ? "sm:max-w-[1000px] max-h-[90vh]" : "sm:max-w-[500px]"}>
        <DialogHeader>
          <DialogTitle>Ajouter une attestation</DialogTitle>
          <DialogDescription>
            {pages.length > 0
              ? "Vérifiez et modifiez les informations extraites si nécessaire"
              : "Téléchargez votre attestation employeur"}
          </DialogDescription>
        </DialogHeader>
        
        {/* Navigation entre pages - en dessous du header */}
        {pages.length > 0 && (
          <div className="flex items-center justify-center gap-3 pb-4 border-b">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleNavigateToPage(currentPageIndex - 1)}
              disabled={currentPageIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Page {currentPageIndex + 1} sur {totalPages}
              </span>
              {currentStatus === 'added' && (
                <Badge variant="default" className="bg-green-600 gap-1">
                  <Check className="w-3 h-3" />
                  Ajoutée
                </Badge>
              )}
              {currentStatus === 'skipped' && (
                <Badge variant="secondary" className="gap-1">
                  <X className="w-3 h-3" />
                  Ignorée
                </Badge>
              )}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleNavigateToPage(currentPageIndex + 1)}
              disabled={currentPageIndex === totalPages - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        {/* État 1: Upload de fichier */}
        {pages.length === 0 && !isProcessing && (
          <div className="py-8">
            <Label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div className="flex flex-col items-center justify-center gap-3 text-center px-4">
                {fileName ? (
                  <>
                    <FileText className="w-12 h-12 text-primary" />
                    <div>
                      <p className="text-sm mb-1">Fichier sélectionné :</p>
                      <p className="text-sm text-muted-foreground">{fileName}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Cliquez pour changer de fichier
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-muted-foreground" />
                    <div>
                      <p className="text-sm mb-1">
                        Cliquez pour télécharger une attestation
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, JPG, PNG (max. 10MB)
                      </p>
                    </div>
                  </>
                )}
              </div>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </Label>
          </div>
        )}

        {/* État intermédiaire: Traitement OCR */}
        {isProcessing && (
          <div className="py-16 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="text-center">
              <p className="text-sm mb-1">Analyse du document en cours...</p>
              <p className="text-xs text-muted-foreground">
                Séparation des pages et extraction des informations par OCR
              </p>
            </div>
          </div>
        )}

        {/* État 2: Formulaire avec prévisualisation PDF */}
        {pages.length > 0 && currentPage && (
          <div className="grid grid-cols-2 gap-6 overflow-y-auto max-h-[calc(90vh-240px)]">
            {/* Colonne gauche: Prévisualisation du PDF */}
            <div className="space-y-3">
              <Label>Prévisualisation du document</Label>
              <div className="border border-border/50 rounded-lg overflow-hidden bg-muted/20 h-[600px]">
                {currentPage.fileUrl.endsWith('.pdf') || fileName.endsWith('.pdf') ? (
                  <iframe
                    src={`${currentPage.fileUrl}#page=${currentPage.pageNumber}`}
                    className="w-full h-full"
                    title={`Prévisualisation PDF - Page ${currentPage.pageNumber}`}
                  />
                ) : (
                  <img
                    src={currentPage.fileUrl}
                    alt={`Prévisualisation - Page ${currentPage.pageNumber}`}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="truncate">{fileName}</span>
                </div>
                {currentStatus === 'added' && (
                  <Badge variant="default" className="bg-green-600">
                    Validée
                  </Badge>
                )}
                {currentStatus === 'skipped' && (
                  <Badge variant="secondary">
                    Ignorée
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  document.getElementById('file-upload-replace')?.click();
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Remplacer le document
              </Button>
              <Input
                id="file-upload-replace"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </div>

            {/* Colonne droite: Formulaire */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siret">SIRET</Label>
                <Input
                  id="siret"
                  value={siret}
                  onChange={(e) => setSiret(e.target.value)}
                  placeholder="Numéro SIRET"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomEmployeur">Nom de l'employeur</Label>
                <Input
                  id="nomEmployeur"
                  value={nomEmployeur}
                  onChange={(e) => setNomEmployeur(e.target.value)}
                  placeholder="Nom de l'employeur"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Nom"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Prénom"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="debutContrat">Début de contrat</Label>
                  <Input
                    id="debutContrat"
                    type="date"
                    value={debutContrat}
                    onChange={(e) => setDebutContrat(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="finContrat">Fin de contrat</Label>
                  <Input
                    id="finContrat"
                    type="date"
                    value={finContrat}
                    onChange={(e) => setFinContrat(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreJours">Nombre de jours travaillés</Label>
                  <Input
                    id="nombreJours"
                    type="number"
                    value={nombreJours}
                    onChange={(e) => setNombreJours(e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombreHeures">Nombre d'heures effectuées</Label>
                  <Input
                    id="nombreHeures"
                    type="number"
                    step="0.5"
                    value={nombreHeures}
                    onChange={(e) => setNombreHeures(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaireBrut">Salaire brut total (€)</Label>
                <Input
                  id="salaireBrut"
                  type="number"
                  step="0.01"
                  value={salaireBrut}
                  onChange={(e) => setSalaireBrut(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annexe">Annexe</Label>
                <Select value={annexe} onValueChange={setAnnexe}>
                  <SelectTrigger id="annexe">
                    <SelectValue placeholder="Sélectionner une annexe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">Annexe 8</SelectItem>
                    <SelectItem value="10">Annexe 10</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Footer avec actions */}
        <div className="flex justify-between items-center gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          
          {pages.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={handleSkipPage}
                disabled={currentStatus === 'added' || currentStatus === 'skipped'}
              >
                <X className="w-4 h-4 mr-2" />
                Ignorer cette page
              </Button>
              
              <Button
                variant="outline"
                onClick={handleAddCurrentPage}
                disabled={currentStatus === 'added'}
              >
                <Check className="w-4 h-4 mr-2" />
                Ajouter cette page
              </Button>
              
              {getRemainingPagesCount() > 1 && (
                <Button
                  className="bg-gradient-to-br from-primary to-purple-600 hover:opacity-90"
                  onClick={handleAddAllRemainingPages}
                >
                  Ajouter toutes les pages restantes ({getRemainingPagesCount()})
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Upload, FileText, Loader2 } from "lucide-react";
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

export function AddAttestationDialog({ open, onOpenChange }: AddAttestationDialogProps) {
  const [fileName, setFileName] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);

  // États pour les champs modifiables
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      
      // Créer une URL temporaire pour la prévisualisation du PDF
      const url = URL.createObjectURL(file);
      setFileUrl(url);

      // Simuler le traitement OCR (à remplacer par votre vraie API)
      setIsProcessing(true);
      
      // TODO: Remplacer par votre appel API réel
      setTimeout(() => {
        // Données simulées extraites par OCR
        const mockData: ExtractedData = {
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
        };

        setExtractedData(mockData);
        setSiret(mockData.siret);
        setNomEmployeur(mockData.nomEmployeur);
        setNom(mockData.nom);
        setPrenom(mockData.prenom);
        setDebutContrat(mockData.debutContrat);
        setFinContrat(mockData.finContrat);
        setNombreJours(mockData.nombreJours);
        setNombreHeures(mockData.nombreHeures);
        setSalaireBrut(mockData.salaireBrut);
        setAnnexe(mockData.annexe);
        setIsProcessing(false);
      }, 2000);
    }
  };

  const handleReset = () => {
    setFileName("");
    setFileUrl("");
    setExtractedData(null);
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

  const handleSave = () => {
    // TODO: Logique de sauvegarde avec les données modifiées
    const dataToSave = {
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
    
    console.log("Données à sauvegarder:", dataToSave);
    toast.success('Attestation ajoutée avec succès !');
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={extractedData ? "sm:max-w-[1000px] max-h-[90vh]" : "sm:max-w-[500px]"}>
        <DialogHeader>
          <DialogTitle>Ajouter une attestation</DialogTitle>
          <DialogDescription>
            {extractedData 
              ? "Vérifiez et modifiez les informations extraites si nécessaire"
              : "Téléchargez votre attestation employeur"}
          </DialogDescription>
        </DialogHeader>
        
        {/* État 1: Upload de fichier */}
        {!extractedData && !isProcessing && (
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
                Extraction des informations par OCR
              </p>
            </div>
          </div>
        )}

        {/* État 2: Formulaire avec prévisualisation PDF */}
        {extractedData && (
          <div className="grid grid-cols-2 gap-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* Colonne gauche: Prévisualisation du PDF */}
            <div className="space-y-3">
              <Label>Prévisualisation du document</Label>
              <div className="border border-border/50 rounded-lg overflow-hidden bg-muted/20 h-[600px]">
                {fileUrl.endsWith('.pdf') ? (
                  <iframe
                    src={fileUrl}
                    className="w-full h-full"
                    title="Prévisualisation PDF"
                  />
                ) : (
                  <img
                    src={fileUrl}
                    alt="Prévisualisation"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span className="truncate">{fileName}</span>
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

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          {extractedData && (
            <Button
              className="bg-gradient-to-br from-primary to-purple-600 hover:opacity-90"
              onClick={handleSave}
            >
              Enregistrer
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Check, ChevronsUpDown, Upload, X, FileText } from "lucide-react";
import { cn } from "./ui/utils";
import { toast } from "sonner@2.0.3";

interface EditDepenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  depense: {
    id: number;
    date: string;
    categorie: string;
    ttc: number;
    ht: number;
    tva: number;
    details: string;
    justificatif: boolean;
  } | null;
}

// Données simulées de la base de données
const mockTypesDepense = [
  "Transports",
  "Vêtements et accessoire",
  "Outillage",
  "Intérêt de crédit",
  "Parking",
  "Frais d'autoroute",
  "Formation",
  "Repas",
  "Hébergement",
  "Assurance professionnelle",
  "Cotisations",
  "Abonnement logiciel",
  "Autre",
];

const mockFournisseurs = [
  "SNCF",
  "RATP",
  "Uber",
  "Décathlon",
  "Thomann",
  "Boulanger",
  "Amazon",
  "Fnac",
  "Leroy Merlin",
];

// Composant Combobox réutilisable
interface ComboboxProps {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

function Combobox({ id, value, onValueChange, options, placeholder, searchPlaceholder = "Rechercher...", emptyMessage = "Aucun résultat trouvé." }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder} 
            value={inputValue}
            onValueChange={(val) => {
              setInputValue(val);
              onValueChange(val);
            }}
          />
          <CommandList>
            <CommandEmpty>
              <div className="py-2 px-2">
                <p className="text-sm text-muted-foreground mb-2">{emptyMessage}</p>
                {inputValue && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      onValueChange(inputValue);
                      setOpen(false);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Utiliser "{inputValue}"
                  </Button>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {options
                .filter((option) => 
                  option.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? "" : currentValue);
                      setInputValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function EditDepenseDialog({ open, onOpenChange, depense }: EditDepenseDialogProps) {
  const [typeDepense, setTypeDepense] = useState("");
  const [fournisseur, setFournisseur] = useState("");
  const [justificatifFile, setJustificatifFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [details, setDetails] = useState("");
  
  // Montants
  const [montantTTC, setMontantTTC] = useState<string>("");
  const [montantHT, setMontantHT] = useState<string>("");
  const [tva, setTva] = useState<string>("20");
  
  // Part professionnelle
  const [partProPourcentage, setPartProPourcentage] = useState<string>("100");
  const [partProMontant, setPartProMontant] = useState<string>("");
  const [customPercentage, setCustomPercentage] = useState(false);

  // Initialiser les valeurs quand la dépense change
  useEffect(() => {
    if (depense) {
      setDate(depense.date);
      setTypeDepense(depense.categorie);
      setMontantTTC(depense.ttc.toString());
      setMontantHT(depense.ht.toString());
      setTva(depense.tva.toString());
      setDetails(depense.details);
      
      // Initialiser la part pro (par défaut 100%)
      setPartProPourcentage("100");
      setPartProMontant(depense.ttc.toString());
    }
  }, [depense]);

  // Calculer le montant professionnel quand le TTC ou le % change
  const updatePartProFromPercentage = (ttc: string, percentage: string) => {
    const ttcNum = parseFloat(ttc) || 0;
    const percentNum = parseFloat(percentage) || 0;
    const montantPro = (ttcNum * percentNum) / 100;
    setPartProMontant(montantPro.toFixed(2));
  };

  // Calculer le pourcentage quand le montant pro change
  const updatePartProFromMontant = (ttc: string, montantPro: string) => {
    const ttcNum = parseFloat(ttc) || 0;
    const montantProNum = parseFloat(montantPro) || 0;
    if (ttcNum > 0) {
      const percentage = (montantProNum / ttcNum) * 100;
      setPartProPourcentage(percentage.toFixed(2));
      setCustomPercentage(true);
    }
  };

  const handleTTCChange = (value: string) => {
    setMontantTTC(value);
    updatePartProFromPercentage(value, partProPourcentage);
  };

  const handlePercentageChange = (value: string) => {
    setPartProPourcentage(value);
    setCustomPercentage(true);
    updatePartProFromPercentage(montantTTC, value);
  };

  const handleMontantProChange = (value: string) => {
    setPartProMontant(value);
    updatePartProFromMontant(montantTTC, value);
  };

  const handleQuickPercentage = (percentage: number) => {
    setPartProPourcentage(percentage.toString());
    setCustomPercentage(false);
    updatePartProFromPercentage(montantTTC, percentage.toString());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Format non supporté. Utilisez JPG, PNG ou PDF.');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Le fichier est trop volumineux (max 5MB).');
      return;
    }

    setJustificatifFile(file);

    // Créer l'aperçu
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Pour les PDFs, on n'affiche pas d'aperçu image
      setPreviewUrl(null);
    }
  };

  const removeFile = () => {
    setJustificatifFile(null);
    setPreviewUrl(null);
  };

  if (!depense) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la dépense</DialogTitle>
          <DialogDescription>
            Modifiez les informations de votre dépense professionnelle
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-5 py-4">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Type et Fournisseur */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de dépense</Label>
              <Combobox
                id="type"
                value={typeDepense}
                onValueChange={setTypeDepense}
                options={mockTypesDepense}
                placeholder="Sélectionner ou saisir un type"
                searchPlaceholder="Rechercher un type..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fournisseur">Fournisseur</Label>
              <Combobox
                id="fournisseur"
                value={fournisseur}
                onValueChange={setFournisseur}
                options={mockFournisseurs}
                placeholder="Sélectionner ou saisir un fournisseur"
                searchPlaceholder="Rechercher un fournisseur..."
              />
            </div>
          </div>

          {/* Prix TTC, HT, TVA */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ttc">Prix TTC (€)</Label>
              <Input 
                id="ttc" 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                value={montantTTC}
                onChange={(e) => handleTTCChange(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ht">Prix HT (€)</Label>
              <Input 
                id="ht" 
                type="number" 
                step="0.01" 
                placeholder="0.00"
                value={montantHT}
                onChange={(e) => setMontantHT(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tva">TVA (%)</Label>
              <Input 
                id="tva" 
                type="number" 
                step="0.01" 
                placeholder="20.00"
                value={tva}
                onChange={(e) => setTva(e.target.value)}
              />
            </div>
          </div>

          {/* Part professionnelle */}
          <div className="space-y-3 p-4 bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-xl">
            <Label className="text-base">Part professionnelle</Label>
            
            {/* Boutons rapides */}
            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 75, 100].map((percentage) => (
                <Button
                  key={percentage}
                  type="button"
                  variant="outline"
                  className={`transition-all ${
                    partProPourcentage === percentage.toString() && !customPercentage
                      ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600 hover:text-white'
                      : 'hover:bg-amber-500/10 hover:border-amber-500/30'
                  }`}
                  onClick={() => handleQuickPercentage(percentage)}
                >
                  {percentage}%
                </Button>
              ))}
            </div>

            {/* Inputs personnalisés */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partProPourcentage" className="text-xs">
                  Pourcentage personnalisé
                </Label>
                <div className="relative">
                  <Input
                    id="partProPourcentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="100"
                    value={partProPourcentage}
                    onChange={(e) => handlePercentageChange(e.target.value)}
                    className={customPercentage ? 'border-amber-500' : ''}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="partProMontant" className="text-xs">
                  Montant professionnel
                </Label>
                <div className="relative">
                  <Input
                    id="partProMontant"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={partProMontant}
                    onChange={(e) => handleMontantProChange(e.target.value)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    €
                  </span>
                </div>
              </div>
            </div>

            {/* Résumé visuel */}
            {montantTTC && parseFloat(montantTTC) > 0 && (
              <div className="mt-3 p-3 bg-white/50 rounded-lg border border-amber-500/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total TTC :</span>
                  <span className="font-medium">{parseFloat(montantTTC).toFixed(2)} €</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Part pro ({partProPourcentage}%) :</span>
                  <span className="font-medium text-amber-600">
                    {partProMontant ? parseFloat(partProMontant).toFixed(2) : '0.00'} €
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Part perso :</span>
                  <span className="font-medium text-muted-foreground">
                    {(parseFloat(montantTTC) - (parseFloat(partProMontant) || 0)).toFixed(2)} €
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Détails */}
          <div className="space-y-2">
            <Label htmlFor="details">Détails</Label>
            <Textarea
              id="details"
              placeholder="Description de la dépense..."
              className="resize-none"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          {/* Upload Justificatif */}
          <div className="space-y-3">
            <Label>Justificatif (Photo ou PDF)</Label>
            
            {!justificatifFile ? (
              <div className="border-2 border-dashed border-border rounded-xl p-6 hover:border-amber-500/50 transition-colors">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm">
                      <span className="text-amber-600">Cliquez pour charger</span> ou glissez un fichier
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG ou PDF (max 5MB)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="border border-border rounded-xl p-4 bg-muted/30">
                <div className="flex items-start gap-4">
                  {/* Aperçu */}
                  <div className="flex-shrink-0">
                    {previewUrl ? (
                      // Aperçu image
                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-border bg-white">
                        <img
                          src={previewUrl}
                          alt="Aperçu"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      // Icône PDF
                      <div className="w-24 h-24 rounded-lg border border-border bg-white flex items-center justify-center">
                        <FileText className="w-10 h-10 text-red-600" />
                      </div>
                    )}
                  </div>

                  {/* Infos fichier */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {justificatifFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(justificatifFile.size / 1024).toFixed(0)} KB • {justificatifFile.type.includes('pdf') ? 'PDF' : 'Image'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-1.5 bg-emerald-500/20 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-emerald-500 rounded-full" />
                          </div>
                          <Check className="w-4 h-4 text-emerald-600" />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
                        onClick={removeFile}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Changer le fichier */}
                <div className="mt-3 pt-3 border-t border-border">
                  <label htmlFor="file-change" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700">
                      <Upload className="w-4 h-4" />
                      <span>Changer le justificatif</span>
                    </div>
                    <input
                      id="file-change"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            className="bg-gradient-to-br from-amber-500 to-orange-600 hover:opacity-90"
            onClick={() => {
              // TODO: Logique de sauvegarde
              toast.success('Dépense modifiée avec succès !');
              onOpenChange(false);
            }}
          >
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

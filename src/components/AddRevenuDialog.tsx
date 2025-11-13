import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "./ui/utils";
import { toast } from "sonner@2.0.3";

interface AddRevenuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Données simulées de la base de données
const mockVerseurs = [
  "Pôle Emploi",
  "Afdas",
  "Théâtre National",
  "Opéra de Paris",
  "Festival d'été",
  "Salle Pleyel",
  "Zénith Paris",
  "Comédie Française",
  "Philharmonie de Paris",
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

export function AddRevenuDialog({ open, onOpenChange }: AddRevenuDialogProps) {
  const [date, setDate] = useState("");
  const [employeur, setEmployeur] = useState("");
  const [typeRevenu, setTypeRevenu] = useState("Cachet");
  const [montantBrut, setMontantBrut] = useState("");
  const [montantNet, setMontantNet] = useState("");
  const [categorie, setCategorie] = useState("Spectacle vivant");
  const [statut, setStatut] = useState("En attente");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !employeur || !montantBrut || !montantNet) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // TODO: Sauvegarder le revenu
    toast.success("Revenu ajouté avec succès");
    
    // Reset form
    setDate("");
    setEmployeur("");
    setTypeRevenu("Cachet");
    setMontantBrut("");
    setMontantNet("");
    setCategorie("Spectacle vivant");
    setStatut("En attente");
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un revenu</DialogTitle>
          <DialogDescription>
            Enregistrez un nouveau revenu professionnel
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input 
              id="date" 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Type de revenu et Catégorie */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="typeRevenu">Type de revenu *</Label>
              <Select value={typeRevenu} onValueChange={setTypeRevenu}>
                <SelectTrigger id="typeRevenu">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cachet">Cachet</SelectItem>
                  <SelectItem value="ARE">ARE (Allocation chômage)</SelectItem>
                  <SelectItem value="AEM">AEM</SelectItem>
                  <SelectItem value="Prime">Prime</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categorie">Catégorie</Label>
              <Select value={categorie} onValueChange={setCategorie}>
                <SelectTrigger id="categorie">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spectacle vivant">Spectacle vivant</SelectItem>
                  <SelectItem value="Indemnités">Indemnités</SelectItem>
                  <SelectItem value="Audiovisuel">Audiovisuel</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Employeur */}
          <div className="space-y-2">
            <Label htmlFor="employeur">Employeur / Verseur *</Label>
            <Combobox
              id="employeur"
              value={employeur}
              onValueChange={setEmployeur}
              options={mockVerseurs}
              placeholder="Sélectionner ou saisir un employeur"
              searchPlaceholder="Rechercher un employeur..."
            />
          </div>

          {/* Montants */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="montantBrut">Montant brut (€) *</Label>
              <Input 
                id="montantBrut" 
                type="number" 
                step="0.01" 
                placeholder="850.00"
                value={montantBrut}
                onChange={(e) => setMontantBrut(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="montantNet">Montant net (€) *</Label>
              <Input 
                id="montantNet" 
                type="number" 
                step="0.01" 
                placeholder="672.50"
                value={montantNet}
                onChange={(e) => setMontantNet(e.target.value)}
              />
            </div>
          </div>

          {/* Statut */}
          <div className="space-y-2">
            <Label htmlFor="statut">Statut</Label>
            <Select value={statut} onValueChange={setStatut}>
              <SelectTrigger id="statut">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Reçu">Reçu</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Annulé">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Récapitulatif */}
          {montantBrut && montantNet && (
            <div className="p-4 bg-muted/30 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Montant brut</span>
                <span>{parseFloat(montantBrut).toFixed(2)} €</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Montant net</span>
                <span>{parseFloat(montantNet).toFixed(2)} €</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Charges</span>
                <span className="text-sm text-red-600">
                  -{(parseFloat(montantBrut) - parseFloat(montantNet)).toFixed(2)} €
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-br from-primary to-purple-600"
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "./ui/utils";
import { toast } from "sonner@2.0.3";

interface AddDepenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function AddDepenseDialog({ open, onOpenChange }: AddDepenseDialogProps) {
  const [typeDepense, setTypeDepense] = useState("");
  const [fournisseur, setFournisseur] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une dépense</DialogTitle>
          <DialogDescription>
            Enregistrez une nouvelle dépense professionnelle
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-5 py-4">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" />
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
              <Input id="ttc" type="number" step="0.01" placeholder="0.00" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ht">Prix HT (€)</Label>
              <Input id="ht" type="number" step="0.01" placeholder="0.00" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tva">TVA (%)</Label>
              <Input id="tva" type="number" step="0.01" placeholder="20.00" />
            </div>
          </div>

          {/* Détails */}
          <div className="space-y-2">
            <Label htmlFor="details">Détails</Label>
            <Textarea
              id="details"
              placeholder="Description de la dépense..."
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Justificatif */}
          <div className="space-y-2">
            <Label htmlFor="justificatif">Justificatif</Label>
            <Select defaultValue="oui">
              <SelectTrigger id="justificatif">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oui">Oui</SelectItem>
                <SelectItem value="non">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            className="bg-gradient-to-br from-primary to-purple-600 hover:opacity-90"
            onClick={() => {
              // TODO: Logique de sauvegarde
              toast.success('Dépense ajoutée avec succès !');
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

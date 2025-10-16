import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Upload, FileText } from "lucide-react";
import { useState } from "react";

interface AddAttestationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddAttestationDialog({ open, onOpenChange }: AddAttestationDialogProps) {
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une attestation</DialogTitle>
          <DialogDescription>
            Téléchargez votre attestation employeur
          </DialogDescription>
        </DialogHeader>
        
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

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            className="bg-gradient-to-br from-primary to-purple-600 hover:opacity-90"
            disabled={!fileName}
            onClick={() => {
              // TODO: Logique de sauvegarde
              onOpenChange(false);
              setFileName("");
            }}
          >
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

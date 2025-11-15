import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { 
  Download, 
  FileText, 
  ZoomIn,
  ZoomOut,
  FileX
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface AemViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aem: {
    id: number;
    dateDebut: string;
    dateFin: string;
    employeur: string;
    nombreJours: number;
    nombreHeures: number;
    salaireBrut: number;
    numeroAttestation: string;
    justificatif: boolean;
  } | null;
}

export function AemViewDialog({ open, onOpenChange, aem }: AemViewDialogProps) {
  const [zoom, setZoom] = useState(100);

  if (!aem) return null;

  const handleDownload = () => {
    toast.success("Téléchargement du justificatif lancé");
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0">
        {/* En-tête simple */}
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
          <div>
            <DialogTitle className="text-lg">
              {aem.numeroAttestation} - {aem.employeur}
            </DialogTitle>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4" />
            Télécharger
          </Button>
        </DialogHeader>

        {/* Barre d'outils zoom */}
        <div className="border-b bg-muted/30 px-4 py-2 flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm min-w-[4rem] text-center">{zoom}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        {/* Zone de visualisation PDF */}
        <div className="flex-1 overflow-auto bg-muted/20 p-6">
          {aem.justificatif ? (
            <div className="max-w-3xl mx-auto">
              <div 
                className="bg-white shadow-lg rounded-lg overflow-hidden border transition-transform origin-top"
                style={{ transform: `scale(${zoom / 100})` }}
              >
                {/* Simulateur de document PDF */}
                <div className="aspect-[210/297] flex items-center justify-center bg-white">
                  <div className="text-center text-muted-foreground">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-sm">Aperçu PDF</p>
                    <p className="text-xs mt-2">{aem.numeroAttestation}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <FileX className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun justificatif disponible</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
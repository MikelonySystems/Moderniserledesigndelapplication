import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { 
  Download, 
  FileText, 
  Building2, 
  Calendar, 
  Clock, 
  Euro,
  TrendingUp,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2
} from "lucide-react";
import { format } from "date-fns@4.1.0";
import { fr } from "date-fns@4.1.0/locale";
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
    salaireBrut: number;
    numeroAttestation: string;
    justificatif: boolean;
  } | null;
}

export function AemViewDialog({ open, onOpenChange, aem }: AemViewDialogProps) {
  const [zoom, setZoom] = useState(100);

  if (!aem) return null;

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd MMMM yyyy", { locale: fr });
  };

  const formatMonth = (dateStr: string) => {
    return format(new Date(dateStr), "MMMM yyyy", { locale: fr });
  };

  const salaireJournalier = aem.salaireBrut / aem.nombreJours;

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
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0">
        {/* En-tête */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl mb-1">Attestation Employeur Mensuel</DialogTitle>
                  <p className="text-sm text-muted-foreground">{aem.numeroAttestation}</p>
                </div>
              </div>
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
          </div>
        </DialogHeader>

        {/* Contenu */}
        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar avec infos */}
          <div className="w-80 border-r bg-muted/20 p-6 overflow-y-auto">
            <div className="space-y-4">
              {/* Employeur */}
              <Card className="p-4 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border-teal-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Employeur</p>
                    <p className="font-medium break-words">{aem.employeur}</p>
                  </div>
                </div>
              </Card>

              {/* Période */}
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Période</p>
                    <p className="font-medium capitalize mb-1">{formatMonth(aem.dateDebut)}</p>
                    <p className="text-xs text-muted-foreground">
                      Du {formatDate(aem.dateDebut)}
                      <br />
                      au {formatDate(aem.dateFin)}
                    </p>
                  </div>
                </div>
              </Card>

              <Separator />

              {/* Stats détaillées */}
              <div className="space-y-3">
                <h3 className="text-sm">Détails de rémunération</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-600" />
                      <span className="text-sm">Jours travaillés</span>
                    </div>
                    <span className="font-medium">{aem.nombreJours}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm">Salaire brut</span>
                    </div>
                    <span className="font-medium text-emerald-600">{aem.salaireBrut.toFixed(2)} €</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm">Salaire journalier</span>
                    </div>
                    <span className="font-medium text-emerald-600">{salaireJournalier.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Informations administratives */}
              <div className="space-y-3">
                <h3 className="text-sm">Informations administratives</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">N° Attestation</span>
                    <span className="font-mono text-xs">{aem.numeroAttestation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Statut</span>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      Reçue
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Justificatif</span>
                    {aem.justificatif ? (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        Présent
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                        Manquant
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Zone de visualisation du document */}
          <div className="flex-1 flex flex-col bg-muted/10">
            {/* Barre d'outils */}
            <div className="border-b bg-background/50 backdrop-blur px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm min-w-[4rem] text-center">{zoom}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(100)}
                >
                  Taille réelle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Aperçu du document */}
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-3xl mx-auto">
                {aem.justificatif ? (
                  <div 
                    className="bg-white shadow-lg rounded-lg overflow-hidden border-2 border-border transition-transform origin-top"
                    style={{ transform: `scale(${zoom / 100})` }}
                  >
                    {/* Simulateur de document AEM */}
                    <div className="p-8 space-y-6">
                      {/* En-tête du document */}
                      <div className="text-center border-b pb-4">
                        <h2 className="text-xl mb-2">ATTESTATION EMPLOYEUR MENSUEL</h2>
                        <p className="text-sm text-muted-foreground">Destinée à France Travail</p>
                      </div>

                      {/* Informations employeur */}
                      <div className="space-y-3">
                        <div className="bg-muted/30 p-4 rounded">
                          <p className="text-xs text-muted-foreground mb-2">INFORMATIONS EMPLOYEUR</p>
                          <p className="font-medium">{aem.employeur}</p>
                          <p className="text-sm text-muted-foreground">123 Rue de la Culture</p>
                          <p className="text-sm text-muted-foreground">75001 Paris</p>
                          <p className="text-sm text-muted-foreground">SIRET : 123 456 789 00012</p>
                        </div>

                        {/* Période et détails */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-muted/30 p-4 rounded">
                            <p className="text-xs text-muted-foreground mb-2">PÉRIODE</p>
                            <p className="text-sm capitalize">{formatMonth(aem.dateDebut)}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Du {format(new Date(aem.dateDebut), "dd/MM/yyyy", { locale: fr })} au {format(new Date(aem.dateFin), "dd/MM/yyyy", { locale: fr })}
                            </p>
                          </div>
                          <div className="bg-muted/30 p-4 rounded">
                            <p className="text-xs text-muted-foreground mb-2">N° ATTESTATION</p>
                            <p className="text-sm font-mono">{aem.numeroAttestation}</p>
                          </div>
                        </div>

                        {/* Tableau récapitulatif */}
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="text-left p-3 border-r">Libellé</th>
                                <th className="text-right p-3">Montant</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-t">
                                <td className="p-3 border-r">Nombre de jours travaillés</td>
                                <td className="p-3 text-right">{aem.nombreJours} jours</td>
                              </tr>
                              <tr className="border-t">
                                <td className="p-3 border-r">Salaire journalier moyen</td>
                                <td className="p-3 text-right">{salaireJournalier.toFixed(2)} €</td>
                              </tr>
                              <tr className="border-t bg-muted/20">
                                <td className="p-3 border-r font-medium">Salaire brut total</td>
                                <td className="p-3 text-right font-medium">{aem.salaireBrut.toFixed(2)} €</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Signature */}
                        <div className="mt-8 pt-6 border-t">
                          <div className="flex justify-between">
                            <div className="text-sm">
                              <p className="text-muted-foreground mb-1">Fait à Paris</p>
                              <p className="text-muted-foreground">Le {format(new Date(aem.dateFin), "dd/MM/yyyy", { locale: fr })}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground mb-8">Signature et cachet</p>
                              <div className="w-32 h-20 border-2 border-dashed border-muted-foreground/30 rounded flex items-center justify-center">
                                <p className="text-xs text-muted-foreground">Signature</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun justificatif disponible</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Le document n'a pas encore été téléversé
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

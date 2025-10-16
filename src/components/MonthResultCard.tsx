import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Calendar } from "lucide-react";

interface MonthResultCardProps {
  month: string;
  revenuBrut: string;
  revenuNet: string;
  allocation: string;
  jours: string;
  heures: string;
}

export function MonthResultCard({ month, revenuBrut, revenuNet, allocation, jours, heures }: MonthResultCardProps) {
  return (
    <Card className="border-0 shadow-sm h-full flex flex-col">
      <CardHeader className="pb-0 flex flex-row items-start justify-between space-y-0">
        <div className="flex-1">
          <CardTitle className="text-base">Mois précédent</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{month}</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 text-primary">
          <Calendar className="w-5 h-5" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-5 pt-0">
        <div>
          <p className="text-sm text-muted-foreground mb-1.5">Revenus BRUT</p>
          <p className="text-2xl">{revenuBrut}</p>
        </div>
        
        <Separator />
        
        <div>
          <p className="text-sm text-muted-foreground mb-1.5">Revenus NET</p>
          <p className="text-2xl">{revenuNet}</p>
        </div>
        
        <Separator />
        
        <div>
          <p className="text-sm text-muted-foreground mb-1.5">Montant d'allocation</p>
          <p className="text-2xl">{allocation}</p>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-sm text-muted-foreground mb-1.5">Jours</p>
            <p className="text-2xl">{jours}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1.5">Heures</p>
            <p className="text-2xl">{heures}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

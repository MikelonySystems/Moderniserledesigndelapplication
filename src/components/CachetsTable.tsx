import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

const cachets = [
  {
    id: 1,
    date: "15/10/2025",
    employeur: "Théâtre National",
    type: "Concert",
    heures: 8,
    brut: 450,
    net: 355,
    statut: "Payé",
  },
  {
    id: 2,
    date: "12/10/2025",
    employeur: "Opéra de Paris",
    type: "Opéra",
    heures: 10,
    brut: 580,
    net: 458,
    statut: "Payé",
  },
  {
    id: 3,
    date: "08/10/2025",
    employeur: "Festival d'été",
    type: "Festival",
    heures: 12,
    brut: 720,
    net: 568,
    statut: "En attente",
  },
  {
    id: 4,
    date: "05/10/2025",
    employeur: "Salle Pleyel",
    type: "Concert",
    heures: 6,
    brut: 380,
    net: 300,
    statut: "Payé",
  },
  {
    id: 5,
    date: "01/10/2025",
    employeur: "Zénith Paris",
    type: "Concert",
    heures: 8,
    brut: 450,
    net: 355,
    statut: "Payé",
  },
  {
    id: 6,
    date: "28/09/2025",
    employeur: "Philharmonie",
    type: "Concert",
    heures: 9,
    brut: 520,
    net: 410,
    statut: "Payé",
  },
];

export function CachetsTable() {
  return (
    <Card className="border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle>Liste des cachets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>Date</TableHead>
                <TableHead>Employeur</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Heures</TableHead>
                <TableHead className="text-right">Brut</TableHead>
                <TableHead className="text-right">Net</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cachets.map((cachet) => (
                <TableRow key={cachet.id} className="hover:bg-muted/20">
                  <TableCell>{cachet.date}</TableCell>
                  <TableCell>{cachet.employeur}</TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{cachet.type}</span>
                  </TableCell>
                  <TableCell className="text-right">{cachet.heures}h</TableCell>
                  <TableCell className="text-right">{cachet.brut}€</TableCell>
                  <TableCell className="text-right">{cachet.net}€</TableCell>
                  <TableCell>
                    <Badge
                      variant={cachet.statut === "Payé" ? "default" : "secondary"}
                      className={
                        cachet.statut === "Payé"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100"
                          : ""
                      }
                    >
                      {cachet.statut}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

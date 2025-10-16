import { useState } from "react";
import { Button } from "./ui/button";
import { Plus, X, Receipt, CreditCard, TrendingUp, FileText } from "lucide-react";
import { AddCachetDialog } from "./AddCachetDialog";
import { AddDepenseDialog } from "./AddDepenseDialog";
import { AddRevenuDialog } from "./AddRevenuDialog";
import { AddAttestationDialog } from "./AddAttestationDialog";
import { motion, AnimatePresence } from "motion/react";

const menuItems = [
  { label: "Ajouter un cachet", icon: Receipt, action: "cachet" },
  { label: "Ajouter une dépense", icon: CreditCard, action: "depense" },
  { label: "Ajouter un revenu", icon: TrendingUp, action: "revenu" },
  { label: "Ajouter une attestation", icon: FileText, action: "attestation" },
];

export function FloatingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cachetDialogOpen, setCachetDialogOpen] = useState(false);
  const [depenseDialogOpen, setDepenseDialogOpen] = useState(false);
  const [revenuDialogOpen, setRevenuDialogOpen] = useState(false);
  const [attestationDialogOpen, setAttestationDialogOpen] = useState(false);

  const handleMenuItemClick = (action: string) => {
    if (action === "cachet") {
      setCachetDialogOpen(true);
    } else if (action === "depense") {
      setDepenseDialogOpen(true);
    } else if (action === "revenu") {
      setRevenuDialogOpen(true);
    } else if (action === "attestation") {
      setAttestationDialogOpen(true);
    }
    setMenuOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-40">
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-20 right-0 flex flex-col gap-3 mb-2"
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.action}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { delay: index * 0.05 }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: 20, 
                    scale: 0.8,
                    transition: { delay: (menuItems.length - index - 1) * 0.05 }
                  }}
                >
                  <Button
                    onClick={() => handleMenuItemClick(item.action)}
                    className="bg-card text-foreground hover:bg-card/90 shadow-lg hover:shadow-xl transition-all whitespace-nowrap gap-3 h-12 px-6 border-0"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <Button 
          size="icon" 
          className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-600 hover:opacity-90 shadow-lg hover:shadow-xl transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <motion.div
            animate={{ rotate: menuOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-6 h-6" />
          </motion.div>
        </Button>
      </div>
      
      <AddCachetDialog open={cachetDialogOpen} onOpenChange={setCachetDialogOpen} />
      <AddDepenseDialog open={depenseDialogOpen} onOpenChange={setDepenseDialogOpen} />
      <AddRevenuDialog open={revenuDialogOpen} onOpenChange={setRevenuDialogOpen} />
      <AddAttestationDialog open={attestationDialogOpen} onOpenChange={setAttestationDialogOpen} />
    </>
  );
}

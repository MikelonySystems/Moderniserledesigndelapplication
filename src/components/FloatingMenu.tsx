import { LayoutDashboard, Receipt, CreditCard, Car, Briefcase, TrendingUp, FileText, Settings, LogOut } from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
  { title: "Cachets", icon: Receipt, page: "cachets" },
  { title: "Dépenses", icon: CreditCard, page: "depenses" },
  { title: "Trajets", icon: Car, page: "trajets" },
  { title: "AEM", icon: Briefcase, page: "aem" },
  { title: "Revenus", icon: TrendingUp, page: "revenus" },
  { title: "Bilan Annuel", icon: FileText, page: "bilan" },
];

interface FloatingMenuProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function FloatingMenu({ currentPage, onPageChange }: FloatingMenuProps) {
  const handleLogout = () => {
    // Logique de déconnexion
    console.log('Déconnexion rapide');
  };

  return (
    <aside className="fixed left-6 top-6 bottom-6 w-56 bg-card rounded-2xl border-0 shadow-lg z-50 flex flex-col">
      <div className="p-6 border-b border-border rounded-t-2xl flex items-center gap-3">
        <button
          onClick={() => onPageChange("compte")}
          className="flex items-center gap-3 hover:bg-muted/50 transition-all rounded-lg p-2 flex-1 -m-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg">
            <span className="text-lg">M</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-foreground">MIKELONY</span>
            <span className="text-xs text-muted-foreground">Mon compte</span>
          </div>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 text-red-600 transition-all"
          title="Déconnexion"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={() => onPageChange(item.page)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
                currentPage === item.page
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.title}</span>
            </button>
          ))}
        </div>
      </nav>
      
      <div className="p-4 border-t border-border">
        <button
          onClick={() => onPageChange("preferences")}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full text-left ${
            currentPage === "preferences"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm">Préférences</span>
        </button>
      </div>
    </aside>
  );
}
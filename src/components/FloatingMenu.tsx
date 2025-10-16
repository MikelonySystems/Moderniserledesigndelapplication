import { LayoutDashboard, Receipt, CreditCard, Car, Briefcase, TrendingUp, Settings } from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, active: true },
  { title: "Cachets", icon: Receipt, active: false },
  { title: "Dépenses", icon: CreditCard, active: false },
  { title: "Trajets", icon: Car, active: false },
  { title: "AEM", icon: Briefcase, active: false },
  { title: "Revenus", icon: TrendingUp, active: false },
];

export function FloatingMenu() {
  return (
    <aside className="fixed left-6 top-6 bottom-6 w-56 bg-card rounded-2xl border-0 shadow-lg z-50 flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg">
            <span className="text-lg">M</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">MIKELONY</span>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <button
              key={item.title}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
                item.active
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
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-muted text-muted-foreground hover:text-foreground w-full text-left">
          <Settings className="w-5 h-5" />
          <span className="text-sm">Préférences</span>
        </button>
      </div>
    </aside>
  );
}

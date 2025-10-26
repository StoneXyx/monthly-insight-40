import { DollarSign, LayoutDashboard, TrendingUp, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  currentView: "expenses" | "analytics";
  onViewChange: (view: "expenses" | "analytics") => void;
}

const Header = ({ currentView, onViewChange }: HeaderProps) => {
  return (
    <header className="bg-gradient-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">FinanceTrack Pro</h1>
              <p className="text-sm text-white/80">Professional Financial Management</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-2">
            <Button
              variant={currentView === "expenses" ? "secondary" : "ghost"}
              onClick={() => onViewChange("expenses")}
              className="text-white hover:bg-white/20"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Expenses
            </Button>
            <Button
              variant={currentView === "analytics" ? "secondary" : "ghost"}
              onClick={() => onViewChange("analytics")}
              className="text-white hover:bg-white/20"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

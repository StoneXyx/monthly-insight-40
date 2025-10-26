import { useState, useMemo } from "react";
import Header from "@/components/Header";
import SummaryCards from "@/components/SummaryCards";
import FilterControls from "@/components/FilterControls";
import ExpenseTable, { Transaction } from "@/components/ExpenseTable";
import AddExpenseDialog from "@/components/AddExpenseDialog";
import AnalyticsView from "@/components/AnalyticsView";
import { generatePDF } from "@/utils/pdfGenerator";
import { toast } from "sonner";

const CATEGORIES = [
  "Education",
  "Food",
  "Transport",
  "Entertainment",
  "Health",
  "Shopping",
  "Utilities",
  "Other",
];

const GROUPS = ["Personal", "Business", "Family", "Investment"];

const Index = () => {
  const [currentView, setCurrentView] = useState<"expenses" | "analytics">("expenses");
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      date: "2025-10-25",
      description: "Online Course Subscription",
      category: "Education",
      group: "Business",
      amount: 1143.0,
    },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Get current month in YYYY-MM format
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState("all");

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesMonth = t.date.startsWith(selectedMonth);
      const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
      const matchesGroup = selectedGroup === "all" || t.group === selectedGroup;
      return matchesMonth && matchesCategory && matchesGroup;
    });
  }, [transactions, selectedMonth, selectedCategory, selectedGroup]);

  // Calculate statistics
  const totalExpenses = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const averageExpense = filteredTransactions.length > 0 ? totalExpenses / filteredTransactions.length : 0;
  const activeCategories = new Set(filteredTransactions.map((t) => t.category)).size;
  const activeGroups = new Set(filteredTransactions.map((t) => t.group)).size;

  const handleAddExpense = (expense: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...expense,
      id: Date.now().toString(),
    };
    setTransactions([...transactions, newTransaction]);
    toast.success("Expense added successfully!");
  };

  const handleDeleteExpense = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    toast.success("Expense deleted successfully!");
  };

  const handleDownloadPDF = () => {
    generatePDF(filteredTransactions, selectedMonth, totalExpenses, averageExpense);
    toast.success("PDF downloaded successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="container mx-auto px-4 py-8">
        {currentView === "expenses" ? (
          <>
            <SummaryCards
              totalExpenses={totalExpenses}
              averageExpense={averageExpense}
              activeCategories={activeCategories}
              transactionCount={filteredTransactions.length}
              groupCount={activeGroups}
            />
            
            <FilterControls
              selectedMonth={selectedMonth}
              selectedCategory={selectedCategory}
              selectedGroup={selectedGroup}
              categories={CATEGORIES}
              groups={GROUPS}
              onMonthChange={setSelectedMonth}
              onCategoryChange={setSelectedCategory}
              onGroupChange={setSelectedGroup}
              onAddExpense={() => setDialogOpen(true)}
              onDownloadPDF={handleDownloadPDF}
            />
            
            <ExpenseTable
              transactions={filteredTransactions}
              onDelete={handleDeleteExpense}
            />
          </>
        ) : (
          <AnalyticsView transactions={filteredTransactions} />
        )}
      </main>

      <AddExpenseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddExpense={handleAddExpense}
        categories={CATEGORIES}
        groups={GROUPS}
      />
    </div>
  );
};

export default Index;

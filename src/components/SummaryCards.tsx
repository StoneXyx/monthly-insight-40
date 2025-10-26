import { TrendingDown, DollarSign, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryCardsProps {
  totalExpenses: number;
  averageExpense: number;
  activeCategories: number;
  transactionCount: number;
  groupCount: number;
}

const SummaryCards = ({
  totalExpenses,
  averageExpense,
  activeCategories,
  transactionCount,
  groupCount,
}: SummaryCardsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Expenses
          </CardTitle>
          <div className="bg-red-100 p-2 rounded-lg">
            <TrendingDown className="h-5 w-5 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {transactionCount} {transactionCount === 1 ? 'transaction' : 'transactions'}
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Average Expense
          </CardTitle>
          <div className="bg-blue-100 p-2 rounded-lg">
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">
            {formatCurrency(averageExpense)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active Categories
          </CardTitle>
          <div className="bg-green-100 p-2 rounded-lg">
            <Tag className="h-5 w-5 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">
            {activeCategories}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {groupCount} {groupCount === 1 ? 'group' : 'groups'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;

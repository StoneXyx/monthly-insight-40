import { Trash2, Calendar, Tag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  group: string;
  amount: number;
}

interface ExpenseTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const ExpenseTable = ({ transactions, onDelete }: ExpenseTableProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Education: "bg-cyan-100 text-cyan-700",
      Food: "bg-orange-100 text-orange-700",
      Transport: "bg-purple-100 text-purple-700",
      Entertainment: "bg-pink-100 text-pink-700",
      Health: "bg-green-100 text-green-700",
      Shopping: "bg-blue-100 text-blue-700",
      Utilities: "bg-yellow-100 text-yellow-700",
      Other: "bg-gray-100 text-gray-700",
    };
    return colors[category] || colors.Other;
  };

  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Category
                  </div>
                </TableHead>
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Group
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-right">Amount</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No transactions found. Add your first expense to get started.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(transaction.category)}>
                        {transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {transaction.group}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(transaction.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {transactions.length > 0 && (
          <div className="border-t p-4 bg-muted/20">
            <div className="flex justify-between items-center font-semibold">
              <span className="text-muted-foreground">
                Total: {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
              </span>
              <span className="text-xl text-foreground">{formatCurrency(total)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseTable;

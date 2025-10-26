import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExpense: (expense: {
    date: string;
    description: string;
    category: string;
    group: string;
    amount: number;
  }) => void;
  categories: string[];
  groups: string[];
}

const AddExpenseDialog = ({
  open,
  onOpenChange,
  onAddExpense,
  categories,
  groups,
}: AddExpenseDialogProps) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [group, setGroup] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !category || !group || !amount) return;

    onAddExpense({
      date,
      description,
      category,
      group,
      amount: parseFloat(amount),
    });

    // Reset form
    setDate(new Date().toISOString().split('T')[0]);
    setDescription("");
    setCategory("");
    setGroup("");
    setAmount("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Enter the details of your expense below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Groceries, Gas, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="group">Group</Label>
              <Select value={group} onValueChange={setGroup} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {groups.map((grp) => (
                    <SelectItem key={grp} value={grp}>
                      {grp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-accent">
              Add Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;

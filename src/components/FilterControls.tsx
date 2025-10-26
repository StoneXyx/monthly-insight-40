import { Filter, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FilterControlsProps {
  selectedMonth: string;
  selectedCategory: string;
  selectedGroup: string;
  categories: string[];
  groups: string[];
  onMonthChange: (month: string) => void;
  onCategoryChange: (category: string) => void;
  onGroupChange: (group: string) => void;
  onAddExpense: () => void;
  onDownloadPDF: () => void;
}

const FilterControls = ({
  selectedMonth,
  selectedCategory,
  selectedGroup,
  categories,
  groups,
  onMonthChange,
  onCategoryChange,
  onGroupChange,
  onAddExpense,
  onDownloadPDF,
}: FilterControlsProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle>Filters & Controls</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button onClick={onAddExpense} className="bg-primary hover:bg-accent">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
            <Button onClick={onDownloadPDF} variant="secondary" className="bg-foreground text-background hover:bg-foreground/90">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Month</label>
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Group</label>
            <Select value={selectedGroup} onValueChange={onGroupChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Groups" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Groups</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterControls;

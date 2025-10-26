import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Transaction } from "./ExpenseTable";

interface AnalyticsViewProps {
  transactions: Transaction[];
}

const COLORS = ['#16a34a', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'];

const AnalyticsView = ({ transactions }: AnalyticsViewProps) => {
  // Category breakdown
  const categoryData = transactions.reduce((acc, t) => {
    const existing = acc.find(item => item.name === t.category);
    if (existing) {
      existing.value += t.amount;
    } else {
      acc.push({ name: t.category, value: t.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Group breakdown
  const groupData = transactions.reduce((acc, t) => {
    const existing = acc.find(item => item.name === t.group);
    if (existing) {
      existing.value += t.amount;
    } else {
      acc.push({ name: t.group, value: t.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Monthly trend (last 6 months)
  const monthlyData = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.amount += t.amount;
    } else {
      acc.push({ month, amount: t.amount });
    }
    return acc;
  }, [] as { month: string; amount: number }[]).slice(-6);

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expense Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by Group</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groupData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={formatCurrency} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsView;

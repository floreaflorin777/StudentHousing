import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  ShoppingBasket, 
  Brush, 
  Receipt 
} from "lucide-react";

interface QuickActionsProps {
  onAddTask: () => void;
  onAddExpense: () => void;
}

export function QuickActions({ onAddTask, onAddExpense }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader className="border-b border-slate-200">
        <CardTitle className="text-lg font-semibold text-slate-900">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={onAddTask}
          >
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mb-2">
              <Brush className="h-4 w-4 text-red-600" />
            </div>
            <span className="text-xs font-medium text-slate-900">Add Cleaning</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={onAddTask}
          >
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <ShoppingBasket className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-xs font-medium text-slate-900">Add Grocery</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={onAddTask}
          >
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
              <Trash2 className="h-4 w-4 text-gray-600" />
            </div>
            <span className="text-xs font-medium text-slate-900">Add Garbage</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto"
            onClick={onAddExpense}
          >
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mb-2">
              <Receipt className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-slate-900">Add Expense</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

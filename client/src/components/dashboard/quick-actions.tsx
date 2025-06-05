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
    <Card className="shadow-lg rounded-xl">
      <CardHeader className="border-b border-carolina-blue">
        <CardTitle className="text-lg font-semibold text-charcoal">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto shadow rounded-lg border-none bg-hunyadi-yellow text-charcoal hover:bg-orange-pantone hover:text-white"
            onClick={onAddTask}
          >
            <div className="w-8 h-8 bg-orange-pantone rounded-lg flex items-center justify-center mb-2">
              <Brush className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs font-medium">Add Cleaning</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto shadow rounded-lg border-none bg-lapis-lazuli text-white hover:bg-carolina-blue hover:text-charcoal"
            onClick={onAddTask}
          >
            <div className="w-8 h-8 bg-hunyadi-yellow rounded-lg flex items-center justify-center mb-2">
              <ShoppingBasket className="h-4 w-4 text-charcoal" />
            </div>
            <span className="text-xs font-medium">Add Grocery</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto shadow rounded-lg border-none bg-carolina-blue text-charcoal hover:bg-lapis-lazuli hover:text-white"
            onClick={onAddTask}
          >
            <div className="w-8 h-8 bg-charcoal rounded-lg flex items-center justify-center mb-2">
              <Trash2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs font-medium">Add Garbage</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto shadow rounded-lg border-none bg-orange-pantone text-white hover:bg-hunyadi-yellow hover:text-charcoal"
            onClick={onAddExpense}
          >
            <div className="w-8 h-8 bg-lapis-lazuli rounded-lg flex items-center justify-center mb-2">
              <Receipt className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs font-medium">Add Expense</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

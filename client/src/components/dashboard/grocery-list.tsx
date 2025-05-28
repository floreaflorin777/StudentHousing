import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { GroceryItem, Flatmate } from "@shared/schema";

export function GroceryList() {
  const [newItem, setNewItem] = useState("");
  const queryClient = useQueryClient();

  const { data: groceryItems = [] } = useQuery<GroceryItem[]>({
    queryKey: ["/api/grocery-items"],
  });
  
  const { data: flatmates = [] } = useQuery<Flatmate[]>({
    queryKey: ["/api/flatmates"],
  });

  const addItemMutation = useMutation({
    mutationFn: async (name: string) => {
      return apiRequest("POST", "/api/grocery-items", {
        name,
        addedBy: 1, // Assuming current user is Alex Johnson (id: 1)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grocery-items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      setNewItem("");
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      return apiRequest("PATCH", `/api/grocery-items/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grocery-items"] });
    },
  });

  const handleAddItem = () => {
    if (newItem.trim()) {
      addItemMutation.mutate(newItem.trim());
    }
  };

  const handleToggleItem = (id: number, completed: boolean) => {
    updateItemMutation.mutate({ id, completed });
  };

  const getFlatmateName = (id: number) => {
    const flatmate = flatmates.find(f => f.id === id);
    return flatmate?.name.split(' ')[0] || 'Unknown';
  };

  const displayItems = groceryItems.slice(0, 4); // Show only first 4 items

  return (
    <Card>
      <CardHeader className="border-b border-slate-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">
            Grocery List
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-blue-600">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {displayItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={(checked) => 
                    handleToggleItem(item.id, checked as boolean)
                  }
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className={cn(
                  "text-sm",
                  item.completed 
                    ? "text-slate-400 line-through" 
                    : "text-slate-900"
                )}>
                  {item.name}
                </span>
              </div>
              <span className="text-xs text-slate-500">
                {getFlatmateName(item.addedBy)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Add item..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              className="flex-1"
            />
            <Button 
              size="sm"
              onClick={handleAddItem}
              disabled={!newItem.trim() || addItemMutation.isPending}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

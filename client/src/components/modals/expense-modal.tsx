import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertExpenseSchema, type Flatmate } from "@shared/schema";
import { z } from "zod";
import { useState } from "react";

interface ExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = insertExpenseSchema.extend({
  amount: z.string().min(1, "Amount is required"),
});

type FormData = z.infer<typeof formSchema>;

export function ExpenseModal({ open, onOpenChange }: ExpenseModalProps) {
  const queryClient = useQueryClient();
  const [selectedFlatmates, setSelectedFlatmates] = useState<number[]>([]);
  
  const { data: flatmates = [] } = useQuery<Flatmate[]>({
    queryKey: ["/api/flatmates"],
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "",
      category: "groceries",
      paidBy: 1, // Assuming current user is Alex Johnson
    },
  });

  const createExpenseMutation = useMutation({
    mutationFn: async (data: { expense: any; shares: any[] }) => {
      return apiRequest("POST", "/api/expenses", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/expense-shares"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      reset();
      setSelectedFlatmates([]);
      onOpenChange(false);
    },
  });

  const onSubmit = (data: FormData) => {
    const amount = parseFloat(data.amount);
    const shareAmount = selectedFlatmates.length > 0 ? amount / selectedFlatmates.length : amount;
    
    const expense = {
      ...data,
      amount: amount.toString(),
    };

    const shares = selectedFlatmates.map(flatmateId => ({
      flatmateId,
      amount: shareAmount.toFixed(2),
      paid: flatmateId === data.paidBy,
    }));

    createExpenseMutation.mutate({ expense, shares });
  };

  const handleFlatemateToggle = (flatmateId: number) => {
    setSelectedFlatmates(prev => 
      prev.includes(flatmateId)
        ? prev.filter(id => id !== flatmateId)
        : [...prev, flatmateId]
    );
  };

  const categoryValue = watch("category");
  const paidByValue = watch("paidBy");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register("description")}
              placeholder="Enter expense description"
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register("amount")}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={categoryValue}
              onValueChange={(value) => setValue("category", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="groceries">Groceries</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="household">Household</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paidBy">Paid By</Label>
            <Select
              value={paidByValue?.toString()}
              onValueChange={(value) => setValue("paidBy", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select who paid" />
              </SelectTrigger>
              <SelectContent>
                {flatmates.map((flatmate) => (
                  <SelectItem key={flatmate.id} value={flatmate.id.toString()}>
                    {flatmate.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paidBy && (
              <p className="text-sm text-red-600">{errors.paidBy.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Split Between</Label>
            <div className="space-y-2">
              {flatmates.map((flatmate) => (
                <div key={flatmate.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedFlatmates.includes(flatmate.id)}
                    onCheckedChange={() => handleFlatemateToggle(flatmate.id)}
                  />
                  <Label className="text-sm font-normal">
                    {flatmate.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createExpenseMutation.isPending}>
              {createExpenseMutation.isPending ? "Creating..." : "Create Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

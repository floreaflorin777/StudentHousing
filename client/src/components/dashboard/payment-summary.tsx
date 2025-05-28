import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Flatmate, ExpenseShare } from "@shared/schema";

export function PaymentSummary() {
  const { data: flatmates = [] } = useQuery<Flatmate[]>({
    queryKey: ["/api/flatmates"],
  });
  
  const { data: expenseShares = [] } = useQuery<ExpenseShare[]>({
    queryKey: ["/api/expense-shares"],
  });

  const getFlatemateBalance = (flatmateId: number) => {
    const shares = expenseShares.filter(share => share.flatmateId === flatmateId);
    const totalOwed = shares.reduce((sum, share) => {
      if (!share.paid) {
        return sum + parseFloat(share.amount);
      }
      return sum;
    }, 0);
    
    if (totalOwed > 0) {
      return { status: 'owes', amount: totalOwed.toFixed(2) };
    } else if (totalOwed === 0) {
      return { status: 'even', amount: '0.00' };
    } else {
      return { status: 'paid', amount: Math.abs(totalOwed).toFixed(2) };
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-slate-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">
            Payment Summary
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-blue-600">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {flatmates.map((flatmate) => {
            const balance = getFlatemateBalance(flatmate.id);
            
            return (
              <div key={flatmate.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: flatmate.color }}
                  >
                    {flatmate.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{flatmate.name}</p>
                    <p className="text-xs text-slate-500">
                      {flatmate.id === 1 ? 'You' : 'Flatmate'}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  balance.status === 'owes' 
                    ? 'text-amber-600' 
                    : balance.status === 'paid'
                    ? 'text-green-600'
                    : 'text-slate-600'
                }`}>
                  {balance.status === 'owes' && `Owes $${balance.amount}`}
                  {balance.status === 'paid' && `Paid $${balance.amount}`}
                  {balance.status === 'even' && 'Even'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <Button className="w-full">
            Send Payment Reminders
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

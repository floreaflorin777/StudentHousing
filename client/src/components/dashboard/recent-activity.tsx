import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Check, Plus, DollarSign } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Activity, Flatmate } from "@shared/schema";

export function RecentActivity() {
  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });
  
  const { data: flatmates = [] } = useQuery<Flatmate[]>({
    queryKey: ["/api/flatmates"],
  });

  const getFlatmateName = (id: number) => {
    const flatmate = flatmates.find(f => f.id === id);
    return flatmate?.name || 'Unknown';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return <Check className="h-3 w-3 text-green-600" />;
      case 'grocery_added':
      case 'task_created':
        return <Plus className="h-3 w-3 text-blue-600" />;
      case 'expense_paid':
        return <DollarSign className="h-3 w-3 text-amber-600" />;
      default:
        return <Plus className="h-3 w-3 text-blue-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'task_completed':
        return 'bg-green-100';
      case 'grocery_added':
      case 'task_created':
        return 'bg-blue-100';
      case 'expense_paid':
        return 'bg-amber-100';
      default:
        return 'bg-blue-100';
    }
  };

  return (
    <Card className="shadow-lg rounded-xl bg-white">
      <CardHeader className="border-b border-carolina-blue">
        <CardTitle className="text-lg font-semibold text-charcoal">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">
              No recent activity
            </p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900">
                    <span className="font-medium">{getFlatmateName(activity.userId)}</span>{' '}
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

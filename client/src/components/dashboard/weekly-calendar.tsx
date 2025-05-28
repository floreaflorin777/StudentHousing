import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfWeek, addDays, isSameDay, isToday } from "date-fns";
import type { Task, Flatmate } from "@shared/schema";

export function WeeklyCalendar() {
  const queryClient = useQueryClient();
  
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });
  
  const { data: flatmates = [] } = useQuery<Flatmate[]>({
    queryKey: ["/api/flatmates"],
  });

  const completeTaskMutation = useMutation({
    mutationFn: async ({ taskId, completedBy }: { taskId: number; completedBy: number }) => {
      return apiRequest("PATCH", `/api/tasks/${taskId}/complete`, { completedBy });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
  });

  const handleCompleteTask = (taskId: number) => {
    // Assuming current user is the first flatmate (Alex Johnson)
    completeTaskMutation.mutate({ taskId, completedBy: 1 });
  };

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start on Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      isSameDay(new Date(task.dueDate), date) && !task.completed
    );
  };

  const getTaskCategoryClass = (category: string) => {
    switch (category) {
      case 'cleaning':
        return 'task-cleaning task-dot-cleaning';
      case 'groceries':
        return 'task-groceries task-dot-groceries';
      case 'garbage':
        return 'task-garbage task-dot-garbage';
      default:
        return 'bg-gray-50 border-gray-200 bg-gray-500';
    }
  };

  const getFlatmateName = (id: number | null) => {
    if (!id) return 'Unassigned';
    const flatmate = flatmates.find(f => f.id === id);
    return flatmate?.name || 'Unknown';
  };

  return (
    <Card>
      <CardHeader className="border-b border-slate-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">
            This Week's Schedule
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-slate-900">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </span>
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {weekDays.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs font-medium text-slate-500 mb-2">
                {format(day, 'EEE')}
              </div>
              <div className={cn(
                "w-8 h-8 mx-auto rounded-full text-sm flex items-center justify-center",
                isToday(day) 
                  ? "bg-primary text-white" 
                  : "text-slate-900"
              )}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Task Items */}
        <div className="space-y-3 mt-6">
          {tasks
            .filter(task => !task.completed)
            .slice(0, 5) // Show only first 5 tasks
            .map((task) => {
              const categoryClasses = getTaskCategoryClass(task.category);
              return (
                <div 
                  key={task.id} 
                  className={cn("flex items-center p-3 border rounded-lg", categoryClasses.split(' ').slice(0, -1).join(' '))}
                >
                  <div className={cn("w-3 h-3 rounded-full mr-3", categoryClasses.split(' ').pop())} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{task.title}</p>
                    <p className="text-xs text-slate-500">
                      {getFlatmateName(task.assignedTo)} • {format(new Date(task.dueDate), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={completeTaskMutation.isPending}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}

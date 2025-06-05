import { Sidebar } from "@/components/layout/sidebar";
import { StatCard } from "@/components/dashboard/stat-card";
import { WeeklyCalendar } from "@/components/dashboard/weekly-calendar";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { GroceryList } from "@/components/dashboard/grocery-list";
import { PaymentSummary } from "@/components/dashboard/payment-summary";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TaskModal } from "@/components/modals/task-modal";
import { ExpenseModal } from "@/components/modals/expense-modal";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Bell, Plus, Menu } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  return (
    <div className="min-h-screen bg-carolina-blue">
      {/* Sidebar */}
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-white border-b border-carolina-blue/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-lapis-lazuli rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-charcoal">FlatMate</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:pl-72 p-8 space-y-8">
        {/* Header */}
        <header className="bg-white border-b border-carolina-blue/30 px-6 py-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-charcoal">Dashboard</h1>
              <p className="text-sm text-lapis-lazuli mt-1">Manage your shared living space</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-pantone text-white text-xs rounded-full flex items-center justify-center">
                  {stats?.overdueTasks || 0}
                </span>
              </Button>
              {/* Quick Actions */}
              <Button onClick={() => setIsTaskModalOpen(true)} className="bg-hunyadi-yellow text-charcoal hover:bg-orange-pantone hover:text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard
            title="Tasks Due Today"
            value={stats?.tasksToday || 0}
            icon="calendar-day"
            color="red"
            subtitle={`${stats?.overdueTasks || 0} overdue tasks pending`}
          />
          <StatCard
            title="Completed This Week"
            value={stats?.completedThisWeek || 0}
            icon="check-circle"
            color="green"
            subtitle="+20% from last week"
          />
          <StatCard
            title="Grocery Balance"
            value={`$${stats?.groceryBalance || "0.00"}`}
            icon="shopping-cart"
            color="amber"
            subtitle="You owe $12.25"
          />
          <StatCard
            title="Active Flatmates"
            value={stats?.activeFlatmates || 0}
            icon="users"
            color="blue"
            subtitle="All members active"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Calendar & Activities */}
          <div className="lg:col-span-2 space-y-8">
            <WeeklyCalendar />
            <RecentActivity />
          </div>

          {/* Right Column - Quick Actions & Lists */}
          <div className="space-y-8">
            <GroceryList />
            <PaymentSummary />
            <QuickActions 
              onAddTask={() => setIsTaskModalOpen(true)}
              onAddExpense={() => setIsExpenseModalOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <TaskModal 
        open={isTaskModalOpen} 
        onOpenChange={setIsTaskModalOpen} 
      />
      <ExpenseModal 
        open={isExpenseModalOpen} 
        onOpenChange={setIsExpenseModalOpen} 
      />
    </div>
  );
}
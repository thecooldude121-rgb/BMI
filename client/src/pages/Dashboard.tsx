import React from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Target, 
  DollarSign, 
  TrendingUp,
  Calendar,
  CheckSquare,
  AlertCircle,
  Clock
} from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import RecentActivity from '../components/Dashboard/RecentActivity';
import SalesFunnel from '../components/Dashboard/SalesFunnel';
import TaskOverview from '../components/Dashboard/TaskOverview';
import LeadScoreChart from '../components/Dashboard/LeadScoreChart';

const Dashboard: React.FC = () => {
  const [location, setLocation] = useLocation();
  
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/leads'],
    enabled: true
  });
  
  const { data: deals = [], isLoading: dealsLoading } = useQuery({
    queryKey: ['/api/deals'],
    enabled: true
  });
  
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/tasks'],
    enabled: true
  });

  const leadsArray = Array.isArray(leads) ? leads : [];
  const dealsArray = Array.isArray(deals) ? deals : [];
  const tasksArray = Array.isArray(tasks) ? tasks : [];

  const stats = {
    totalLeads: leadsArray.length,
    qualifiedLeads: leadsArray.filter((lead: any) => lead.stage === 'qualified' || lead.stage === 'proposal').length,
    totalDeals: dealsArray.reduce((sum: number, deal: any) => sum + parseFloat(deal.value || 0), 0),
    wonDeals: dealsArray.filter((deal: any) => deal.stage === 'closed-won').length,
    pendingTasks: tasksArray.filter((task: any) => task.status === 'pending').length,
    overdueTasks: tasksArray.filter((task: any) => new Date(task.dueDate) < new Date() && task.status !== 'completed').length
  };

  if (leadsLoading || dealsLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Add Lead
          </button>
          <button 
            onClick={() => setLocation('/crm/deals/create')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Create Deal
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads.toString()}
          icon={Users}
          change="+12%"
          changeType="positive"
          color="blue"
        />
        <StatCard
          title="Qualified Leads"
          value={stats.qualifiedLeads.toString()}
          icon={Target}
          change="+8%"
          changeType="positive"
          color="green"
        />
        <StatCard
          title="Pipeline Value"
          value={`$${(stats.totalDeals / 1000).toFixed(0)}K`}
          icon={DollarSign}
          change="+15%"
          changeType="positive"
          color="yellow"
        />
        <StatCard
          title="Won Deals"
          value={stats.wonDeals.toString()}
          icon={TrendingUp}
          change="+5%"
          changeType="positive"
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Leads</h3>
          <div className="space-y-3">
            {leadsArray.slice(0, 5).map((lead: any) => (
              <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{lead.name}</p>
                  <p className="text-sm text-gray-600">{lead.company} - {lead.stage}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${parseInt(lead.value || 0).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{lead.probability}% probability</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Deals */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Deals</h3>
          <div className="space-y-3">
            {dealsArray.slice(0, 4).map((deal: any) => (
              <div key={deal.id} className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium text-gray-900">{deal.name}</p>
                <p className="text-sm text-gray-600">{deal.stage}</p>
                <p className="text-sm font-medium text-green-600">${parseInt(deal.value || 0).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-md">
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingTasks}</p>
            <p className="text-sm text-yellow-600">Pending Tasks</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-md">
            <p className="text-2xl font-bold text-red-600">{stats.overdueTasks}</p>
            <p className="text-sm text-red-600">Overdue Tasks</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-md">
            <p className="text-2xl font-bold text-green-600">{tasksArray.filter((task: any) => task.status === 'completed').length}</p>
            <p className="text-sm text-green-600">Completed Tasks</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            <Users className="h-5 w-5 text-blue-600 mr-3" />
            <span className="text-sm font-medium">Import Leads</span>
          </button>
          <button className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            <Calendar className="h-5 w-5 text-green-600 mr-3" />
            <span className="text-sm font-medium">Schedule Meeting</span>
          </button>
          <button className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            <CheckSquare className="h-5 w-5 text-purple-600 mr-3" />
            <span className="text-sm font-medium">Create Task</span>
          </button>
          <button className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            <TrendingUp className="h-5 w-5 text-orange-600 mr-3" />
            <span className="text-sm font-medium">View Reports</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {stats.overdueTasks > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-sm font-medium text-red-800">
              You have {stats.overdueTasks} overdue task{stats.overdueTasks > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
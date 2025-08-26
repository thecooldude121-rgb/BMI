import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  Star,
  Users,
  Activity,
  FileText,
  Settings,
  BarChart3,
  Target,
  Clock,
  Phone,
  Mail,
  Video,
  CheckCircle,
  Circle,
  ArrowRight,
  Edit,
  Eye,
  MessageSquare,
  Paperclip,
  Share2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Deal {
  id: string;
  name: string;
  title: string;
  value: string;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  dealHealth: string;
  dealType: string;
  aiScore: number;
  lastActivityDate: string;
  followUpDate: string;
  teamMembers: string[];
  followers: string[];
  account?: {
    id: string;
    name: string;
  };
  contact?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface DealStageColumn {
  id: string;
  title: string;
  color: string;
  deals: Deal[];
}

const DEAL_STAGES = [
  { id: 'discovery', title: 'Discovery', color: 'bg-blue-500' },
  { id: 'qualification', title: 'Qualification', color: 'bg-purple-500' },
  { id: 'proposal', title: 'Proposal', color: 'bg-yellow-500' },
  { id: 'demo', title: 'Demo', color: 'bg-indigo-500' },
  { id: 'trial', title: 'Trial', color: 'bg-teal-500' },
  { id: 'negotiation', title: 'Negotiation', color: 'bg-orange-500' },
  { id: 'closed-won', title: 'Closed Won', color: 'bg-green-500' },
  { id: 'closed-lost', title: 'Closed Lost', color: 'bg-red-500' }
];

const DEAL_HEALTH_COLORS = {
  healthy: 'bg-green-100 text-green-800',
  at_risk: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800',
  hot_opportunity: 'bg-blue-100 text-blue-800',
  stalled: 'bg-gray-100 text-gray-800'
};

export default function AdvancedDealsModule() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    stage: '',
    health: '',
    assignee: '',
    dateRange: ''
  });
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const queryClient = useQueryClient();

  // Fetch deals data
  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['/api/deals'],
    queryFn: async () => {
      const response = await fetch('/api/deals');
      if (!response.ok) throw new Error('Failed to fetch deals');
      return response.json();
    }
  });

  // Transform deals into kanban columns
  const dealColumns = React.useMemo(() => {
    const columns: DealStageColumn[] = DEAL_STAGES.map(stage => ({
      ...stage,
      deals: deals.filter((deal: Deal) => deal.stage === stage.id)
    }));
    return columns;
  }, [deals]);

  // Deal update mutation
  const updateDealMutation = useMutation({
    mutationFn: async ({ dealId, updates }: { dealId: string; updates: Partial<Deal> }) => {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update deal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
    }
  });

  // Handle drag and drop for kanban
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      // Move deal to different stage
      updateDealMutation.mutate({
        dealId: draggableId,
        updates: { stage: destination.droppableId }
      });
    }
  };

  // Bulk operations
  const handleBulkOperation = (operation: string) => {
    console.log(`Performing ${operation} on deals:`, selectedDeals);
    // Implement bulk operations logic here
  };

  // Filter deals based on search and filters
  const filteredDeals = React.useMemo(() => {
    return deals.filter((deal: Deal) => {
      const matchesSearch = deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStage = !selectedFilters.stage || deal.stage === selectedFilters.stage;
      const matchesHealth = !selectedFilters.health || deal.dealHealth === selectedFilters.health;
      
      return matchesSearch && matchesStage && matchesHealth;
    });
  }, [deals, searchTerm, selectedFilters]);

  const renderDealCard = (deal: Deal, isDragging = false) => (
    <Card className={`mb-3 cursor-pointer transition-all hover:shadow-md ${isDragging ? 'rotate-2 shadow-lg' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1 line-clamp-2">{deal.name}</h4>
            <p className="text-xs text-gray-600 mb-2 line-clamp-1">{deal.title}</p>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <Badge variant="outline" className={`text-xs ${DEAL_HEALTH_COLORS[deal.dealHealth as keyof typeof DEAL_HEALTH_COLORS]}`}>
              {deal.dealHealth}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-bold text-green-600">
            ${parseInt(deal.value).toLocaleString()}
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs">{deal.probability}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs">
                {deal.contact?.firstName?.[0]}{deal.contact?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600">
              {deal.contact?.firstName} {deal.contact?.lastName}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className={`w-3 h-3 ${deal.aiScore > 80 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
            <span className="text-xs">{deal.aiScore}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{new Date(deal.lastActivityDate).toLocaleDateString()}</span>
          </div>
        </div>

        <Progress value={deal.probability} className="mt-2 h-1" />
      </CardContent>
    </Card>
  );

  const renderKanbanView = () => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-6 gap-4 h-full">
        {dealColumns.map((column) => (
          <div key={column.id} className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="font-semibold text-sm">{column.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {column.deals.length}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[200px] ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                >
                  {column.deals.map((deal, index) => (
                    <Draggable key={deal.id} draggableId={deal.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {renderDealCard(deal, snapshot.isDragging)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );

  const renderListView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredDeals.map((deal: Deal) => (
        <div key={deal.id}>
          {renderDealCard(deal)}
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="bg-white rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <input
                  type="checkbox"
                  checked={selectedDeals.length === filteredDeals.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedDeals(filteredDeals.map(d => d.id));
                    } else {
                      setSelectedDeals([]);
                    }
                  }}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deal</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Health</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Close Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDeals.map((deal: Deal) => (
              <tr key={deal.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedDeals.includes(deal.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDeals([...selectedDeals, deal.id]);
                      } else {
                        setSelectedDeals(selectedDeals.filter(id => id !== deal.id));
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-sm">{deal.name}</div>
                    <div className="text-xs text-gray-500">{deal.title}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{deal.account?.name}</td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium">${parseInt(deal.value).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{deal.probability}% chance</div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-xs">
                    {deal.stage}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={`text-xs ${DEAL_HEALTH_COLORS[deal.dealHealth as keyof typeof DEAL_HEALTH_COLORS]}`}>
                    {deal.dealHealth}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm">
                  {new Date(deal.expectedCloseDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="h-full bg-white">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Deals Pipeline</h1>
              <p className="text-gray-600">Manage your sales opportunities</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Deal
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search deals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              {selectedDeals.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedDeals.length} selected
                  </span>
                  <Button variant="outline" size="sm" onClick={() => handleBulkOperation('assign')}>
                    Assign
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkOperation('move')}>
                    Move Stage
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkOperation('tag')}>
                    Add Tags
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('kanban')}
                >
                  Kanban
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  Cards
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  Table
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
              <Select value={selectedFilters.stage} onValueChange={(value) => setSelectedFilters({...selectedFilters, stage: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Stages</SelectItem>
                  {DEAL_STAGES.map(stage => (
                    <SelectItem key={stage.id} value={stage.id}>{stage.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedFilters.health} onValueChange={(value) => setSelectedFilters({...selectedFilters, health: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Health" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Health</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="at_risk">At Risk</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="hot_opportunity">Hot Opportunity</SelectItem>
                  <SelectItem value="stalled">Stalled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedFilters.assignee} onValueChange={(value) => setSelectedFilters({...selectedFilters, assignee: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Assignees</SelectItem>
                  <SelectItem value="me">My Deals</SelectItem>
                  <SelectItem value="team">Team Deals</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedFilters.dateRange} onValueChange={(value) => setSelectedFilters({...selectedFilters, dateRange: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Close Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Dates</SelectItem>
                  <SelectItem value="this_week">This Week</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="this_quarter">This Quarter</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 h-full overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading deals...</p>
              </div>
            </div>
          ) : (
            <>
              {viewMode === 'kanban' && renderKanbanView()}
              {viewMode === 'list' && renderListView()}
              {viewMode === 'table' && renderTableView()}
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
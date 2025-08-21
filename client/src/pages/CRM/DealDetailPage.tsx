import React, { useState, useEffect } from 'react';
import { useParams, useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  MoreVertical,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Star,
  Users,
  Activity,
  FileText,
  Phone,
  Mail,
  Video,
  MessageSquare,
  Paperclip,
  Share2,
  Clock,
  Target,
  CheckCircle,
  Circle,
  ArrowRight,
  Building,
  User,
  Tag,
  Link,
  Download,
  Eye,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

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
  description: string;
  nextStep: string;
  notes: string;
  account?: {
    id: string;
    name: string;
    industry: string;
  };
  contact?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

interface Activity {
  id: string;
  subject: string;
  type: string;
  direction: string;
  status: string;
  description: string;
  scheduledAt: string;
  completedAt: string;
  createdBy: string;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
  mentions: string[];
}

interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  createdAt: string;
}

const DEAL_HEALTH_COLORS = {
  healthy: 'bg-green-100 text-green-800 border-green-200',
  at_risk: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  critical: 'bg-red-100 text-red-800 border-red-200',
  hot_opportunity: 'bg-blue-100 text-blue-800 border-blue-200',
  stalled: 'bg-gray-100 text-gray-800 border-gray-200'
};

const DEAL_STAGES = [
  'discovery', 'qualification', 'proposal', 'negotiation', 'demo', 'trial', 'closed-won', 'closed-lost'
];

export default function DealDetailPage() {
  const [match, params] = useRoute('/crm/deals/:id');
  const id = params?.id;
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [newComment, setNewComment] = useState('');
  const [newActivity, setNewActivity] = useState({
    subject: '',
    type: 'call',
    description: '',
    scheduledAt: ''
  });

  // Fetch deal data
  const { data: deal, isLoading } = useQuery({
    queryKey: ['/api/deals', id],
    queryFn: async () => {
      const response = await fetch(`/api/deals/${id}`);
      if (!response.ok) throw new Error('Failed to fetch deal');
      return response.json();
    },
    enabled: !!id
  });

  // Fetch deal activities
  const { data: activities = [] } = useQuery({
    queryKey: ['/api/activities', 'deal', id],
    queryFn: async () => {
      const response = await fetch(`/api/activities?relatedToType=deal&relatedToId=${id}`);
      if (!response.ok) throw new Error('Failed to fetch activities');
      return response.json();
    },
    enabled: !!id
  });

  // Deal update mutation
  const updateDealMutation = useMutation({
    mutationFn: async (updates: Partial<Deal>) => {
      const response = await fetch(`/api/deals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update deal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals', id] });
      setIsEditing(null);
      setEditValues({});
    }
  });

  const handleSave = (field: string) => {
    updateDealMutation.mutate({ [field]: editValues[field] });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditValues({});
  };

  const startEditing = (field: string, currentValue: any) => {
    setIsEditing(field);
    setEditValues({ [field]: currentValue });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deal...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">Deal not found</p>
          <Button onClick={() => window.location.href = '/crm/deals'} className="mt-4">
            Back to Deals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.location.href = '/crm/deals'}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold">{deal.name}</h1>
                  <Badge 
                    variant="outline" 
                    className={`${DEAL_HEALTH_COLORS[deal.dealHealth as keyof typeof DEAL_HEALTH_COLORS]}`}
                  >
                    {deal.dealHealth}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className={`w-4 h-4 ${deal.aiScore > 80 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                    <span className="text-sm font-medium">{deal.aiScore}</span>
                  </div>
                </div>
                <p className="text-gray-600">{deal.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Star className="w-4 h-4 mr-2" />
                Follow
              </Button>
              <Button>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Deal
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-full">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Deal Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Deal Value</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${parseInt(deal.value).toLocaleString()}
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Probability</p>
                        <p className="text-2xl font-bold">{deal.probability}%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Stage</p>
                        <p className="text-lg font-semibold capitalize">{deal.stage}</p>
                      </div>
                      <Target className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Close Date</p>
                        <p className="text-lg font-semibold">
                          {new Date(deal.expectedCloseDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Calendar className="w-8 h-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Information */}
              <div className="grid grid-cols-3 gap-6">
                
                {/* Deal Information */}
                <div className="col-span-2 space-y-6">
                  
                  {/* Basic Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Deal Information</span>
                        <Button variant="ghost" size="sm">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Deal Name</Label>
                          {isEditing === 'name' ? (
                            <div className="flex items-center space-x-2 mt-1">
                              <Input
                                value={editValues.name}
                                onChange={(e) => setEditValues({...editValues, name: e.target.value})}
                                className="flex-1"
                              />
                              <Button size="sm" onClick={() => handleSave('name')}>
                                <Save className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={handleCancel}>
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <p 
                              className="mt-1 cursor-pointer hover:bg-gray-50 p-2 rounded"
                              onClick={() => startEditing('name', deal.name)}
                            >
                              {deal.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-600">Stage</Label>
                          {isEditing === 'stage' ? (
                            <div className="flex items-center space-x-2 mt-1">
                              <Select
                                value={editValues.stage}
                                onValueChange={(value) => setEditValues({...editValues, stage: value})}
                              >
                                <SelectTrigger className="flex-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {DEAL_STAGES.map(stage => (
                                    <SelectItem key={stage} value={stage}>
                                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button size="sm" onClick={() => handleSave('stage')}>
                                <Save className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={handleCancel}>
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <p 
                              className="mt-1 cursor-pointer hover:bg-gray-50 p-2 rounded capitalize"
                              onClick={() => startEditing('stage', deal.stage)}
                            >
                              {deal.stage}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-600">Description</Label>
                        {isEditing === 'description' ? (
                          <div className="space-y-2 mt-1">
                            <Textarea
                              value={editValues.description}
                              onChange={(e) => setEditValues({...editValues, description: e.target.value})}
                              rows={3}
                            />
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={() => handleSave('description')}>
                                <Save className="w-3 h-3 mr-1" />
                                Save
                              </Button>
                              <Button size="sm" variant="ghost" onClick={handleCancel}>
                                <X className="w-3 h-3 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p 
                            className="mt-1 cursor-pointer hover:bg-gray-50 p-2 rounded"
                            onClick={() => startEditing('description', deal.description)}
                          >
                            {deal.description || 'Click to add description...'}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-600">Next Step</Label>
                        {isEditing === 'nextStep' ? (
                          <div className="space-y-2 mt-1">
                            <Input
                              value={editValues.nextStep}
                              onChange={(e) => setEditValues({...editValues, nextStep: e.target.value})}
                            />
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={() => handleSave('nextStep')}>
                                <Save className="w-3 h-3 mr-1" />
                                Save
                              </Button>
                              <Button size="sm" variant="ghost" onClick={handleCancel}>
                                <X className="w-3 h-3 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p 
                            className="mt-1 cursor-pointer hover:bg-gray-50 p-2 rounded"
                            onClick={() => startEditing('nextStep', deal.nextStep)}
                          >
                            {deal.nextStep || 'Click to add next step...'}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Activities & Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Activities & Timeline</span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Activity
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>New Activity</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Subject</Label>
                                <Input
                                  value={newActivity.subject}
                                  onChange={(e) => setNewActivity({...newActivity, subject: e.target.value})}
                                  placeholder="Activity subject"
                                />
                              </div>
                              <div>
                                <Label>Type</Label>
                                <Select
                                  value={newActivity.type}
                                  onValueChange={(value) => setNewActivity({...newActivity, type: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="call">Call</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="meeting">Meeting</SelectItem>
                                    <SelectItem value="task">Task</SelectItem>
                                    <SelectItem value="note">Note</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Description</Label>
                                <Textarea
                                  value={newActivity.description}
                                  onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                                  placeholder="Activity description"
                                />
                              </div>
                              <div>
                                <Label>Scheduled Date</Label>
                                <Input
                                  type="datetime-local"
                                  value={newActivity.scheduledAt}
                                  onChange={(e) => setNewActivity({...newActivity, scheduledAt: e.target.value})}
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline">Cancel</Button>
                                <Button>Create Activity</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-4">
                          {activities.map((activity: Activity) => (
                            <div key={activity.id} className="flex space-x-3 p-3 border rounded-lg">
                              <div className="flex-shrink-0">
                                {activity.type === 'call' && <Phone className="w-5 h-5 text-blue-500" />}
                                {activity.type === 'email' && <Mail className="w-5 h-5 text-green-500" />}
                                {activity.type === 'meeting' && <Video className="w-5 h-5 text-purple-500" />}
                                {activity.type === 'task' && <CheckCircle className="w-5 h-5 text-orange-500" />}
                                {activity.type === 'note' && <FileText className="w-5 h-5 text-gray-500" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{activity.subject}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {activity.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {activity.completedAt 
                                    ? `Completed ${new Date(activity.completedAt).toLocaleDateString()}`
                                    : activity.scheduledAt ? `Scheduled ${new Date(activity.scheduledAt).toLocaleDateString()}` : 'No date set'
                                  }
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  
                  {/* Key Contacts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Key Contacts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {deal.account && (
                        <div className="flex items-center space-x-3 p-2 border rounded">
                          <Building className="w-8 h-8 text-blue-500" />
                          <div>
                            <p className="font-medium">{deal.account.name}</p>
                            <p className="text-xs text-gray-500">{deal.account.industry}</p>
                          </div>
                        </div>
                      )}
                      
                      {deal.contact && (
                        <div className="flex items-center space-x-3 p-2 border rounded">
                          <User className="w-8 h-8 text-green-500" />
                          <div>
                            <p className="font-medium">
                              {deal.contact.firstName} {deal.contact.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{deal.contact.email}</p>
                            <p className="text-xs text-gray-500">{deal.contact.phone}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Deal Health & AI Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Deal Intelligence</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">AI Health Score</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={deal.aiScore} className="w-16 h-2" />
                          <span className="text-sm font-bold">{deal.aiScore}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Key Insights</h4>
                        <div className="space-y-1">
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                            <p className="text-xs text-gray-600">
                              No activity in 5 days - consider follow-up
                            </p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
                            <p className="text-xs text-gray-600">
                              High engagement signals detected
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Phone className="w-4 h-4 mr-2" />
                        Schedule Call
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Video className="w-4 h-4 mr-2" />
                        Book Meeting
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Create Proposal
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Team & Followers */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Team & Followers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Deal Owner</span>
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">JD</AvatarFallback>
                          </Avatar>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Team Members</span>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="flex space-x-1">
                            {[1, 2, 3].map((i) => (
                              <Avatar key={i} className="w-6 h-6">
                                <AvatarFallback className="text-xs">U{i}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Followers</span>
                            <span className="text-xs text-gray-500">{deal.followers.length}</span>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <Star className="w-4 h-4 mr-2" />
                            Follow Deal
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
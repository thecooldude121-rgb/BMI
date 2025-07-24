import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Maximize, 
  Users, 
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  Share,
  Link,
  Bot,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  email: string;
  speakingTime: number;
  engagementScore: number;
}

interface Task {
  id: string;
  assignee: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function MeetingDashboard() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration] = useState('33:26');
  const [activeTab, setActiveTab] = useState('Summary');
  const [showParticipants, setShowParticipants] = useState(true);
  const queryClient = useQueryClient();

  // Fetch meeting data
  const { data: meeting, isLoading } = useQuery({
    queryKey: ['/api/meetings', id],
    enabled: !!id
  });

  const { data: summary } = useQuery({
    queryKey: ['/api/meetings', id, 'summary'],
    enabled: !!id
  });

  const { data: outcomes } = useQuery({
    queryKey: ['/api/meetings', id, 'outcomes'],
    enabled: !!id
  });

  const { data: insights } = useQuery({
    queryKey: ['/api/meetings', id, 'insights'],
    enabled: !!id
  });

  const { data: questions } = useQuery({
    queryKey: ['/api/meetings', id, 'questions'],
    enabled: !!id
  });

  // Mock data for demonstration
  const participants: Participant[] = [
    { id: '1', name: 'Nicholas Coston', email: 'nicholas@company.com', speakingTime: 94, engagementScore: 94 },
    { id: '2', name: 'Venkatraj Radhakrishnan', email: 'venkat@company.com', speakingTime: 65, engagementScore: 65 }
  ];

  const tasks: Task[] = [
    {
      id: '1',
      assignee: 'Nicholas Coston',
      description: 'Send comprehensive list of media options in New York City area (beyond just Out Front subway stations) to Manjusha for the media buy request',
      dueDate: 'Tomorrow',
      completed: false,
      priority: 'high'
    },
    {
      id: '2',
      assignee: 'Nicholas Coston',
      description: 'Follow up with Tiffany from Fan TV regarding demo feedback and pricing discussion',
      dueDate: 'Tomorrow',
      completed: false,
      priority: 'medium'
    },
    {
      id: '3',
      assignee: 'Nicholas Coston',
      description: 'Schedule meeting with Bright Path to discuss their concepts/platforms (including Nick and Venkat) for early next week',
      dueDate: 'Tomorrow',
      completed: false,
      priority: 'medium'
    }
  ];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      // API call to update task
      return { taskId, completed };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meetings', id, 'outcomes'] });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Meeting not found</h2>
          <p className="text-gray-600 mt-2">The meeting you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {(meeting as any)?.title || 'Media tech Standup Americas'}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Jul 24, 6:02 PM</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              <Share className="h-4 w-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              <Link className="h-4 w-4" />
              <span>Link opportunity</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Bot className="h-4 w-4" />
              <span>Generate AI Email</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Question Bar */}
      <div className="bg-blue-50 border-b px-6 py-3">
        <div className="flex items-center space-x-3">
          <Bot className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-gray-700">Ask Sybill about this meeting, like</span>
          <button className="text-sm text-blue-600 hover:underline">
            how did this call go and what could have gone better?
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="bg-black rounded-lg overflow-hidden">
                <div className="relative aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-2">Media tech Standup Americas</h2>
                      <p className="text-lg opacity-75">Jul 24, 6:02 PM</p>
                    </div>
                  </div>
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={togglePlay}
                        className="text-white hover:text-blue-400 transition-colors"
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </button>
                      <button className="text-white hover:text-blue-400">
                        <SkipBack className="h-5 w-5" />
                      </button>
                      <button className="text-white hover:text-blue-400">
                        <SkipForward className="h-5 w-5" />
                      </button>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-600 rounded-full h-1">
                          <div className="bg-blue-500 h-1 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                      </div>
                      <span className="text-white text-sm">{currentTime} / {duration}</span>
                      <button className="text-white hover:text-blue-400">
                        <Volume2 className="h-5 w-5" />
                      </button>
                      <button className="text-white hover:text-blue-400">
                        <Maximize className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className="mt-4">
                <button 
                  onClick={() => setShowParticipants(!showParticipants)}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Users className="h-4 w-4" />
                  <span>{participants.length} participants</span>
                  {showParticipants ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                
                {showParticipants && (
                  <div className="mt-3 space-y-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{participant.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{participant.engagementScore}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${participant.engagementScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Tabs */}
              <div className="border-b">
                <nav className="flex space-x-6">
                  {['Summary', 'Transcript'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'Summary' && (
                <div className="space-y-6">
                  {/* Outcome */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Outcome</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {(summary as any)?.conciseSummary || 
                        `This media tech standup focused on reviewing ongoing business development initiatives and 
                        partnerships. Key outcomes include progress on partnerships with Outdoor Link and Catchbox Media, 
                        signing of an NBA Atlanta Hawks agreement for bronze-level participation in the OOH Atlanta 
                        event, and new engagement with Edison Interactive regarding their golf cart digital screens. Follow-up 
                        actions were established for Fanty discussions regarding pricing and demo feedback. The team 
                        also acknowledged progress with Flo Advertising and their HyperVision 3D technology integration, 
                        while a potential New York City media buy opportunity is being explored with multiple vendors.`}
                    </p>
                  </div>

                  {/* Tasks */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Tasks</h3>
                    <div className="space-y-3">
                      {tasks.map((task) => (
                        <div key={task.id} className="flex items-start space-x-3">
                          <button
                            onClick={() => updateTaskStatus.mutate({ 
                              taskId: task.id, 
                              completed: !task.completed 
                            })}
                            className="mt-1 text-gray-400 hover:text-blue-600"
                          >
                            {task.completed ? 
                              <CheckCircle className="h-5 w-5 text-green-600" /> : 
                              <Circle className="h-5 w-5" />
                            }
                          </button>
                          <div className="flex-1">
                            <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              <span className="font-medium">{task.assignee}</span> {task.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-orange-600">{task.dueDate}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Transcript' && (
                <div>
                  <div className="text-sm text-gray-700 space-y-4">
                    <div>
                      <span className="font-medium">Nicholas Coston:</span> Good morning everyone, let's start with our regular standup. 
                      Can we begin with the updates on our media partnerships?
                    </div>
                    <div>
                      <span className="font-medium">Venkatraj Radhakrishnan:</span> Sure, I've been working on the Outdoor Link 
                      integration. We've made significant progress on the API connections...
                    </div>
                    <div className="text-center py-4">
                      <button className="text-blue-600 hover:text-blue-700 text-sm">
                        Load more transcript...
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
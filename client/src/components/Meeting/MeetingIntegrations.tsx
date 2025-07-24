import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Link,
  ExternalLink,
  Copy,
  CheckCircle,
  Plus,
  Settings,
  Smartphone
} from 'lucide-react';

interface MeetingIntegrationProps {
  meetingId?: string;
  onMeetingCreated?: (meeting: any) => void;
}

export default function MeetingIntegrations({ meetingId, onMeetingCreated }: MeetingIntegrationProps) {
  const [activeTab, setActiveTab] = useState('create');
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    description: '',
    scheduledStart: '',
    scheduledEnd: '',
    attendees: '',
    platform: 'google-meet', // 'google-meet' | 'teams'
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const createMeetingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/meetings/create-with-platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create meeting');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/meetings'] });
      onMeetingCreated?.(data);
      setMeetingForm({
        title: '',
        description: '',
        scheduledStart: '',
        scheduledEnd: '',
        attendees: '',
        platform: 'google-meet',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
    }
  });

  const generateMeetingLinkMutation = useMutation({
    mutationFn: async ({ platform, meetingData }: { platform: string; meetingData: any }) => {
      const response = await fetch('/api/meetings/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, ...meetingData })
      });
      if (!response.ok) throw new Error('Failed to generate meeting link');
      return response.json();
    }
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateGoogleMeetLink = () => {
    const startTime = new Date(meetingForm.scheduledStart);
    const endTime = new Date(meetingForm.scheduledEnd);
    
    const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
    googleCalendarUrl.searchParams.set('action', 'TEMPLATE');
    googleCalendarUrl.searchParams.set('text', meetingForm.title);
    googleCalendarUrl.searchParams.set('details', meetingForm.description);
    googleCalendarUrl.searchParams.set('dates', 
      `${startTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`
    );
    googleCalendarUrl.searchParams.set('add', meetingForm.attendees.replace(/\s/g, ''));
    googleCalendarUrl.searchParams.set('ctz', meetingForm.timezone);
    
    return googleCalendarUrl.toString();
  };

  const generateTeamsLink = () => {
    const startTime = new Date(meetingForm.scheduledStart);
    const endTime = new Date(meetingForm.scheduledEnd);
    
    const teamsUrl = new URL('https://teams.microsoft.com/l/meeting/new');
    const meetingParams = {
      subject: meetingForm.title,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      content: meetingForm.description,
      attendees: meetingForm.attendees
    };
    
    // Note: Teams deep linking requires specific formatting
    return `https://teams.microsoft.com/l/meeting/new?subject=${encodeURIComponent(meetingForm.title)}&startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`;
  };

  const handleCreateMeeting = async () => {
    if (!meetingForm.title || !meetingForm.scheduledStart) {
      alert('Please fill in meeting title and start time');
      return;
    }

    const meetingData = {
      ...meetingForm,
      scheduledStart: new Date(meetingForm.scheduledStart),
      scheduledEnd: new Date(meetingForm.scheduledEnd || meetingForm.scheduledStart),
      attendees: meetingForm.attendees.split(',').map((a: string) => a.trim()).filter(Boolean),
      status: 'scheduled',
      type: 'video'
    };

    createMeetingMutation.mutate(meetingData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 py-4">
          {['create', 'integrate', 'calendar'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'create' && <><Video className="h-4 w-4 inline mr-2" />Quick Meeting</>}
              {tab === 'integrate' && <><Settings className="h-4 w-4 inline mr-2" />Platform Integration</>}
              {tab === 'calendar' && <><Calendar className="h-4 w-4 inline mr-2" />Calendar Sync</>}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'create' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Platform
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMeetingForm(prev => ({ ...prev, platform: 'google-meet' }))}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      meetingForm.platform === 'google-meet'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Video className="h-8 w-8 text-blue-600" />
                      <span className="text-sm font-medium">Google Meet</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setMeetingForm(prev => ({ ...prev, platform: 'teams' }))}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      meetingForm.platform === 'teams'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Smartphone className="h-8 w-8 text-purple-600" />
                      <span className="text-sm font-medium">Teams</span>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={meetingForm.title}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Weekly Team Standup"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="scheduledStart" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  id="scheduledStart"
                  type="datetime-local"
                  value={meetingForm.scheduledStart}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, scheduledStart: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="scheduledEnd" className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  id="scheduledEnd"
                  type="datetime-local"
                  value={meetingForm.scheduledEnd}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, scheduledEnd: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 mb-2">
                Attendees (comma-separated emails)
              </label>
              <input
                id="attendees"
                type="text"
                value={meetingForm.attendees}
                onChange={(e) => setMeetingForm(prev => ({ ...prev, attendees: e.target.value }))}
                placeholder="user1@company.com, user2@company.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Description
              </label>
              <textarea
                id="description"
                value={meetingForm.description}
                onChange={(e) => setMeetingForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Discuss project updates and next steps..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between">
              <div className="flex space-x-3">
                {meetingForm.title && meetingForm.scheduledStart && (
                  <>
                    <a
                      href={meetingForm.platform === 'google-meet' ? generateGoogleMeetLink() : generateTeamsLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <Calendar className="h-4 w-4" />
                      Add to Calendar
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <button
                      onClick={() => copyToClipboard(meetingForm.platform === 'google-meet' ? generateGoogleMeetLink() : generateTeamsLink())}
                      className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={handleCreateMeeting}
                disabled={createMeetingMutation.isPending || !meetingForm.title || !meetingForm.scheduledStart}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                Create Meeting
              </button>
            </div>
          </div>
        )}

        {activeTab === 'integrate' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Integration</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Connect your Google Workspace or Microsoft 365 account to automatically sync meetings and calendar events.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                <button className="flex items-center justify-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Video className="h-6 w-6 text-blue-600" />
                  <span className="font-medium">Connect Google</span>
                </button>
                <button className="flex items-center justify-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Smartphone className="h-6 w-6 text-purple-600" />
                  <span className="font-medium">Connect Microsoft</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar Synchronization</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Sync your meetings with external calendars and set up automatic reminders.
              </p>
              
              <div className="space-y-4 max-w-lg mx-auto">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Google Calendar Sync</span>
                  </div>
                  <button className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                    Connected
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Outlook Calendar Sync</span>
                  </div>
                  <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
                    Connect
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">Meeting Reminders</span>
                  </div>
                  <button className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                    Enabled
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
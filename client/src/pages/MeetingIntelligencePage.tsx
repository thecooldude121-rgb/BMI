import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Brain, Calendar, Mic, FileText, Users, Plus, Loader2 } from 'lucide-react';

export default function MeetingIntelligencePage() {
  const [activeTab, setActiveTab] = useState('create');
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    description: '',
    transcript: '',
    scheduledStart: '',
    scheduledEnd: '',
    attendees: '',
    type: 'sales'
  });
  
  const queryClient = useQueryClient();

  // Fetch meetings
  const { data: meetings = [], isLoading: meetingsLoading } = useQuery({
    queryKey: ['/api/meetings']
  });

  // Create meeting mutation
  const createMeetingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create meeting');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meetings'] });
      alert('Meeting created successfully');
      setMeetingForm({
        title: '',
        description: '',
        transcript: '',
        scheduledStart: '',
        scheduledEnd: '',
        attendees: '',
        type: 'sales'
      });
    }
  });

  const handleCreateMeeting = async () => {
    if (!meetingForm.title || !meetingForm.transcript) {
      alert('Please fill in meeting title and transcript');
      return;
    }

    const meetingData = {
      ...meetingForm,
      scheduledStart: new Date(meetingForm.scheduledStart || new Date()),
      scheduledEnd: new Date(meetingForm.scheduledEnd || new Date()),
      attendees: meetingForm.attendees.split(',').map((a: string) => a.trim()).filter(Boolean),
      status: 'completed',
      createdBy: 'current-user-id'
    };

    createMeetingMutation.mutate(meetingData);
  };

  const handleAnalyzeMeeting = async (meetingId: string) => {
    try {
      const response = await fetch(`/api/meetings/${meetingId}/analyze`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to analyze meeting');
      alert('Meeting analyzed successfully');
      queryClient.invalidateQueries({ queryKey: ['/api/meetings'] });
    } catch (error) {
      alert('Failed to analyze meeting');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Brain className="h-8 w-8 text-blue-600" />
          AI Meeting Intelligence
        </h1>
        <p className="text-gray-600 mt-2">
          Transform your meetings into actionable insights with AI-powered analysis
        </p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'create', label: 'Create Meeting', icon: Mic },
            { key: 'meetings', label: 'Meetings', icon: Calendar }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'create' && (
          <div className="bg-white rounded-lg shadow border p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5" />
                New Meeting Setup
              </h2>
              <p className="text-gray-600">
                Create a new meeting record and add transcript for AI analysis
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={meetingForm.title}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Sales Discovery Call - Acme Corp"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Type
                  </label>
                  <select
                    id="type"
                    value={meetingForm.type}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sales">Sales Call</option>
                    <option value="discovery">Discovery Call</option>
                    <option value="demo">Product Demo</option>
                    <option value="call">Phone Call</option>
                    <option value="video">Video Call</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 mb-1">
                    Attendees (comma-separated)
                  </label>
                  <input
                    id="attendees"
                    type="text"
                    value={meetingForm.attendees}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, attendees: e.target.value }))}
                    placeholder="john.doe@acme.com, sarah.smith@company.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="scheduledStart" className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label htmlFor="scheduledEnd" className="block text-sm font-medium text-gray-700 mb-1">
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
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Description
                  </label>
                  <textarea
                    id="description"
                    value={meetingForm.description}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Quarterly business review with key stakeholders..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div>
                <label htmlFor="transcript" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Meeting Transcript
                </label>
                <textarea
                  id="transcript"
                  value={meetingForm.transcript}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, transcript: e.target.value }))}
                  placeholder="Paste or type the meeting transcript here for AI analysis..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={handleCreateMeeting} 
                disabled={createMeetingMutation.isPending || !meetingForm.title || !meetingForm.transcript}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMeetingMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
                Create & Analyze Meeting
              </button>
            </div>
          </div>
        )}

        {activeTab === 'meetings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Meeting History</h2>
              <button
                onClick={() => setActiveTab('create')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                New Meeting
              </button>
            </div>
            
            {meetingsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : Array.isArray(meetings) && meetings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meetings.map((meeting: any) => (
                  <div key={meeting.id} className="bg-white rounded-lg shadow border p-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg line-clamp-2">{meeting.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          meeting.type === 'sales' ? 'bg-green-100 text-green-800' :
                          meeting.type === 'demo' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {meeting.type}
                        </span>
                      </div>
                      
                      {meeting.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">{meeting.description}</p>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {meeting.scheduledStart ? new Date(meeting.scheduledStart).toLocaleDateString() : 'No date set'}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        {Array.isArray(meeting.attendees) ? `${meeting.attendees.length} attendees` : 'No attendees'}
                      </div>
                      
                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            meeting.status === 'completed' ? 'bg-green-100 text-green-800' :
                            meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {meeting.status}
                          </span>
                          
                          {meeting.transcript && (
                            <button
                              onClick={() => handleAnalyzeMeeting(meeting.id)}
                              className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              <Brain className="h-4 w-4" />
                              Analyze
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500">No meetings found</h3>
                <p className="text-sm text-gray-400 mt-2">Create your first meeting to get started</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
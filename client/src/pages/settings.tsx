import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Key, 
  Database, 
  Bell,
  Download,
  Trash2,
  AlertTriangle
} from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                <p className="text-sm text-gray-600">Manage your MeetingAI preferences and configuration</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 text-blue-500 mr-2" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-green-800">Google Gemini API Connected</p>
                    <p className="text-sm text-green-600">Transcription and analysis services are active</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Your Google Gemini API key is securely stored and used for:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Audio transcription with Gemini 1.5 Pro</li>
                  <li>Meeting analysis with Gemini AI</li>
                  <li>Generating summaries and insights</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Processing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="w-5 h-5 text-purple-500 mr-2" />
                Processing Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-process uploads</Label>
                  <p className="text-sm text-gray-500">Automatically start transcription when files are uploaded</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Generate detailed insights</Label>
                  <p className="text-sm text-gray-500">Include pain points and objections in analysis</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email notifications</Label>
                  <p className="text-sm text-gray-500">Get notified when processing is complete</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Storage Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 text-green-500 mr-2" />
                Storage & Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <p className="font-medium text-blue-800">In-Memory Storage</p>
                  <p className="text-sm text-blue-600">Data is stored temporarily during your session</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Development</Badge>
              </div>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export All Meeting Data
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Clear All Session Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* File Upload Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 text-orange-500 mr-2" />
                Upload Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                  <Input 
                    id="maxFileSize" 
                    type="number" 
                    defaultValue="100" 
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="supportedFormats">Supported Formats</Label>
                  <Input 
                    id="supportedFormats" 
                    defaultValue="MP3, WAV, M4A, MP4" 
                    disabled
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Current upload limits are optimized for typical meeting recordings. Contact support for enterprise limits.</p>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <Trash2 className="w-5 h-5 mr-2" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Delete All Meeting Data</h4>
                <p className="text-sm text-red-600 mb-4">
                  This will permanently delete all your meetings, transcripts, and AI insights. This action cannot be undone.
                </p>
                <Button variant="destructive" size="sm">
                  Delete All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
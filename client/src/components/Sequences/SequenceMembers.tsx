import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Plus, Search, Filter, MoreVertical, Mail, Phone, 
  Calendar, User, Crown, Shield, Eye, Settings, Trash2,
  UserPlus, UserX, CheckCircle, XCircle, Clock, Target
} from 'lucide-react';

interface SequenceMembersProps {
  sequenceId: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar: string;
  addedDate: string;
  lastActive: string;
  permissions: {
    canEdit: boolean;
    canAddProspects: boolean;
    canViewAnalytics: boolean;
    canManageMembers: boolean;
  };
  stats: {
    prospectsAdded: number;
    repliesReceived: number;
    meetingsBooked: number;
  };
  status: 'active' | 'pending' | 'inactive';
}

/**
 * Sequence Members Component - Team collaboration for sequences
 * Apollo.io inspired design for managing sequence access and permissions
 * TODO: Connect to backend API for member management
 */
const SequenceMembers: React.FC<SequenceMembersProps> = ({ sequenceId }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  // Mock members data - replace with API call
  useEffect(() => {
    const fetchMembers = async () => {
      // TODO: Replace with real API call
      setTimeout(() => {
        setMembers([
          {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@company.com',
            role: 'owner',
            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
            addedDate: '2024-01-15',
            lastActive: '2 hours ago',
            permissions: {
              canEdit: true,
              canAddProspects: true,
              canViewAnalytics: true,
              canManageMembers: true
            },
            stats: {
              prospectsAdded: 89,
              repliesReceived: 23,
              meetingsBooked: 12
            },
            status: 'active'
          },
          {
            id: '2',
            name: 'Mike Chen',
            email: 'mike.chen@company.com',
            role: 'admin',
            avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
            addedDate: '2024-01-16',
            lastActive: '1 day ago',
            permissions: {
              canEdit: true,
              canAddProspects: true,
              canViewAnalytics: true,
              canManageMembers: false
            },
            stats: {
              prospectsAdded: 45,
              repliesReceived: 8,
              meetingsBooked: 3
            },
            status: 'active'
          },
          {
            id: '3',
            name: 'Emily Rodriguez',
            email: 'emily.rodriguez@company.com',
            role: 'editor',
            avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
            addedDate: '2024-01-18',
            lastActive: '3 hours ago',
            permissions: {
              canEdit: true,
              canAddProspects: true,
              canViewAnalytics: true,
              canManageMembers: false
            },
            stats: {
              prospectsAdded: 22,
              repliesReceived: 5,
              meetingsBooked: 2
            },
            status: 'active'
          },
          {
            id: '4',
            name: 'David Park',
            email: 'david.park@company.com',
            role: 'viewer',
            avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
            addedDate: '2024-01-20',
            lastActive: '2 days ago',
            permissions: {
              canEdit: false,
              canAddProspects: false,
              canViewAnalytics: true,
              canManageMembers: false
            },
            stats: {
              prospectsAdded: 0,
              repliesReceived: 0,
              meetingsBooked: 0
            },
            status: 'active'
          },
          {
            id: '5',
            name: 'Lisa Wang',
            email: 'lisa.wang@company.com',
            role: 'editor',
            avatar: 'https://images.pexels.com/photos/2381094/pexels-photo-2381094.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
            addedDate: '2024-01-22',
            lastActive: 'Never',
            permissions: {
              canEdit: true,
              canAddProspects: true,
              canViewAnalytics: true,
              canManageMembers: false
            },
            stats: {
              prospectsAdded: 0,
              repliesReceived: 0,
              meetingsBooked: 0
            },
            status: 'pending'
          }
        ]);
        setLoading(false);
      }, 500);
    };

    fetchMembers();
  }, [sequenceId]);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'admin': return <Shield className="h-4 w-4 text-blue-600" />;
      case 'editor': return <User className="h-4 w-4 text-green-600" />;
      case 'viewer': return <Eye className="h-4 w-4 text-gray-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'admin': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'editor': return 'bg-green-100 text-green-800 border-green-200';
      case 'viewer': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'inactive': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleMemberAction = (action: string, memberId: string) => {
    switch (action) {
      case 'edit':
        // TODO: Open edit member modal
        console.log('Edit member:', memberId);
        break;
      case 'remove':
        // TODO: Remove member
        console.log('Remove member:', memberId);
        break;
      case 'resend':
        // TODO: Resend invitation
        console.log('Resend invitation:', memberId);
        break;
      case 'promote':
        // TODO: Promote member
        console.log('Promote member:', memberId);
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            {members.length} members
          </span>
        </div>
        
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          data-testid="button-invite-member"
        >
          <UserPlus className="h-4 w-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            data-testid="input-search-members"
          />
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </button>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            data-testid={`member-card-${member.id}`}
          >
            {/* Member Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </button>
                
                {selectedMember === member.id && (
                  <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={() => handleMemberAction('edit', member.id)}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Edit Permissions
                    </button>
                    {member.status === 'pending' && (
                      <button
                        onClick={() => handleMemberAction('resend', member.id)}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Mail className="h-4 w-4 mr-3" />
                        Resend Invite
                      </button>
                    )}
                    {member.role !== 'owner' && (
                      <button
                        onClick={() => handleMemberAction('remove', member.id)}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <UserX className="h-4 w-4 mr-3" />
                        Remove Member
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Role and Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(member.role)}`}>
                  {getRoleIcon(member.role)}
                  <span className="capitalize">{member.role}</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                {getStatusIcon(member.status)}
                <span className="text-xs text-gray-600 capitalize">{member.status}</span>
              </div>
            </div>

            {/* Permissions */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Permissions</h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${member.permissions.canEdit ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-xs text-gray-600">Edit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${member.permissions.canAddProspects ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-xs text-gray-600">Add Prospects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${member.permissions.canViewAnalytics ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-xs text-gray-600">Analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${member.permissions.canManageMembers ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-xs text-gray-600">Manage</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="border-t border-gray-100 pt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{member.stats.prospectsAdded}</p>
                  <p className="text-xs text-gray-600">Prospects</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{member.stats.repliesReceived}</p>
                  <p className="text-xs text-gray-600">Replies</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{member.stats.meetingsBooked}</p>
                  <p className="text-xs text-gray-600">Meetings</p>
                </div>
              </div>
            </div>

            {/* Last Active */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Last active: {member.lastActive}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Invite team members to collaborate on this sequence.'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Invite Your First Member
            </button>
          )}
        </div>
      )}

      {/* Invite Modal Placeholder */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Send invitation
                  setShowInviteModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SequenceMembers;
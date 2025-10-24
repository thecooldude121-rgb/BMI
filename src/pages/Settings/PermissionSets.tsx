import React, { useState } from 'react';
import {
  Plus, Search, Edit, Trash2, Copy, Users, Shield,
  ChevronRight, X, Check, AlertTriangle, Package
} from 'lucide-react';

interface PermissionSet {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, any>;
  modulesCovered: string[];
  appliedToRoles: string[];
  createdAt: string;
  updatedAt: string;
}

const SAMPLE_PERMISSION_SETS: PermissionSet[] = [
  {
    id: 'ps-1',
    name: 'Sales Manager Baseline',
    description: 'Full access to leads and deals with delete permissions',
    permissions: {
      leads: { read: true, write: true, delete: true, export: true },
      deals: { read: true, write: true, delete: true, export: true },
      accounts: { read: true, write: true, delete: false, export: true },
      contacts: { read: true, write: true, delete: false, export: true }
    },
    modulesCovered: ['Leads', 'Deals', 'Accounts', 'Contacts'],
    appliedToRoles: ['Sales Manager', 'Regional Manager'],
    createdAt: '2024-01-15',
    updatedAt: '2024-10-01'
  },
  {
    id: 'ps-2',
    name: 'Sales Rep Standard',
    description: 'Read and write access to leads without delete',
    permissions: {
      leads: { read: true, write: true, delete: false, export: false },
      deals: { read: true, write: true, delete: false, export: false },
      accounts: { read: true, write: false, delete: false, export: false },
      contacts: { read: true, write: false, delete: false, export: false }
    },
    modulesCovered: ['Leads', 'Deals', 'Accounts', 'Contacts'],
    appliedToRoles: ['Sales Representative', 'Junior Sales'],
    createdAt: '2024-01-15',
    updatedAt: '2024-09-15'
  },
  {
    id: 'ps-3',
    name: 'Support Agent Access',
    description: 'Cases and knowledge base access',
    permissions: {
      cases: { read: true, write: true, delete: false, export: false },
      knowledge_base: { read: true, write: true, delete: false, export: false },
      contacts: { read: true, write: false, delete: false, export: false }
    },
    modulesCovered: ['Cases', 'Knowledge Base', 'Contacts'],
    appliedToRoles: ['Support Agent'],
    createdAt: '2024-02-01',
    updatedAt: '2024-09-20'
  }
];

const PermissionSets: React.FC = () => {
  const [permissionSets, setPermissionSets] = useState<PermissionSet[]>(SAMPLE_PERMISSION_SETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSet, setSelectedSet] = useState<PermissionSet | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [applyMode, setApplyMode] = useState<'merge' | 'overwrite'>('merge');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const availableRoles = [
    'Sales Manager', 'Sales Representative', 'Regional Manager',
    'Support Agent', 'Junior Sales', 'Marketing Manager'
  ];

  const filteredSets = permissionSets.filter(set =>
    set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    set.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyToRoles = (set: PermissionSet) => {
    setSelectedSet(set);
    setSelectedRoles([]);
    setShowApplyModal(true);
  };

  const confirmApply = () => {
    if (!selectedSet) return;

    const updatedSet = {
      ...selectedSet,
      appliedToRoles: [...new Set([...selectedSet.appliedToRoles, ...selectedRoles])],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setPermissionSets(sets =>
      sets.map(s => s.id === selectedSet.id ? updatedSet : s)
    );

    setShowApplyModal(false);
    setSelectedSet(null);
    setSelectedRoles([]);
  };

  const handleDelete = (setId: string) => {
    const set = permissionSets.find(s => s.id === setId);
    if (set && set.appliedToRoles.length > 0) {
      alert(`Cannot delete "${set.name}" - it is currently applied to ${set.appliedToRoles.length} role(s)`);
      return;
    }
    setPermissionSets(sets => sets.filter(s => s.id !== setId));
  };

  const handleDuplicate = (set: PermissionSet) => {
    const newSet: PermissionSet = {
      ...set,
      id: `ps-${Date.now()}`,
      name: `${set.name} (Copy)`,
      appliedToRoles: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setPermissionSets([...permissionSets, newSet]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Permission Sets</h2>
          <p className="text-gray-600 mt-1">Create reusable permission templates to apply across multiple roles</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Permission Set
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search permission sets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredSets.map((set) => (
          <div
            key={set.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{set.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{set.description}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Covers Modules</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {set.modulesCovered.length} modules
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {set.modulesCovered.slice(0, 3).map((module) => (
                        <span
                          key={module}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {module}
                        </span>
                      ))}
                      {set.modulesCovered.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{set.modulesCovered.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Applied To</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {set.appliedToRoles.length} role{set.appliedToRoles.length !== 1 ? 's' : ''}
                    </p>
                    {set.appliedToRoles.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {set.appliedToRoles.slice(0, 2).map((role) => (
                          <span
                            key={role}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700"
                          >
                            {role}
                          </span>
                        ))}
                        {set.appliedToRoles.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{set.appliedToRoles.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {new Date(set.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 mb-2">Permission Preview:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(set.permissions).map(([module, perms]: [string, any]) => (
                      <div key={module} className="text-xs">
                        <span className="font-medium text-gray-900 capitalize">{module}:</span>
                        <span className="text-gray-600 ml-1">
                          {Object.entries(perms)
                            .filter(([_, value]) => value)
                            .map(([key]) => key)
                            .join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <button
                  onClick={() => handleApplyToRoles(set)}
                  className="flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm"
                >
                  <Users className="h-4 w-4 mr-1" />
                  Apply to Roles
                </button>
                <button
                  onClick={() => {
                    setSelectedSet(set);
                    setShowEditModal(true);
                  }}
                  className="flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDuplicate(set)}
                  className="flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Duplicate
                </button>
                <button
                  onClick={() => handleDelete(set.id)}
                  className="flex items-center px-3 py-1.5 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredSets.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No permission sets found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first permission set
            </button>
          </div>
        )}
      </div>

      {showApplyModal && selectedSet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Apply "{selectedSet.name}" to Roles
              </h3>
              <button onClick={() => setShowApplyModal(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Mode
                </label>
                <div className="space-y-2">
                  <label className="flex items-start p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="applyMode"
                      value="merge"
                      checked={applyMode === 'merge'}
                      onChange={(e) => setApplyMode(e.target.value as 'merge')}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Merge</p>
                      <p className="text-sm text-gray-600">
                        Adds permissions without removing existing ones
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="applyMode"
                      value="overwrite"
                      checked={applyMode === 'overwrite'}
                      onChange={(e) => setApplyMode(e.target.value as 'overwrite')}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Overwrite</p>
                      <p className="text-sm text-gray-600">
                        Replaces existing permissions for selected modules
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Roles
                </label>
                <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                  {availableRoles.map((role) => (
                    <label
                      key={role}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRoles([...selectedRoles, role]);
                          } else {
                            setSelectedRoles(selectedRoles.filter(r => r !== role));
                          }
                        }}
                        className="mr-3"
                      />
                      <span className="text-sm text-gray-900">{role}</span>
                      {selectedSet.appliedToRoles.includes(role) && (
                        <span className="ml-auto text-xs text-gray-500">(Already applied)</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {selectedRoles.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Preview Changes</p>
                      <p className="text-sm text-blue-700 mt-1">
                        This will {applyMode === 'merge' ? 'add' : 'replace'} permissions for{' '}
                        <strong>{selectedSet.modulesCovered.join(', ')}</strong> to{' '}
                        <strong>{selectedRoles.length} role(s)</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmApply}
                disabled={selectedRoles.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Apply to {selectedRoles.length} Role{selectedRoles.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Create Permission Set</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-600 mb-4">
                Permission set builder will be displayed here with full permission matrix.
              </p>
              <p className="text-sm text-gray-500">
                This modal will include name, description fields and the complete permission matrix
                interface similar to the Role edit view.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Permission Set
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedSet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit "{selectedSet.name}"
              </h3>
              <button onClick={() => setShowEditModal(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="px-6 py-4">
              {selectedSet.appliedToRoles.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">Warning</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        This permission set is currently applied to {selectedSet.appliedToRoles.length} role(s).
                        Changes will affect: {selectedSet.appliedToRoles.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <p className="text-gray-600">
                Permission set editor will be displayed here with editable fields and permission matrix.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionSets;

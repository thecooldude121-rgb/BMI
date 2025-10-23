import React, { useState, useEffect, useRef } from 'react';
import {
  Grid, Search, Filter, Download, Upload, Save, X, Check,
  AlertTriangle, Info, Eye, Edit, Trash2, Lock, Unlock,
  Copy, Layers, ChevronDown, ChevronRight, RotateCcw, Zap,
  Settings, Shield, CheckSquare, Square, MinusSquare, HelpCircle
} from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { SystemRole } from '../../types/settings';

type PermissionType = 'read' | 'write' | 'delete' | 'export' | 'import' | 'hide';

interface Module {
  id: string;
  name: string;
  displayName: string;
  fields: ModuleField[];
  category: string;
}

interface ModuleField {
  id: string;
  name: string;
  displayName: string;
  type: string;
}

interface PermissionCell {
  roleId: string;
  moduleId: string;
  fieldId?: string;
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
    export: boolean;
    import: boolean;
    hide: boolean;
  };
}

interface PermissionSet {
  id: string;
  name: string;
  description: string;
  permissions: PermissionCell[];
  isTemplate: boolean;
}

interface ConflictWarning {
  roleId: string;
  moduleName: string;
  fieldName?: string;
  type: 'inherited' | 'override' | 'missing';
  message: string;
}

const PermissionMatrix: React.FC = () => {
  const {
    roles,
    fetchRoles,
    getModulePermissions,
    setModulePermission,
    getFieldPermissions,
    setFieldPermission
  } = useSettings();

  const [modules] = useState<Module[]>([
    {
      id: 'leads',
      name: 'leads',
      displayName: 'Leads',
      category: 'CRM',
      fields: [
        { id: 'name', name: 'name', displayName: 'Name', type: 'text' },
        { id: 'email', name: 'email', displayName: 'Email', type: 'email' },
        { id: 'phone', name: 'phone', displayName: 'Phone', type: 'phone' },
        { id: 'status', name: 'status', displayName: 'Status', type: 'select' },
        { id: 'score', name: 'score', displayName: 'Score', type: 'number' }
      ]
    },
    {
      id: 'deals',
      name: 'deals',
      displayName: 'Deals',
      category: 'CRM',
      fields: [
        { id: 'title', name: 'title', displayName: 'Title', type: 'text' },
        { id: 'value', name: 'value', displayName: 'Value', type: 'currency' },
        { id: 'stage', name: 'stage', displayName: 'Stage', type: 'select' },
        { id: 'owner', name: 'owner', displayName: 'Owner', type: 'user' }
      ]
    },
    {
      id: 'accounts',
      name: 'accounts',
      displayName: 'Accounts',
      category: 'CRM',
      fields: [
        { id: 'company', name: 'company', displayName: 'Company', type: 'text' },
        { id: 'industry', name: 'industry', displayName: 'Industry', type: 'select' },
        { id: 'revenue', name: 'revenue', displayName: 'Revenue', type: 'currency' }
      ]
    },
    {
      id: 'contacts',
      name: 'contacts',
      displayName: 'Contacts',
      category: 'CRM',
      fields: [
        { id: 'name', name: 'name', displayName: 'Name', type: 'text' },
        { id: 'email', name: 'email', displayName: 'Email', type: 'email' },
        { id: 'position', name: 'position', displayName: 'Position', type: 'text' }
      ]
    },
    {
      id: 'tasks',
      name: 'tasks',
      displayName: 'Tasks',
      category: 'Productivity',
      fields: [
        { id: 'title', name: 'title', displayName: 'Title', type: 'text' },
        { id: 'status', name: 'status', displayName: 'Status', type: 'select' },
        { id: 'priority', name: 'priority', displayName: 'Priority', type: 'select' }
      ]
    }
  ]);

  const [permissions, setPermissions] = useState<Map<string, PermissionCell>>(new Map());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showSidebar, setShowSidebar] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [permissionSets, setPermissionSets] = useState<PermissionSet[]>([]);
  const [conflicts, setConflicts] = useState<ConflictWarning[]>([]);
  const [showConflicts, setShowConflicts] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [sidebarView, setSidebarView] = useState<'sets' | 'conflicts' | 'help'>('sets');
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    detectConflicts();
  }, [permissions, roles]);

  const loadData = async () => {
    await fetchRoles();
    await loadPermissionsFromDatabase();
  };

  const loadPermissionsFromDatabase = async () => {
    const permMap = new Map<string, PermissionCell>();

    for (const role of roles) {
      for (const module of modules) {
        const modulePerms = await getModulePermissions(role.id);
        const modulePerm = modulePerms.find(p => p.module_name === module.name);

        const key = `${role.id}-${module.id}`;
        permMap.set(key, {
          roleId: role.id,
          moduleId: module.id,
          permissions: {
            read: modulePerm?.can_read || false,
            write: modulePerm?.can_update || false,
            delete: modulePerm?.can_delete || false,
            export: modulePerm?.can_export || false,
            import: modulePerm?.can_import || false,
            hide: false
          }
        });

        const fieldPerms = await getFieldPermissions(role.id, module.name);
        module.fields.forEach(field => {
          const fieldPerm = fieldPerms.find(p => p.field_name === field.name);
          const fieldKey = `${role.id}-${module.id}-${field.id}`;
          permMap.set(fieldKey, {
            roleId: role.id,
            moduleId: module.id,
            fieldId: field.id,
            permissions: {
              read: fieldPerm?.can_read || false,
              write: fieldPerm?.can_write || false,
              delete: fieldPerm?.can_delete || false,
              export: false,
              import: false,
              hide: !fieldPerm?.can_read || false
            }
          });
        });
      }
    }

    setPermissions(permMap);
  };

  const detectConflicts = () => {
    const newConflicts: ConflictWarning[] = [];

    roles.forEach(role => {
      if (role.parent_role_id) {
        modules.forEach(module => {
          const roleKey = `${role.id}-${module.id}`;
          const parentKey = `${role.parent_role_id}-${module.id}`;

          const rolePerms = permissions.get(roleKey);
          const parentPerms = permissions.get(parentKey);

          if (rolePerms && parentPerms) {
            Object.keys(rolePerms.permissions).forEach(permType => {
              const key = permType as PermissionType;
              if (rolePerms.permissions[key] && !parentPerms.permissions[key]) {
                newConflicts.push({
                  roleId: role.id,
                  moduleName: module.displayName,
                  type: 'override',
                  message: `${role.name} has ${permType} permission but parent role doesn't`
                });
              }
            });
          }
        });
      }
    });

    setConflicts(newConflicts);
  };

  const togglePermission = (roleId: string, moduleId: string, permType: PermissionType, fieldId?: string) => {
    const key = fieldId ? `${roleId}-${moduleId}-${fieldId}` : `${roleId}-${moduleId}`;
    const cell = permissions.get(key);

    if (cell) {
      const updated = {
        ...cell,
        permissions: {
          ...cell.permissions,
          [permType]: !cell.permissions[permType]
        }
      };

      const newPermissions = new Map(permissions);
      newPermissions.set(key, updated);
      setPermissions(newPermissions);
      setHasUnsavedChanges(true);
    }
  };

  const setModulePermissions = (roleId: string, moduleId: string, permType: PermissionType, value: boolean) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    const newPermissions = new Map(permissions);

    const moduleKey = `${roleId}-${moduleId}`;
    const moduleCell = newPermissions.get(moduleKey);
    if (moduleCell) {
      moduleCell.permissions[permType] = value;
      newPermissions.set(moduleKey, moduleCell);
    }

    module.fields.forEach(field => {
      const fieldKey = `${roleId}-${moduleId}-${field.id}`;
      const fieldCell = newPermissions.get(fieldKey);
      if (fieldCell) {
        fieldCell.permissions[permType] = value;
        newPermissions.set(fieldKey, fieldCell);
      }
    });

    setPermissions(newPermissions);
    setHasUnsavedChanges(true);
  };

  const bulkSetPermissions = (permType: PermissionType, value: boolean) => {
    const newPermissions = new Map(permissions);

    selectedRoles.forEach(roleId => {
      selectedModules.forEach(moduleId => {
        const module = modules.find(m => m.id === moduleId);
        if (!module) return;

        const moduleKey = `${roleId}-${moduleId}`;
        const moduleCell = newPermissions.get(moduleKey);
        if (moduleCell) {
          moduleCell.permissions[permType] = value;
          newPermissions.set(moduleKey, moduleCell);
        }

        module.fields.forEach(field => {
          const fieldKey = `${roleId}-${moduleId}-${field.id}`;
          const fieldCell = newPermissions.get(fieldKey);
          if (fieldCell) {
            fieldCell.permissions[permType] = value;
            newPermissions.set(fieldKey, fieldCell);
          }
        });
      });
    });

    setPermissions(newPermissions);
    setHasUnsavedChanges(true);
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const toggleRoleSelection = (roleId: string) => {
    const newSelected = new Set(selectedRoles);
    if (newSelected.has(roleId)) {
      newSelected.delete(roleId);
    } else {
      newSelected.add(roleId);
    }
    setSelectedRoles(newSelected);
  };

  const toggleModuleSelection = (moduleId: string) => {
    const newSelected = new Set(selectedModules);
    if (newSelected.has(moduleId)) {
      newSelected.delete(moduleId);
    } else {
      newSelected.add(moduleId);
    }
    setSelectedModules(newSelected);
  };

  const savePermissions = async () => {
    try {
      for (const [key, cell] of permissions.entries()) {
        if (cell.fieldId) {
          const module = modules.find(m => m.id === cell.moduleId);
          if (module) {
            await setFieldPermission({
              role_id: cell.roleId,
              module_name: module.name,
              field_name: module.fields.find(f => f.id === cell.fieldId)?.name || '',
              can_read: cell.permissions.read,
              can_write: cell.permissions.write,
              can_delete: cell.permissions.delete
            });
          }
        } else {
          const module = modules.find(m => m.id === cell.moduleId);
          if (module) {
            await setModulePermission({
              role_id: cell.roleId,
              module_name: module.name,
              can_read: cell.permissions.read,
              can_create: cell.permissions.write,
              can_update: cell.permissions.write,
              can_delete: cell.permissions.delete,
              can_export: cell.permissions.export,
              can_import: cell.permissions.import
            });
          }
        }
      }
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Failed to save permissions. Please try again.');
    }
  };

  const discardChanges = async () => {
    await loadPermissionsFromDatabase();
    setHasUnsavedChanges(false);
  };

  const createPermissionSet = () => {
    const newSet: PermissionSet = {
      id: `set-${Date.now()}`,
      name: 'New Permission Set',
      description: '',
      permissions: Array.from(permissions.values()),
      isTemplate: true
    };
    setPermissionSets([...permissionSets, newSet]);
  };

  const applyPermissionSet = (set: PermissionSet) => {
    const newPermissions = new Map(permissions);
    set.permissions.forEach(perm => {
      const key = perm.fieldId
        ? `${perm.roleId}-${perm.moduleId}-${perm.fieldId}`
        : `${perm.roleId}-${perm.moduleId}`;
      newPermissions.set(key, perm);
    });
    setPermissions(newPermissions);
    setHasUnsavedChanges(true);
  };

  const getPermissionState = (roleId: string, moduleId: string, permType: PermissionType): 'all' | 'some' | 'none' => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return 'none';

    const moduleKey = `${roleId}-${moduleId}`;
    const moduleCell = permissions.get(moduleKey);
    const moduleHas = moduleCell?.permissions[permType] || false;

    const fieldStates = module.fields.map(field => {
      const fieldKey = `${roleId}-${moduleId}-${field.id}`;
      const fieldCell = permissions.get(fieldKey);
      return fieldCell?.permissions[permType] || false;
    });

    const allTrue = moduleHas && fieldStates.every(s => s);
    const someTrue = moduleHas || fieldStates.some(s => s);

    if (allTrue) return 'all';
    if (someTrue) return 'some';
    return 'none';
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || module.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(modules.map(m => m.category)));

  const renderPermissionCheckbox = (
    roleId: string,
    moduleId: string,
    permType: PermissionType,
    fieldId?: string
  ) => {
    const key = fieldId ? `${roleId}-${moduleId}-${fieldId}` : `${roleId}-${moduleId}`;
    const cell = permissions.get(key);
    const isChecked = cell?.permissions[permType] || false;

    if (!fieldId) {
      const state = getPermissionState(roleId, moduleId, permType);
      const Icon = state === 'all' ? CheckSquare : state === 'some' ? MinusSquare : Square;
      const color = state === 'all' ? 'text-green-600' : state === 'some' ? 'text-blue-600' : 'text-gray-400';

      return (
        <button
          onClick={() => {
            const newValue = state !== 'all';
            setModulePermissions(roleId, moduleId, permType, newValue);
          }}
          className={`p-1.5 hover:bg-gray-100 rounded transition-colors ${color}`}
          title={`${permType} - ${state}`}
        >
          <Icon className="h-4 w-4" />
        </button>
      );
    }

    return (
      <button
        onClick={() => togglePermission(roleId, moduleId, permType, fieldId)}
        className={`p-1.5 hover:bg-gray-100 rounded transition-colors ${
          isChecked ? 'text-green-600' : 'text-gray-400'
        }`}
        title={permType}
      >
        {isChecked ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
      </button>
    );
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Grid className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Permission Matrix</h2>
              {conflicts.length > 0 && (
                <button
                  onClick={() => setShowConflicts(!showConflicts)}
                  className="flex items-center space-x-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">{conflicts.length} Conflicts</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {hasUnsavedChanges && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">Unsaved changes</span>
                </div>
              )}

              <button
                onClick={() => setBulkMode(!bulkMode)}
                className={`flex items-center px-4 py-2 rounded-lg border ${
                  bulkMode
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Zap className="h-4 w-4 mr-2" />
                Bulk Mode
              </button>

              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Layers className="h-4 w-4 mr-2" />
                Permission Sets
              </button>

              {hasUnsavedChanges && (
                <>
                  <button
                    onClick={discardChanges}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Discard
                  </button>
                  <button
                    onClick={savePermissions}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search roles or modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Bulk Mode Controls */}
        {bulkMode && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  Selected: {selectedRoles.size} roles, {selectedModules.size} modules
                </span>
                {selectedRoles.size > 0 && selectedModules.size > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-blue-700">Apply:</span>
                    {(['read', 'write', 'delete', 'export'] as PermissionType[]).map(perm => (
                      <button
                        key={perm}
                        onClick={() => bulkSetPermissions(perm, true)}
                        className="px-2 py-1 bg-white text-blue-700 rounded border border-blue-300 hover:bg-blue-100 text-xs"
                      >
                        ✓ {perm}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setBulkMode(false);
                  setSelectedRoles(new Set());
                  setSelectedModules(new Set());
                }}
                className="text-sm text-blue-700 hover:text-blue-900"
              >
                Exit Bulk Mode
              </button>
            </div>
          </div>
        )}

        {/* Matrix Table */}
        <div className="flex-1 overflow-auto">
          <div className="inline-block min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="sticky left-0 z-20 bg-gray-50 px-6 py-3 text-left">
                    <div className="flex items-center space-x-2">
                      {bulkMode && (
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRoles(new Set(roles.map(r => r.id)));
                            } else {
                              setSelectedRoles(new Set());
                            }
                          }}
                        />
                      )}
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Role
                      </span>
                    </div>
                  </th>
                  {filteredModules.map(module => (
                    <th
                      key={module.id}
                      className="px-6 py-3 bg-gray-50 border-l border-gray-200"
                      colSpan={6}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {bulkMode && (
                            <input
                              type="checkbox"
                              checked={selectedModules.has(module.id)}
                              onChange={() => toggleModuleSelection(module.id)}
                              className="rounded border-gray-300"
                            />
                          )}
                          <button
                            onClick={() => toggleModule(module.id)}
                            className="flex items-center space-x-1 hover:text-blue-600"
                          >
                            {expandedModules.has(module.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <span className="text-xs font-medium text-gray-700 uppercase">
                              {module.displayName}
                            </span>
                          </button>
                        </div>
                        <span className="text-xs text-gray-500">{module.category}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-gray-500 w-12">Read</span>
                        <span className="text-xs text-gray-500 w-12">Write</span>
                        <span className="text-xs text-gray-500 w-12">Delete</span>
                        <span className="text-xs text-gray-500 w-12">Export</span>
                        <span className="text-xs text-gray-500 w-12">Import</span>
                        <span className="text-xs text-gray-500 w-12">Hide</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRoles.map(role => (
                  <React.Fragment key={role.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap border-r border-gray-200">
                        <div className="flex items-center space-x-3">
                          {bulkMode && (
                            <input
                              type="checkbox"
                              checked={selectedRoles.has(role.id)}
                              onChange={() => toggleRoleSelection(role.id)}
                              className="rounded border-gray-300"
                            />
                          )}
                          <div>
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-900">{role.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">Level {role.hierarchy_level}</span>
                          </div>
                        </div>
                      </td>
                      {filteredModules.map(module => (
                        <td
                          key={module.id}
                          className="px-6 py-4 border-l border-gray-200"
                        >
                          <div className="flex items-center space-x-2">
                            {(['read', 'write', 'delete', 'export', 'import', 'hide'] as PermissionType[]).map(perm => (
                              <div key={perm} className="w-12 flex justify-center">
                                {renderPermissionCheckbox(role.id, module.id, perm)}
                              </div>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Field-level permissions */}
                    {expandedModules.has(filteredModules[0]?.id) && filteredModules.map(module =>
                      expandedModules.has(module.id) && module.fields.map(field => (
                        <tr key={`${role.id}-${module.id}-${field.id}`} className="bg-gray-50">
                          <td className="sticky left-0 z-10 bg-gray-50 px-6 py-2 border-r border-gray-200">
                            <div className="pl-12 text-sm text-gray-600">
                              └─ {field.displayName}
                            </div>
                          </td>
                          {filteredModules.map(m => {
                            if (m.id !== module.id) {
                              return <td key={m.id} className="border-l border-gray-200" />;
                            }
                            return (
                              <td key={m.id} className="px-6 py-2 border-l border-gray-200">
                                <div className="flex items-center space-x-2">
                                  {(['read', 'write', 'delete', 'export', 'import', 'hide'] as PermissionType[]).map(perm => (
                                    <div key={perm} className="w-12 flex justify-center">
                                      {renderPermissionCheckbox(role.id, module.id, perm, field.id)}
                                    </div>
                                  ))}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Tooltip */}
        <div className="bg-white border-t border-gray-200 px-6 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <HelpCircle className="h-4 w-4" />
            <span>
              <strong>Tip:</strong> Click module names to expand field-level permissions.
              Use bulk mode for efficient multi-role assignments.
              <CheckSquare className="inline h-3 w-3 mx-1" /> = All fields have permission,
              <MinusSquare className="inline h-3 w-3 mx-1" /> = Some fields have permission
            </span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sidebar</h3>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setSidebarView('sets')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                  sidebarView === 'sets'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Permission Sets
              </button>
              <button
                onClick={() => setSidebarView('conflicts')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                  sidebarView === 'conflicts'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Conflicts ({conflicts.length})
              </button>
              <button
                onClick={() => setSidebarView('help')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                  sidebarView === 'help'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Help
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {sidebarView === 'sets' && (
              <div className="space-y-4">
                <button
                  onClick={createPermissionSet}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Permission Set
                </button>

                {permissionSets.length === 0 ? (
                  <div className="text-center py-12">
                    <Layers className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">No permission sets yet</p>
                    <p className="text-xs text-gray-500 mt-1">Create reusable permission templates</p>
                  </div>
                ) : (
                  permissionSets.map(set => (
                    <div key={set.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{set.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{set.description}</p>
                        </div>
                        {set.isTemplate && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                            Template
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <button
                          onClick={() => applyPermissionSet(set)}
                          className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Apply
                        </button>
                        <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded">
                          <Copy className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {sidebarView === 'conflicts' && (
              <div className="space-y-3">
                {conflicts.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">No conflicts detected</p>
                    <p className="text-xs text-gray-500 mt-1">All permissions are properly configured</p>
                  </div>
                ) : (
                  conflicts.map((conflict, idx) => (
                    <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-amber-900">
                            {roles.find(r => r.id === conflict.roleId)?.name}
                          </p>
                          <p className="text-sm text-amber-700 mt-1">{conflict.message}</p>
                          <p className="text-xs text-amber-600 mt-1">
                            Module: {conflict.moduleName}
                            {conflict.fieldName && ` • Field: ${conflict.fieldName}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {sidebarView === 'help' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Permission Types</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start space-x-2">
                      <Eye className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Read:</strong> View records and data
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Edit className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Write:</strong> Create and edit records
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Trash2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Delete:</strong> Remove records permanently
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Download className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Export:</strong> Export data to external formats
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Upload className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Import:</strong> Import data from external sources
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Keyboard Shortcuts</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Save changes</span>
                      <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs">Ctrl+S</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Toggle bulk mode</span>
                      <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs">Ctrl+B</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Search</span>
                      <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs">Ctrl+F</kbd>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Tips</h4>
                  <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                    <li>Use bulk mode for applying permissions to multiple roles at once</li>
                    <li>Expand modules to set field-level permissions</li>
                    <li>Create permission sets for reusable templates</li>
                    <li>Monitor conflicts regularly to maintain security</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionMatrix;

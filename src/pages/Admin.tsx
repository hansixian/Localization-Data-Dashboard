import React, { useState } from 'react';
import { useDashboardStore, Page, Widget, ChartType } from '../store/dashboardStore';
import { useAuthStore, Role } from '../store/authStore';
import { Navigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, UserPlus, Settings, Save, X } from 'lucide-react';

export const Admin: React.FC = () => {
  const { user, users, addUser } = useAuthStore();
  const { pages, addPage, updatePage, deletePage, addWidget, updateWidget, deleteWidget } = useDashboardStore();

  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSection, setNewPageSection] = useState<'internal' | 'external' | 'overview'>('overview');

  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editPageTitle, setEditPageTitle] = useState('');
  const [editPageSection, setEditPageSection] = useState<'internal' | 'external' | 'overview'>('overview');

  const [selectedPageId, setSelectedPageId] = useState<string>(pages[0]?.id || '');
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  const [newWidget, setNewWidget] = useState<Partial<Widget>>({
    title: '',
    type: 'line',
    dataSourceUrl: '',
    sourceLink: '',
    xAxisField: '',
    yAxisFields: [],
    colSpan: 6,
    rowSpan: 2,
  });
  const [yAxisInput, setYAxisInput] = useState('');

  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('internal');

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAddPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPageTitle) {
      addPage({
        id: `page-${Date.now()}`,
        title: newPageTitle,
        section: newPageSection,
        widgets: [],
      });
      setNewPageTitle('');
    }
  };

  const startEditPage = (page: Page) => {
    setEditingPageId(page.id);
    setEditPageTitle(page.title);
    setEditPageSection(page.section);
  };

  const handleSavePage = (pageId: string) => {
    if (editPageTitle) {
      updatePage(pageId, { title: editPageTitle, section: editPageSection });
      setEditingPageId(null);
    }
  };

  const handleAddOrUpdateWidget = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPageId && newWidget.title && newWidget.dataSourceUrl && newWidget.xAxisField && yAxisInput) {
      const yFields = yAxisInput.split(',').map(s => s.trim());
      
      if (editingWidgetId) {
        updateWidget(selectedPageId, editingWidgetId, {
          title: newWidget.title!,
          type: newWidget.type as ChartType,
          dataSourceUrl: newWidget.dataSourceUrl!,
          sourceLink: newWidget.sourceLink,
          xAxisField: newWidget.xAxisField!,
          yAxisFields: yFields,
          colSpan: newWidget.colSpan || 6,
          rowSpan: newWidget.rowSpan || 2,
        });
        setEditingWidgetId(null);
      } else {
        addWidget(selectedPageId, {
          id: `widget-${Date.now()}`,
          title: newWidget.title!,
          type: newWidget.type as ChartType,
          dataSourceUrl: newWidget.dataSourceUrl!,
          sourceLink: newWidget.sourceLink,
          xAxisField: newWidget.xAxisField!,
          yAxisFields: yFields,
          colSpan: newWidget.colSpan || 6,
          rowSpan: newWidget.rowSpan || 2,
          filters: [],
        });
      }
      
      setNewWidget({ title: '', type: 'line', dataSourceUrl: '', sourceLink: '', xAxisField: '', colSpan: 6, rowSpan: 2 });
      setYAxisInput('');
    }
  };

  const startEditWidget = (pageId: string, widget: Widget) => {
    setSelectedPageId(pageId);
    setEditingWidgetId(widget.id);
    setNewWidget({
      title: widget.title,
      type: widget.type,
      dataSourceUrl: widget.dataSourceUrl,
      sourceLink: widget.sourceLink || '',
      xAxisField: widget.xAxisField,
      colSpan: widget.colSpan,
      rowSpan: widget.rowSpan,
    });
    setYAxisInput(widget.yAxisFields.join(', '));
    // Scroll to form
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const cancelEditWidget = () => {
    setEditingWidgetId(null);
    setNewWidget({ title: '', type: 'line', dataSourceUrl: '', sourceLink: '', xAxisField: '', colSpan: 6, rowSpan: 2 });
    setYAxisInput('');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserEmail) {
      addUser({
        email: newUserEmail,
        name: newUserEmail.split('@')[0],
        role: newUserRole,
      });
      setNewUserEmail('');
    }
  };

  return (
    <div className="flex-1 bg-slate-50/50 h-screen overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            <Settings className="text-indigo-600" />
            Admin Settings
          </h1>
          <p className="mt-1.5 text-sm font-medium text-slate-500">
            Manage users, pages, and chart widgets.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Manage Users</h2>
          <form onSubmit={handleAddUser} className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="email"
              placeholder="User Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              required
            />
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value as Role)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            >
              <option value="admin">Admin</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
            </select>
            <button type="submit" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2 font-medium transition-colors shadow-sm">
              <UserPlus size={18} /> Add User
            </button>
          </form>

          <div className="space-y-3">
            {users.map(u => (
              <div key={u.email} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                <div>
                  <span className="font-medium text-slate-800">{u.email}</span>
                  <span className="ml-3 text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full uppercase tracking-wider">{u.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Manage Pages</h2>
          <form onSubmit={handleAddPage} className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Page Title"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              required
            />
            <select
              value={newPageSection}
              onChange={(e) => setNewPageSection(e.target.value as 'internal' | 'external' | 'overview')}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            >
              <option value="overview">Overview</option>
              <option value="internal">Internal Operations</option>
              <option value="external">Product Analytics</option>
            </select>
            <button type="submit" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2 font-medium transition-colors shadow-sm">
              <Plus size={18} /> Add Page
            </button>
          </form>

          <div className="space-y-3">
            {pages.map(page => (
              <div key={page.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50/50 rounded-xl border border-slate-100 gap-4">
                {editingPageId === page.id ? (
                  <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                    <input
                      type="text"
                      value={editPageTitle}
                      onChange={(e) => setEditPageTitle(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    />
                    <select
                      value={editPageSection}
                      onChange={(e) => setEditPageSection(e.target.value as 'internal' | 'external' | 'overview')}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    >
                      <option value="overview">Overview</option>
                      <option value="internal">Internal Operations</option>
                      <option value="external">Product Analytics</option>
                    </select>
                    <div className="flex gap-2">
                      <button onClick={() => handleSavePage(page.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        <Save size={18} />
                      </button>
                      <button onClick={() => setEditingPageId(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="font-medium text-slate-800">{page.title}</span>
                      <span className="ml-3 text-[10px] font-bold bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full uppercase tracking-wider">{page.section}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditPage(page)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => deletePage(page.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Existing Chart Widgets</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Page to View Widgets</label>
            <select
              value={selectedPageId}
              onChange={(e) => setSelectedPageId(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            >
              {pages.map(page => (
                <option key={page.id} value={page.id}>{page.title} ({page.section})</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-3">
            {pages.find(p => p.id === selectedPageId)?.widgets.map(widget => (
              <div key={widget.id} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                <div>
                  <span className="font-medium text-slate-800">{widget.title}</span>
                  <span className="ml-3 text-[10px] font-bold bg-sky-100 text-sky-700 px-2.5 py-1 rounded-full uppercase tracking-wider">{widget.type}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEditWidget(selectedPageId, widget)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => deleteWidget(selectedPageId, widget.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {pages.find(p => p.id === selectedPageId)?.widgets.length === 0 && (
              <p className="text-sm text-slate-500 italic py-2">No widgets on this page.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-800">
              {editingWidgetId ? 'Edit Chart Widget' : 'Add Chart Widget'}
            </h2>
            {editingWidgetId && (
              <button onClick={cancelEditWidget} className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
                <X size={16} /> Cancel Edit
              </button>
            )}
          </div>
          <form onSubmit={handleAddOrUpdateWidget} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Target Page</label>
                <select
                  value={selectedPageId}
                  onChange={(e) => setSelectedPageId(e.target.value)}
                  disabled={!!editingWidgetId}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all disabled:opacity-50"
                >
                  {pages.map(page => (
                    <option key={page.id} value={page.id}>{page.title} ({page.section})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Chart Title</label>
                <input
                  type="text"
                  value={newWidget.title}
                  onChange={(e) => setNewWidget({ ...newWidget, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Chart Type</label>
                <select
                  value={newWidget.type}
                  onChange={(e) => setNewWidget({ ...newWidget, type: e.target.value as ChartType })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                >
                  <option value="line">Line</option>
                  <option value="area">Area</option>
                  <option value="bar">Bar</option>
                  <option value="pie">Pie</option>
                  <option value="scatter">Scatter</option>
                  <option value="composed">Composed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Data Source URL (Bitable)</label>
                <input
                  type="text"
                  value={newWidget.dataSourceUrl}
                  onChange={(e) => setNewWidget({ ...newWidget, dataSourceUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  placeholder="bitable://..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Source Link (Optional)</label>
                <input
                  type="url"
                  value={newWidget.sourceLink || ''}
                  onChange={(e) => setNewWidget({ ...newWidget, sourceLink: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">X-Axis Field</label>
                <input
                  type="text"
                  value={newWidget.xAxisField}
                  onChange={(e) => setNewWidget({ ...newWidget, xAxisField: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Y-Axis Fields (comma separated)</label>
                <input
                  type="text"
                  value={yAxisInput}
                  onChange={(e) => setYAxisInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Column Span (1-12)</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={newWidget.colSpan}
                  onChange={(e) => setNewWidget({ ...newWidget, colSpan: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2 font-medium transition-colors shadow-sm w-full sm:w-auto">
                {editingWidgetId ? <Save size={18} /> : <Plus size={18} />}
                {editingWidgetId ? 'Save Changes' : 'Add Widget'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

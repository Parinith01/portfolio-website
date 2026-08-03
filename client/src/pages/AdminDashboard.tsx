import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import {
  LayoutDashboard, User, Info, Cpu, FolderGit2, Briefcase, GraduationCap,
  Award, FileText, Image as ImageIcon, Share2, Mail, Settings, LogOut,
  Plus, Edit, Trash2, Save, Upload, ExternalLink, RefreshCw, Sparkles,
  Download, Eye, CheckCircle2, Shield, Search, Filter, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cmsData, setCmsData] = useState<any>(null);

  // Search & Filter States
  const [skillSearch, setSkillSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [messageSearch, setMessageSearch] = useState('');

  // Modals state
  const [modalType, setModalType] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPromptType, setAiPromptType] = useState('project-description');
  const [aiInputText, setAiInputText] = useState('');
  const [aiResultText, setAiResultText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  // Protect Admin Route
  useEffect(() => {
    if (!token) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to access the admin dashboard.',
        variant: 'destructive'
      });
      setLocation('/admin/login');
      return;
    }
    fetchCMSData();
  }, [token]);

  const fetchCMSData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/content');
      if (res.ok) {
        const data = await res.json();
        setCmsData(data);
      }
    } catch (err) {
      toast({
        title: 'Error Loading CMS Data',
        description: 'Could not connect to backend server.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      toast({
        title: 'Session Expired',
        description: 'Your login session expired. Please log in again.',
        variant: 'destructive'
      });
      setLocation('/admin/login');
    }
    return response;
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload/single', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        toast({ title: 'File Uploaded', description: `Saved as ${data.filename}` });
        return data.url;
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err: any) {
      toast({ title: 'Upload Failed', description: err.message, variant: 'destructive' });
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast({ title: 'Logged Out', description: 'You have been logged out safely.' });
    setLocation('/admin/login');
  };

  // --- SAVE SECTION HANDLERS ---
  const saveSection = async (section: string, bodyData: any) => {
    setSaving(true);
    try {
      const res = await authFetch(`/api/cms/${section}`, {
        method: 'PUT',
        body: JSON.stringify(bodyData)
      });
      if (res.ok) {
        toast({ title: 'Changes Saved!', description: `${section.toUpperCase()} updated successfully.` });
        fetchCMSData();
      } else {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.message || 'Failed to save section changes.');
      }
    } catch (err: any) {
      toast({ title: 'Error Saving', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // AI Helper Handler
  const handleRunAi = async () => {
    setAiLoading(true);
    try {
      const res = await authFetch('/api/cms/ai-helper', {
        method: 'POST',
        body: JSON.stringify({
          promptType: aiPromptType,
          text: aiInputText,
          context: editingItem?.title || cmsData?.home?.name
        })
      });
      const data = await res.json();
      setAiResultText(data.result || '');
    } catch (e) {
      toast({ title: 'AI Generation Failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setAiLoading(false);
    }
  };

  // Backup & Restore
  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cmsData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `portfolio_cms_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast({ title: 'Backup Exported', description: 'JSON backup file downloaded successfully.' });
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const res = await authFetch('/api/cms/restore', {
          method: 'POST',
          body: JSON.stringify(parsed)
        });
        if (res.ok) {
          toast({ title: 'Backup Restored!', description: 'Portfolio database restored successfully.' });
          fetchCMSData();
        }
      } catch (err) {
        toast({ title: 'Restore Failed', description: 'Invalid JSON backup file format.', variant: 'destructive' });
      }
    };
    reader.readAsText(file);
  };

  if (loading || !cmsData) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-cyan-400">Loading Parinith C M Control Center...</p>
      </div>
    );
  }

  const sidebarNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'home', label: 'Home Section', icon: User },
    { id: 'about', label: 'About Section', icon: Info },
    { id: 'skills', label: 'Skills Manager', icon: Cpu, badge: cmsData.skills?.length },
    { id: 'projects', label: 'Projects Manager', icon: FolderGit2, badge: cmsData.projects?.length },
    { id: 'experience', label: 'Experience', icon: Briefcase, badge: cmsData.experience?.length },
    { id: 'education', label: 'Education', icon: GraduationCap, badge: cmsData.education?.length },
    { id: 'certificates', label: 'Certificates', icon: Award, badge: cmsData.certificates?.length },
    { id: 'resume', label: 'Resume File', icon: FileText },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon, badge: cmsData.gallery?.length },
    { id: 'socials', label: 'Social Links', icon: Share2 },
    { id: 'messages', label: 'Messages Inbox', icon: Mail, badge: cmsData.messages?.filter((m: any) => !m.read)?.length },
    { id: 'settings', label: 'Settings & SEO', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black text-gray-100 flex font-sans selection:bg-cyan-500/30">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-gray-950 border-r border-white/10 flex flex-col justify-between p-4 shrink-0 fixed top-0 bottom-0 left-0 z-30 overflow-y-auto">
        <div>
          {/* Logo / Brand Header */}
          <div className="p-4 mb-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 font-mono text-xs">
                PCM
              </div>
              <div>
                <h2 className="font-bold text-white tracking-wide text-sm font-mono">PARINITH C M</h2>
                <p className="text-xs font-mono text-cyan-400">Control Center</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {sidebarNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-cyan-300 border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-cyan-400' : 'text-gray-400'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                      isActive ? 'bg-cyan-400 text-black' : 'bg-white/10 text-gray-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono text-cyan-400 transition-all"
          >
            <ExternalLink size={14} /> View Live Website
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-mono transition-all"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-72 p-8 overflow-y-auto">
        {/* TOP BAR */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white capitalize flex items-center gap-3">
              <span>{sidebarNav.find(s => s.id === activeTab)?.label}</span>
            </h1>
            <p className="text-xs font-mono text-gray-400 mt-1">
              Last Database Update: {new Date(cmsData.lastUpdated).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAiModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 transition-all shadow-lg shadow-purple-500/20"
            >
              <Sparkles size={16} /> AI Assistant
            </button>

            <button
              onClick={handleExportBackup}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-gray-300 hover:bg-white/10 hover:border-cyan-400/50 transition-all"
            >
              <Download size={14} /> Backup
            </button>

            <label className="flex items-center gap-2 px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-gray-300 hover:bg-white/10 hover:border-cyan-400/50 cursor-pointer transition-all">
              <Upload size={14} /> Restore
              <input type="file" accept=".json" onChange={handleRestoreBackup} className="hidden" />
            </label>
          </div>
        </header>

        {/* SECTION 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass p-6 rounded-2xl border border-cyan-400/20 bg-cyan-900/10">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Total Projects</span>
                  <FolderGit2 className="text-cyan-400" size={24} />
                </div>
                <div className="text-4xl font-black text-white">{cmsData.projects?.length || 0}</div>
                <p className="text-xs text-gray-400 mt-2 font-mono">Full stack & ML builds</p>
              </div>

              <div className="glass p-6 rounded-2xl border border-purple-400/20 bg-purple-900/10">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">Core Skills</span>
                  <Cpu className="text-purple-400" size={24} />
                </div>
                <div className="text-4xl font-black text-white">{cmsData.skills?.length || 0}</div>
                <p className="text-xs text-gray-400 mt-2 font-mono">Frontend & backend tech</p>
              </div>

              <div className="glass p-6 rounded-2xl border border-emerald-400/20 bg-emerald-900/10">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Certificates</span>
                  <Award className="text-emerald-400" size={24} />
                </div>
                <div className="text-4xl font-black text-white">{cmsData.certificates?.length || 0}</div>
                <p className="text-xs text-gray-400 mt-2 font-mono">Verified credentials</p>
              </div>

              <div className="glass p-6 rounded-2xl border border-pink-400/20 bg-pink-900/10">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-pink-400 uppercase tracking-widest">Inbox Messages</span>
                  <Mail className="text-pink-400" size={24} />
                </div>
                <div className="text-4xl font-black text-white">{cmsData.messages?.length || 0}</div>
                <p className="text-xs text-gray-400 mt-2 font-mono">
                  {cmsData.messages?.filter((m: any) => !m.read)?.length || 0} unread messages
                </p>
              </div>
            </div>

            {/* Activity Logs & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass p-6 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <RefreshCw size={18} className="text-cyan-400" /> Recent CMS Activity Log
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {cmsData.activityLogs?.map((log: any) => (
                    <div key={log.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                        <span className="text-gray-200 font-semibold">{log.action}</span>
                      </div>
                      <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-lg font-bold text-white mb-2">Quick CMS Actions</h3>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="w-full p-4 bg-cyan-500/10 border border-cyan-400/30 rounded-xl text-left text-sm font-bold text-cyan-300 hover:bg-cyan-500/20 transition-all flex items-center justify-between"
                >
                  <span>Add New Project</span>
                  <Plus size={18} />
                </button>
                <button
                  onClick={() => setActiveTab('skills')}
                  className="w-full p-4 bg-purple-500/10 border border-purple-400/30 rounded-xl text-left text-sm font-bold text-purple-300 hover:bg-purple-500/20 transition-all flex items-center justify-between"
                >
                  <span>Manage Core Skills</span>
                  <Plus size={18} />
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className="w-full p-4 bg-pink-500/10 border border-pink-400/30 rounded-xl text-left text-sm font-bold text-pink-300 hover:bg-pink-500/20 transition-all flex items-center justify-between"
                >
                  <span>View Visitor Messages</span>
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: HOME SECTION EDITOR */}
        {activeTab === 'home' && (
          <form onSubmit={(e) => { e.preventDefault(); saveSection('home', cmsData.home); }} className="space-y-6 max-w-4xl">
            <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">Edit Hero / Home Header</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-400">Full Name</label>
                  <input
                    type="text"
                    value={cmsData.home.name}
                    onChange={(e) => setCmsData({ ...cmsData, home: { ...cmsData.home, name: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-400">Main Role Title</label>
                  <input
                    type="text"
                    value={cmsData.home.role}
                    onChange={(e) => setCmsData({ ...cmsData, home: { ...cmsData.home, role: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-gray-400">Typing Animation Highlight</label>
                <input
                  type="text"
                  value={cmsData.home.typingText}
                  onChange={(e) => setCmsData({ ...cmsData, home: { ...cmsData.home, typingText: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cyan-300 text-sm focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-gray-400">Short Hero Description</label>
                <textarea
                  rows={4}
                  value={cmsData.home.shortDescription}
                  onChange={(e) => setCmsData({ ...cmsData, home: { ...cmsData.home, shortDescription: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-400">Button 1 Label</label>
                  <input
                    type="text"
                    value={cmsData.home.btn1Text}
                    onChange={(e) => setCmsData({ ...cmsData, home: { ...cmsData.home, btn1Text: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-400">Button 2 Label</label>
                  <input
                    type="text"
                    value={cmsData.home.btn2Text}
                    onChange={(e) => setCmsData({ ...cmsData, home: { ...cmsData.home, btn2Text: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-gray-400">Profile Photo Upload</label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={cmsData.home.profileImage}
                    onChange={(e) => setCmsData({ ...cmsData, home: { ...cmsData.home, profileImage: e.target.value } })}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono"
                  />
                  <label className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-mono text-cyan-300 cursor-pointer">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) setCmsData({ ...cmsData, home: { ...cmsData.home, profileImage: url } });
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 text-xs"
              >
                <Save size={16} /> {saving ? 'Saving...' : 'Save Home Section'}
              </button>
            </div>
          </form>
        )}

        {/* SECTION 3: ABOUT SECTION EDITOR */}
        {activeTab === 'about' && (
          <form onSubmit={(e) => { e.preventDefault(); saveSection('about', cmsData.about); }} className="space-y-6 max-w-4xl">
            <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">Edit About Me & Bio</h2>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-gray-400">Biography Paragraphs</label>
                <textarea
                  rows={6}
                  value={cmsData.about.biography}
                  onChange={(e) => setCmsData({ ...cmsData, about: { ...cmsData.about, biography: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-gray-400">"My Why" Statement Quote</label>
                <input
                  type="text"
                  value={cmsData.about.myWhyQuote}
                  onChange={(e) => setCmsData({ ...cmsData, about: { ...cmsData.about, myWhyQuote: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-400">Location</label>
                  <input
                    type="text"
                    value={cmsData.about.location}
                    onChange={(e) => setCmsData({ ...cmsData, about: { ...cmsData.about, location: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-400">Email Address</label>
                  <input
                    type="email"
                    value={cmsData.about.email}
                    onChange={(e) => setCmsData({ ...cmsData, about: { ...cmsData.about, email: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 text-xs"
              >
                <Save size={16} /> {saving ? 'Saving...' : 'Save About Section'}
              </button>
            </div>
          </form>
        )}

        {/* SECTION 4: SKILLS MANAGER */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-cyan-400 font-mono"
                />
              </div>

              <button
                onClick={() => { setEditingItem({ name: '', category: 'Frontend', percentage: 90, description: '' }); setModalType('skill'); }}
                className="w-full sm:w-auto px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add New Skill
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cmsData.skills?.filter((s: any) => s.name.toLowerCase().includes(skillSearch.toLowerCase())).map((skill: any) => (
                <div key={skill.id} className="glass p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-cyan-300 text-lg">{skill.name}</h3>
                      <span className="px-2 py-0.5 bg-white/10 rounded text-xs font-mono text-gray-300">{skill.category}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">{skill.description}</p>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full" style={{ width: `${skill.percentage}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5 mt-4">
                    <button
                      onClick={() => { setEditingItem(skill); setModalType('skill'); }}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-cyan-300 text-xs flex items-center gap-1"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={async () => {
                        await authFetch(`/api/cms/skills/${skill.id}`, { method: 'DELETE' });
                        toast({ title: 'Skill Deleted' });
                        fetchCMSData();
                      }}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: PROJECTS MANAGER */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-cyan-400 font-mono"
                />
              </div>

              <button
                onClick={() => {
                  setEditingItem({
                    title: '',
                    shortDescription: '',
                    detailedDescription: '',
                    technologies: ['React', 'Node.js'],
                    githubUrl: 'https://github.com/parinith01',
                    liveUrl: '',
                    featured: true,
                    category: 'Full Stack'
                  });
                  setModalType('project');
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add New Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cmsData.projects?.filter((p: any) => p.title.toLowerCase().includes(projectSearch.toLowerCase())).map((proj: any) => (
                <div key={proj.id} className="glass p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white text-xl">{proj.title}</h3>
                    {proj.featured && (
                      <span className="px-2.5 py-1 bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 rounded-full text-xs font-mono font-bold">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed">{proj.shortDescription}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies?.map((tech: string) => (
                      <span key={tech} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-cyan-300">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-gray-400 hover:text-cyan-300 flex items-center gap-1">
                      <ExternalLink size={12} /> GitHub Repo
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditingItem(proj); setModalType('project'); }}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-cyan-300 text-xs flex items-center gap-1"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={async () => {
                          await authFetch(`/api/cms/projects/${proj.id}`, { method: 'DELETE' });
                          toast({ title: 'Project Deleted' });
                          fetchCMSData();
                        }}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: EXPERIENCE MANAGER */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Work Experience</h2>
              <button
                onClick={() => {
                  setEditingItem({ company: '', role: '', description: '', startDate: '2024', endDate: 'Present', currentlyWorking: true });
                  setModalType('experience');
                }}
                className="px-5 py-2.5 bg-cyan-500 text-black font-bold rounded-xl text-xs uppercase flex items-center gap-2"
              >
                <Plus size={16} /> Add Experience
              </button>
            </div>

            <div className="space-y-4">
              {cmsData.experience?.map((exp: any) => (
                <div key={exp.id} className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-lg">{exp.role}</h3>
                    <p className="text-sm font-mono text-cyan-400">{exp.company}</p>
                    <p className="text-xs text-gray-400 mt-2">{exp.description}</p>
                    <span className="text-xs font-mono text-gray-500 mt-1 inline-block">{exp.startDate} - {exp.endDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingItem(exp); setModalType('experience'); }}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-cyan-300 text-xs flex items-center gap-1"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={async () => {
                        await authFetch(`/api/cms/experience/${exp.id}`, { method: 'DELETE' });
                        toast({ title: 'Experience Deleted' });
                        fetchCMSData();
                      }}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 7: EDUCATION MANAGER */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Education History</h2>
              <button
                onClick={() => {
                  setEditingItem({ institution: '', location: '', degree: '', score: '90%', year: '2023 - 2027', color: 'cyan' });
                  setModalType('education');
                }}
                className="px-5 py-2.5 bg-cyan-500 text-black font-bold rounded-xl text-xs uppercase flex items-center gap-2"
              >
                <Plus size={16} /> Add Education
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cmsData.education?.map((edu: any) => (
                <div key={edu.id} className="glass p-6 rounded-2xl border border-white/10 space-y-3">
                  <h3 className="font-bold text-white text-lg">{edu.institution}</h3>
                  <p className="text-xs font-mono text-cyan-400">{edu.degree} ({edu.year})</p>
                  <p className="text-sm font-bold text-gray-300">Grade / CGPA: {edu.score}</p>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                    <button
                      onClick={() => { setEditingItem(edu); setModalType('education'); }}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-cyan-300 text-xs flex items-center gap-1"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={async () => {
                        await authFetch(`/api/cms/education/${edu.id}`, { method: 'DELETE' });
                        toast({ title: 'Education Entry Deleted' });
                        fetchCMSData();
                      }}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 8: CERTIFICATES MANAGER */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Certificates & Credentials</h2>
              <button
                onClick={() => {
                  setEditingItem({ name: '', org: '', issueDate: '2024', credentialId: '', pdfLink: '' });
                  setModalType('certificate');
                }}
                className="px-5 py-2.5 bg-cyan-500 text-black font-bold rounded-xl text-xs uppercase flex items-center gap-2"
              >
                <Plus size={16} /> Add Certificate
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cmsData.certificates?.map((cert: any) => (
                <div key={cert.id} className="glass p-6 rounded-2xl border border-white/10 space-y-3">
                  <h3 className="font-bold text-white text-lg">{cert.name}</h3>
                  <p className="text-xs font-mono text-emerald-400">ISSUED BY {cert.org}</p>
                  {cert.pdfLink && (
                    <a href={cert.pdfLink} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-cyan-300 underline block">
                      View PDF Credential
                    </a>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                    <button
                      onClick={() => { setEditingItem(cert); setModalType('certificate'); }}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-cyan-300 text-xs flex items-center gap-1"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={async () => {
                        await authFetch(`/api/cms/certificates/${cert.id}`, { method: 'DELETE' });
                        toast({ title: 'Certificate Deleted' });
                        fetchCMSData();
                      }}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 9: RESUME MANAGER */}
        {activeTab === 'resume' && (
          <div className="space-y-6 max-w-4xl">
            <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
              <h2 className="text-xl font-bold text-cyan-400">Resume PDF Manager</h2>
              <p className="text-xs font-mono text-gray-400">Current Resume Link: {cmsData.about?.resumeUrl || '/Parinith_CM_Resume.pdf'}</p>

              <div className="flex items-center gap-4">
                <a
                  href={cmsData.about?.resumeUrl || '/Parinith_CM_Resume.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded-xl text-xs font-mono font-bold flex items-center gap-2 hover:bg-cyan-500/30"
                >
                  <Eye size={16} /> Preview Current Resume PDF
                </a>

                <label className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-mono text-white cursor-pointer flex items-center gap-2">
                  <Upload size={16} /> Upload New Resume PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleFileUpload(file);
                        if (url) {
                          await saveSection('about', { ...cmsData.about, resumeUrl: url });
                        }
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 10: GALLERY */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Gallery Images</h2>
              <label className="px-5 py-2.5 bg-cyan-500 text-black font-bold rounded-xl text-xs uppercase cursor-pointer flex items-center gap-2">
                <Upload size={16} /> Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await handleFileUpload(file);
                      if (url) {
                        await authFetch('/api/cms/gallery', {
                          method: 'POST',
                          body: JSON.stringify({ url, caption: file.name })
                        });
                        fetchCMSData();
                      }
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {cmsData.gallery?.map((img: any) => (
                <div key={img.id} className="relative group rounded-2xl overflow-hidden border border-white/10">
                  <img src={img.url} alt={img.caption} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={async () => {
                        await authFetch(`/api/cms/gallery/${img.id}`, { method: 'DELETE' });
                        toast({ title: 'Image Deleted' });
                        fetchCMSData();
                      }}
                      className="p-3 bg-red-500 text-white rounded-xl"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 11: SOCIAL LINKS */}
        {activeTab === 'socials' && (
          <form onSubmit={(e) => { e.preventDefault(); saveSection('socials', cmsData.socials); }} className="space-y-6 max-w-4xl">
            <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">Edit Social Profiles & Contact Links</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-400">GitHub Profile URL</label>
                  <input
                    type="text"
                    value={cmsData.socials?.github || ''}
                    onChange={(e) => setCmsData({ ...cmsData, socials: { ...cmsData.socials, github: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-400">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={cmsData.socials?.linkedin || ''}
                    onChange={(e) => setCmsData({ ...cmsData, socials: { ...cmsData.socials, linkedin: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-400">Instagram Handle / URL</label>
                  <input
                    type="text"
                    value={cmsData.socials?.instagram || ''}
                    onChange={(e) => setCmsData({ ...cmsData, socials: { ...cmsData.socials, instagram: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-400">LeetCode URL</label>
                  <input
                    type="text"
                    value={cmsData.socials?.leetcode || ''}
                    onChange={(e) => setCmsData({ ...cmsData, socials: { ...cmsData.socials, leetcode: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 text-xs"
              >
                <Save size={16} /> {saving ? 'Saving...' : 'Save Social Links'}
              </button>
            </div>
          </form>
        )}

        {/* SECTION 12: MESSAGES INBOX */}
        {activeTab === 'messages' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Contact Form Inbox</h2>
              <span className="text-xs font-mono text-cyan-400">{cmsData.messages?.length || 0} Total Messages</span>
            </div>

            <div className="space-y-4">
              {cmsData.messages?.map((msg: any) => (
                <div key={msg.id} className={`glass p-6 rounded-2xl border transition-all ${
                  msg.read ? 'border-white/5 bg-white/5 opacity-70' : 'border-cyan-400/40 bg-cyan-900/10 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                }`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-bold text-white text-base">{msg.name}</h4>
                      <p className="text-xs font-mono text-cyan-300">{msg.email}</p>
                    </div>
                    <span className="text-xs font-mono text-gray-500">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>

                  <p className="text-sm text-gray-200 leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5 mb-4">
                    {msg.message}
                  </p>

                  <div className="flex items-center justify-end gap-3">
                    {!msg.read && (
                      <button
                        onClick={async () => {
                          await authFetch(`/api/cms/messages/${msg.id}/read`, { method: 'PATCH' });
                          toast({ title: 'Marked as Read' });
                          fetchCMSData();
                        }}
                        className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 rounded-lg text-xs font-mono flex items-center gap-1 hover:bg-cyan-500/30"
                      >
                        <CheckCircle2 size={14} /> Mark Read
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        await authFetch(`/api/cms/messages/${msg.id}`, { method: 'DELETE' });
                        toast({ title: 'Message Deleted' });
                        fetchCMSData();
                      }}
                      className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-mono flex items-center gap-1 hover:bg-red-500/30"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 13: SETTINGS & SEO */}
        {activeTab === 'settings' && (
          <form onSubmit={(e) => { e.preventDefault(); saveSection('settings', cmsData.settings); }} className="space-y-6 max-w-4xl">
            <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">Website Settings & SEO Meta Configuration</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-400">SEO Meta Title</label>
                  <input
                    type="text"
                    value={cmsData.settings?.seoTitle || ''}
                    onChange={(e) => setCmsData({ ...cmsData, settings: { ...cmsData.settings, seoTitle: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-400">Footer Text</label>
                  <input
                    type="text"
                    value={cmsData.settings?.footerText || ''}
                    onChange={(e) => setCmsData({ ...cmsData, settings: { ...cmsData.settings, footerText: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-gray-400">SEO Meta Description</label>
                <textarea
                  rows={3}
                  value={cmsData.settings?.seoDescription || ''}
                  onChange={(e) => setCmsData({ ...cmsData, settings: { ...cmsData.settings, seoDescription: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 text-xs"
              >
                <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        )}

        {/* MODAL: ADD / EDIT SKILL */}
        {modalType === 'skill' && editingItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="glass p-8 rounded-3xl border border-cyan-400/30 bg-gray-950 w-full max-w-lg space-y-6">
              <h3 className="text-xl font-bold text-cyan-300">{editingItem.id ? 'Edit Skill' : 'Add New Skill'}</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">Skill Name</label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="Tools">Tools & DevOps</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">Proficiency Percentage ({editingItem.percentage}%)</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={editingItem.percentage}
                    onChange={(e) => setEditingItem({ ...editingItem, percentage: Number(e.target.value) })}
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">Description</label>
                  <textarea
                    rows={3}
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setModalType(null)} className="px-4 py-2.5 bg-white/10 text-gray-300 rounded-xl text-xs font-mono">
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (editingItem.id) {
                      await authFetch(`/api/cms/skills/${editingItem.id}`, { method: 'PUT', body: JSON.stringify(editingItem) });
                    } else {
                      await authFetch('/api/cms/skills', { method: 'POST', body: JSON.stringify(editingItem) });
                    }
                    setModalType(null);
                    fetchCMSData();
                    toast({ title: 'Skill Saved!' });
                  }}
                  className="px-5 py-2.5 bg-cyan-500 text-black font-bold rounded-xl text-xs uppercase"
                >
                  Save Skill
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT PROJECT */}
        {modalType === 'project' && editingItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="glass p-8 rounded-3xl border border-cyan-400/30 bg-gray-950 w-full max-w-2xl space-y-6 my-8">
              <h3 className="text-xl font-bold text-cyan-300">{editingItem.id ? 'Edit Project' : 'Add New Project'}</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">Project Title</label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">Short Summary</label>
                  <textarea
                    rows={3}
                    value={editingItem.shortDescription}
                    onChange={(e) => setEditingItem({ ...editingItem, shortDescription: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-gray-400">GitHub URL</label>
                    <input
                      type="text"
                      value={editingItem.githubUrl}
                      onChange={(e) => setEditingItem({ ...editingItem, githubUrl: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-gray-400">Category</label>
                    <input
                      type="text"
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={editingItem.featured}
                    onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                    className="w-4 h-4 accent-cyan-400"
                  />
                  <label htmlFor="featured" className="text-xs font-mono text-gray-300">Feature on Public Home Page</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button onClick={() => setModalType(null)} className="px-4 py-2.5 bg-white/10 text-gray-300 rounded-xl text-xs font-mono">
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (editingItem.id) {
                      await authFetch(`/api/cms/projects/${editingItem.id}`, { method: 'PUT', body: JSON.stringify(editingItem) });
                    } else {
                      await authFetch('/api/cms/projects', { method: 'POST', body: JSON.stringify(editingItem) });
                    }
                    setModalType(null);
                    fetchCMSData();
                    toast({ title: 'Project Saved!' });
                  }}
                  className="px-5 py-2.5 bg-cyan-500 text-black font-bold rounded-xl text-xs uppercase"
                >
                  Save Project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT EXPERIENCE */}
        {modalType === 'experience' && editingItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="glass p-8 rounded-3xl border border-cyan-400/30 bg-gray-950 w-full max-w-lg space-y-6">
              <h3 className="text-xl font-bold text-cyan-300">{editingItem.id ? 'Edit Experience' : 'Add Work Experience'}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">Role Title</label>
                  <input
                    type="text"
                    value={editingItem.role}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">Company / Organization</label>
                  <input
                    type="text"
                    value={editingItem.company}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">Description</label>
                  <textarea
                    rows={3}
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 font-mono">
                <button onClick={() => setModalType(null)} className="px-4 py-2.5 bg-white/10 text-gray-300 rounded-xl text-xs">Cancel</button>
                <button
                  onClick={async () => {
                    if (editingItem.id) {
                      await authFetch(`/api/cms/experience/${editingItem.id}`, { method: 'PUT', body: JSON.stringify(editingItem) });
                    } else {
                      await authFetch('/api/cms/experience', { method: 'POST', body: JSON.stringify(editingItem) });
                    }
                    setModalType(null);
                    fetchCMSData();
                    toast({ title: 'Experience Saved!' });
                  }}
                  className="px-5 py-2.5 bg-cyan-500 text-black font-bold rounded-xl text-xs uppercase"
                >
                  Save Experience
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT EDUCATION */}
        {modalType === 'education' && editingItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="glass p-8 rounded-3xl border border-cyan-400/30 bg-gray-950 w-full max-w-lg space-y-6">
              <h3 className="text-xl font-bold text-cyan-300">{editingItem.id ? 'Edit Education' : 'Add Education Record'}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">Institution Name</label>
                  <input
                    type="text"
                    value={editingItem.institution}
                    onChange={(e) => setEditingItem({ ...editingItem, institution: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">Degree / Stream</label>
                  <input
                    type="text"
                    value={editingItem.degree}
                    onChange={(e) => setEditingItem({ ...editingItem, degree: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-gray-400">CGPA / Score</label>
                    <input
                      type="text"
                      value={editingItem.score}
                      onChange={(e) => setEditingItem({ ...editingItem, score: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-gray-400">Year</label>
                    <input
                      type="text"
                      value={editingItem.year}
                      onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 font-mono">
                <button onClick={() => setModalType(null)} className="px-4 py-2.5 bg-white/10 text-gray-300 rounded-xl text-xs">Cancel</button>
                <button
                  onClick={async () => {
                    if (editingItem.id) {
                      await authFetch(`/api/cms/education/${editingItem.id}`, { method: 'PUT', body: JSON.stringify(editingItem) });
                    } else {
                      await authFetch('/api/cms/education', { method: 'POST', body: JSON.stringify(editingItem) });
                    }
                    setModalType(null);
                    fetchCMSData();
                    toast({ title: 'Education Saved!' });
                  }}
                  className="px-5 py-2.5 bg-cyan-500 text-black font-bold rounded-xl text-xs uppercase"
                >
                  Save Education
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT CERTIFICATE */}
        {modalType === 'certificate' && editingItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="glass p-8 rounded-3xl border border-cyan-400/30 bg-gray-950 w-full max-w-lg space-y-6">
              <h3 className="text-xl font-bold text-cyan-300">{editingItem.id ? 'Edit Certificate' : 'Add Certificate'}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">Certificate Name</label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">Organization / Issuer</label>
                  <input
                    type="text"
                    value={editingItem.org}
                    onChange={(e) => setEditingItem({ ...editingItem, org: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">PDF Document Link</label>
                  <input
                    type="text"
                    value={editingItem.pdfLink}
                    onChange={(e) => setEditingItem({ ...editingItem, pdfLink: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 font-mono">
                <button onClick={() => setModalType(null)} className="px-4 py-2.5 bg-white/10 text-gray-300 rounded-xl text-xs">Cancel</button>
                <button
                  onClick={async () => {
                    if (editingItem.id) {
                      await authFetch(`/api/cms/certificates/${editingItem.id}`, { method: 'PUT', body: JSON.stringify(editingItem) });
                    } else {
                      await authFetch('/api/cms/certificates', { method: 'POST', body: JSON.stringify(editingItem) });
                    }
                    setModalType(null);
                    fetchCMSData();
                    toast({ title: 'Certificate Saved!' });
                  }}
                  className="px-5 py-2.5 bg-cyan-500 text-black font-bold rounded-xl text-xs uppercase"
                >
                  Save Certificate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI ASSISTANT MODAL */}
        {aiModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="glass p-8 rounded-3xl border border-purple-400/40 bg-gray-950 w-full max-w-lg space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-purple-300 flex items-center gap-2">
                  <Sparkles size={20} /> Portfolio AI Writer
                </h3>
                <button onClick={() => setAiModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">Select Task</label>
                  <select
                    value={aiPromptType}
                    onChange={(e) => setAiPromptType(e.target.value)}
                    className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                  >
                    <option value="project-description">Generate Project Description</option>
                    <option value="improve-bio">Polishing & Improve Bio</option>
                    <option value="seo-tags">Generate SEO Meta Tags</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">Context / Draft Text</label>
                  <textarea
                    rows={3}
                    placeholder="Enter keywords or draft text..."
                    value={aiInputText}
                    onChange={(e) => setAiInputText(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono mt-1"
                  />
                </div>

                <button
                  onClick={handleRunAi}
                  disabled={aiLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white text-xs uppercase tracking-widest hover:opacity-90 flex items-center justify-center gap-2 font-mono"
                >
                  {aiLoading ? 'Generating...' : 'Generate with AI'}
                </button>

                {aiResultText && (
                  <div className="p-4 bg-white/5 border border-purple-400/30 rounded-xl space-y-2">
                    <span className="text-xs font-mono text-purple-300 uppercase">AI Output:</span>
                    <p className="text-xs text-gray-200 leading-relaxed font-mono">{aiResultText}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

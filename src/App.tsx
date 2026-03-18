import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, FolderOpen, Code, Globe, Search, Bell, HelpCircle, 
  Settings, Command, Plus, X, SplitSquareHorizontal, ArrowLeft, ArrowRight, RotateCw, Lock, Puzzle, Star,
  History, Users, Archive, Rocket, ChevronRight, ChevronDown, AlignLeft, CheckSquare, Box, Network, Monitor
} from 'lucide-react';
import { Pane, PaneType, Task } from './types';

export type DeviceSize = 'mobile-sm' | 'mobile-md' | 'pro-max' | 'tablet' | 'desktop';
export interface BrowserInstance { id: string; size: DeviceSize; }
import PlanView from './views/PlanView';
import BuildView from './views/BuildView';
import RunView from './views/RunView';
import PreviewView from './views/PreviewView';
import PushView from './views/PushView';

export default function App() {
  const [activeProject, setActiveProject] = useState('T3 Code');
  const [activeTab, setActiveTab] = useState('BUILD');
  
  const [allPanes, setAllPanes] = useState<Record<string, Pane[]>>({
    'T3 Code': [
      { id: '1', type: 'terminal', title: 'zsh - node server' },
      { id: '2', type: 'editor', title: 'src/main.tsx' }
    ],
    'Sandbox': [
      { id: '3', type: 'terminal', title: 'zsh' }
    ],
    'Open Code': []
  });
  const panes = allPanes[activeProject] || [];
  const setPanes = (action: Pane[] | ((prev: Pane[]) => Pane[])) => {
    setAllPanes(prev => ({
      ...prev,
      [activeProject]: typeof action === 'function' ? action(prev[activeProject] || []) : action
    }));
  };

  const [showHotkeys, setShowHotkeys] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [tasks, setTasks] = useState<Task[]>([
    { id: 'TASK-101', title: 'Implement Auth Flow', column: 'To Do', tags: [{ label: 'Frontend', color: 'bg-[#25f4f4]/10 text-[#25f4f4]' }, { label: 'Security', color: 'bg-purple-500/10 text-purple-400' }], assignee: 'Alex', priority: 'red' },
    { id: 'TASK-102', title: 'Design Database Schema', column: 'To Do', tags: [{ label: 'Backend', color: 'bg-blue-500/10 text-blue-400' }], assignee: 'Sam', priority: 'yellow' },
    { id: 'TASK-103', title: 'Update Landing Page', column: 'In Progress', tags: [{ label: 'Design', color: 'bg-pink-500/10 text-pink-400' }], assignee: 'Jordan', priority: 'green' },
  ]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [activeTaskTransition, setActiveTaskTransition] = useState<Task | null>(null);
  const [transitionStep, setTransitionStep] = useState(0);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const [allBrowsers, setAllBrowsers] = useState<Record<string, BrowserInstance[]>>({
    'T3 Code': [{ id: '1', size: 'mobile-md' }],
    'Sandbox': [{ id: '2', size: 'mobile-md' }],
    'Open Code': [{ id: '3', size: 'tablet' }]
  });
  const previewBrowsers = allBrowsers[activeProject] || [{ id: 'default', size: 'mobile-md' }];
  const setPreviewBrowsers = (action: BrowserInstance[] | ((prev: BrowserInstance[]) => BrowserInstance[])) => {
    setAllBrowsers(prev => {
      const current = prev[activeProject] || [{ id: 'default', size: 'mobile-md' }];
      return {
        ...prev,
        [activeProject]: typeof action === 'function' ? action(current) : action
      };
    });
  };

  const [allActivePreviewIds, setAllActivePreviewIds] = useState<Record<string, string>>({
    'T3 Code': '1',
    'Sandbox': '2',
    'Open Code': '3'
  });
  const activePreviewId = allActivePreviewIds[activeProject] || previewBrowsers[0]?.id;
  const setActivePreviewId = (id: string | ((prev: string) => string)) => {
    setAllActivePreviewIds(prev => ({
      ...prev,
      [activeProject]: typeof id === 'function' ? id(prev[activeProject] || previewBrowsers[0]?.id) : id
    }));
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => setDraggedTaskId(taskId), 0);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, column: string) => {
    e.preventDefault();
    setDraggedTaskId(null);
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.column !== column) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, column } : t));
      
      if (column === 'In Progress') {
        setActiveTaskTransition({ ...task, column });
        setTransitionStep(0);
        
        // Simulate steps
        setTimeout(() => setTransitionStep(1), 1000);
        setTimeout(() => setTransitionStep(2), 2000);
        setTimeout(() => {
          setActiveTaskTransition(null);
          setIsBuilding(true);
        }, 3500);
      }
    }
  };

  const addPane = (type: PaneType = 'terminal') => {
    const newPane: Pane = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      type,
      title: type === 'browser' ? 'Preview - localhost:3000' : type === 'editor' ? 'Untitled' : 'zsh'
    };
    setPanes(prev => [...prev, newPane]);
    
    // Scroll to right after adding
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.scrollTo({
          left: canvasRef.current.scrollWidth,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const splitPaneVertically = () => {
    setPanes(prev => {
      if (prev.length === 0) return prev;
      const newPanes = [...prev];
      const lastPane = newPanes[newPanes.length - 1];
      
      if (!lastPane.splitMode) {
        lastPane.splitMode = 'vertical';
        const originalChild = { ...lastPane, id: lastPane.id + '-1' };
        delete originalChild.splitMode;
        delete originalChild.children;
        
        lastPane.children = [
          originalChild,
          { id: Date.now().toString() + Math.random().toString(36).substring(2, 9), type: 'terminal', title: 'zsh' }
        ];
      }
      // If already split, do nothing to enforce strict 50/50 split
      return newPanes;
    });
  };

  const removePane = (id: string) => {
    setPanes(prev => {
      return prev.filter(p => p.id !== id).map(p => {
        if (p.children) {
          const newChildren = p.children.filter(c => c.id !== id);
          if (newChildren.length === 1) {
            return { ...newChildren[0], id: p.id };
          }
          return { ...p, children: newChildren };
        }
        return p;
      });
    });
  };

  const startReview = () => {
    const newPane: Pane = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      type: 'terminal',
      title: 'Codex Review'
    };
    setPanes(prev => [...prev, newPane]);
    setActiveTab('BUILD');
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.scrollTo({
          left: canvasRef.current.scrollWidth,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Keyboard shortcut simulation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        setShowHotkeys(true);
        
        if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          if (activeTab === 'VIEW') {
            const newId = Date.now().toString();
            setPreviewBrowsers(prev => [...prev, { id: newId, size: 'mobile-md' }]);
            setActivePreviewId(newId);
          } else if (e.shiftKey) {
            splitPaneVertically();
          } else {
            addPane('terminal');
          }
        } else if (e.key === 'r' || e.key === 'R') {
          if (e.shiftKey) {
            e.preventDefault();
            startReview();
          }
        } else if (e.key === '1') {
          e.preventDefault();
          setActiveProject('T3 Code');
        } else if (e.key === '2') {
          e.preventDefault();
          setActiveProject('Sandbox');
        } else if (e.key === '3') {
          e.preventDefault();
          setActiveProject('Open Code');
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey) {
        setShowHotkeys(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const renderPaneContent = (pane: Pane) => (
    <>
      {/* Pane Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#102222] border-b border-[#1a3333]">
        <div className="flex items-center gap-2">
          {pane.type === 'terminal' && <Terminal size={14} className="text-[#25f4f4]" />}
          {pane.type === 'editor' && <Code size={14} className="text-blue-400" />}
          {pane.type === 'browser' && <Globe size={14} className="text-emerald-400" />}
          <span className="text-xs font-bold text-slate-300 tracking-wider">{pane.title}</span>
        </div>
        <button onClick={() => removePane(pane.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded hover:bg-white/5">
          <X size={14} />
        </button>
      </div>

      {/* Pane Content */}
      <div className="flex-1 overflow-hidden relative">
        {pane.type === 'terminal' && (
          <div className="h-full p-4 font-mono text-xs overflow-y-auto bg-[#050808] text-slate-300">
            {pane.title === 'Codex Review' ? (
              <>
                <div className="text-slate-500 mb-2">Starting Codex CLI...</div>
                <div className="flex gap-2 mb-1">
                  <span className="text-[#25f4f4]">➜</span>
                  <span className="text-blue-400">~/{activeProject.toLowerCase().replace(' ', '-')}</span>
                  <span className="text-slate-100">codex review --branch current</span>
                </div>
                <div className="text-emerald-400 mb-2">
                  Analyzing uncommitted changes and current branch...
                </div>
                <div className="text-slate-300 mb-4">
                  - Found 3 modified files<br/>
                  - Running static analysis...<br/>
                  - Checking against style guidelines...
                </div>
                <div className="flex gap-2">
                  <span className="text-[#25f4f4]">➜</span>
                  <span className="w-2 h-4 bg-[#25f4f4] animate-pulse"></span>
                </div>
              </>
            ) : (
              <>
                <div className="text-slate-500 mb-2">Last login: Wed Oct 25 14:22:11 on ttys001</div>
                <div className="flex gap-2 mb-1">
                  <span className="text-[#25f4f4]">➜</span>
                  <span className="text-blue-400">~/{activeProject.toLowerCase().replace(' ', '-')}</span>
                  <span className="text-slate-400">git:(</span><span className="text-red-400">main</span><span className="text-slate-400">)</span>
                  <span className="text-slate-100">npm run dev</span>
                </div>
                <div className="text-slate-400 mb-2">
                  &gt; {activeProject.toLowerCase().replace(' ', '-')}@1.0.0 dev<br/>
                  &gt; vite
                </div>
                <div className="text-emerald-400 mb-1">
                  VITE v5.0.0  ready in 240 ms
                </div>
                <div className="text-slate-300 mb-4">
                  ➜  Local:   <a href="#" className="text-blue-400 hover:underline">http://localhost:3000/</a><br/>
                  ➜  Network: use --host to expose<br/>
                  ➜  press h to show help
                </div>
                <div className="flex gap-2">
                  <span className="text-[#25f4f4]">➜</span>
                  <span className="w-2 h-4 bg-[#25f4f4] animate-pulse"></span>
                </div>
              </>
            )}
          </div>
        )}

        {pane.type === 'editor' && (
          <div className="h-full flex flex-col bg-[#0d1515]">
            <div className="flex border-b border-[#1a3333] bg-[#102222]">
              <div className="px-4 py-2 border-r border-[#1a3333] border-b-2 border-b-[#25f4f4] text-xs text-slate-200 bg-[#0d1515] flex items-center gap-2">
                <span className="text-yellow-400">TS</span> main.tsx
              </div>
              <div className="px-4 py-2 border-r border-[#1a3333] text-xs text-slate-500 flex items-center gap-2">
                <span className="text-blue-400">CSS</span> styles.css
              </div>
            </div>
            <div className="flex-1 p-4 font-mono text-sm overflow-y-auto text-slate-300">
              <div className="flex"><span className="w-8 text-slate-600 select-none">1</span><span className="text-purple-400">import</span> React <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>;</div>
              <div className="flex"><span className="w-8 text-slate-600 select-none">2</span><span className="text-purple-400">import</span> {'{'} createRoot {'}'} <span className="text-purple-400">from</span> <span className="text-green-400">'react-dom/client'</span>;</div>
              <div className="flex"><span className="w-8 text-slate-600 select-none">3</span><span className="text-purple-400">import</span> App <span className="text-purple-400">from</span> <span className="text-green-400">'./App'</span>;</div>
              <div className="flex"><span className="w-8 text-slate-600 select-none">4</span><span className="text-purple-400">import</span> <span className="text-green-400">'./index.css'</span>;</div>
              <div className="flex"><span className="w-8 text-slate-600 select-none">5</span></div>
              <div className="flex"><span className="w-8 text-slate-600 select-none">6</span><span className="text-blue-400">const</span> root = document.<span className="text-yellow-200">getElementById</span>(<span className="text-green-400">'root'</span>);</div>
              <div className="flex"><span className="w-8 text-slate-600 select-none">7</span><span className="text-purple-400">if</span> (root) {'{'}</div>
              <div className="flex"><span className="w-8 text-slate-600 select-none">8</span>  <span className="text-yellow-200">createRoot</span>(root).<span className="text-yellow-200">render</span>(</div>
              <div className="flex"><span className="w-8 text-slate-600 select-none">9</span>    &lt;<span className="text-blue-400">React.StrictMode</span>&gt;</div>
              <div className="flex"><span className="w-8 text-slate-600 select-none">10</span>      &lt;<span className="text-blue-400">App</span> /&gt;</div>
              <div className="flex"><span className="w-8 text-slate-600 select-none">11</span>    &lt;/<span className="text-blue-400">React.StrictMode</span>&gt;</div>
              <div className="flex"><span className="w-8 text-slate-600 select-none">12</span>  );</div>
              <div className="flex"><span className="w-8 text-slate-600 select-none">13</span>{'}'}</div>
            </div>
          </div>
        )}

        {pane.type === 'browser' && (
          <div className="h-full flex flex-col bg-white text-slate-900">
            {/* Chrome-like Header */}
            <div className="bg-[#f1f3f4] flex flex-col border-b border-slate-300">
              {/* Tabs */}
              <div className="flex items-end px-2 pt-2 gap-1">
                <div className="bg-white rounded-t-lg px-4 py-1.5 flex items-center gap-2 min-w-[200px] max-w-[240px] border-x border-t border-slate-300 relative z-10">
                  <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-[10px] text-white font-bold">V</div>
                  <span className="text-xs font-medium truncate flex-1">Vite + React</span>
                  <X size={12} className="text-slate-500 hover:bg-slate-200 rounded-full cursor-pointer" />
                </div>
                <div className="px-4 py-1.5 flex items-center gap-2 min-w-[200px] max-w-[240px] hover:bg-slate-200 rounded-t-lg cursor-pointer">
                  <Globe size={14} className="text-slate-500" />
                  <span className="text-xs font-medium text-slate-600 truncate flex-1">GitHub - {activeProject}</span>
                </div>
                <button className="p-1 hover:bg-slate-200 rounded-full ml-1">
                  <Plus size={16} className="text-slate-600" />
                </button>
              </div>
              
              {/* Address Bar */}
              <div className="bg-white flex items-center gap-2 px-2 py-1.5 border-b border-slate-300">
                <div className="flex gap-1">
                  <button className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600"><ArrowLeft size={16} /></button>
                  <button className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400"><ArrowRight size={16} /></button>
                  <button className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600"><RotateCw size={16} /></button>
                </div>
                <div className="flex-1 bg-[#f1f3f4] rounded-full flex items-center px-4 py-1 border border-transparent hover:border-slate-300 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                  <Lock size={14} className="text-slate-500 mr-2" />
                  <span className="text-sm text-slate-800 flex-1">localhost:3000</span>
                  <Star size={16} className="text-slate-400 hover:text-yellow-400 cursor-pointer" />
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600" title="Extensions"><Puzzle size={18} /></button>
                  <div className="w-px h-5 bg-slate-300 mx-1"></div>
                  <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer border-2 border-white shadow-sm">
                    A
                  </div>
                </div>
              </div>

              {/* Bookmarks */}
              <div className="flex items-center gap-4 px-3 py-1 bg-white text-xs text-slate-600">
                <div className="flex items-center gap-1.5 hover:bg-slate-100 px-2 py-1 rounded cursor-pointer">
                  <img src="https://github.githubassets.com/favicons/favicon.svg" className="w-3 h-3" alt="GitHub" />
                  <span>GitHub</span>
                </div>
                <div className="flex items-center gap-1.5 hover:bg-slate-100 px-2 py-1 rounded cursor-pointer">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                  <span>Linear</span>
                </div>
                <div className="flex items-center gap-1.5 hover:bg-slate-100 px-2 py-1 rounded cursor-pointer">
                  <Terminal size={12} className="text-slate-800" />
                  <span>Vercel</span>
                </div>
              </div>
            </div>

            {/* Webview Content */}
            <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-[#25f4f4] to-blue-500 rounded-2xl mb-6 shadow-lg flex items-center justify-center text-white">
                <Rocket size={48} />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-4">{activeProject} App</h1>
              <p className="text-slate-500 max-w-md mb-8">
                Your application is running successfully. Edit <code>src/App.tsx</code> to see changes.
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
                  Documentation
                </button>
                <button className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                  API Reference
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="flex h-screen w-full bg-[#0a1111] text-slate-100 font-sans overflow-hidden selection:bg-[#25f4f4] selection:text-[#0a1111]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-[#1a3333] flex flex-col bg-[#0d1a1a] z-20">
        <div className="h-16 px-4 flex items-center gap-3 border-b border-[#1a3333] shrink-0">
          <div className="w-8 h-8 rounded bg-[#25f4f4] flex items-center justify-center text-[#0a1111]">
            <Rocket size={20} className="font-bold" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">ai1.studio</span>
            <span className="text-[10px] text-[#25f4f4] uppercase tracking-widest font-bold">Pro Workspace</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
          <div>
            <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Projects</h3>
            <nav className="space-y-1">
              {['T3 Code', 'Sandbox', 'Open Code'].map((proj, idx) => (
                <button 
                  key={proj}
                  onClick={() => setActiveProject(proj)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded transition-colors ${
                    activeProject === proj 
                      ? 'bg-[#25f4f4]/10 text-[#25f4f4] border-l-2 border-[#25f4f4]' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  } ${showHotkeys ? 'ring-1 ring-[#25f4f4]' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    {proj === 'T3 Code' ? <FolderOpen size={18} /> : proj === 'Sandbox' ? <Code size={18} /> : <Terminal size={18} />}
                    <span className="text-sm font-medium">{proj}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {proj === 'T3 Code' && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Dev server running"></span>
                      </div>
                    )}
                    {proj === 'Sandbox' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Dev server running"></span>
                    )}
                    {showHotkeys && <kbd className="text-[10px] font-mono text-[#25f4f4]">⌘{idx + 1}</kbd>}
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div>
            <div className="px-3 flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sessions</h3>
              <Plus size={14} className="text-slate-500 cursor-pointer hover:text-[#25f4f4]" />
            </div>
            <nav className="space-y-1">
              <div className="group">
                <div className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:bg-slate-800 cursor-pointer">
                  <ChevronRight size={14} />
                  <span className="text-sm">Auth Refactor</span>
                </div>
              </div>
              <div className="group">
                <div className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:bg-slate-800 cursor-pointer">
                  <ChevronDown size={14} />
                  <span className="text-sm text-slate-200">UI Components</span>
                </div>
                <div className="ml-8 space-y-1 border-l border-slate-800">
                  <a href="#" className="block pl-4 py-1 text-xs text-slate-500 hover:text-[#25f4f4]">Button System</a>
                  <a href="#" className="block pl-4 py-1 text-xs text-[#25f4f4]">Kanban View</a>
                  <a href="#" className="block pl-4 py-1 text-xs text-slate-500 hover:text-[#25f4f4]">Input Styles</a>
                </div>
              </div>
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-[#1a3333]">
          <button className="w-full flex items-center justify-center gap-2 bg-[#25f4f4] text-[#0a1111] py-2 rounded font-bold text-sm hover:opacity-90 transition-opacity">
            <Plus size={16} />
            New Project
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Nav */}
        <header className="h-16 border-b border-[#1a3333] flex items-center justify-between px-6 bg-[#0a1111]/80 backdrop-blur-md z-10 shrink-0">
          <nav className="flex items-center gap-8 h-full">
            {['PLAN', 'BUILD', 'RUN', 'VIEW', 'PUSH'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-bold tracking-widest transition-colors h-full flex items-center ${
                  activeTab === tab ? 'text-[#25f4f4]' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 relative py-1">
                  {tab}
                  {tab === 'BUILD' && isBuilding && (
                    <span className="w-2 h-2 rounded-full bg-[#25f4f4] animate-pulse"></span>
                  )}
                  {activeTab === tab && <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#25f4f4]"></span>}
                </div>
              </button>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search commands..." 
                className="bg-[#102222] border border-[#1a3333] rounded-lg pl-10 pr-4 py-1.5 text-xs w-64 focus:ring-1 focus:ring-[#25f4f4] focus:border-[#25f4f4] outline-none transition-all text-slate-200 placeholder-slate-500"
              />
            </div>
            <button 
              onClick={() => setShowHotkeys(!showHotkeys)}
              className="bg-[#102222] border border-[#1a3333] text-slate-300 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 hover:text-[#25f4f4] hover:border-[#25f4f4]/50 transition-colors"
              title="Hold Command/Ctrl to show hotkeys"
            >
              <Command size={14} />
              <span>Hotkeys</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" className="w-full h-full" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        {/* Canvas Toolbar */}
        <div className="h-14 px-6 border-b border-[#1a3333] flex items-center justify-between bg-[#0a1111] shrink-0 relative">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <FolderOpen size={20} className="text-[#25f4f4]" />
              {activeProject} Workspace
            </h2>
          </div>
          
          {activeTab === 'VIEW' && (
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#102222] border border-[#1a3333] rounded-lg px-2 py-1">
              <Monitor size={14} className="text-slate-400" />
              <select 
                value={previewBrowsers.find(b => b.id === activePreviewId)?.size || 'mobile-md'}
                onChange={(e) => {
                  const newSize = e.target.value as DeviceSize;
                  setPreviewBrowsers(prev => prev.map(b => b.id === activePreviewId ? { ...b, size: newSize } : b));
                }}
                className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer"
              >
                <option value="mobile-sm">Mobile Small (320px)</option>
                <option value="mobile-md">Mobile Mid (375px)</option>
                <option value="pro-max">Pro Max (430px)</option>
                <option value="tablet">Tablet (768px)</option>
                <option value="desktop">Desktop</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0">
            {activeTab === 'BUILD' && (
              <>
                <button onClick={() => addPane('terminal')} className={`flex items-center gap-2 bg-[#102222] border border-[#1a3333] px-3 py-1.5 rounded text-xs font-medium hover:bg-[#1a3333] text-slate-300 hover:text-white transition-colors ${showHotkeys ? 'ring-1 ring-[#25f4f4]' : ''}`}>
                  <Terminal size={14} /> Add Terminal
                </button>
                <button onClick={() => addPane('editor')} className={`flex items-center gap-2 bg-[#102222] border border-[#1a3333] px-3 py-1.5 rounded text-xs font-medium hover:bg-[#1a3333] text-slate-300 hover:text-white transition-colors ${showHotkeys ? 'ring-1 ring-[#25f4f4]' : ''}`}>
                  <Code size={14} /> Add Editor
                </button>
              </>
            )}
            {(activeTab === 'BUILD' || activeTab === 'VIEW') && (
              <button 
                onClick={() => {
                  if (activeTab === 'BUILD') {
                    addPane('browser');
                  } else {
                    const newId = Date.now().toString();
                    setPreviewBrowsers(prev => [...prev, { id: newId, size: 'mobile-md' }]);
                    setActivePreviewId(newId);
                  }
                }} 
                className={`flex items-center gap-2 ${activeTab === 'VIEW' ? 'bg-[#25f4f4]/10 border border-[#25f4f4]/30 text-[#25f4f4] font-bold hover:bg-[#25f4f4]/20' : 'bg-[#102222] border border-[#1a3333] text-slate-300 font-medium hover:bg-[#1a3333] hover:text-white'} px-3 py-1.5 rounded text-xs transition-colors ${showHotkeys ? 'ring-1 ring-[#25f4f4]' : ''}`}
              >
                <Globe size={14} /> Add Browser
                {showHotkeys && activeTab === 'VIEW' && <kbd className="text-[10px] font-mono bg-[#0a1111] px-1 py-0.5 rounded ml-1">⌘D</kbd>}
              </button>
            )}
            {activeTab === 'BUILD' && (
              <button onClick={startReview} className={`flex items-center gap-2 bg-[#25f4f4]/10 border border-[#25f4f4]/30 text-[#25f4f4] px-3 py-1.5 rounded text-xs font-bold hover:bg-[#25f4f4]/20 transition-colors ${showHotkeys ? 'ring-1 ring-[#25f4f4]' : ''}`}>
                <Code size={14} /> Review Code
                {showHotkeys && <kbd className="text-[10px] font-mono bg-[#0a1111] px-1 py-0.5 rounded ml-1">⌘⇧R</kbd>}
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        {activeTab === 'PLAN' && (
          <PlanView 
            tasks={tasks}
            draggedTaskId={draggedTaskId}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
          />
        )}
        {activeTab === 'BUILD' && (
          <BuildView 
            panes={panes}
            activeProject={activeProject}
            showHotkeys={showHotkeys}
            canvasRef={canvasRef}
            addPane={addPane}
            removePane={removePane}
          />
        )}
        {activeTab === 'RUN' && <RunView />}
        {activeTab === 'VIEW' && (
          <PreviewView 
            activeProject={activeProject} 
            browsers={previewBrowsers}
            activeBrowserId={activePreviewId}
            onRemoveBrowser={(id) => {
              if (previewBrowsers.length > 1) {
                const newBrowsers = previewBrowsers.filter(b => b.id !== id);
                setPreviewBrowsers(newBrowsers);
                if (activePreviewId === id) {
                  setActivePreviewId(newBrowsers[0].id);
                }
              }
            }}
            onSetActiveBrowser={setActivePreviewId}
          />
        )}
        {activeTab === 'PUSH' && <PushView />}
      </main>

      {/* Task Transition Overlay */}
      {activeTaskTransition && (
        <div className="fixed right-0 top-14 bottom-0 w-80 bg-[#0d1a1a] border-l border-[#1a3333] shadow-2xl z-40 animate-in slide-in-from-right duration-300 flex flex-col">
          <div className="p-4 border-b border-[#1a3333] bg-[#102222]">
            <h3 className="text-sm font-bold text-slate-200">Starting Workspace</h3>
            <p className="text-xs text-slate-500 font-mono mt-1">{activeTaskTransition.id}</p>
          </div>
          <div className="p-6 flex-1 space-y-6">
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${transitionStep >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                {transitionStep > 0 ? <CheckSquare size={12} /> : <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>}
              </div>
              <div>
                <p className={`text-sm font-medium ${transitionStep >= 0 ? 'text-slate-200' : 'text-slate-500'}`}>Set up git worktree</p>
                <p className="text-xs text-slate-500 mt-1">Branch: feature/{activeTaskTransition.id.toLowerCase()}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${transitionStep >= 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                {transitionStep > 1 ? <CheckSquare size={12} /> : transitionStep === 1 ? <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> : <div className="w-2 h-2 rounded-full bg-slate-600"></div>}
              </div>
              <div>
                <p className={`text-sm font-medium ${transitionStep >= 1 ? 'text-slate-200' : 'text-slate-500'}`}>Copy .env files</p>
                <p className="text-xs text-slate-500 mt-1">Syncing secrets from vault</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${transitionStep >= 2 ? 'bg-[#25f4f4]/20 text-[#25f4f4]' : 'bg-slate-800 text-slate-500'}`}>
                {transitionStep > 2 ? <CheckSquare size={12} /> : transitionStep === 2 ? <div className="w-2 h-2 rounded-full bg-[#25f4f4] animate-pulse"></div> : <div className="w-2 h-2 rounded-full bg-slate-600"></div>}
              </div>
              <div>
                <p className={`text-sm font-medium ${transitionStep >= 2 ? 'text-slate-200' : 'text-slate-500'}`}>Start Claude instance</p>
                <p className="text-xs text-slate-500 mt-1">Initializing agentic context</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

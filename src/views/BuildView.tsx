import React from 'react';
import { Terminal, Code, Globe, X, Plus, ArrowLeft, ArrowRight, RotateCw, Lock, Star, Puzzle, Rocket, Maximize2, Sparkles } from 'lucide-react';
import { Pane, PaneType } from '../types';

interface BuildViewProps {
  panes: Pane[];
  activeProject: string;
  showHotkeys: boolean;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  addPane: (type?: PaneType) => void;
  removePane: (id: string) => void;
}

export default function BuildView({ panes, activeProject, showHotkeys, canvasRef, addPane, removePane }: BuildViewProps) {
  const scrollToPane = (id: string) => {
    const el = document.getElementById(`pane-${id}`);
    if (el && canvasRef.current) {
      const container = canvasRef.current;
      const scrollLeft = el.offsetLeft - (container.clientWidth / 2) + (el.clientWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  const renderPaneContent = (pane: Pane) => (
    <>
      {/* Pane Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#102222] border-b border-[#1a3333]">
        <div className="flex items-center gap-2">
          {pane.type === 'terminal' && (
            pane.title === 'Codex Review' ? <Sparkles size={14} className="text-yellow-400" /> : <Terminal size={14} className="text-[#25f4f4]" />
          )}
          {pane.type === 'editor' && <Code size={14} className="text-blue-400" />}
          {pane.type === 'browser' && <Globe size={14} className="text-emerald-400" />}
          <span className="text-xs font-bold text-slate-300 tracking-wider">{pane.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => scrollToPane(pane.id)} className="text-slate-500 hover:text-[#25f4f4] transition-colors p-1 rounded hover:bg-white/5" title="Focus Pane">
            <Maximize2 size={14} />
          </button>
          <button onClick={() => removePane(pane.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded hover:bg-white/5" title="Close Pane">
            <X size={14} />
          </button>
        </div>
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
                  <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer border-2 border-white shadow-sm" title="Chrome Profile">
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
    <div 
      ref={canvasRef}
      className="flex-1 overflow-x-auto overflow-y-hidden bg-[#050808] p-6 flex gap-6 custom-scrollbar scroll-smooth relative"
      style={{ scrollSnapType: 'x mandatory' }}
    >
      {panes.map((pane) => (
        <div 
          id={`pane-${pane.id}`}
          key={pane.id} 
          className={`flex-shrink-0 w-[800px] h-full flex ${pane.splitMode === 'vertical' ? 'flex-col gap-4 bg-transparent border-none shadow-none' : `flex-col bg-[#0d1515] border ${pane.title === 'Codex Review' ? 'border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.1)]' : 'border-[#1a3333]'} rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-[#25f4f4]/50 hover:shadow-[0_0_30px_rgba(37,244,244,0.1)]`}`}
          style={{ scrollSnapAlign: 'center' }}
        >
          {pane.splitMode === 'vertical' && pane.children ? (
            pane.children.map(child => (
              <div key={child.id} className="flex-1 flex flex-col bg-[#0d1515] border border-[#1a3333] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-[#25f4f4]/50 hover:shadow-[0_0_30px_rgba(37,244,244,0.1)] relative">
                {renderPaneContent(child)}
              </div>
            ))
          ) : (
            renderPaneContent(pane)
          )}
        </div>
      ))}
      
      {/* Add Pane Placeholder */}
      <div className={`flex-shrink-0 w-[300px] h-full flex items-center justify-center border-2 border-dashed border-[#1a3333] rounded-xl hover:border-[#25f4f4]/50 hover:bg-[#25f4f4]/5 transition-all cursor-pointer group ${showHotkeys ? 'border-[#25f4f4] bg-[#25f4f4]/5' : ''}`} onClick={() => addPane('terminal')}>
        <div className={`flex flex-col items-center gap-3 text-slate-500 ${showHotkeys ? 'text-[#25f4f4]' : 'group-hover:text-[#25f4f4]'}`}>
          <div className={`w-12 h-12 rounded-full bg-[#102222] flex items-center justify-center transition-colors ${showHotkeys ? 'bg-[#25f4f4]/20' : 'group-hover:bg-[#25f4f4]/20'}`}>
            <Plus size={24} />
          </div>
          <span className="font-bold tracking-widest uppercase text-xs">Add Pane</span>
          {showHotkeys && <kbd className="text-[10px] font-mono bg-[#102222] px-2 py-1 rounded mt-2">⌘D</kbd>}
        </div>
      </div>

      {/* Minimap */}
      <div className="fixed bottom-6 right-6 bg-[#0a1111]/90 backdrop-blur border border-[#1a3333] p-2 rounded-lg flex gap-1 z-50 shadow-2xl">
        {panes.map(p => (
          <div 
            key={p.id} 
            onClick={() => scrollToPane(p.id)}
            className={`w-8 h-6 rounded cursor-pointer transition-colors border ${p.title === 'Codex Review' ? 'bg-yellow-400/20 border-yellow-400/50' : 'bg-[#102222] border-[#1a3333] hover:border-[#25f4f4]/50'}`}
            title={p.title}
          >
            <div className="w-full h-full flex items-center justify-center opacity-50">
              {p.type === 'terminal' && <Terminal size={10} className={p.title === 'Codex Review' ? 'text-yellow-400' : 'text-[#25f4f4]'} />}
              {p.type === 'editor' && <Code size={10} className="text-blue-400" />}
              {p.type === 'browser' && <Globe size={10} className="text-emerald-400" />}
            </div>
          </div>
        ))}
        <div 
          onClick={() => addPane('terminal')}
          className="w-8 h-6 rounded cursor-pointer transition-colors border border-dashed border-[#1a3333] hover:border-[#25f4f4]/50 flex items-center justify-center bg-[#25f4f4]/5"
          title="Add Pane"
        >
          <Plus size={10} className="text-slate-500" />
        </div>
      </div>
    </div>
  );
}


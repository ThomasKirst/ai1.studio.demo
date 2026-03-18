import React, { useState } from 'react';
import { Activity, Server, Database, Square, RotateCw, Terminal, Code, Box, Eye, EyeOff, Edit2, X } from 'lucide-react';

export default function RunView() {
  const [showDbUrl, setShowDbUrl] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  return (
    <div className="flex-1 overflow-hidden bg-[#050808] flex">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 text-slate-300 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="text-[#25f4f4]" /> Running Services
          </h2>
          <button 
            onClick={() => setShowTerminal(!showTerminal)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${showTerminal ? 'bg-[#25f4f4]/10 border border-[#25f4f4]/30 text-[#25f4f4] hover:bg-[#25f4f4]/20' : 'bg-[#102222] border border-[#1a3333] hover:bg-[#1a3333] text-slate-300 hover:text-white'}`}
          >
            <Terminal size={14} /> Open Worktree in CLI
          </button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {['Frontend (Vite)', 'Backend (Node)', 'Database (Postgres)'].map((service, i) => (
            <div key={service} className="bg-[#0d1515] border border-[#1a3333] rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  {i === 2 ? <Database size={16} className="text-purple-400" /> : <Server size={16} className="text-blue-400" />}
                  <span className="font-bold">{service}</span>
                </div>
                <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> Healthy
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-500 mb-4">
                <div className="flex justify-between"><span>CPU</span><span className="text-slate-300">{Math.floor(Math.random() * 20) + 1}%</span></div>
                <div className="flex justify-between"><span>RAM</span><span className="text-slate-300">{Math.floor(Math.random() * 500) + 100} MB</span></div>
                <div className="flex justify-between"><span>Uptime</span><span className="text-slate-300">2h 14m</span></div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 bg-[#1a3333] hover:bg-[#25f4f4]/20 hover:text-[#25f4f4] py-1.5 rounded transition-colors text-xs">
                  <RotateCw size={12} /> Restart
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 bg-[#1a3333] hover:bg-red-500/20 hover:text-red-400 py-1.5 rounded transition-colors text-xs">
                  <Square size={12} /> Stop
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex-1 flex flex-col gap-6 min-h-0">
          <div className="bg-[#0d1515] border border-[#1a3333] rounded-xl p-4 flex-1 flex flex-col min-h-[150px]">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Terminal size={14} /> Aggregated Logs</h3>
            <div className="flex-1 bg-[#050808] rounded p-3 font-mono text-xs overflow-y-auto space-y-1">
              <div className="text-slate-500">[14:02:01] <span className="text-blue-400">frontend</span> | VITE v5.0.0 ready in 240 ms</div>
              <div className="text-slate-500">[14:02:05] <span className="text-emerald-400">backend</span>  | Server listening on port 3001</div>
              <div className="text-slate-500">[14:05:22] <span className="text-purple-400">database</span> | Connection established from 127.0.0.1</div>
            </div>
          </div>
          
          {showTerminal && (
            <div className="bg-[#0d1515] border border-[#1a3333] rounded-xl p-4 flex-1 flex flex-col min-h-[200px] animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold flex items-center gap-2"><Terminal size={14} /> Worktree CLI</h3>
                <button onClick={() => setShowTerminal(false)} className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded hover:bg-white/5">
                  <X size={14} />
                </button>
              </div>
              <div className="flex-1 bg-[#050808] rounded p-3 font-mono text-xs overflow-y-auto text-slate-300">
                <div className="text-slate-500 mb-2">Last login: Wed Oct 25 14:22:11 on ttys001</div>
                <div className="flex gap-2 mb-1">
                  <span className="text-[#25f4f4]">➜</span>
                  <span className="text-blue-400">~/projects/t3-code</span>
                  <span className="text-slate-400">git:(</span><span className="text-red-400">feature/task-101</span><span className="text-slate-400">)</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#25f4f4]">➜</span>
                  <span className="w-2 h-4 bg-[#25f4f4] animate-pulse"></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-96 border-l border-[#1a3333] bg-[#0d1a1a] p-5 flex flex-col gap-5 overflow-y-auto custom-scrollbar shrink-0">
        {/* Environment */}
        <div className="bg-[#0a1111] border border-[#1a3333] rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-sm tracking-wider">
              <Code size={16} className="text-[#25f4f4]" />
              ENVIRONMENT
            </div>
            <span className="bg-[#1a3333] text-[#25f4f4] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              .env loaded
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">DATABASE_URL</div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setShowDbUrl(!showDbUrl)} className="p-1 hover:bg-[#1a3333] rounded text-slate-400 hover:text-[#25f4f4] transition-colors">
                    {showDbUrl ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                  <button className="p-1 hover:bg-[#1a3333] rounded text-slate-400 hover:text-[#25f4f4] transition-colors">
                    <Edit2 size={12} />
                  </button>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-300 break-all bg-[#050808] p-2 rounded border border-[#1a3333]">
                {showDbUrl ? 'postgres://user:pass@localhost:5432/db' : 'postgres://u...****'}
              </div>
            </div>
            
            <div className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PORT</div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:bg-[#1a3333] rounded text-slate-400 hover:text-[#25f4f4] transition-colors">
                    <Edit2 size={12} />
                  </button>
                </div>
              </div>
              <div className="bg-[#050808] p-2 rounded border border-[#1a3333]">
                <input 
                  type="number" 
                  defaultValue={3000} 
                  className="text-xs font-mono text-slate-300 bg-transparent border-none outline-none w-full" 
                />
              </div>
            </div>

            <div className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">API_KEY</div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setShowApiKey(!showApiKey)} className="p-1 hover:bg-[#1a3333] rounded text-slate-400 hover:text-[#25f4f4] transition-colors">
                    {showApiKey ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                  <button className="p-1 hover:bg-[#1a3333] rounded text-slate-400 hover:text-[#25f4f4] transition-colors">
                    <Edit2 size={12} />
                  </button>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-300 break-all bg-[#050808] p-2 rounded border border-[#1a3333]">
                {showApiKey ? 'sk_live_9f8d7c6b5a41234a21' : 'sk_live_...4a21'}
              </div>
            </div>
          </div>
        </div>

        {/* Containers */}
        <div className="bg-[#0a1111] border border-[#1a3333] rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-sm tracking-wider">
              <Box size={16} className="text-blue-400" />
              CONTAINERS
            </div>
            <span className="bg-blue-400/10 text-blue-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              compose.yml
            </span>
          </div>
          
          <div className="space-y-3 relative">
            {/* Network line */}
            <div className="absolute left-3 top-3 bottom-3 w-px bg-[#1a3333]"></div>
            
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-6 h-6 rounded bg-[#0d1a1a] border border-[#1a3333] flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.5)]"></div>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-300">web</div>
                <div className="text-[10px] text-slate-500 font-mono">localhost:3000</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-6 h-6 rounded bg-[#0d1a1a] border border-[#1a3333] flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.5)]"></div>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-300">api</div>
                <div className="text-[10px] text-slate-500 font-mono">localhost:8080</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-6 h-6 rounded bg-[#0d1a1a] border border-[#1a3333] flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.5)]"></div>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-300">db</div>
                <div className="text-[10px] text-slate-500 font-mono">postgres:5432</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-6 h-6 rounded bg-[#0d1a1a] border border-[#1a3333] flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-500 flex items-center gap-2">
                  redis 
                  <span className="text-[9px] font-normal px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 uppercase tracking-wider">exited</span>
                </div>
                <div className="text-[10px] text-slate-600 font-mono">redis:6379</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

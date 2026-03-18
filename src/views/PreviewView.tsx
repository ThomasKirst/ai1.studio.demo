import React from 'react';
import { X, Rocket, ArrowLeft, ArrowRight, RotateCw, Lock, Plus, MoreVertical } from 'lucide-react';
import { DeviceSize, BrowserInstance } from '../App';

interface PreviewViewProps {
  activeProject: string;
  browsers: BrowserInstance[];
  activeBrowserId: string;
  onRemoveBrowser: (id: string) => void;
  onSetActiveBrowser: (id: string) => void;
}

export default function PreviewView({ activeProject, browsers, activeBrowserId, onRemoveBrowser, onSetActiveBrowser }: PreviewViewProps) {
  const getDimensions = (size: DeviceSize) => {
    switch(size) {
      case 'mobile-sm': return { width: 320, height: 568 };
      case 'mobile-md': return { width: 375, height: 667 };
      case 'pro-max': return { width: 430, height: 932 };
      case 'tablet': return { width: 768, height: 1024 };
      case 'desktop': return { width: 1280, height: 800 };
      default: return { width: '100%', height: '100%' };
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#050808] overflow-hidden">
      {/* Workspace */}
      <div className="flex-1 overflow-auto p-8 flex gap-8 items-start custom-scrollbar bg-[#050808]">
        {browsers.map(b => {
          const isOnlyDesktop = browsers.length === 1 && b.size === 'desktop';
          const dims = getDimensions(b.size);
          const style = isOnlyDesktop 
            ? { flex: 1, height: '100%', minHeight: '600px' } 
            : { width: dims.width, height: dims.height, flexShrink: 0 };
          const isActive = b.id === activeBrowserId;

          return (
            <div 
              key={b.id} 
              onClick={() => onSetActiveBrowser(b.id)}
              className={`flex flex-col bg-white rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-all duration-300 ${isActive ? 'ring-2 ring-[#25f4f4]' : 'border border-slate-700 opacity-80 hover:opacity-100'}`}
              style={style}
            >
              {/* Chrome Browser Header */}
              <div className="bg-[#dee1e6] flex flex-col shrink-0 rounded-t-xl overflow-hidden">
                {/* Tabs Area */}
                <div className="flex items-end px-2 pt-2 gap-1 bg-[#dee1e6]">
                  <div className="bg-white rounded-t-lg px-4 py-1.5 flex items-center gap-2 max-w-[200px] min-w-[120px] relative group">
                    <div className="w-3 h-3 rounded-full bg-slate-200 shrink-0"></div>
                    <span className="text-xs text-slate-700 truncate flex-1">{activeProject}</span>
                    {browsers.length > 1 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onRemoveBrowser(b.id); }}
                        className="p-0.5 hover:bg-slate-200 rounded-full text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                  <button className="p-1.5 hover:bg-slate-300 rounded-full text-slate-600 mb-0.5">
                    <Plus size={14} />
                  </button>
                </div>

                {/* Navigation Area */}
                <div className="bg-white px-2 py-1.5 flex items-center gap-2 border-b border-slate-200">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400"><ArrowLeft size={16} /></button>
                    <button className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400"><ArrowRight size={16} /></button>
                    <button className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600"><RotateCw size={14} /></button>
                  </div>
                  
                  <div className="flex-1 bg-[#f1f3f4] rounded-full flex items-center px-3 py-1 border border-transparent hover:border-slate-300 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                    <Lock size={12} className="text-slate-500 mr-2" />
                    <span className="text-sm text-slate-800 flex-1 truncate">localhost:3000</span>
                  </div>

                  <button className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Viewport Content */}
              <div className="flex-1 bg-slate-50 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#25f4f4] to-blue-500 rounded-2xl mb-6 shadow-lg flex items-center justify-center text-white">
                    <Rocket size={40} />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-800 mb-2">{activeProject}</h1>
                  <p className="text-slate-500 text-sm mb-6">
                    {b.size === 'desktop' ? 'Desktop View' : 
                     b.size === 'tablet' ? 'Tablet View' : 'Mobile View'}
                  </p>
                  <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-500 shadow-sm">
                    {isOnlyDesktop ? 'Responsive' : `${dims.width} × ${dims.height}`}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

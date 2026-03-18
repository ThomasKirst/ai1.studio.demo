import React, { useState } from 'react';
import { 
  CloudUpload, ExternalLink, Sparkles, FileText, Settings, 
  AlertTriangle, GitPullRequest, CheckCircle2, Loader2, GitBranch,
  FileCode2, Box, ChevronDown, ChevronRight, GitCommit
} from 'lucide-react';

const DiffView = ({ filename, icon: Icon, additions, deletions, diffLines, isExpandedDefault = false }: any) => {
  const [isExpanded, setIsExpanded] = useState(isExpandedDefault);

  return (
    <div className="bg-[#0d1515] border border-[#1a3333] rounded-xl overflow-hidden mb-4">
      <div 
        className="px-4 py-3 border-b border-[#1a3333] flex items-center justify-between bg-[#102222] cursor-pointer hover:bg-[#152b2b] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? <ChevronDown size={16} className="text-slate-500" /> : <ChevronRight size={16} className="text-slate-500" />}
          <Icon size={16} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-200">{filename}</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-emerald-400">+{additions}</span>
          <span className="text-red-400">-{deletions}</span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="overflow-x-auto bg-[#050808] text-xs font-mono leading-relaxed">
          <table className="w-full border-collapse">
            <tbody>
              {diffLines.map((line: any, i: number) => (
                <tr key={i} className={`
                  ${line.type === 'add' ? 'bg-emerald-500/10 text-emerald-300' : ''}
                  ${line.type === 'remove' ? 'bg-red-500/10 text-red-300' : ''}
                  ${line.type === 'context' ? 'text-slate-400' : ''}
                `}>
                  <td className="w-10 text-right pr-2 py-0.5 text-slate-600 select-none border-r border-[#1a3333]/50">
                    {line.oldNum || ' '}
                  </td>
                  <td className="w-10 text-right pr-2 py-0.5 text-slate-600 select-none border-r border-[#1a3333]/50">
                    {line.newNum || ' '}
                  </td>
                  <td className="w-6 text-center select-none">
                    {line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}
                  </td>
                  <td className="py-0.5 whitespace-pre pr-4">
                    {line.content}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default function PushView() {
  const [isPushing, setIsPushing] = useState(false);
  const [pushSuccess, setPushSuccess] = useState(false);

  const handlePush = () => {
    setIsPushing(true);
    // Simulate network request and CI/CD pipeline trigger
    setTimeout(() => {
      setIsPushing(false);
      setPushSuccess(true);
    }, 2500);
  };

  const diffs = [
    {
      filename: 'src/auth/core.ts',
      icon: FileText,
      additions: 124,
      deletions: 12,
      isExpandedDefault: true,
      diffLines: [
        { type: 'context', oldNum: 45, newNum: 45, content: 'export class AuthService {' },
        { type: 'context', oldNum: 46, newNum: 46, content: '  private session: Session | null = null;' },
        { type: 'remove', oldNum: 47, newNum: null, content: '  private token: string | null = null;' },
        { type: 'add', oldNum: null, newNum: 47, content: '  private tokens: TokenPair | null = null;' },
        { type: 'add', oldNum: null, newNum: 48, content: '  private refreshTimer: NodeJS.Timeout | null = null;' },
        { type: 'context', oldNum: 48, newNum: 49, content: '' },
        { type: 'remove', oldNum: 49, newNum: null, content: '  async login(credentials: Credentials) {' },
        { type: 'remove', oldNum: 50, newNum: null, content: '    const res = await api.post("/auth", credentials);' },
        { type: 'remove', oldNum: 51, newNum: null, content: '    this.token = res.token;' },
        { type: 'add', oldNum: null, newNum: 50, content: '  async authenticate(credentials: Credentials, options?: AuthOptions) {' },
        { type: 'add', oldNum: null, newNum: 51, content: '    const res = await api.post("/v2/auth/login", credentials);' },
        { type: 'add', oldNum: null, newNum: 52, content: '    this.tokens = res.tokens;' },
        { type: 'add', oldNum: null, newNum: 53, content: '    this.setupRefreshTimer();' },
        { type: 'context', oldNum: 52, newNum: 54, content: '    this.session = res.session;' },
        { type: 'context', oldNum: 53, newNum: 55, content: '    return this.session;' },
        { type: 'context', oldNum: 54, newNum: 56, content: '  }' },
      ]
    },
    {
      filename: 'src/ui/sidebar.tsx',
      icon: FileCode2,
      additions: 45,
      deletions: 0,
      isExpandedDefault: false,
      diffLines: [
        { type: 'context', oldNum: 112, newNum: 112, content: '      <div className="flex flex-col gap-2">' },
        { type: 'context', oldNum: 113, newNum: 113, content: '        <NavLinks items={mainLinks} />' },
        { type: 'add', oldNum: null, newNum: 114, content: '        ' },
        { type: 'add', oldNum: null, newNum: 115, content: '        {/* New Environment Widget */}' },
        { type: 'add', oldNum: null, newNum: 116, content: '        <div className="mt-8">' },
        { type: 'add', oldNum: null, newNum: 117, content: '          <h3 className="text-xs font-bold text-slate-500 uppercase px-4 mb-2">Environment</h3>' },
        { type: 'add', oldNum: null, newNum: 118, content: '          <EnvironmentWidget />' },
        { type: 'add', oldNum: null, newNum: 119, content: '        </div>' },
        { type: 'context', oldNum: 114, newNum: 120, content: '      </div>' },
        { type: 'context', oldNum: 115, newNum: 121, content: '    </aside>' },
      ]
    },
    {
      filename: 'package.json',
      icon: Settings,
      additions: 2,
      deletions: 1,
      isExpandedDefault: false,
      diffLines: [
        { type: 'context', oldNum: 24, newNum: 24, content: '  "dependencies": {' },
        { type: 'context', oldNum: 25, newNum: 25, content: '    "react": "^18.2.0",' },
        { type: 'context', oldNum: 26, newNum: 26, content: '    "react-dom": "^18.2.0",' },
        { type: 'remove', oldNum: 27, newNum: null, content: '    "lucide-react": "^0.263.1"' },
        { type: 'add', oldNum: null, newNum: 27, content: '    "lucide-react": "^0.344.0",' },
        { type: 'add', oldNum: null, newNum: 28, content: '    "zustand": "^4.5.2"' },
        { type: 'context', oldNum: 28, newNum: 29, content: '  },' },
        { type: 'context', oldNum: 29, newNum: 30, content: '  "devDependencies": {' },
      ]
    }
  ];

  return (
    <div className="flex-1 overflow-auto bg-[#050808] p-8 text-slate-300 custom-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2 text-[#25f4f4] text-xs font-bold tracking-widest uppercase mb-2">
            <CloudUpload size={16} /> Push to Remote
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Review & Push</h1>
          <p className="text-slate-400">Review your staged changes, update PR details, and push to your feature branch.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0d1515] border border-[#1a3333] rounded-lg text-sm font-medium hover:bg-[#1a3333] transition-colors">
          <ExternalLink size={16} /> View on GitHub
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Rich Diff View */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <GitCommit className="text-[#25f4f4]" /> Staged Changes
            </h2>
            <div className="flex items-center gap-4 text-xs font-mono bg-[#0d1515] px-3 py-1.5 rounded-full border border-[#1a3333]">
              <span className="text-slate-400">3 files changed</span>
              <span className="text-emerald-400">+171</span>
              <span className="text-red-400">-13</span>
            </div>
          </div>

          <div className="flex flex-col">
            {diffs.map((diff, index) => (
              <DiffView key={index} {...diff} />
            ))}
          </div>
        </div>

        {/* Right Column - PR Details & Actions */}
        <div className="flex flex-col gap-6">
          
          {/* PR Details Card */}
          <div className="bg-[#0d1515] border border-[#1a3333] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1a3333] flex items-center justify-between bg-[#102222]">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <GitPullRequest size={16} className="text-[#25f4f4]" /> Pull Request
              </h2>
              <button className="flex items-center gap-1.5 text-xs text-[#25f4f4] hover:text-white transition-colors">
                <Sparkles size={14} /> Auto-fill
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Title</label>
                <input 
                  type="text" 
                  defaultValue="feat: auth refactor and update sidebar layout"
                  className="w-full bg-[#050808] border border-[#1a3333] rounded-lg px-4 py-3 text-sm text-slate-200 focus:border-[#25f4f4] outline-none transition-colors font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Description</label>
                <textarea 
                  rows={8}
                  defaultValue={`This PR introduces the new authentication flow implementation in \`src/auth/core.ts\` and refactors the sidebar component to support the new session states.

Key changes:
- Optimized rendering cycles in core engine (+124 lines).
- Implemented new responsive sidebar layout with lucide-react icons.
- Updated package dependencies for visual consistency.
- Added Environment and Container widgets to the Run view.`}
                  className="w-full bg-[#050808] border border-[#1a3333] rounded-lg px-4 py-3 text-sm text-slate-300 focus:border-[#25f4f4] outline-none transition-colors leading-relaxed resize-none custom-scrollbar"
                />
              </div>
            </div>
          </div>

          {/* Push Action Card */}
          <div className="bg-[#0d1515] border border-[#1a3333] rounded-xl p-6">
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between py-2 border-b border-[#1a3333]">
                <span className="text-sm text-slate-400">Target Branch</span>
                <span className="bg-[#1a3333] text-[#25f4f4] text-xs px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5">
                  <GitBranch size={12} /> feature/auth-refactor
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#1a3333]">
                <span className="text-sm text-slate-400">Reviewers</span>
                <div className="flex items-center -space-x-2">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" className="w-6 h-6 rounded-full border-2 border-[#0d1515] bg-slate-800" alt="Reviewer 1" />
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sam" className="w-6 h-6 rounded-full border-2 border-[#0d1515] bg-slate-800" alt="Reviewer 2" />
                  <div className="w-6 h-6 rounded-full border-2 border-[#0d1515] bg-[#1a3333] flex items-center justify-center text-[8px] font-bold text-slate-300">+2</div>
                </div>
              </div>
            </div>

            {pushSuccess ? (
              <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-lg p-5 text-center">
                <div className="w-12 h-12 bg-emerald-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={24} className="text-emerald-400" />
                </div>
                <h3 className="text-emerald-400 font-bold mb-1">Successfully Pushed!</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Changes pushed to <span className="font-mono text-emerald-300">feature/auth-refactor</span> and PR #142 created.
                </p>
                <button className="w-full bg-[#1a3333] text-slate-200 font-bold py-2.5 rounded-lg text-sm hover:bg-[#25f4f4]/20 hover:text-[#25f4f4] transition-colors">
                  View Pull Request
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={handlePush}
                  disabled={isPushing}
                  className={`w-full font-bold py-3.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-all ${
                    isPushing 
                      ? 'bg-[#25f4f4]/50 text-[#0a1111] cursor-not-allowed' 
                      : 'bg-[#25f4f4] text-[#0a1111] hover:opacity-90 hover:shadow-[0_0_20px_rgba(37,244,244,0.3)]'
                  }`}
                >
                  {isPushing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Pushing to feature/auth-refactor...
                    </>
                  ) : (
                    <>
                      <CloudUpload size={18} /> PUSH & CREATE PR
                    </>
                  )}
                </button>
                <div className="flex items-start gap-2 mt-4 text-yellow-500/80 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    No conflicts with <span className="font-mono">main</span>. Pushing will trigger the CI/CD pipeline for this feature branch.
                  </p>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

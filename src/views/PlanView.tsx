import React from 'react';
import { Plus, AlignLeft, CheckSquare } from 'lucide-react';
import { Task } from '../types';

interface PlanViewProps {
  tasks: Task[];
  draggedTaskId: string | null;
  handleDragStart: (e: React.DragEvent, taskId: string) => void;
  handleDragEnd: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, column: string) => void;
}

export default function PlanView({ tasks, draggedTaskId, handleDragStart, handleDragEnd, handleDragOver, handleDrop }: PlanViewProps) {
  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden bg-[#050808] p-6 flex gap-6 custom-scrollbar">
      {['To Do', 'In Progress', 'In Review', 'Done'].map(col => (
        <div 
          key={col} 
          className="flex-shrink-0 w-[320px] flex flex-col bg-[#0d1a1a] border border-[#1a3333] rounded-xl overflow-hidden"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, col)}
        >
          <div className="px-4 py-3 border-b border-[#1a3333] flex items-center justify-between bg-[#102222]">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">{col}</h3>
            <span className="bg-[#1a3333] text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {tasks.filter(t => t.column === col).length}
            </span>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
            {tasks.filter(t => t.column === col).map(task => (
              <div 
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragEnd={handleDragEnd}
                className={`bg-[#102222] border p-3 rounded-lg transition-colors cursor-grab active:cursor-grabbing ${
                  draggedTaskId === task.id 
                    ? 'opacity-30 border-dashed border-[#25f4f4]' 
                    : 'border-[#1a3333] hover:border-[#25f4f4]/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full bg-${task.priority}-400`}></span>
                  <span className="text-[10px] text-slate-500 font-mono">{task.id}</span>
                </div>
                <h4 className="text-sm font-medium text-slate-200 mb-2">{task.title}</h4>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {task.tags.map(tag => (
                    <span key={tag.label} className={`text-[10px] px-2 py-0.5 rounded ${tag.color}`}>{tag.label}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[10px]"><AlignLeft size={12} /></div>
                    <div className="flex items-center gap-1 text-[10px]"><CheckSquare size={12} /> 1/3</div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-slate-700 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee}`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[#1a3333]">
            <button className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-300 text-xs font-medium py-1.5 hover:bg-[#1a3333] rounded transition-colors">
              <Plus size={14} /> Add Task
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export type PaneType = 'terminal' | 'editor' | 'browser';

export interface Pane {
  id: string;
  type: PaneType;
  title: string;
  splitMode?: 'vertical';
  children?: Pane[];
}

export interface Task {
  id: string;
  title: string;
  column: string;
  tags: { label: string; color: string }[];
  assignee: string;
  priority: string;
}

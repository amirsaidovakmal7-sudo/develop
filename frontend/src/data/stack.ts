export type StackGroup = 'frontend' | 'backend' | 'bots' | 'database' | 'infra';

export interface StackNode {
  id: string;
  label: string;
  group: StackGroup;
  /** ids of directly related nodes — highlighted together on hover/focus. */
  connections: string[];
}

/**
 * Tech network graph for the interactive Stack section (TECH_TASK_REDISIGN.md п.14).
 * The Python → {Django, FastAPI, Aiogram, Telebot, SQLAlchemy} highlight set is the
 * literal example given in the brief and is reproduced exactly.
 */
export const stackNodes: StackNode[] = [
  { id: 'python', label: 'Python', group: 'backend', connections: ['django', 'fastapi', 'aiogram', 'telebot', 'sqlalchemy'] },
  { id: 'django', label: 'Django', group: 'backend', connections: ['python', 'postgresql', 'sqlite', 'javascript', 'vps'] },
  { id: 'fastapi', label: 'FastAPI', group: 'backend', connections: ['python', 'postgresql', 'vps'] },
  { id: 'aiogram', label: 'Aiogram', group: 'bots', connections: ['python', 'telebot'] },
  { id: 'telebot', label: 'Telebot', group: 'bots', connections: ['python', 'aiogram'] },
  { id: 'sqlalchemy', label: 'SQLAlchemy', group: 'database', connections: ['python', 'postgresql', 'sqlite'] },
  { id: 'postgresql', label: 'PostgreSQL', group: 'database', connections: ['django', 'fastapi', 'sqlalchemy'] },
  { id: 'sqlite', label: 'SQLite', group: 'database', connections: ['django', 'sqlalchemy'] },
  { id: 'react', label: 'React', group: 'frontend', connections: ['html', 'css', 'javascript'] },
  { id: 'html', label: 'HTML', group: 'frontend', connections: ['react', 'css', 'javascript'] },
  { id: 'css', label: 'CSS', group: 'frontend', connections: ['react', 'html', 'javascript'] },
  { id: 'javascript', label: 'JavaScript', group: 'frontend', connections: ['react', 'html', 'css', 'django'] },
  { id: 'vps', label: 'VPS', group: 'infra', connections: ['django', 'fastapi'] },
];

export interface User {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  members?: Member[];
  workspace_icon?: string;
  icon?: string;
  is_active?: boolean;
}

export interface Member {
  id: string;
  user_id: string;
  workspace_id: string;
  role: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  joined_at: string;
  color?: string;
  initials?: string;
  tasks?: number;
  capacity?: number;
  trend?: string;
  highPriority?: number;
}

export interface Task {
  id: string;
  workspace_id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assignee_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: User;
  avatar_url?: string;
  author?: string;
  color?: string;
  initials?: string;
  text?: string;
}

export interface ActivityLog {
  id: string;
  workspace_id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, unknown>;
  created_at: string;
  user?: User;
  target?: string;
  workspace_name?: string;
  profile?: { full_name?: string; avatar_url?: string; email?: string };
}

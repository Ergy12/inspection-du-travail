export type UserRole = 'super_admin' | 'admin' | 'complaint_manager' | 'inspector' | 'controller' | 'administrative';

export interface Province {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Direction {
  id: string;
  name: string;
  province_id: string;
  address: string;
  created_at: Date;
  updated_at: Date;
}

export interface Branch {
  id: string;
  name: string;
  direction_id: string;
  address: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  direction_id?: string;
  branch_id?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ComplaintAssignment {
  id: string;
  complaint_id: string;
  inspector_id: string;
  assigned_at: Date;
  removed_at?: Date;
}

export interface ComplaintHistory {
  id: string;
  complaint_id: string;
  user_id: string;
  action: 'status_change' | 'report_update' | 'document_upload' | 'assignment_change';
  details: string;
  created_at: Date;
}

export interface ComplaintDocument {
  id: string;
  complaint_id: string;
  name: string;
  type: string;
  url: string;
  uploaded_by: string;
  created_at: Date;
}

export interface ComplaintReport {
  id: string;
  complaint_id: string;
  content: string;
  author_id: string;
  created_at: Date;
}
export interface Complaint {
  id: string;
  code: string;
  status: 'received' | 'pending' | 'in_progress' | 'resolved' | 'classified';
  personalInfo: {
    email: string;
    firstName: string;
    lastName: string;
    middleName: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    maritalStatus: string;
    address: string;
    phone: string;
  };
  professionalInfo: {
    companyName: string;
    position: string;
    contractStartYear: number;
    companyAddress: string;
  };
  complaintInfo: {
    reason: string;
    details: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Invitation {
  id: string;
  complaintId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
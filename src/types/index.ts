/**
 * Federal Polytechnic Ukana - Hostel Management System Types
 */

export type Role = 'student' | 'admin';

export type Gender = 'Male' | 'Female';

export type StudentLevel = 'ND I' | 'ND II' | 'HND I' | 'HND II';

export type ProgramType = 'National Diploma (ND)' | 'Higher National Diploma (HND)';

export type HostelStatus = 'Active' | 'Maintenance' | 'Full';

export type RoomStatus = 'Available' | 'Partially Occupied' | 'Full' | 'Maintenance' | 'Closed';

export type BedSpaceStatus = 'Available' | 'Occupied' | 'Maintenance';

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Allocated';

export type PaymentStatus = 'Pending' | 'Submitted' | 'Verified' | 'Rejected';

export type MaintenanceCategory = 
  | 'Electrical'
  | 'Plumbing'
  | 'Furniture'
  | 'Water'
  | 'Cleaning'
  | 'Security'
  | 'Structural'
  | 'Other';

export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type MaintenanceStatus = 
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  registrationNumber: string; // e.g. 2025/ND/CS/014
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  school: string; // e.g. School of Applied Sciences
  department: string; // e.g. Computer Science
  programme: ProgramType;
  level: StudentLevel;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  avatarUrl?: string;
  updatedAt: string;
}

export interface Hostel {
  id: string;
  name: string; // e.g. Male Hostel A (Ikot Akpaden)
  code: string; // e.g. HSTA
  gender: Gender;
  location: string;
  description: string;
  numberOfBlocks: number;
  numberOfRooms: number;
  totalCapacity: number;
  feePerSession: number;
  status: HostelStatus;
  imageUrl?: string;
  createdAt: string;
}

export interface Room {
  id: string;
  hostelId: string;
  roomNumber: string; // e.g. A-101
  block: string; // e.g. Block A
  floor: 'Ground' | '1st Floor' | '2nd Floor';
  capacity: number; // e.g. 4
  occupiedSpaces: number;
  status: RoomStatus;
}

export interface BedSpace {
  id: string;
  roomId: string;
  hostelId: string;
  bedNumber: string; // e.g. Bed 01
  status: BedSpaceStatus;
  occupiedByStudentId?: string;
}

export interface AcademicSession {
  id: string;
  sessionName: string; // e.g. 2025/2026 Academic Session
  isCurrent: boolean;
  applicationOpen: boolean;
}

export interface Application {
  id: string;
  studentId: string;
  academicSessionId: string;
  preferredHostelId: string;
  specialRequest?: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface Allocation {
  id: string;
  allocationCode: string; // e.g. ALLOC-000125
  studentId: string;
  hostelId: string;
  roomId: string;
  bedSpaceId: string;
  academicSessionId: string;
  allocatedByAdminName: string;
  status: 'Active' | 'Revoked' | 'Graduated';
  allocatedAt: string;
}

export interface Payment {
  id: string;
  studentId: string;
  academicSessionId: string;
  amount: number;
  paymentReference: string; // e.g. REMITA-8849201923
  paymentSlipUrl?: string;
  paymentDate: string;
  status: PaymentStatus;
  verifiedByAdminName?: string;
  verifiedAt?: string;
  remarks?: string;
}

export interface MaintenanceRequest {
  id: string;
  ticketNumber: string; // e.g. MAINT-2026-012
  studentId: string;
  hostelId: string;
  roomId: string;
  category: MaintenanceCategory;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  imageUrl?: string;
  reportedAt: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export interface SystemNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  targetAudience: 'All' | 'Male Hostels' | 'Female Hostels';
  publishedAt: string;
  priority: 'Normal' | 'Urgent';
}

export interface AuditLog {
  id: string;
  performedBy: string; // e.g. Admin: Dr. E. U. Bassey
  action: string;
  entityType: string;
  details: string;
  timestamp: string;
}

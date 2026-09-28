import {
  User,
  StudentProfile,
  Hostel,
  Room,
  BedSpace,
  BedSpaceStatus,
  AcademicSession,
  Application,
  Allocation,
  Payment,
  MaintenanceRequest,
  SystemNotification,
  Announcement,
  AuditLog
} from '../types';

export const SEED_ACADEMIC_SESSIONS: AcademicSession[] = [
  {
    id: 'session-2025-2026',
    sessionName: '2025/2026 Academic Session',
    isCurrent: true,
    applicationOpen: true,
  },
  {
    id: 'session-2024-2025',
    sessionName: '2024/2025 Academic Session',
    isCurrent: false,
    applicationOpen: false,
  }
];

export const SEED_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'Dr. E. U. Bassey',
    email: 'admin@fedpolyukana.edu.ng',
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'user-admin-2',
    name: 'Mrs. Aniefiok Okon',
    email: 'hosteladmin@fedpolyukana.edu.ng',
    role: 'admin',
    status: 'active',
    createdAt: '2025-02-01T09:30:00Z',
  },
  {
    id: 'user-student-1',
    name: 'Akpan Emmanuel John',
    email: 'akpan.john@student.fedpolyukana.edu.ng',
    role: 'student',
    status: 'active',
    createdAt: '2025-09-01T10:00:00Z',
  },
  {
    id: 'user-student-2',
    name: 'Udoh Blessing Edet',
    email: 'udoh.blessing@student.fedpolyukana.edu.ng',
    role: 'student',
    status: 'active',
    createdAt: '2025-09-02T11:15:00Z',
  },
  {
    id: 'user-student-3',
    name: 'Effiong Samuel Anietie',
    email: 'effiong.samuel@student.fedpolyukana.edu.ng',
    role: 'student',
    status: 'active',
    createdAt: '2025-09-03T14:20:00Z',
  },
  {
    id: 'user-student-4',
    name: 'Inyang Grace Victor',
    email: 'inyang.grace@student.fedpolyukana.edu.ng',
    role: 'student',
    status: 'active',
    createdAt: '2025-09-04T09:00:00Z',
  }
];

export const SEED_STUDENT_PROFILES: StudentProfile[] = [
  {
    id: 'prof-student-1',
    userId: 'user-student-1',
    registrationNumber: '2025/ND/CS/014',
    phone: '08031234567',
    gender: 'Male',
    dateOfBirth: '2004-05-14',
    school: 'School of Science & Applied Technology',
    department: 'Computer Science',
    programme: 'National Diploma (ND)',
    level: 'ND II',
    nextOfKinName: 'Elder John Akpan',
    nextOfKinPhone: '08029876543',
    updatedAt: '2025-09-05T10:00:00Z',
  },
  {
    id: 'prof-student-2',
    userId: 'user-student-2',
    registrationNumber: '2025/ND/EE/008',
    phone: '08149871234',
    gender: 'Female',
    dateOfBirth: '2005-01-22',
    school: 'School of Engineering Technology',
    department: 'Electrical / Electronic Engineering',
    programme: 'National Diploma (ND)',
    level: 'ND I',
    nextOfKinName: 'Mrs. Mercy Edet Udoh',
    nextOfKinPhone: '08034567890',
    updatedAt: '2025-09-06T11:00:00Z',
  },
  {
    id: 'prof-student-3',
    userId: 'user-student-3',
    registrationNumber: '2025/ND/ST/031',
    phone: '07038882211',
    gender: 'Male',
    dateOfBirth: '2003-11-09',
    school: 'School of Science & Applied Technology',
    department: 'Statistics',
    programme: 'National Diploma (ND)',
    level: 'ND II',
    nextOfKinName: 'Chief Anietie Effiong',
    nextOfKinPhone: '08031114455',
    updatedAt: '2025-09-07T12:00:00Z',
  },
  {
    id: 'prof-student-4',
    userId: 'user-student-4',
    registrationNumber: '2025/ND/BA/019',
    phone: '08123339900',
    gender: 'Female',
    dateOfBirth: '2004-08-30',
    school: 'School of Management Studies',
    department: 'Business Administration',
    programme: 'National Diploma (ND)',
    level: 'ND I',
    nextOfKinName: 'Mr. Victor Inyang',
    nextOfKinPhone: '08027778899',
    updatedAt: '2025-09-08T09:30:00Z',
  }
];

export const SEED_HOSTELS: Hostel[] = [
  {
    id: 'hostel-male-main',
    name: 'Main Campus Male Hostel',
    code: 'M-HST',
    gender: 'Male',
    location: 'Main Campus East Wing, Fed Poly Ukana',
    description: 'Main campus residential hall with 22 rooms, standard 4-bed spaces per room, study desks, and ensuite facilities.',
    numberOfBlocks: 2,
    numberOfRooms: 22,
    totalCapacity: 88,
    feePerSession: 30000,
    status: 'Active',
    imageUrl: 'https://cdn.corenexis.com/f/LW7d70nDYeH.jpg',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'hostel-female-main',
    name: 'Main Campus Female Hostel',
    code: 'F-HST',
    gender: 'Female',
    location: 'Main Campus West Wing, Fed Poly Ukana',
    description: 'Main campus secure female residential hall with 21 rooms, standard 4-bed spaces per room, reading lounge, and water heaters.',
    numberOfBlocks: 2,
    numberOfRooms: 21,
    totalCapacity: 84,
    feePerSession: 30000,
    status: 'Active',
    imageUrl: 'https://cdn.corenexis.com/f/LW7d70nDYeH.jpg',
    createdAt: '2025-01-15T10:00:00Z',
  }
];

// Helper to generate seed rooms and bedspaces
const generateSeedRoomsAndBeds = () => {
  const rooms: Room[] = [];
  const beds: BedSpace[] = [];

  SEED_HOSTELS.forEach((hostel) => {
    for (let r = 1; r <= hostel.numberOfRooms; r++) {
      const roomNumber = `${hostel.code}-${100 + r}`;
      const block = r <= Math.ceil(hostel.numberOfRooms / 2) ? 'Block A' : 'Block B';
      const floor = r <= 10 ? 'Ground' : '1st Floor';
      const roomId = `room-${hostel.id}-${r}`;

      // Sample occupation count
      let occupied = 0;
      if (hostel.id === 'hostel-male-main' && r === 1) occupied = 2; // Akpan & Effiong
      if (hostel.id === 'hostel-female-main' && r === 1) occupied = 1; // Udoh

      const roomStatus = occupied === 4 ? 'Full' : occupied > 0 ? 'Partially Occupied' : 'Available';

      rooms.push({
        id: roomId,
        hostelId: hostel.id,
        roomNumber,
        block,
        floor,
        capacity: 4,
        occupiedSpaces: occupied,
        status: roomStatus,
      });

      for (let b = 1; b <= 4; b++) {
        const bedId = `bed-${roomId}-${b}`;
        let bedStatus: BedSpaceStatus = 'Available';
        let studentId: string | undefined = undefined;

        if (hostel.id === 'hostel-male-main' && r === 1) {
          if (b === 1) { bedStatus = 'Occupied'; studentId = 'prof-student-1'; } // Akpan
          if (b === 2) { bedStatus = 'Occupied'; studentId = 'prof-student-3'; } // Effiong
        } else if (hostel.id === 'hostel-female-main' && r === 1) {
          if (b === 1) { bedStatus = 'Occupied'; studentId = 'prof-student-2'; } // Udoh
        }

        beds.push({
          id: bedId,
          roomId,
          hostelId: hostel.id,
          bedNumber: `Bed 0${b}`,
          status: bedStatus,
          occupiedByStudentId: studentId,
        });
      }
    }
  });

  return { rooms, beds };
};

const generatedData = generateSeedRoomsAndBeds();
export const SEED_ROOMS: Room[] = generatedData.rooms;
export const SEED_BED_SPACES: BedSpace[] = generatedData.beds;

export const SEED_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    studentId: 'prof-student-1',
    academicSessionId: 'session-2025-2026',
    preferredHostelId: 'hostel-male-a',
    specialRequest: 'Prefer ground floor room near the study reading corner.',
    status: 'Allocated',
    submittedAt: '2025-09-05T12:00:00Z',
    reviewedAt: '2025-09-06T09:00:00Z',
  },
  {
    id: 'app-2',
    studentId: 'prof-student-2',
    academicSessionId: 'session-2025-2026',
    preferredHostelId: 'hostel-female-b',
    specialRequest: 'Requires lower bunk due to mild asthmatic condition.',
    status: 'Allocated',
    submittedAt: '2025-09-06T14:30:00Z',
    reviewedAt: '2025-09-07T10:15:00Z',
  },
  {
    id: 'app-3',
    studentId: 'prof-student-3',
    academicSessionId: 'session-2025-2026',
    preferredHostelId: 'hostel-male-a',
    specialRequest: 'Same room allocation request with Akpan Emmanuel (2025/ND/CS/014).',
    status: 'Allocated',
    submittedAt: '2025-09-07T16:00:00Z',
    reviewedAt: '2025-09-08T08:45:00Z',
  },
  {
    id: 'app-4',
    studentId: 'prof-student-4',
    academicSessionId: 'session-2025-2026',
    preferredHostelId: 'hostel-female-b',
    specialRequest: 'Near main entrance hall.',
    status: 'Pending',
    submittedAt: '2025-09-10T11:20:00Z',
  }
];

export const SEED_ALLOCATIONS: Allocation[] = [
  {
    id: 'alloc-1',
    allocationCode: 'ALLOC-2025-0012',
    studentId: 'prof-student-1',
    hostelId: 'hostel-male-a',
    roomId: 'room-hostel-male-a-1',
    bedSpaceId: 'bed-room-hostel-male-a-1-1',
    academicSessionId: 'session-2025-2026',
    allocatedByAdminName: 'Dr. E. U. Bassey',
    status: 'Active',
    allocatedAt: '2025-09-06T09:30:00Z',
  },
  {
    id: 'alloc-2',
    allocationCode: 'ALLOC-2025-0015',
    studentId: 'prof-student-2',
    hostelId: 'hostel-female-b',
    roomId: 'room-hostel-female-b-1',
    bedSpaceId: 'bed-room-hostel-female-b-1-1',
    academicSessionId: 'session-2025-2026',
    allocatedByAdminName: 'Mrs. Aniefiok Okon',
    status: 'Active',
    allocatedAt: '2025-09-07T10:30:00Z',
  },
  {
    id: 'alloc-3',
    allocationCode: 'ALLOC-2025-0018',
    studentId: 'prof-student-3',
    hostelId: 'hostel-male-a',
    roomId: 'room-hostel-male-a-1',
    bedSpaceId: 'bed-room-hostel-male-a-1-2',
    academicSessionId: 'session-2025-2026',
    allocatedByAdminName: 'Dr. E. U. Bassey',
    status: 'Active',
    allocatedAt: '2025-09-08T09:00:00Z',
  }
];

export const SEED_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    studentId: 'prof-student-1',
    academicSessionId: 'session-2025-2026',
    amount: 30000,
    paymentReference: 'REMITA-9920148201',
    paymentDate: '2025-09-05T11:00:00Z',
    status: 'Verified',
    verifiedByAdminName: 'Dr. E. U. Bassey',
    verifiedAt: '2025-09-05T15:30:00Z',
    remarks: 'Verified against Remita Federal Government Treasury Single Account portal.',
  },
  {
    id: 'pay-2',
    studentId: 'prof-student-2',
    academicSessionId: 'session-2025-2026',
    amount: 30000,
    paymentReference: 'REMITA-8849201923',
    paymentDate: '2025-09-06T13:15:00Z',
    status: 'Verified',
    verifiedByAdminName: 'Mrs. Aniefiok Okon',
    verifiedAt: '2025-09-06T16:00:00Z',
    remarks: 'Bank teller matches FPU Student Portal account.',
  },
  {
    id: 'pay-3',
    studentId: 'prof-student-3',
    academicSessionId: 'session-2025-2026',
    amount: 30000,
    paymentReference: 'REMITA-7738291002',
    paymentDate: '2025-09-07T14:45:00Z',
    status: 'Verified',
    verifiedByAdminName: 'Dr. E. U. Bassey',
    verifiedAt: '2025-09-07T17:00:00Z',
    remarks: 'Confirmed TSA Receipt.',
  },
  {
    id: 'pay-4',
    studentId: 'prof-student-4',
    academicSessionId: 'session-2025-2026',
    amount: 30000,
    paymentReference: 'REMITA-1029384756',
    paymentDate: '2025-09-10T10:00:00Z',
    status: 'Submitted',
    remarks: 'Awaiting Bursary clearance check.',
  }
];

export const SEED_MAINTENANCE: MaintenanceRequest[] = [
  {
    id: 'maint-1',
    ticketNumber: 'MAINT-2025-001',
    studentId: 'prof-student-1',
    hostelId: 'hostel-male-main',
    roomId: 'room-hostel-male-main-1',
    category: 'Plumbing',
    description: 'Ensuite bathroom washbasin tap is leaking persistently and causing water build up on floor.',
    priority: 'High',
    status: 'In Progress',
    reportedAt: '2025-09-12T08:30:00Z',
    adminNotes: 'Assigned to Works & Physical Planning Dept - Lead Plumber Mr. Bassey.',
  },
  {
    id: 'maint-2',
    ticketNumber: 'MAINT-2025-002',
    studentId: 'prof-student-2',
    hostelId: 'hostel-female-main',
    roomId: 'room-hostel-female-main-1',
    category: 'Electrical',
    description: 'Ceiling fan regulator knob is loose and operating at fixed maximum speed only.',
    priority: 'Medium',
    status: 'Resolved',
    reportedAt: '2025-09-10T14:00:00Z',
    resolvedAt: '2025-09-11T11:20:00Z',
    adminNotes: 'Replaced with new 5-step ceiling fan speed regulator unit.',
  },
  {
    id: 'maint-3',
    ticketNumber: 'MAINT-2025-003',
    studentId: 'prof-student-3',
    hostelId: 'hostel-male-main',
    roomId: 'room-hostel-male-main-1',
    category: 'Furniture',
    description: 'Bed frame #2 right side wooden slat is cracked.',
    priority: 'Low',
    status: 'Submitted',
    reportedAt: '2025-09-15T09:15:00Z',
  }
];

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Resumption & Hostel Clearance Requirements for 2025/2026 Session',
    content: 'All resident students of Federal Polytechnic Ukana are reminded to present their verified Remita TSA Receipts, Medical Clearance Forms, and 2 passport photographs at the Dean of Student Affairs Office prior to bed space key collection.',
    author: 'Directorate of Student Affairs',
    targetAudience: 'All',
    publishedAt: '2025-09-01T08:00:00Z',
    priority: 'Urgent',
  },
  {
    id: 'ann-2',
    title: 'Routine Environmental Sanitation Exercise in Student Hostels',
    content: 'General cleaning exercise across Male Hostel A, Female Hostel B, and Annex Blocks will take place every Saturday from 7:00 AM to 9:30 AM. Attendance by all hostel residents is mandatory.',
    author: 'Hostel Environment Committee',
    targetAudience: 'All',
    publishedAt: '2025-09-08T10:00:00Z',
    priority: 'Normal',
  }
];

export const SEED_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    userId: 'user-student-1',
    title: 'Room Allocation Confirmed!',
    message: 'You have been allocated to Male Hostel Block A, Room M-101, Bed 01 for the 2025/2026 session.',
    type: 'success',
    read: true,
    createdAt: '2025-09-06T09:30:00Z',
  },
  {
    id: 'notif-2',
    userId: 'user-student-1',
    title: 'Payment Verification Successful',
    message: 'Your hostel accommodation payment (₦45,000) with Ref REMITA-9920148201 has been verified.',
    type: 'success',
    read: true,
    createdAt: '2025-09-05T15:30:00Z',
  },
  {
    id: 'notif-3',
    userId: 'user-student-1',
    title: 'Maintenance Update',
    message: 'Maintenance ticket MAINT-2025-001 status changed to: In Progress.',
    type: 'info',
    read: false,
    createdAt: '2025-09-12T09:00:00Z',
  }
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    performedBy: 'Dr. E. U. Bassey (Admin)',
    action: 'Room Allocation',
    entityType: 'Allocation',
    details: 'Allocated Akpan Emmanuel John (2025/ND/CS/014) to Male Hostel Block A, Room M-101, Bed 01',
    timestamp: '2025-09-06T09:30:00Z',
  },
  {
    id: 'log-2',
    performedBy: 'Mrs. Aniefiok Okon (Admin)',
    action: 'Payment Verification',
    entityType: 'Payment',
    details: 'Verified payment REMITA-8849201923 for Udoh Blessing Edet (₦45,000)',
    timestamp: '2025-09-06T16:00:00Z',
  },
  {
    id: 'log-3',
    performedBy: 'Akpan Emmanuel John (Student)',
    action: 'Maintenance Complaint',
    entityType: 'Maintenance',
    details: 'Submitted ticket MAINT-2025-001 for Plumbing issue in Room M-101',
    timestamp: '2025-09-12T08:30:00Z',
  }
];

import {
  User,
  StudentProfile,
  Hostel,
  Room,
  BedSpace,
  AcademicSession,
  Application,
  Allocation,
  Payment,
  MaintenanceRequest,
  SystemNotification,
  Announcement,
  AuditLog,
  ApplicationStatus,
  PaymentStatus,
  MaintenanceStatus,
  Gender
} from '../types';

import {
  SEED_ACADEMIC_SESSIONS,
  SEED_USERS,
  SEED_STUDENT_PROFILES,
  SEED_HOSTELS,
  SEED_ROOMS,
  SEED_BED_SPACES,
  SEED_APPLICATIONS,
  SEED_ALLOCATIONS,
  SEED_PAYMENTS,
  SEED_MAINTENANCE,
  SEED_ANNOUNCEMENTS,
  SEED_NOTIFICATIONS,
  SEED_AUDIT_LOGS,
} from './mockData';

const STORAGE_KEYS = {
  USERS: 'fpu_hostel_users',
  STUDENT_PROFILES: 'fpu_hostel_profiles',
  HOSTELS: 'fpu_hostel_hostels',
  ROOMS: 'fpu_hostel_rooms',
  BED_SPACES: 'fpu_hostel_bed_spaces',
  ACADEMIC_SESSIONS: 'fpu_hostel_sessions',
  APPLICATIONS: 'fpu_hostel_applications',
  ALLOCATIONS: 'fpu_hostel_allocations',
  PAYMENTS: 'fpu_hostel_payments',
  MAINTENANCE: 'fpu_hostel_maintenance',
  ANNOUNCEMENTS: 'fpu_hostel_announcements',
  NOTIFICATIONS: 'fpu_hostel_notifications',
  AUDIT_LOGS: 'fpu_hostel_audit_logs',
  CURRENT_USER_ID: 'fpu_hostel_current_user_id',
};

// Helper function to read from localStorage with fallback
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.error(`Error loading key ${key} from storage:`, e);
  }
  return fallback;
}

// Helper function to write to localStorage
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving key ${key} to storage:`, e);
  }
}

class HostelStore {
  private users: User[];
  private profiles: StudentProfile[];
  private hostels: Hostel[];
  private rooms: Room[];
  private bedSpaces: BedSpace[];
  private sessions: AcademicSession[];
  private applications: Application[];
  private allocations: Allocation[];
  private payments: Payment[];
  private maintenance: MaintenanceRequest[];
  private announcements: Announcement[];
  private notifications: SystemNotification[];
  private auditLogs: AuditLog[];
  private currentUserId: string | null;

  constructor() {
    this.users = loadFromStorage(STORAGE_KEYS.USERS, SEED_USERS);
    this.profiles = loadFromStorage(STORAGE_KEYS.STUDENT_PROFILES, SEED_STUDENT_PROFILES);
    this.hostels = loadFromStorage(STORAGE_KEYS.HOSTELS, SEED_HOSTELS);
    this.rooms = loadFromStorage(STORAGE_KEYS.ROOMS, SEED_ROOMS);
    this.bedSpaces = loadFromStorage(STORAGE_KEYS.BED_SPACES, SEED_BED_SPACES);
    this.sessions = loadFromStorage(STORAGE_KEYS.ACADEMIC_SESSIONS, SEED_ACADEMIC_SESSIONS);
    this.applications = loadFromStorage(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
    this.allocations = loadFromStorage(STORAGE_KEYS.ALLOCATIONS, SEED_ALLOCATIONS);
    this.payments = loadFromStorage(STORAGE_KEYS.PAYMENTS, SEED_PAYMENTS);
    this.maintenance = loadFromStorage(STORAGE_KEYS.MAINTENANCE, SEED_MAINTENANCE);
    this.announcements = loadFromStorage(STORAGE_KEYS.ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
    this.notifications = loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    this.auditLogs = loadFromStorage(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
    this.currentUserId = loadFromStorage(STORAGE_KEYS.CURRENT_USER_ID, 'user-student-1');
  }

  private saveAll() {
    saveToStorage(STORAGE_KEYS.USERS, this.users);
    saveToStorage(STORAGE_KEYS.STUDENT_PROFILES, this.profiles);
    saveToStorage(STORAGE_KEYS.HOSTELS, this.hostels);
    saveToStorage(STORAGE_KEYS.ROOMS, this.rooms);
    saveToStorage(STORAGE_KEYS.BED_SPACES, this.bedSpaces);
    saveToStorage(STORAGE_KEYS.ACADEMIC_SESSIONS, this.sessions);
    saveToStorage(STORAGE_KEYS.APPLICATIONS, this.applications);
    saveToStorage(STORAGE_KEYS.ALLOCATIONS, this.allocations);
    saveToStorage(STORAGE_KEYS.PAYMENTS, this.payments);
    saveToStorage(STORAGE_KEYS.MAINTENANCE, this.maintenance);
    saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, this.announcements);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
    saveToStorage(STORAGE_KEYS.CURRENT_USER_ID, this.currentUserId);
  }

  public resetToSeedData() {
    localStorage.clear();
    this.users = SEED_USERS;
    this.profiles = SEED_STUDENT_PROFILES;
    this.hostels = SEED_HOSTELS;
    this.rooms = SEED_ROOMS;
    this.bedSpaces = SEED_BED_SPACES;
    this.sessions = SEED_ACADEMIC_SESSIONS;
    this.applications = SEED_APPLICATIONS;
    this.allocations = SEED_ALLOCATIONS;
    this.payments = SEED_PAYMENTS;
    this.maintenance = SEED_MAINTENANCE;
    this.announcements = SEED_ANNOUNCEMENTS;
    this.notifications = SEED_NOTIFICATIONS;
    this.auditLogs = SEED_AUDIT_LOGS;
    this.currentUserId = 'user-student-1';
    this.saveAll();
  }

  public logAudit(performedBy: string, action: string, entityType: string, details: string) {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      performedBy,
      action,
      entityType,
      details,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs = [newLog, ...this.auditLogs];
    this.saveAll();
  }

  // --- Auth & Users ---
  public getCurrentUser(): { user: User; profile?: StudentProfile } | null {
    if (!this.currentUserId) return null;
    const user = this.users.find((u) => u.id === this.currentUserId);
    if (!user) return null;
    const profile = this.profiles.find((p) => p.userId === user.id);
    return { user, profile };
  }

  public switchCurrentUser(userId: string) {
    this.currentUserId = userId;
    this.saveAll();
  }

  public login(identifier: string): { success: boolean; user?: User; message?: string } {
    const cleanId = identifier.trim().toLowerCase();
    
    // Find user by email or student registration number
    let user = this.users.find((u) => u.email.toLowerCase() === cleanId);
    if (!user) {
      const profile = this.profiles.find(
        (p) => p.registrationNumber.toLowerCase() === cleanId
      );
      if (profile) {
        user = this.users.find((u) => u.id === profile.userId);
      }
    }

    if (!user) {
      return { success: false, message: 'Invalid email or Registration Number.' };
    }

    this.currentUserId = user.id;
    this.saveAll();
    this.logAudit(`${user.name} (${user.role})`, 'User Login', 'User', 'Successfully authenticated into system');
    return { success: true, user };
  }

  public registerStudent(data: {
    fullName: string;
    registrationNumber: string;
    email: string;
    phone: string;
    gender: Gender;
    dateOfBirth: string;
    school: string;
    department: string;
    programme: 'National Diploma (ND)' | 'Higher National Diploma (HND)';
    level: 'ND I' | 'ND II' | 'HND I' | 'HND II';
  }): { success: boolean; user?: User; message?: string } {
    // Validate uniqueness
    if (this.users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, message: 'A user with this email address already exists.' };
    }
    if (this.profiles.some((p) => p.registrationNumber.toLowerCase() === data.registrationNumber.toLowerCase())) {
      return { success: false, message: 'A student with this Registration Number already exists.' };
    }

    const userId = `user-student-${Date.now()}`;
    const newUser: User = {
      id: userId,
      name: data.fullName,
      email: data.email,
      role: 'student',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    const newProfile: StudentProfile = {
      id: `prof-${userId}`,
      userId: userId,
      registrationNumber: data.registrationNumber,
      phone: data.phone,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      school: data.school,
      department: data.department,
      programme: data.programme,
      level: data.level,
      updatedAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.profiles.push(newProfile);
    this.currentUserId = userId;
    this.saveAll();

    this.logAudit(
      `${data.fullName} (Student)`,
      'Student Registration',
      'Student',
      `Registered new student account with Reg No: ${data.registrationNumber}`
    );

    return { success: true, user: newUser };
  }

  public updateStudentProfile(profileId: string, updates: Partial<StudentProfile>) {
    const index = this.profiles.findIndex((p) => p.id === profileId);
    if (index !== -1) {
      this.profiles[index] = {
        ...this.profiles[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.saveAll();
    }
  }

  // --- Hostels, Rooms, Bed Spaces ---
  public getHostels(): Hostel[] {
    return this.hostels;
  }

  public getHostelById(id: string): Hostel | undefined {
    return this.hostels.find((h) => h.id === id);
  }

  public getRooms(hostelId?: string): Room[] {
    if (hostelId) {
      return this.rooms.filter((r) => r.hostelId === hostelId);
    }
    return this.rooms;
  }

  public getRoomById(id: string): Room | undefined {
    return this.rooms.find((r) => r.id === id);
  }

  public getBedSpaces(roomId?: string): BedSpace[] {
    if (roomId) {
      return this.bedSpaces.filter((b) => b.roomId === roomId);
    }
    return this.bedSpaces;
  }

  public addHostel(data: Omit<Hostel, 'id' | 'createdAt'>): Hostel {
    const newHostel: Hostel = {
      ...data,
      id: `hostel-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.hostels.push(newHostel);
    this.saveAll();
    this.logAudit('Admin', 'Create Hostel', 'Hostel', `Created new hostel: ${data.name}`);
    return newHostel;
  }

  public addRoom(data: Omit<Room, 'id' | 'occupiedSpaces' | 'status'>): Room {
    const hostel = this.getHostelById(data.hostelId);
    const newRoom: Room = {
      ...data,
      id: `room-${data.hostelId}-${Date.now()}`,
      occupiedSpaces: 0,
      status: 'Available',
    };
    this.rooms.push(newRoom);

    // Automatically create bed spaces based on capacity
    for (let b = 1; b <= data.capacity; b++) {
      this.bedSpaces.push({
        id: `bed-${newRoom.id}-${b}`,
        roomId: newRoom.id,
        hostelId: data.hostelId,
        bedNumber: `Bed 0${b}`,
        status: 'Available',
      });
    }

    if (hostel) {
      hostel.numberOfRooms += 1;
      hostel.totalCapacity += data.capacity;
    }

    this.saveAll();
    this.logAudit('Admin', 'Create Room', 'Room', `Created Room ${data.roomNumber} in Hostel ${hostel?.name}`);
    return newRoom;
  }

  // --- Applications & Allocations ---
  public getApplications(): Application[] {
    return this.applications;
  }

  public getStudentApplication(studentProfileId: string): Application | undefined {
    return this.applications.find((a) => a.studentId === studentProfileId);
  }

  public submitApplication(studentProfileId: string, preferredHostelId: string, specialRequest?: string): Application {
    const currentSession = this.sessions.find((s) => s.isCurrent) || this.sessions[0];
    
    // Check if existing application exists
    const existing = this.applications.find(
      (a) => a.studentId === studentProfileId && a.academicSessionId === currentSession.id
    );

    if (existing) {
      existing.preferredHostelId = preferredHostelId;
      existing.specialRequest = specialRequest;
      existing.status = 'Pending';
      existing.submittedAt = new Date().toISOString();
      this.saveAll();
      return existing;
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      studentId: studentProfileId,
      academicSessionId: currentSession.id,
      preferredHostelId,
      specialRequest,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };

    this.applications.push(newApp);
    this.saveAll();

    const studentProfile = this.profiles.find((p) => p.id === studentProfileId);
    this.logAudit(
      `${studentProfile?.registrationNumber || 'Student'}`,
      'Hostel Application',
      'Application',
      `Submitted hostel application for session ${currentSession.sessionName}`
    );

    return newApp;
  }

  public reviewApplication(appId: string, status: ApplicationStatus, rejectionReason?: string) {
    const app = this.applications.find((a) => a.id === appId);
    if (app) {
      app.status = status;
      app.reviewedAt = new Date().toISOString();
      if (rejectionReason) app.rejectionReason = rejectionReason;
      this.saveAll();
      this.logAudit('Admin', 'Application Review', 'Application', `Reviewed application ${appId} -> ${status}`);
    }
  }

  public allocateStudent(params: {
    studentProfileId: string;
    hostelId: string;
    roomId: string;
    bedSpaceId: string;
    adminName: string;
    applicationId?: string;
  }): { success: boolean; allocation?: Allocation; message?: string } {
    const { studentProfileId, hostelId, roomId, bedSpaceId, adminName, applicationId } = params;

    const student = this.profiles.find((p) => p.id === studentProfileId);
    const hostel = this.hostels.find((h) => h.id === hostelId);
    const room = this.rooms.find((r) => r.id === roomId);
    const bed = this.bedSpaces.find((b) => b.id === bedSpaceId);
    const currentSession = this.sessions.find((s) => s.isCurrent) || this.sessions[0];

    if (!student || !hostel || !room || !bed) {
      return { success: false, message: 'Invalid allocation records.' };
    }

    // Gender check
    if (hostel.gender !== student.gender) {
      return { success: false, message: `Gender mismatch! Cannot allocate ${student.gender} student to ${hostel.gender} hostel.` };
    }

    // Capacity check
    if (bed.status === 'Occupied') {
      return { success: false, message: `${bed.bedNumber} in ${room.roomNumber} is already occupied!` };
    }

    // Existing allocation check
    const existingAlloc = this.allocations.find(
      (a) => a.studentId === studentProfileId && a.academicSessionId === currentSession.id && a.status === 'Active'
    );
    if (existingAlloc) {
      return { success: false, message: 'Student already has an active room allocation for this session!' };
    }

    // Update bed space & room count
    bed.status = 'Occupied';
    bed.occupiedByStudentId = studentProfileId;

    room.occupiedSpaces += 1;
    if (room.occupiedSpaces >= room.capacity) {
      room.status = 'Full';
    } else {
      room.status = 'Partially Occupied';
    }

    // Create allocation record
    const allocationCode = `ALLOC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAllocation: Allocation = {
      id: `alloc-${Date.now()}`,
      allocationCode,
      studentId: studentProfileId,
      hostelId,
      roomId,
      bedSpaceId,
      academicSessionId: currentSession.id,
      allocatedByAdminName: adminName,
      status: 'Active',
      allocatedAt: new Date().toISOString(),
    };

    this.allocations.push(newAllocation);

    // Update application status if exists
    if (applicationId) {
      const app = this.applications.find((a) => a.id === applicationId);
      if (app) {
        app.status = 'Allocated';
        app.reviewedAt = new Date().toISOString();
      }
    } else {
      const app = this.applications.find((a) => a.studentId === studentProfileId);
      if (app) app.status = 'Allocated';
    }

    // Send notification
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: student.userId,
      title: 'Hostel Allocation Confirmed',
      message: `You have been allocated to ${hostel.name}, Room ${room.roomNumber}, ${bed.bedNumber} (${allocationCode}).`,
      type: 'success',
      read: false,
      createdAt: new Date().toISOString(),
    });

    this.saveAll();

    this.logAudit(
      adminName,
      'Room Allocation',
      'Allocation',
      `Allocated ${student.registrationNumber} to ${hostel.name} (Room ${room.roomNumber}, ${bed.bedNumber})`
    );

    return { success: true, allocation: newAllocation };
  }

  public getAllocations(): Allocation[] {
    return this.allocations;
  }

  public getStudentAllocation(studentProfileId: string): Allocation | undefined {
    return this.allocations.find((a) => a.studentId === studentProfileId && a.status === 'Active');
  }

  // --- Payments ---
  public getPayments(): Payment[] {
    return this.payments;
  }

  public getStudentPayment(studentProfileId: string): Payment | undefined {
    return this.payments.find((p) => p.studentId === studentProfileId);
  }

  public submitPayment(studentProfileId: string, amount: number, paymentReference: string, slipUrl?: string): Payment {
    const currentSession = this.sessions.find((s) => s.isCurrent) || this.sessions[0];
    
    const existing = this.payments.find((p) => p.studentId === studentProfileId && p.academicSessionId === currentSession.id);
    if (existing) {
      existing.amount = amount;
      existing.paymentReference = paymentReference;
      existing.paymentSlipUrl = slipUrl;
      existing.status = 'Submitted';
      existing.paymentDate = new Date().toISOString();
      this.saveAll();
      return existing;
    }

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      studentId: studentProfileId,
      academicSessionId: currentSession.id,
      amount,
      paymentReference,
      paymentSlipUrl: slipUrl,
      paymentDate: new Date().toISOString(),
      status: 'Submitted',
    };

    this.payments.push(newPayment);
    this.saveAll();

    const profile = this.profiles.find((p) => p.id === studentProfileId);
    this.logAudit(
      profile?.registrationNumber || 'Student',
      'Payment Submission',
      'Payment',
      `Submitted hostel payment reference ${paymentReference} (₦${amount.toLocaleString()})`
    );

    return newPayment;
  }

  public verifyPayment(paymentId: string, status: PaymentStatus, remarks: string, adminName: string) {
    const payment = this.payments.find((p) => p.id === paymentId);
    if (payment) {
      payment.status = status;
      payment.remarks = remarks;
      payment.verifiedByAdminName = adminName;
      payment.verifiedAt = new Date().toISOString();

      const profile = this.profiles.find((p) => p.id === payment.studentId);
      if (profile) {
        this.notifications.unshift({
          id: `notif-${Date.now()}`,
          userId: profile.userId,
          title: `Payment ${status}`,
          message: `Your hostel payment (Ref: ${payment.paymentReference}) status is now ${status}. ${remarks ? `Remarks: ${remarks}` : ''}`,
          type: status === 'Verified' ? 'success' : 'alert',
          read: false,
          createdAt: new Date().toISOString(),
        });
      }

      this.saveAll();
      this.logAudit(adminName, 'Payment Verification', 'Payment', `Verified payment ${payment.paymentReference} -> ${status}`);
    }
  }

  // --- Maintenance Requests ---
  public getMaintenanceRequests(): MaintenanceRequest[] {
    return this.maintenance;
  }

  public getStudentMaintenanceRequests(studentProfileId: string): MaintenanceRequest[] {
    return this.maintenance.filter((m) => m.studentId === studentProfileId);
  }

  public submitMaintenanceRequest(params: {
    studentProfileId: string;
    hostelId: string;
    roomId: string;
    category: MaintenanceRequest['category'];
    description: string;
    priority: MaintenanceRequest['priority'];
    imageUrl?: string;
  }): MaintenanceRequest {
    const ticketNumber = `MAINT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newRequest: MaintenanceRequest = {
      id: `maint-${Date.now()}`,
      ticketNumber,
      studentId: params.studentProfileId,
      hostelId: params.hostelId,
      roomId: params.roomId,
      category: params.category,
      description: params.description,
      priority: params.priority,
      status: 'Submitted',
      imageUrl: params.imageUrl,
      reportedAt: new Date().toISOString(),
    };

    this.maintenance.unshift(newRequest);
    this.saveAll();

    const profile = this.profiles.find((p) => p.id === params.studentProfileId);
    this.logAudit(
      profile?.registrationNumber || 'Student',
      'Submit Maintenance',
      'Maintenance',
      `Submitted maintenance complaint ticket ${ticketNumber} (${params.category})`
    );

    return newRequest;
  }

  public updateMaintenanceStatus(ticketId: string, status: MaintenanceStatus, notes?: string, adminName?: string) {
    const item = this.maintenance.find((m) => m.id === ticketId);
    if (item) {
      item.status = status;
      if (notes) item.adminNotes = notes;
      if (status === 'Resolved' || status === 'Closed') {
        item.resolvedAt = new Date().toISOString();
      }

      const profile = this.profiles.find((p) => p.id === item.studentId);
      if (profile) {
        this.notifications.unshift({
          id: `notif-${Date.now()}`,
          userId: profile.userId,
          title: `Maintenance Ticket ${item.ticketNumber} Updated`,
          message: `Your maintenance ticket status is now: ${status}.`,
          type: 'info',
          read: false,
          createdAt: new Date().toISOString(),
        });
      }

      this.saveAll();
      this.logAudit(adminName || 'Admin', 'Update Maintenance', 'Maintenance', `Updated ticket ${item.ticketNumber} to ${status}`);
    }
  }

  // --- Announcements & Notifications ---
  public getAnnouncements(): Announcement[] {
    return this.announcements;
  }

  public addAnnouncement(announcement: Omit<Announcement, 'id' | 'publishedAt'>): Announcement {
    const newAnn: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      publishedAt: new Date().toISOString(),
    };
    this.announcements.unshift(newAnn);
    this.saveAll();
    this.logAudit('Admin', 'Publish Announcement', 'Announcement', `Published: ${announcement.title}`);
    return newAnn;
  }

  public getUserNotifications(userId: string): SystemNotification[] {
    return this.notifications.filter((n) => n.userId === userId);
  }

  public markNotificationAsRead(notifId: string) {
    const n = this.notifications.find((notif) => notif.id === notifId);
    if (n) {
      n.read = true;
      this.saveAll();
    }
  }

  // --- Audit Logs & Profiles ---
  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  public getAllStudents(): { user: User; profile: StudentProfile; allocation?: Allocation; payment?: Payment }[] {
    return this.profiles.map((profile) => {
      const user = this.users.find((u) => u.id === profile.userId) || {
        id: profile.userId,
        name: 'Unknown',
        email: '',
        role: 'student' as const,
        status: 'active' as const,
        createdAt: '',
      };
      const allocation = this.allocations.find((a) => a.studentId === profile.id && a.status === 'Active');
      const payment = this.payments.find((p) => p.studentId === profile.id);
      return { user, profile, allocation, payment };
    });
  }

  // --- Statistics ---
  public getStats() {
    const totalStudents = this.profiles.length;
    const totalHostels = this.hostels.length;
    const totalRooms = this.rooms.length;
    
    let totalBedSpaces = 0;
    let occupiedBedSpaces = 0;

    this.rooms.forEach((r) => {
      totalBedSpaces += r.capacity;
      occupiedBedSpaces += r.occupiedSpaces;
    });

    const availableBedSpaces = totalBedSpaces - occupiedBedSpaces;
    const occupancyPercentage = totalBedSpaces > 0 ? Math.round((occupiedBedSpaces / totalBedSpaces) * 100) : 0;

    const pendingApplications = this.applications.filter((a) => a.status === 'Pending').length;
    const pendingPayments = this.payments.filter((p) => p.status === 'Submitted' || p.status === 'Pending').length;
    const openMaintenance = this.maintenance.filter((m) => m.status !== 'Resolved' && m.status !== 'Closed').length;

    return {
      totalStudents,
      totalHostels,
      totalRooms,
      totalBedSpaces,
      occupiedBedSpaces,
      availableBedSpaces,
      occupancyPercentage,
      pendingApplications,
      pendingPayments,
      openMaintenance,
    };
  }
}

export const store = new HostelStore();

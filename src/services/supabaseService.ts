import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { store } from './store';

export const SUPABASE_SQL_SCHEMA = `-- ==========================================
-- Federal Polytechnic Ukana Hostel Management System
-- Supabase PostgreSQL Database Schema
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. HOSTELS TABLE
CREATE TABLE IF NOT EXISTS hostels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  gender TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  number_of_blocks INT DEFAULT 2,
  number_of_rooms INT DEFAULT 22,
  total_capacity INT DEFAULT 88,
  fee_per_session NUMERIC DEFAULT 30000,
  status TEXT DEFAULT 'Active',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ROOMS TABLE
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  hostel_id TEXT REFERENCES hostels(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL,
  block TEXT NOT NULL,
  floor TEXT NOT NULL,
  capacity INT DEFAULT 4,
  occupied_count INT DEFAULT 0,
  status TEXT DEFAULT 'Available',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BED SPACES TABLE
CREATE TABLE IF NOT EXISTS bed_spaces (
  id TEXT PRIMARY KEY,
  room_id TEXT REFERENCES rooms(id) ON DELETE CASCADE,
  hostel_id TEXT REFERENCES hostels(id) ON DELETE CASCADE,
  bed_number INT NOT NULL,
  label TEXT NOT NULL,
  status TEXT DEFAULT 'Available',
  student_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STUDENT PROFILES TABLE
CREATE TABLE IF NOT EXISTS student_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  matric_number TEXT NOT NULL UNIQUE,
  jamb_reg_number TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  gender TEXT NOT NULL,
  department TEXT NOT NULL,
  programme TEXT NOT NULL,
  level TEXT NOT NULL,
  next_of_kin_name TEXT,
  next_of_kin_phone TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ACADEMIC SESSIONS TABLE
CREATE TABLE IF NOT EXISTS academic_sessions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_current BOOLEAN DEFAULT false,
  application_open BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  academic_session_id TEXT NOT NULL,
  preferred_hostel_id TEXT,
  status TEXT DEFAULT 'Submitted',
  health_condition TEXT,
  special_needs TEXT,
  submission_date TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewer_id TEXT,
  reviewer_notes TEXT
);

-- 7. ALLOCATIONS TABLE
CREATE TABLE IF NOT EXISTS allocations (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  academic_session_id TEXT NOT NULL,
  hostel_id TEXT REFERENCES hostels(id),
  room_id TEXT REFERENCES rooms(id),
  bed_space_id TEXT REFERENCES bed_spaces(id),
  allocated_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'Active',
  allocated_by TEXT,
  expiry_date TIMESTAMPTZ
);

-- 8. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  academic_session_id TEXT NOT NULL,
  amount NUMERIC DEFAULT 30000,
  payment_reference TEXT NOT NULL UNIQUE,
  payment_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'Submitted',
  verified_by TEXT,
  verified_at TIMESTAMPTZ,
  notes TEXT
);

-- 9. MAINTENANCE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id TEXT PRIMARY KEY,
  ticket_number TEXT NOT NULL UNIQUE,
  student_id TEXT NOT NULL,
  hostel_id TEXT REFERENCES hostels(id),
  room_id TEXT REFERENCES rooms(id),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'Medium',
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  work_notes TEXT
);

-- 10. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'Normal',
  target_role TEXT DEFAULT 'All',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);

-- 11. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  details TEXT,
  ip_address TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Seed Hostels (Main Campus Female Hostel Only)
INSERT INTO hostels (id, name, code, gender, location, description, number_of_blocks, number_of_rooms, total_capacity, fee_per_session, status, image_url)
VALUES 
  ('hostel-female-main', 'Main Campus Female Hostel', 'F-HST', 'Female', 'Main Campus West Wing, Fed Poly Ukana', 'Main campus secure female residential hall with 21 rooms, standard 4-bed spaces per room, reading lounge, and water heaters.', 2, 21, 84, 30000, 'Active', 'https://cdn.corenexis.com/f/LW7d70nDYeH.jpg')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  fee_per_session = EXCLUDED.fee_per_session;
`;

export async function syncStoreWithSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    // Attempt reading hostels from Supabase
    const { data: remoteHostels, error } = await supabase.from('hostels').select('*');
    if (error) {
      console.warn('Supabase query error (tables may need creation):', error.message);
      return { success: false, message: error.message };
    }

    return { success: true, count: remoteHostels?.length || 0 };
  } catch (err: any) {
    return { success: false, message: err.message || 'Unknown sync error' };
  }
}

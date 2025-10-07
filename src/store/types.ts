// Auth Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  language?: string;
  profile_image_url?: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  user: User;
}

// Medication Types
export interface Medication {
  id: number;
  name: string;
  generic_name?: string;
  brand_name?: string;
  description?: string;
  manufacturer?: string;
  dosage_form?: string;
  strength?: string;
  route_of_administration?: string;
  uses?: string;
  contraindications?: string;
  storage_instructions?: string;
  barcode?: string;
  image_url?: string;
  requires_prescription: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserMedication {
  id: number;
  user_id: number;
  medication_id: number;
  custom_name?: string;
  prescribed_dosage?: string;
  prescribed_frequency?: string;
  start_date?: string;
  end_date?: string;
  doctor_instructions?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  medication?: Medication;
}

export interface CreateUserMedicationRequest {
  medication_id: number;
  custom_name?: string;
  prescribed_dosage?: string;
  prescribed_frequency?: string;
  start_date?: string;
  end_date?: string;
  doctor_instructions?: string;
  notes?: string;
}

export interface PaginatedResponse<T> {
  items?: T[];
  medications?: T[];
  doctors?: T[];
  prescriptions?: T[];
  reminders?: T[];
  notifications?: T[];
  logs?: T[];
  contacts?: T[];
  settings?: T[];
  intakes?: T[];
  media_files?: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

// Doctor Types
export interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  specialty?: string;
  license_number?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserDoctor {
  id: number;
  user_id: number;
  doctor_id: number;
  relationship_type?: 'primary' | 'specialist' | 'other';
  is_primary: boolean;
  relationship_start_date?: string;
  relationship_end_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  doctor?: Doctor;
}

export interface CreateDoctorRequest {
  first_name: string;
  last_name: string;
  specialty?: string;
  license_number?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface CreateUserDoctorRequest {
  doctor_id: number;
  relationship_type?: 'primary' | 'specialist' | 'other';
  is_primary?: boolean;
  relationship_start_date?: string;
  relationship_end_date?: string;
  notes?: string;
}

// Reminder Types
export interface Reminder {
  id: number;
  user_medication_id: number;
  title?: string;
  description?: string;
  reminder_time?: string;
  time_of_week?: string;
  frequency_type: 'daily' | 'weekly' | 'monthly' | 'custom';
  frequency_value: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  event_enabled: boolean;
  calendar_reminder: boolean;
  push_notification: boolean;
  email_notification: boolean;
  created_at: string;
  updated_at: string;
  medication?: Medication;
}

export interface ReminderLog {
  id: number;
  reminder_id: number;
  scheduled_time?: string;
  actual_time?: string;
  status: 'pending' | 'sent' | 'acknowledged' | 'missed';
  notes?: string;
  log_metadata?: Record<string, any>;
  created_at: string;
}

export interface CreateReminderRequest {
  user_medication_id: number;
  title?: string;
  description?: string;
  reminder_time?: string;
  time_of_week?: string;
  frequency_type?: 'daily' | 'weekly' | 'monthly' | 'custom';
  frequency_value?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  event_enabled?: boolean;
  calendar_reminder?: boolean;
  push_notification?: boolean;
  email_notification?: boolean;
}

// Prescription Types
export interface Prescription {
  id: number;
  user_id: number;
  doctor_id?: number;
  medication_id?: number;
  prescription_number?: string;
  prescribed_date?: string;
  expiry_date?: string;
  dosage?: string;
  frequency?: string;
  quantity?: number;
  refills_remaining?: number;
  instructions?: string;
  status: 'active' | 'expired' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePrescriptionRequest {
  doctor_id?: number;
  medication_id?: number;
  prescription_number?: string;
  prescribed_date?: string;
  expiry_date?: string;
  dosage?: string;
  frequency?: string;
  quantity?: number;
  refills_remaining?: number;
  instructions?: string;
  status?: 'active' | 'expired' | 'cancelled';
  notes?: string;
}

// Notification Types
export interface Notification {
  id: number;
  user_id: number;
  reminder_id?: number;
  notification_type?: string;
  title?: string;
  message?: string;
  delivery_method: 'push' | 'email' | 'sms';
  scheduled_at?: string;
  sent_at?: string;
  read_at?: string;
  status: 'pending' | 'sent' | 'failed' | 'read';
  retry_count: number;
  error_message?: string;
  created_at: string;
}

export interface MedicationIntake {
  id: number;
  user_medication_id: number;
  reminder_log_id?: number;
  status_at?: string;
  dosage_taken?: string;
  status: 'taken' | 'missed' | 'skipped';
  notes?: string;
  side_effects_reported?: string;
  created_at: string;
}

export interface CreateMedicationIntakeRequest {
  user_medication_id: number;
  reminder_log_id?: number;
  status_at?: string;
  dosage_taken?: string;
  status?: 'taken' | 'missed' | 'skipped';
  notes?: string;
  side_effects_reported?: string;
}

// User Types
export interface UserSetting {
  id: number;
  user_id: number;
  setting_key: string;
  setting_value?: string;
  data_type?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface EmergencyContact {
  id: number;
  user_id: number;
  name: string;
  relationship?: string;
  phone?: string;
  email?: string;
  is_primary: boolean;
  notify_missed_doses: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: number;
  user_id?: number;
  entity_type?: string;
  entity_id?: number;
  action?: string;
  old_data?: Record<string, any>;
  new_data?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  description?: string;
  created_at: string;
}

export interface CreateEmergencyContactRequest {
  name: string;
  relationship?: string;
  phone?: string;
  email?: string;
  is_primary?: boolean;
  notify_missed_doses?: boolean;
}

export interface UpdateUserProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  language?: string;
  profile_image_url?: string;
}

// Media Types
export interface MediaFile {
  id: number;
  user_id: number;
  related_entity_id?: number;
  related_entity_type?: string;
  original_name?: string;
  file_path: string;
  file_type?: string;
  mime_type?: string;
  file_size?: number;
  file_metadata?: Record<string, any>;
  description?: string;
  is_processed: boolean;
  ai_analysis_result?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateMediaFileRequest {
  related_entity_id?: number;
  related_entity_type?: string;
  original_name?: string;
  file_path: string;
  file_type?: string;
  mime_type?: string;
  file_size?: number;
  file_metadata?: Record<string, any>;
  description?: string;
}

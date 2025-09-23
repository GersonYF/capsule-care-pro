export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: number; // times per day
  times: string[]; // specific times like ["09:00", "21:00"]
  color: string;
  notes?: string;
  startDate: Date;
  endDate?: Date;
  reminderEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  notificationEnabled: boolean;
}

export interface MedicationDose {
  id: string;
  medicationId: string;
  scheduledTime: string;
  date: Date;
  taken: boolean;
  takenAt?: Date;
  skipped: boolean;
}

export interface DaySchedule {
  date: Date;
  doses: MedicationDose[];
}
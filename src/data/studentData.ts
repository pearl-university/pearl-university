export interface StudentCourse {
  no: number
  title: string
  code: string
  unit: number
  status: 'C' | 'E' | 'R' // Compulsory / Elective / Required
}

export interface OutstandingFee {
  id: string
  title: string
  amount: number
  formattedAmount: string
  buttonLabel: string
  category: 'tuition' | 'faculty' | 'department' | 'levy'
}

export interface RecentPayment {
  id: string
  session: string
  level: string
  type: string
  date: string
  amount: number
  formattedAmount: string
}

export interface StudentProfile {
  name: string
  appNumber: string
  matricNumber: string
  email: string
  phone: string
  nucStatus: string
  level: string
  faculty: string
  department: string
  academicProgress: number
  avatarUrl: string
}

export const STUDENT_PROFILE_DATA: StudentProfile = {
  name: 'John Offiong',
  appNumber: '20240887TF',
  matricNumber: 'PU/2024/CSC/0842',
  email: 'john.offiong@pearl.edu.ng',
  phone: '+234 903 455 7895',
  nucStatus: 'NUC',
  level: 'Level 100',
  faculty: 'Faculty of Computing',
  department: 'Computer Science',
  academicProgress: 25,
  avatarUrl: '', // resolved in component
}

export const OUTSTANDING_FEES_DATA: OutstandingFee[] = [
  {
    id: 'school-fees',
    title: 'School fees',
    amount: 200000,
    formattedAmount: '₦200,000.00',
    buttonLabel: 'Pay School Fees',
    category: 'tuition',
  },
  {
    id: 'faculty-dues',
    title: 'Faculty Dues',
    amount: 20000,
    formattedAmount: '₦20,000.00',
    buttonLabel: 'Pay Faculty Dues',
    category: 'faculty',
  },
  {
    id: 'department-dues',
    title: 'Department Dues',
    amount: 10000,
    formattedAmount: '₦10,000.00',
    buttonLabel: 'Pay Department Dues',
    category: 'department',
  },
]

export const RECENT_PAYMENTS_DATA: RecentPayment[] = [
  {
    id: 'pay-1',
    session: '2025/2026',
    level: 'Level 100',
    type: 'School fees',
    date: '9/09/2026',
    amount: 200000,
    formattedAmount: '₦200,000.00',
  },
  {
    id: 'pay-2',
    session: '2025/2026',
    level: 'Level 100',
    type: 'Faculty dues',
    date: '9/09/2026',
    amount: 32500,
    formattedAmount: '₦32,500.00',
  },
  {
    id: 'pay-3',
    session: '2025/2026',
    level: 'Level 100',
    type: 'Department dues',
    date: '9/09/2026',
    amount: 16000,
    formattedAmount: '₦16,000.00',
  },
]

export const STUDENT_COURSES_DATA: StudentCourse[] = [
  {
    no: 1,
    title: 'INTRODUCTION TO COMPUTER SCIENCE',
    code: 'CSC 101',
    unit: 3,
    status: 'C',
  },
  {
    no: 2,
    title: 'PROBLEM SOLVING',
    code: 'CSC 102',
    unit: 3,
    status: 'C',
  },
  {
    no: 3,
    title: 'GENERAL PHYSICS I',
    code: 'PHY 101',
    unit: 2,
    status: 'C',
  },
  {
    no: 4,
    title: 'ELEMENTARY MATHEMATICS I',
    code: 'MTH 101',
    unit: 3,
    status: 'C',
  },
  {
    no: 5,
    title: 'DESCRIPTIVE STATISTICS',
    code: 'STA 111',
    unit: 3,
    status: 'C',
  },
  {
    no: 6,
    title: 'COMMUNICATION IN ENGLISH',
    code: 'GST 111',
    unit: 2,
    status: 'C',
  },
  {
    no: 7,
    title: 'NIGERIAN PEOPLES AND CULTURE',
    code: 'GST 112',
    unit: 2,
    status: 'C',
  },
]

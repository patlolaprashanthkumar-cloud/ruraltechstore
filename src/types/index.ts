export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  walletBalance?: number;
  commission?: number;
  parentId?: string;
  state?: string;
  district?: string;
  phone?: string;
  address?: string;
  kycStatus?: 'pending' | 'approved' | 'rejected';
  certifications?: string[];
}

export type UserRole = 'admin' | 'sub_admin' | 'super_distributor' | 'distributor' | 'retailer';

export interface Service {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  subCategory?: string;
  image: string;
  redirectUrl?: string;
  hasApplyForm: boolean;
  isActive: boolean;
  enabledRoles: UserRole[];
  commission: {
    [key in UserRole]?: number;
  };
  states?: string[];
  documents?: string[];
  processingTime?: string;
  fees?: number;
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory = 
  | 'utility' 
  | 'taxation' 
  | 'education' 
  | 'travel' 
  | 'ecommerce' 
  | 'banking' 
  | 'agriculture' 
  | 'child_benefit' 
  | 'pension' 
  | 'business' 
  | 'state_services'
  | 'healthcare'
  | 'training'
  | 'passport'
  | 'marketplace';

export interface ServiceApplication {
  id: string;
  serviceId: string;
  userId: string;
  applicantName: string;
  phone: string;
  email: string;
  state: string;
  district: string;
  documents: {
    name: string;
    url: string;
    type: string;
  }[];
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed';
  remarks?: string;
  trackingId?: string;
  fees?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number; // in minutes
  videoUrl?: string;
  materials: {
    name: string;
    url: string;
    type: 'pdf' | 'video' | 'document';
  }[];
  quiz?: {
    questions: {
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
    passingScore: number;
  };
  certificate: {
    template: string;
    validityPeriod: number; // in months
  };
  enabledRoles: UserRole[];
  isActive: boolean;
  createdAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  moduleId: string;
  certificateNumber: string;
  issuedDate: string;
  expiryDate: string;
  score: number;
  status: 'active' | 'expired' | 'revoked';
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response?: string;
  timestamp: string;
  type: 'user' | 'bot' | 'support';
  resolved: boolean;
}

export interface DoctorConsultation {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationType: 'video' | 'audio' | 'chat';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  symptoms: string;
  prescription?: string;
  fees: number;
  createdAt: string;
}

export interface MarketplaceProduct {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  price: number;
  discountPrice?: number;
  stock: number;
  isActive: boolean;
  ratings: {
    average: number;
    count: number;
  };
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    freeShipping: boolean;
    shippingCost: number;
  };
  createdAt: string;
}

export interface ONDCOrder {
  id: string;
  buyerId: string;
  sellerId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingId?: string;
  createdAt: string;
}

export const SERVICE_CATEGORIES = {
  utility: { name: 'Utility Services', icon: '📱' },
  taxation: { name: 'Taxation & Compliance', icon: '🧾' },
  education: { name: 'Education & Training', icon: '🎓' },
  travel: { name: 'Travel & Ticketing', icon: '🧳' },
  ecommerce: { name: 'E-Commerce & Booking', icon: '📦' },
  banking: { name: 'Banking & Financial', icon: '🏦' },
  agriculture: { name: 'Agriculture Schemes', icon: '🌾' },
  child_benefit: { name: 'Child & Birth Benefits', icon: '👶' },
  pension: { name: 'Pension & Welfare', icon: '👵' },
  business: { name: 'Business Development', icon: '💼' },
  state_services: { name: 'State Government Services', icon: '🏛️' },
  healthcare: { name: 'Healthcare Services', icon: '🏥' },
  training: { name: 'Training & Certification', icon: '📚' },
  passport: { name: 'Passport & Visa Services', icon: '📋' },
  marketplace: { name: 'E-Commerce Marketplace', icon: '🛒' },
};

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export const ROLE_HIERARCHY = {
  admin: 0,
  sub_admin: 1,
  super_distributor: 2,
  distributor: 3,
  retailer: 4,
};

export interface VehicleReview {
    author: string;
    rating: number; // 1 to 5
    comment: string;
    date: string; // ISO string format
}

export interface Vehicle {
  id: string; // Modificat din number în string pentru compatibilitate Firestore
  model: string;
  brand: string;
  sku: string;
  type: 'Sedan' | 'SUV' | 'Electrică' | 'Utilitară';
  tags: string[];
  perks: string[];
  price: number;
  image: string; 
  gallery?: string[];
  transmission: 'Automată' | 'Manuală';
  engine: string;
  consumption: string;
  view360?: {
    exterior: string;
    interior: string;
  };
  fuelType: 'Benzină' | 'Diesel' | 'Hibrid' | 'Electrică';
  power: number; 
  features: string[];
  popularity: number;
  isAvailable: boolean;
  reviews?: VehicleReview[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface TeamMember {
  name: string;
  role: string;
  quote: string;
  image: string;
}

export interface FleetItem {
  vehicleId: string; // Modificat din number în string
  quantity: number;
}

export interface SearchResult {
    type: 'vehicle' | 'page';
    title: string;
    description?: string;
    path: string;
}

// Tipuri noi pentru Panoul de Administrare

export type RequestStatus = 'Nouă' | 'În lucru' | 'Contactat' | 'Finalizată';

export interface QuoteRequest {
  id: string; // ID unic, ex: timestamp
  date: string; // ISO string
  status: RequestStatus;
  companyName: string;
  cui: string;
  contactPerson: string;
  email: string;
  phone: string;
  fleet: FleetItem[];
  notes: string;
}

export type UserRole = 'Admin' | 'Manager Vânzări' | 'Operator';

export interface User {
  id: string; // Modificat din number în string
  name: string;
  email: string;
  role: UserRole;
  lastLogin: string; // ISO string
}

export interface FAQItem {
  id: string; // Modificat din number în string
  question: string;
  answer: string;
}

// Tipuri noi pentru funcționalitățile avansate de administrare
export interface Client {
    companyName: string;
    cui: string;
    contactPerson: string;
    email: string;
    phone: string;
    requests: QuoteRequest[];
}

export interface AuditLogEntry {
    id: string;
    timestamp: string; // ISO string
    user: string; // Nume utilizator (simulat)
    action: string; // Ex: 'update_vehicle', 'delete_user'
    details: string; // Ex: 'A modificat vehiculul "Sedan Business"'
}

// Tip nou pentru imaginile încărcate în Firebase Storage
export interface UploadedImage {
    id: string;
    name: string;
    size: number;
    downloadUrl: string;
    storagePath: string; // Calea către fișier în Storage, necesară pentru ștergere
}
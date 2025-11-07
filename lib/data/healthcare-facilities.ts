// Comprehensive healthcare facilities database

export interface HealthcareFacility {
  id: string;
  name: string;
  type: "clinic" | "pharmacy" | "hospital" | "medical_shop";
  address: string;
  phone: string;
  rating: number;
  distance: string;
  isOpen: boolean;
  openHours: string;
  specialties?: string[];
  services?: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  website?: string;
  email?: string;
  description?: string;
}

export const HEALTHCARE_FACILITIES: HealthcareFacility[] = [
  // Clinics
  {
    id: "1",
    name: "City Medical Center",
    type: "clinic",
    address: "123 Main St, Downtown",
    phone: "(555) 123-4567",
    rating: 4.5,
    distance: "0.5 miles",
    isOpen: true,
    openHours: "8:00 AM - 6:00 PM",
    specialties: ["General Medicine", "Cardiology", "Dermatology"],
    services: ["Walk-in", "Appointments", "Emergency Care"],
    coordinates: { lat: 40.7128, lng: -74.0060 },
    website: "https://citymedical.com",
    email: "info@citymedical.com",
    description: "Full-service medical center with comprehensive healthcare services"
  },
  {
    id: "2",
    name: "Riverside Family Clinic",
    type: "clinic",
    address: "789 River Rd, Riverside",
    phone: "(555) 345-6789",
    rating: 4.7,
    distance: "1.2 miles",
    isOpen: false,
    openHours: "Closed - Opens 8:00 AM",
    specialties: ["Family Medicine", "Pediatrics", "Women's Health"],
    services: ["Appointments Only", "Telehealth"],
    coordinates: { lat: 40.7589, lng: -73.9851 },
    website: "https://riversideclinic.com",
    email: "contact@riversideclinic.com",
    description: "Family-focused healthcare with personalized care"
  },
  {
    id: "3",
    name: "Downtown Urgent Care",
    type: "clinic",
    address: "456 Broadway, Downtown",
    phone: "(555) 789-0123",
    rating: 4.2,
    distance: "0.8 miles",
    isOpen: true,
    openHours: "7:00 AM - 10:00 PM",
    specialties: ["Urgent Care", "Minor Injuries", "Illness Treatment"],
    services: ["Walk-in", "Same-day Appointments", "X-ray"],
    coordinates: { lat: 40.7505, lng: -73.9934 },
    website: "https://downtownurgent.com",
    email: "info@downtownurgent.com",
    description: "Fast, convenient urgent care services"
  },

  // Pharmacies
  {
    id: "4",
    name: "HealthPlus Pharmacy",
    type: "pharmacy",
    address: "456 Oak Ave, Midtown",
    phone: "(555) 234-5678",
    rating: 4.2,
    distance: "0.8 miles",
    isOpen: true,
    openHours: "9:00 AM - 9:00 PM",
    services: ["Prescription Filling", "Vaccinations", "Health Screenings"],
    coordinates: { lat: 40.7614, lng: -73.9776 },
    website: "https://healthpluspharmacy.com",
    email: "pharmacy@healthplus.com",
    description: "Full-service pharmacy with health consultations"
  },
  {
    id: "5",
    name: "QuickCare Pharmacy",
    type: "pharmacy",
    address: "321 Pine St, Uptown",
    phone: "(555) 456-7890",
    rating: 4.0,
    distance: "1.5 miles",
    isOpen: true,
    openHours: "24 Hours",
    services: ["24/7 Service", "Drive-through", "Delivery"],
    coordinates: { lat: 40.7831, lng: -73.9712 },
    website: "https://quickcarepharmacy.com",
    email: "info@quickcarepharmacy.com",
    description: "24/7 pharmacy services with drive-through convenience"
  },
  {
    id: "6",
    name: "MediMart Pharmacy",
    type: "pharmacy",
    address: "789 Health Blvd, Medical District",
    phone: "(555) 567-8901",
    rating: 4.4,
    distance: "2.0 miles",
    isOpen: true,
    openHours: "8:00 AM - 8:00 PM",
    services: ["Prescription Filling", "Medication Counseling", "Health Products"],
    coordinates: { lat: 40.7505, lng: -73.9934 },
    website: "https://medimart.com",
    email: "pharmacy@medimart.com",
    description: "Comprehensive pharmacy with health and wellness products"
  },

  // Medical Shops
  {
    id: "7",
    name: "MedSupply Plus",
    type: "medical_shop",
    address: "234 Medical Way, Healthcare Plaza",
    phone: "(555) 678-9012",
    rating: 4.3,
    distance: "1.8 miles",
    isOpen: true,
    openHours: "9:00 AM - 7:00 PM",
    services: ["Medical Equipment", "Supplies", "Home Care Items"],
    coordinates: { lat: 40.7282, lng: -73.9942 },
    website: "https://medsupplyplus.com",
    email: "sales@medsupplyplus.com",
    description: "Complete medical supplies and equipment store"
  },
  {
    id: "8",
    name: "Health Essentials Store",
    type: "medical_shop",
    address: "567 Wellness Ave, Health Center",
    phone: "(555) 789-0123",
    rating: 4.1,
    distance: "2.3 miles",
    isOpen: true,
    openHours: "8:00 AM - 6:00 PM",
    services: ["Medical Devices", "Health Monitors", "First Aid"],
    coordinates: { lat: 40.7589, lng: -73.9851 },
    website: "https://healthessentials.com",
    email: "info@healthessentials.com",
    description: "Essential health products and medical devices"
  },
  {
    id: "9",
    name: "CareMed Supplies",
    type: "medical_shop",
    address: "890 Care St, Medical Complex",
    phone: "(555) 890-1234",
    rating: 4.6,
    distance: "2.5 miles",
    isOpen: false,
    openHours: "Closed - Opens 9:00 AM",
    services: ["Professional Medical Equipment", "Diagnostic Tools", "Surgical Supplies"],
    coordinates: { lat: 40.7831, lng: -73.9712 },
    website: "https://caremedsupplies.com",
    email: "orders@caremedsupplies.com",
    description: "Professional medical equipment and supplies"
  },

  // Hospitals
  {
    id: "10",
    name: "Metropolitan Hospital",
    type: "hospital",
    address: "555 Hospital Blvd, Medical District",
    phone: "(555) 567-8901",
    rating: 4.3,
    distance: "2.1 miles",
    isOpen: true,
    openHours: "24 Hours Emergency",
    specialties: ["Emergency Medicine", "Surgery", "Cardiology", "Oncology"],
    services: ["Emergency Room", "Inpatient Care", "Outpatient Services"],
    coordinates: { lat: 40.7505, lng: -73.9934 },
    website: "https://metropolitanhospital.com",
    email: "info@metropolitanhospital.com",
    description: "Full-service hospital with comprehensive medical care"
  },
  {
    id: "11",
    name: "City General Hospital",
    type: "hospital",
    address: "123 Hospital Dr, Medical Center",
    phone: "(555) 234-5678",
    rating: 4.5,
    distance: "3.2 miles",
    isOpen: true,
    openHours: "24 Hours",
    specialties: ["General Medicine", "Pediatrics", "Orthopedics", "Neurology"],
    services: ["Emergency Services", "Surgery", "Diagnostic Imaging", "Laboratory"],
    coordinates: { lat: 40.7282, lng: -73.9942 },
    website: "https://citygeneral.com",
    email: "contact@citygeneral.com",
    description: "Leading general hospital with advanced medical technology"
  }
];

// Utility functions for healthcare facilities
export class HealthcareFacilityManager {
  static getAllFacilities(): HealthcareFacility[] {
    return HEALTHCARE_FACILITIES;
  }

  static getFacilitiesByType(type: HealthcareFacility['type']): HealthcareFacility[] {
    return HEALTHCARE_FACILITIES.filter(facility => facility.type === type);
  }

  static getOpenFacilities(): HealthcareFacility[] {
    return HEALTHCARE_FACILITIES.filter(facility => facility.isOpen);
  }

  static searchFacilities(query: string): HealthcareFacility[] {
    const lowercaseQuery = query.toLowerCase();
    return HEALTHCARE_FACILITIES.filter(facility =>
      facility.name.toLowerCase().includes(lowercaseQuery) ||
      facility.address.toLowerCase().includes(lowercaseQuery) ||
      facility.specialties?.some(specialty => specialty.toLowerCase().includes(lowercaseQuery)) ||
      facility.services?.some(service => service.toLowerCase().includes(lowercaseQuery))
    );
  }

  static getFacilitiesNearLocation(lat: number, lng: number, radiusMiles: number = 10): HealthcareFacility[] {
    return HEALTHCARE_FACILITIES.filter(facility => {
      const distance = this.calculateDistance(lat, lng, facility.coordinates.lat, facility.coordinates.lng);
      return distance <= radiusMiles;
    }).sort((a, b) => {
      const distanceA = this.calculateDistance(lat, lng, a.coordinates.lat, a.coordinates.lng);
      const distanceB = this.calculateDistance(lat, lng, b.coordinates.lat, b.coordinates.lng);
      return distanceA - distanceB;
    });
  }

  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static getFacilityById(id: string): HealthcareFacility | undefined {
    return HEALTHCARE_FACILITIES.find(facility => facility.id === id);
  }

  static getFacilitiesBySpecialty(specialty: string): HealthcareFacility[] {
    return HEALTHCARE_FACILITIES.filter(facility =>
      facility.specialties?.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
    );
  }
}

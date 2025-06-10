export interface DoctorInfo {
  id: string;
  name: string;
  title: string;
  specialty: string[];
  image: string;
  education: string[];
  experience: string[];
  certifications: string[];
  expertise: string[];
  schedule: {
    [key: string]: string[];
  };
  introduction: string;
}

export interface ClinicInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: {
    [key: string]: string;
  };
  services: string[];
}
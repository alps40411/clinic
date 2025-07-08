import { pages } from './Layout';
import AppointmentBooking from './AppointmentBooking';
import AppointmentLookup from './AppointmentLookup';
import ConsultationPage from './ConsultationPage';
import PatientProfile from './PatientProfile';
import ClinicInfo from './ClinicInfo';
import ClinicProgress from './ClinicProgress';

export const routes = pages.map(page => ({
  ...page,
  element: (() => {
    switch (page.id) {
      case 'clinic':
        return <ClinicInfo />;
      case 'appointment':
        return <AppointmentBooking />;
      case 'lookup':
        return <AppointmentLookup />;
      case 'progress':
        return <ClinicProgress />;
      case 'consultation':
        return <ConsultationPage />;
      case 'profile':
        return <PatientProfile />;
      default:
        return null;
    }
  })()
})); 
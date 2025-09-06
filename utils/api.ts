import type { Vehicle, Testimonial } from '../types';
import { vehiclesData as initialVehiclesData } from '../data/vehicles';

// Date statice pentru testimoniale, care vor fi salvate în localStorage
const initialTestimonialsData: Testimonial[] = [
    { quote: "Am redus costurile cu ~20% în primul an. Servicii impecabile și o echipă de profesioniști.", author: "Andreea P.", role: "CFO", company: "TechNova SRL" },
    { quote: "Flexibilitatea flotei ne-a permis să ne adaptăm rapid la noile proiecte. Recomand cu încredere!", author: "Mihai D.", role: "Manager Logistica", company: "Construct Group" },
];

// Numele cheilor folosite în localStorage pentru a fi consistente cu adminDataService
const VEHICLES_KEY = 'admin_vehicles';
const TESTIMONIALS_KEY = 'public_testimonials';

// --- API-ul Serviciului Simulat ---

/**
 * Simulează un API asincron care interacționează cu localStorage.
 * Datele sunt citite/scrise din/în localStorage pentru a persista între sesiuni.
 * Întoarce Promise-uri pentru a mima comportamentul unei cereri de rețea.
 */
export const api = {
    /**
     * Prelucrează vehiculele.
     * Dacă nu există date în localStorage, le inițializează din fișierul static.
     * @returns {Promise<Vehicle[]>} O promisiune care se rezolvă cu lista de vehicule.
     */
    getVehicles: (): Promise<Vehicle[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const data = localStorage.getItem(VEHICLES_KEY);
                    if (data) {
                        resolve(JSON.parse(data));
                    } else {
                        // Inițializează dacă nu există
                        localStorage.setItem(VEHICLES_KEY, JSON.stringify(initialVehiclesData));
                        resolve(initialVehiclesData);
                    }
                } catch (error) {
                    console.error("Eroare la preluarea vehiculelor din API simulat:", error);
                    resolve(initialVehiclesData); // Fallback la datele statice
                }
            }, 500); // Simulează o întârziere de rețea de 500ms
        });
    },

    /**
     * Prelucrează testimonialele.
     * Dacă nu există date în localStorage, le inițializează.
     * @returns {Promise<Testimonial[]>} O promisiune care se rezolvă cu lista de testimoniale.
     */
    getTestimonials: (): Promise<Testimonial[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const data = localStorage.getItem(TESTIMONIALS_KEY);
                    if (data) {
                        resolve(JSON.parse(data));
                    } else {
                        // Inițializează dacă nu există
                        localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(initialTestimonialsData));
                        resolve(initialTestimonialsData);
                    }
                } catch (error) {
                    console.error("Eroare la preluarea testimonialelor din API simulat:", error);
                    resolve(initialTestimonialsData); // Fallback
                }
            }, 300); // Simulează o întârziere de rețea de 300ms
        });
    },
};

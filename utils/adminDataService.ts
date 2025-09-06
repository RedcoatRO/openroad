
import type { Vehicle, QuoteRequest, User, FAQItem, AuditLogEntry, Client, RequestStatus, Testimonial } from '../types';
import { vehiclesData as initialVehiclesData } from '../data/vehicles';

/**
 * Serviciu de date simulat care utilizează localStorage pentru a persista datele
 * panoului de administrare.
 */

// --- Tipuri Interne ---
interface UploadedImage {
    id: string;
    dataUrl: string;
    name: string;
    size: number;
}


// --- Date Inițiale (Seed Data) ---
const initialUsers: User[] = [
    { id: 1, name: 'Admin Principal', email: 'admin@fleetlease.pro', role: 'Admin', lastLogin: new Date().toISOString() },
    { id: 2, name: 'Ana Popescu', email: 'ana.p@fleetlease.pro', role: 'Manager Vânzări', lastLogin: new Date().toISOString() },
    { id: 3, name: 'Mihai Ionescu', email: 'mihai.i@fleetlease.pro', role: 'Operator', lastLogin: new Date().toISOString() },
];

const initialFAQs: FAQItem[] = [
    { id: 1, question: "Care este durata minimă a contractului?", answer: "Durata minimă este de 12 luni, cu opțiuni flexibile de extindere până la 48 de luni." },
    { id: 2, question: "Ce costuri sunt incluse în rata lunară?", answer: "Rata lunară include RCA, CASCO, mentenanța completă (revizii și reparații), taxele (rovinieta) și un vehicul de înlocuire în caz de imobilizare." }
];

const initialTestimonials: Testimonial[] = [
    { quote: "Am redus costurile cu ~20% în primul an. Servicii impecabile și o echipă de profesioniști.", author: "Andreea P.", role: "CFO", company: "TechNova SRL" },
    { quote: "Flexibilitatea flotei ne-a permis să ne adaptăm rapid la noile proiecte. Recomand cu încredere!", author: "Mihai D.", role: "Manager Logistica", company: "Construct Group" },
];

const initialPartners = Array.from({length: 6}, (_, i) => ({
  id: `partner-${i+1}`,
  logoUrl: `https://picsum.photos/seed/partner${i+1}/128/32`,
  name: `Partner ${i+1}`
}));


// --- Funcții Helper ---

function getData<T>(key: string, defaultValue: T): T {
    try {
        const data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        } else {
            // Nu salvăm valoarea default aici pentru a permite actualizări ale datelor inițiale
            return defaultValue;
        }
    } catch (error) {
        console.error(`Failed to read ${key} from localStorage`, error);
        return defaultValue;
    }
}

function setData<T>(key: string, data: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Failed to write ${key} to localStorage`, error);
    }
}

// Funcție pentru a adăuga o intrare în log
function logAction(action: string, details: string): void {
    const logs = getData<AuditLogEntry[]>('admin_audit_log', []);
    const newLog: AuditLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        user: 'Admin (Simulat)', // Într-o aplicație reală, s-ar lua user-ul logat
        action,
        details,
    };
    setData('admin_audit_log', [newLog, ...logs]);
}

// --- API-ul Serviciului ---

export const adminDataService = {
    // Vehicule
    getVehicles: (): Vehicle[] => {
        // Această funcție implementează un sistem de "override".
        // Verifică mai întâi dacă există date modificate de admin în localStorage.
        // Dacă da, returnează versiunea salvată.
        // Dacă nu, returnează datele inițiale din fișierul `data/vehicles.ts`.
        // Prima operațiune de scriere (add/update/delete) va copia datele inițiale
        // în localStorage, creând astfel o versiune de lucru.
        const storedData = localStorage.getItem('admin_vehicles');
        if (storedData) {
            try {
                return JSON.parse(storedData);
            } catch (e) {
                console.error("Eroare la parsarea datelor vehiculelor din localStorage, se revine la datele inițiale.", e);
                return initialVehiclesData; // Fallback în caz de eroare de parsare
            }
        }
        return initialVehiclesData; // Fallback dacă nu există nimic în localStorage
    },
    updateVehicle: (updatedVehicle: Vehicle): void => {
        // Asigură că se lucrează pe o copie a datelor (din localStorage sau inițiale) la prima modificare
        const vehicles = adminDataService.getVehicles();
        const index = vehicles.findIndex(v => v.id === updatedVehicle.id);
        if (index !== -1) {
            vehicles[index] = updatedVehicle;
            setData('admin_vehicles', vehicles);
            logAction('update_vehicle', `A actualizat vehiculul: ${updatedVehicle.model}`);
        }
    },
    addVehicle: (newVehicleData: Omit<Vehicle, 'id'>): void => {
        const vehicles = adminDataService.getVehicles();
        const newVehicle: Vehicle = { ...newVehicleData, id: Date.now(), popularity: 50, reviews: [] };
        setData('admin_vehicles', [...vehicles, newVehicle]);
        logAction('add_vehicle', `A adăugat vehiculul: ${newVehicle.model}`);
    },
    deleteVehicle: (vehicleId: number): void => {
        const vehicles = adminDataService.getVehicles();
        const vehicleToDelete = vehicles.find(v => v.id === vehicleId);
        setData('admin_vehicles', vehicles.filter(v => v.id !== vehicleId));
        if (vehicleToDelete) {
            logAction('delete_vehicle', `A șters vehiculul: ${vehicleToDelete.model}`);
        }
    },

    // Solicitări
    getRequests: (): QuoteRequest[] => getData<QuoteRequest[]>('admin_requests', []),
    addRequest: (newRequestData: Omit<QuoteRequest, 'id' | 'date' | 'status'>): void => {
        const requests = adminDataService.getRequests();
        const newRequest: QuoteRequest = { ...newRequestData, id: Date.now().toString(), date: new Date().toISOString(), status: 'Nouă' };
        setData('admin_requests', [newRequest, ...requests]);
        logAction('new_request', `Solicitare nouă de la: ${newRequestData.companyName}`);
    },
    updateRequestStatus: (requestId: string, status: RequestStatus): void => {
        const requests = adminDataService.getRequests();
        const index = requests.findIndex(r => r.id === requestId);
        if (index !== -1) {
            requests[index].status = status;
            setData('admin_requests', requests);
            logAction('update_request_status', `Statusul solicitării de la ${requests[index].companyName} a fost schimbat în "${status}"`);
        }
    },

    // Clienți (derivați din solicitări)
    getClients: (): Client[] => {
        const requests = adminDataService.getRequests();
        const clientsMap = new Map<string, Client>();

        requests.forEach(req => {
            if (!clientsMap.has(req.cui)) {
                clientsMap.set(req.cui, {
                    companyName: req.companyName,
                    cui: req.cui,
                    contactPerson: req.contactPerson,
                    email: req.email,
                    phone: req.phone,
                    requests: []
                });
            }
            clientsMap.get(req.cui)!.requests.push(req);
        });

        return Array.from(clientsMap.values());
    },

    // Utilizatori
    getUsers: (): User[] => getData<User[]>('admin_users', initialUsers),
    updateUser: (updatedUser: User): void => {
        const users = adminDataService.getUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
            setData('admin_users', users);
            logAction('update_user', `A actualizat utilizatorul: ${updatedUser.name}`);
        }
    },
    deleteUser: (userId: number): void => {
        const users = adminDataService.getUsers();
        const userToDelete = users.find(u => u.id === userId);
        setData('admin_users', users.filter(u => u.id !== userId));
        if (userToDelete) {
            logAction('delete_user', `A șters utilizatorul: ${userToDelete.name}`);
        }
    },

    // CMS (FAQ)
    getFAQs: (): FAQItem[] => getData<FAQItem[]>('admin_faqs', initialFAQs),
    updateFAQ: (updatedFAQ: FAQItem): void => {
        const faqs = adminDataService.getFAQs();
        const index = faqs.findIndex(f => f.id === updatedFAQ.id);
        if (index !== -1) {
            faqs[index] = updatedFAQ;
            setData('admin_faqs', faqs);
            logAction('update_faq', `A actualizat FAQ: "${updatedFAQ.question.substring(0, 20)}..."`);
        }
    },
    addFAQ: (newFAQData: Omit<FAQItem, 'id'>): void => {
        const faqs = adminDataService.getFAQs();
        const newFAQ: FAQItem = { ...newFAQData, id: Date.now() };
        setData('admin_faqs', [...faqs, newFAQ]);
        logAction('add_faq', `A adăugat FAQ: "${newFAQ.question.substring(0, 20)}..."`);
    },
    deleteFAQ: (faqId: number): void => {
        const faqs = adminDataService.getFAQs();
        const faqToDelete = faqs.find(f => f.id === faqId);
        setData('admin_faqs', faqs.filter(f => f.id !== faqId));
        if (faqToDelete) {
            logAction('delete_faq', `A șters FAQ: "${faqToDelete.question.substring(0, 20)}..."`);
        }
    },
    
    // CMS Content Overrides
    getContentOverrides: (): Record<string, string> => getData<Record<string, string>>('admin_content_overrides', {}),
    getSingleContent: (id: string, fallback: string): string => {
        const overrides = adminDataService.getContentOverrides();
        return overrides[id] || fallback;
    },
    setContentOverride: (id: string, content: string): void => {
        const overrides = adminDataService.getContentOverrides();
        overrides[id] = content;
        setData('admin_content_overrides', overrides);
        logAction('update_content', `A actualizat conținutul pentru elementul: ${id}`);
    },

    // CMS Testimonials
    getTestimonials: (): Testimonial[] => getData<Testimonial[]>('admin_testimonials', initialTestimonials),
    updateTestimonials: (testimonials: Testimonial[]): void => {
        setData('admin_testimonials', testimonials);
        logAction('update_testimonials', `A actualizat lista de testimoniale.`);
    },

    // CMS Partners
    getPartners: (): { id: string, logoUrl: string, name: string }[] => getData<any[]>('admin_partners', initialPartners),
    updatePartners: (partners: { id: string, logoUrl: string, name: string }[]): void => {
        setData('admin_partners', partners);
        logAction('update_partners', `A actualizat lista de parteneri.`);
    },

    // Audit Log
    getLogs: (): AuditLogEntry[] => getData<AuditLogEntry[]>('admin_audit_log', []),

    // Image Gallery
    getUploadedImages: (): UploadedImage[] => getData<UploadedImage[]>('admin_uploaded_images', []),
    addUploadedImage: (image: Omit<UploadedImage, 'id'>): void => {
        const images = adminDataService.getUploadedImages();
        const newImage: UploadedImage = { ...image, id: Date.now().toString() };
        setData('admin_uploaded_images', [newImage, ...images]);
        logAction('upload_image', `A încărcat imaginea: ${image.name}`);
    },
    deleteUploadedImage: (imageId: string): void => {
        const images = adminDataService.getUploadedImages();
        const imageToDelete = images.find(img => img.id === imageId);
        setData('admin_uploaded_images', images.filter(img => img.id !== imageId));
        if (imageToDelete) {
            logAction('delete_image', `A șters imaginea: ${imageToDelete.name}`);
        }
    },
};
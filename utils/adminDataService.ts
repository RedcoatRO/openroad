// FIX: Import the `firebase` object to make its types available within this module.
import { db, storage, firebase } from './firebase';
import type { Vehicle, QuoteRequest, User, FAQItem, AuditLogEntry, Client, RequestStatus, Testimonial, UploadedImage, VehicleReview } from '../types';

/**
 * Serviciu de date care interacționează direct cu serviciile Firebase (Firestore, Storage)
 * pentru a gestiona toate datele aplicației.
 */

// Funcție ajutătoare pentru a transforma un snapshot Firestore într-un array de obiecte, adăugând și ID-ul documentului.
const mapSnapshotToData = <T extends {}>(snapshot: firebase.firestore.QuerySnapshot): (T & { id: string })[] => {
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T & { id: string }));
};

// Funcție pentru a loga acțiunile de audit în colecția 'auditLog' din Firestore.
async function logAction(action: string, details: string): Promise<void> {
    try {
        await db.collection('auditLog').add({
            action,
            details,
            user: 'Admin', // Într-o aplicație reală, s-ar prelua din starea de autentificare
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Eroare la scrierea în audit log:", error);
    }
}

export const adminDataService = {
    // --- Vehicule ---
    async getVehicles(): Promise<Vehicle[]> {
        const snapshot = await db.collection('vehicles').get();
        return mapSnapshotToData<Vehicle>(snapshot);
    },

    async updateVehicle(updatedVehicle: Vehicle): Promise<void> {
        const { id, ...vehicleData } = updatedVehicle;
        await db.collection('vehicles').doc(id).set(vehicleData, { merge: true });
        await logAction('update_vehicle', `A actualizat vehiculul: ${updatedVehicle.model}`);
    },

    async addVehicle(newVehicleData: Omit<Vehicle, 'id'>): Promise<void> {
        await db.collection('vehicles').add(newVehicleData);
        await logAction('add_vehicle', `A adăugat vehiculul: ${newVehicleData.model}`);
    },

    async deleteVehicle(vehicleId: string): Promise<void> {
        await db.collection('vehicles').doc(vehicleId).delete();
        await logAction('delete_vehicle', `A șters vehiculul cu ID: ${vehicleId}`);
    },

    // --- Recenzii Vehicule ---
    async getReviewsForVehicle(vehicleId: string): Promise<VehicleReview[]> {
        const snapshot = await db.collection('vehicles').doc(vehicleId).collection('reviews').orderBy('date', 'desc').get();
        return snapshot.docs.map(doc => doc.data() as VehicleReview);
    },

    async addReviewForVehicle(vehicleId: string, review: Omit<VehicleReview, 'date'>): Promise<void> {
        const reviewWithDate = { ...review, date: new Date().toISOString() };
        await db.collection('vehicles').doc(vehicleId).collection('reviews').add(reviewWithDate);
    },

    // --- Solicitări de Ofertă ---
    async getRequests(): Promise<QuoteRequest[]> {
        const snapshot = await db.collection('requests').orderBy('date', 'desc').get();
        return mapSnapshotToData<QuoteRequest>(snapshot);
    },

    async addRequest(newRequestData: Omit<QuoteRequest, 'id' | 'date' | 'status'>): Promise<void> {
        const newRequest = { 
            ...newRequestData, 
            date: new Date().toISOString(), 
            status: 'Nouă' as RequestStatus 
        };
        await db.collection('requests').add(newRequest);
        await logAction('new_request', `Solicitare nouă de la: ${newRequestData.companyName}`);
    },

    async updateRequestStatus(requestId: string, status: RequestStatus): Promise<void> {
        await db.collection('requests').doc(requestId).update({ status });
        await logAction('update_request_status', `Statusul solicitării ${requestId} a fost schimbat în "${status}"`);
    },

    // --- Clienți (derivați din solicitări) ---
    async getClients(): Promise<Client[]> {
        const requests = await this.getRequests();
        const clientsMap = new Map<string, Client>();
        requests.forEach(req => {
            if (!clientsMap.has(req.cui)) {
                clientsMap.set(req.cui, {
                    companyName: req.companyName, cui: req.cui, contactPerson: req.contactPerson,
                    email: req.email, phone: req.phone, requests: []
                });
            }
            clientsMap.get(req.cui)!.requests.push(req);
        });
        return Array.from(clientsMap.values());
    },

    // --- Utilizatori ---
    async getUsers(): Promise<User[]> {
        const snapshot = await db.collection('users').get();
        return mapSnapshotToData<User>(snapshot);
    },

    async updateUser(updatedUser: User): Promise<void> {
        const { id, ...userData } = updatedUser;
        await db.collection('users').doc(id).set(userData, { merge: true });
        await logAction('update_user', `A actualizat utilizatorul: ${updatedUser.name}`);
    },

    async deleteUser(userId: string): Promise<void> {
        await db.collection('users').doc(userId).delete();
        await logAction('delete_user', `A șters utilizatorul cu ID: ${userId}`);
    },

    // --- CMS (FAQ, Testimoniale, Parteneri) ---
    async getFAQs(): Promise<FAQItem[]> {
        const snapshot = await db.collection('faqs').get();
        return mapSnapshotToData<FAQItem>(snapshot);
    },

    async updateFAQ(updatedFAQ: FAQItem): Promise<void> {
        const { id, ...faqData } = updatedFAQ;
        await db.collection('faqs').doc(id).set(faqData);
        await logAction('update_faq', `A actualizat FAQ: "${updatedFAQ.question.substring(0, 20)}..."`);
    },

    async addFAQ(newFAQData: Omit<FAQItem, 'id'>): Promise<void> {
        await db.collection('faqs').add(newFAQData);
        await logAction('add_faq', `A adăugat FAQ: "${newFAQData.question.substring(0, 20)}..."`);
    },

    async deleteFAQ(faqId: string): Promise<void> {
        await db.collection('faqs').doc(faqId).delete();
        await logAction('delete_faq', `A șters FAQ cu ID: ${faqId}`);
    },
    
    async getContentOverrides(): Promise<Record<string, string>> {
        const docRef = await db.collection('content').doc('overrides').get();
        return docRef.exists ? (docRef.data() as Record<string, string>) : {};
    },
    
    listenToContentOverrides(callback: (data: Record<string, string>) => void): () => void {
        const docRef = db.collection('content').doc('overrides');
        const unsubscribe = docRef.onSnapshot(
            (doc) => {
                const data = doc.exists ? (doc.data() as Record<string, string>) : {};
                callback(data);
            },
            (error) => {
                console.error("Error listening to content overrides:", error);
            }
        );
        return unsubscribe; // Returnează funcția de dezabonare pentru cleanup
    },

    async setContentOverride(id: string, content: string): Promise<void> {
        await db.collection('content').doc('overrides').set({ [id]: content }, { merge: true });
        await logAction('update_content', `A actualizat conținutul pentru elementul: ${id}`);
    },

    async getTestimonials(): Promise<Testimonial[]> {
        const docRef = await db.collection('content').doc('testimonials').get();
        return docRef.exists ? (docRef.data()?.list as Testimonial[] || []) : [];
    },

    async updateTestimonials(testimonials: Testimonial[]): Promise<void> {
        await db.collection('content').doc('testimonials').set({ list: testimonials });
        await logAction('update_testimonials', `A actualizat lista de testimoniale.`);
    },

    async getPartners(): Promise<{ id: string, logoUrl: string, name: string }[]> {
         const docRef = await db.collection('content').doc('partners').get();
        return docRef.exists ? (docRef.data()?.list || []) : [];
    },

    async updatePartners(partners: { id: string, logoUrl: string, name: string }[]): Promise<void> {
        await db.collection('content').doc('partners').set({ list: partners });
        await logAction('update_partners', `A actualizat lista de parteneri.`);
    },

    // --- Audit Log ---
    async getLogs(): Promise<AuditLogEntry[]> {
        const snapshot = await db.collection('auditLog').orderBy('timestamp', 'desc').limit(100).get();
        return mapSnapshotToData<AuditLogEntry>(snapshot);
    },

    // --- Galerie de Imagini (Storage + Firestore) ---
    async getUploadedImages(): Promise<UploadedImage[]> {
        const snapshot = await db.collection('images').get();
        return mapSnapshotToData<UploadedImage>(snapshot);
    },
    
    async addUploadedImage(file: File, compressedDataUrl: string): Promise<void> {
        const storagePath = `gallery/${Date.now()}_${file.name}`;
        const storageRef = storage.ref(storagePath);
        
        // Pas 1: Încarcă imaginea (comprimată) în Firebase Storage
        const uploadTask = await storageRef.putString(compressedDataUrl, 'data_url');
        
        // Pas 2: Obține URL-ul public de descărcare
        const downloadUrl = await uploadTask.ref.getDownloadURL();
        
        // Pas 3: Salvează metadatele imaginii în Firestore
        await db.collection('images').add({
            name: file.name,
            size: file.size, // Mărimea originală pentru informare
            downloadUrl,
            storagePath,
        });
        await logAction('upload_image', `A încărcat imaginea: ${file.name}`);
    },

    async deleteUploadedImage(image: UploadedImage): Promise<void> {
        // Pas 1: Șterge fișierul din Firebase Storage
        await storage.refFromURL(image.downloadUrl).delete();
        
        // Pas 2: Șterge documentul corespunzător din Firestore
        await db.collection('images').doc(image.id).delete();

        await logAction('delete_image', `A șters imaginea: ${image.name}`);
    },

    // --- Altele: Alerte Stoc, Programări ---
    async addStockSubscription(email: string, vehicleId: string, model: string): Promise<void> {
        await db.collection('stockSubscriptions').add({ email, vehicleId, model, date: new Date().toISOString() });
    },

    async addBooking(bookingData: any): Promise<void> {
        await db.collection('bookings').add(bookingData);
    },
};
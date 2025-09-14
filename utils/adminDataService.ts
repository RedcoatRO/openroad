
import { 
    collection, getDocs, doc, updateDoc, addDoc, deleteDoc, setDoc, getDoc, query, orderBy, writeBatch
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from './firebase';

import type { Vehicle, QuoteRequest, User, FAQItem, AuditLogEntry, Client, RequestStatus, Testimonial, UploadedImage, VehicleReview } from '../types';

/**
 * Serviciu de date care interacționează cu Firebase (Firestore și Storage)
 * pentru a persista datele panoului de administrare. Toate metodele sunt asincrone.
 */

// --- Numele Colecțiilor din Firestore ---
const COLLECTIONS = {
    VEHICLES: 'vehicles',
    REQUESTS: 'quoteRequests',
    USERS: 'users',
    FAQS: 'faqs',
    CONTENT: 'content', // Colecție pentru conținut singleton (overrides, testimonials)
    AUDIT_LOG: 'auditLog',
    GALLERY: 'gallery',
    SUBSCRIPTIONS: 'stockSubscriptions',
    BOOKINGS: 'bookings',
};


// --- Funcție Helper pentru Logare ---

/**
 * Adaugă o intrare în colecția de audit log din Firestore.
 * @param action Tipul acțiunii efectuate (ex: 'update_vehicle').
 * @param details O descriere a modificării.
 */
async function logAction(action: string, details: string): Promise<void> {
    try {
        await addDoc(collection(db, COLLECTIONS.AUDIT_LOG), {
            timestamp: new Date().toISOString(),
            user: 'Admin (Simulat)', // Într-o aplicație reală, s-ar lua user-ul autentificat
            action,
            details,
        });
    } catch (error) {
        console.error("Eroare la scrierea în audit log:", error);
    }
}

// --- API-ul Serviciului ---

export const adminDataService = {
    // --- Vehicule ---
    async getVehicles(): Promise<Vehicle[]> {
        const q = query(collection(db, COLLECTIONS.VEHICLES));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
    },

    async updateVehicle(updatedVehicle: Vehicle): Promise<void> {
        const vehicleDoc = doc(db, COLLECTIONS.VEHICLES, updatedVehicle.id);
        await updateDoc(vehicleDoc, { ...updatedVehicle });
        await logAction('update_vehicle', `A actualizat vehiculul: ${updatedVehicle.model}`);
    },

    async addVehicle(newVehicleData: Omit<Vehicle, 'id'>): Promise<void> {
        const docRef = await addDoc(collection(db, COLLECTIONS.VEHICLES), newVehicleData);
        console.log("Vehicul adăugat cu ID:", docRef.id);
        await logAction('add_vehicle', `A adăugat vehiculul: ${newVehicleData.model}`);
    },

    async deleteVehicle(vehicleId: string): Promise<void> {
        const vehicleDoc = doc(db, COLLECTIONS.VEHICLES, vehicleId);
        await deleteDoc(vehicleDoc);
        await logAction('delete_vehicle', `A șters vehiculul cu ID: ${vehicleId}`);
    },

    // --- Recenzii Vehicule (Sub-colecție) ---
    async getReviewsForVehicle(vehicleId: string): Promise<VehicleReview[]> {
        const reviewsCol = collection(db, COLLECTIONS.VEHICLES, vehicleId, 'reviews');
        const q = query(reviewsCol, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as VehicleReview);
    },

    async addReviewForVehicle(vehicleId: string, review: Omit<VehicleReview, 'date'>): Promise<void> {
        const reviewWithDate = { ...review, date: new Date().toISOString() };
        const reviewsCol = collection(db, COLLECTIONS.VEHICLES, vehicleId, 'reviews');
        await addDoc(reviewsCol, reviewWithDate);
    },

    // --- Solicitări de Ofertă ---
    async getRequests(): Promise<QuoteRequest[]> {
        const q = query(collection(db, COLLECTIONS.REQUESTS), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuoteRequest));
    },

    async addRequest(newRequestData: Omit<QuoteRequest, 'id' | 'date' | 'status'>): Promise<void> {
        const newRequest = { ...newRequestData, date: new Date().toISOString(), status: 'Nouă' as RequestStatus };
        await addDoc(collection(db, COLLECTIONS.REQUESTS), newRequest);
        await logAction('new_request', `Solicitare nouă de la: ${newRequestData.companyName}`);
    },

    async updateRequestStatus(requestId: string, status: RequestStatus): Promise<void> {
        const requestDoc = doc(db, COLLECTIONS.REQUESTS, requestId);
        await updateDoc(requestDoc, { status });
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
        const q = query(collection(db, COLLECTIONS.USERS));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    },

    async updateUser(updatedUser: User): Promise<void> {
        const userDoc = doc(db, COLLECTIONS.USERS, updatedUser.id);
        await updateDoc(userDoc, { ...updatedUser });
        await logAction('update_user', `A actualizat utilizatorul: ${updatedUser.name}`);
    },

    async deleteUser(userId: string): Promise<void> {
        await deleteDoc(doc(db, COLLECTIONS.USERS, userId));
        await logAction('delete_user', `A șters utilizatorul cu ID: ${userId}`);
    },

    // --- CMS (FAQ) ---
    async getFAQs(): Promise<FAQItem[]> {
        const q = query(collection(db, COLLECTIONS.FAQS));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQItem));
    },

    async updateFAQ(updatedFAQ: FAQItem): Promise<void> {
        const faqDoc = doc(db, COLLECTIONS.FAQS, updatedFAQ.id);
        await updateDoc(faqDoc, { ...updatedFAQ });
        await logAction('update_faq', `A actualizat FAQ: "${updatedFAQ.question.substring(0, 20)}..."`);
    },

    async addFAQ(newFAQData: Omit<FAQItem, 'id'>): Promise<void> {
        await addDoc(collection(db, COLLECTIONS.FAQS), newFAQData);
        await logAction('add_faq', `A adăugat FAQ: "${newFAQData.question.substring(0, 20)}..."`);
    },

    async deleteFAQ(faqId: string): Promise<void> {
        await deleteDoc(doc(db, COLLECTIONS.FAQS, faqId));
        await logAction('delete_faq', `A șters FAQ cu ID: ${faqId}`);
    },
    
    // --- CMS Content (Singleton Documents) ---
    async getContentOverrides(): Promise<Record<string, string>> {
        const docRef = doc(db, COLLECTIONS.CONTENT, 'contentOverrides');
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : {};
    },

    async setContentOverride(id: string, content: string): Promise<void> {
        const docRef = doc(db, COLLECTIONS.CONTENT, 'contentOverrides');
        // Folosim `setDoc` cu `merge: true` pentru a crea documentul dacă nu există
        // sau pentru a actualiza un câmp specific fără a suprascrie întregul document.
        await setDoc(docRef, { [id]: content }, { merge: true });
        await logAction('update_content', `A actualizat conținutul pentru elementul: ${id}`);
    },

    async getTestimonials(): Promise<Testimonial[]> {
        const docRef = doc(db, COLLECTIONS.CONTENT, 'testimonials');
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? (docSnap.data().items || []) : [];
    },

    async updateTestimonials(testimonials: Testimonial[]): Promise<void> {
        const docRef = doc(db, COLLECTIONS.CONTENT, 'testimonials');
        await setDoc(docRef, { items: testimonials });
        await logAction('update_testimonials', `A actualizat lista de testimoniale.`);
    },

    async getPartners(): Promise<{ id: string, logoUrl: string, name: string }[]> {
        const docRef = doc(db, COLLECTIONS.CONTENT, 'partners');
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? (docSnap.data().items || []) : [];
    },

    async updatePartners(partners: { id: string, logoUrl: string, name: string }[]): Promise<void> {
        const docRef = doc(db, COLLECTIONS.CONTENT, 'partners');
        await setDoc(docRef, { items: partners });
        await logAction('update_partners', `A actualizat lista de parteneri.`);
    },

    // --- Audit Log ---
    async getLogs(): Promise<AuditLogEntry[]> {
        const q = query(collection(db, COLLECTIONS.AUDIT_LOG), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as AuditLogEntry));
    },

    // --- Galerie de Imagini (Firebase Storage + Firestore) ---
    async getUploadedImages(): Promise<UploadedImage[]> {
        const q = query(collection(db, COLLECTIONS.GALLERY));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UploadedImage));
    },
    
    async addUploadedImage(file: File, compressedDataUrl: string): Promise<void> {
        // Creează o cale unică pentru fișier în Storage
        const storagePath = `gallery/${Date.now()}_${file.name}`;
        const imageRef = ref(storage, storagePath);
        
        // Încarcă imaginea (comprimată, ca string Base64) în Firebase Storage
        const snapshot = await uploadString(imageRef, compressedDataUrl, 'data_url');
        
        // Obține URL-ul de descărcare public
        const downloadUrl = await getDownloadURL(snapshot.ref);

        // Adaugă metadatele imaginii în Firestore
        await addDoc(collection(db, COLLECTIONS.GALLERY), {
            name: file.name,
            size: file.size,
            downloadUrl,
            storagePath,
        });
        await logAction('upload_image', `A încărcat imaginea: ${file.name}`);
    },

    async deleteUploadedImage(image: UploadedImage): Promise<void> {
        // Șterge fișierul din Firebase Storage
        const imageRef = ref(storage, image.storagePath);
        await deleteObject(imageRef);

        // Șterge documentul de metadate din Firestore
        await deleteDoc(doc(db, COLLECTIONS.GALLERY, image.id));
        await logAction('delete_image', `A șters imaginea: ${image.name}`);
    },

    // --- Altele: Alerte Stoc, Programări ---
    async addStockSubscription(email: string, vehicleId: string, model: string): Promise<void> {
        await addDoc(collection(db, COLLECTIONS.SUBSCRIPTIONS), {
            email, vehicleId, model, date: new Date().toISOString()
        });
    },

    async addBooking(bookingData: any): Promise<void> {
        await addDoc(collection(db, COLLECTIONS.BOOKINGS), bookingData);
    },
};


import React, { useState, useEffect } from 'react';
import type { VehicleReview } from '../types';
import { StarIcon } from './icons';
import { adminDataService } from '../utils/adminDataService';

interface VehicleReviewsProps {
    vehicleId: string; // ID-ul este acum string
    initialReviews: VehicleReview[]; // Păstrăm recenziile inițiale ca fallback
}

const VehicleReviews: React.FC<VehicleReviewsProps> = ({ vehicleId, initialReviews }) => {
    const [reviews, setReviews] = useState<VehicleReview[]>(initialReviews);
    const [isLoading, setIsLoading] = useState(true);
    const [newReview, setNewReview] = useState({ author: '', rating: 0, comment: '' });
    const [hoverRating, setHoverRating] = useState(0);

    // Funcție pentru a încărca recenziile din Firestore
    const loadReviews = async () => {
        if (!vehicleId) return;
        setIsLoading(true);
        try {
            const reviewsFromDb = await adminDataService.getReviewsForVehicle(vehicleId);
            setReviews(reviewsFromDb);
        } catch (error) {
            console.error(`Eroare la încărcarea recenziilor pentru vehiculul ${vehicleId}:`, error);
            // În caz de eroare, se păstrează recenziile inițiale
        } finally {
            setIsLoading(false);
        }
    };

    // Încarcă recenziile la montarea componentei sau la schimbarea ID-ului vehiculului
    useEffect(() => {
        loadReviews();
    }, [vehicleId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewReview({ ...newReview, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newReview.author && newReview.rating > 0 && newReview.comment) {
            try {
                // Adaugă noua recenzie în Firestore
                await adminDataService.addReviewForVehicle(vehicleId, {
                    author: newReview.author,
                    rating: newReview.rating,
                    comment: newReview.comment,
                });
                // Resetează formularul
                setNewReview({ author: '', rating: 0, comment: '' });
                // Reîncarcă lista de recenzii pentru a afișa adăugarea
                await loadReviews();
            } catch (error) {
                console.error("Eroare la adăugarea recenziei:", error);
                alert("A apărut o eroare la trimiterea recenziei.");
            }
        }
    };

    const inputClass = "w-full p-2 border border-border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white text-sm";
    const labelClass = "block text-xs font-medium text-muted dark:text-gray-400 mb-1";

    return (
        <div className="p-6 h-full overflow-y-auto">
            {/* Secțiunea de adăugare recenzie */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-border dark:border-gray-700 mb-8">
                <h3 className="font-bold text-lg text-text-main dark:text-white mb-4">Adaugă o recenzie</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Numele tău</label>
                            <input type="text" name="author" value={newReview.author} onChange={handleInputChange} className={inputClass} required />
                        </div>
                        <div>
                            <label className={labelClass}>Evaluare</label>
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <StarIcon
                                        key={star}
                                        className={`w-6 h-6 cursor-pointer transition-colors ${(hoverRating || newReview.rating) >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Comentariu</label>
                        <textarea name="comment" value={newReview.comment} onChange={handleInputChange} rows={3} className={inputClass} required></textarea>
                    </div>
                    <button type="submit" className="bg-primary text-white font-semibold px-6 py-2.5 rounded-btn hover:bg-primary-600 transition-colors">Trimite recenzia</button>
                </form>
            </div>
            
            {/* Lista de recenzii */}
            <h3 className="font-bold text-lg text-text-main dark:text-white mb-4">Recenzii clienți ({reviews.length})</h3>
            <div className="space-y-6">
                {isLoading ? (
                    <p className="text-sm text-muted">Se încarcă recenziile...</p>
                ) : reviews.length > 0 ? reviews.map((review, index) => (
                    <div key={index} className="border-b border-border dark:border-gray-700 pb-4">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold text-text-main dark:text-white">{review.author}</p>
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                        </div>
                        <p className="text-xs text-muted dark:text-gray-500 mt-1">{new Date(review.date).toLocaleDateString('ro-RO')}</p>
                        <p className="text-sm text-muted dark:text-gray-400 mt-2">{review.comment}</p>
                    </div>
                )) : (
                    <p className="text-sm text-muted dark:text-gray-400 text-center py-8">Acest vehicul nu are încă nicio recenzie. Fii primul care adaugă una!</p>
                )}
            </div>
        </div>
    );
};

export default VehicleReviews;

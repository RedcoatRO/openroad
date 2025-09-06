
import React, { useState, useEffect } from 'react';
import type { VehicleReview } from '../types';
import { StarIcon } from './icons';

interface VehicleReviewsProps {
    vehicleId: number;
    initialReviews: VehicleReview[];
}

const VehicleReviews: React.FC<VehicleReviewsProps> = ({ vehicleId, initialReviews }) => {
    // Starea pentru recenzii, inițializată din localStorage sau din props
    const [reviews, setReviews] = useState<VehicleReview[]>(() => {
        try {
            const savedReviews = localStorage.getItem(`reviews_${vehicleId}`);
            return savedReviews ? JSON.parse(savedReviews) : initialReviews;
        } catch (error) {
            console.error("Failed to parse reviews from localStorage", error);
            return initialReviews;
        }
    });

    // Starea pentru formularul de recenzie nouă
    const [newReview, setNewReview] = useState({ author: '', rating: 0, comment: '' });
    const [hoverRating, setHoverRating] = useState(0);

    // Efect pentru a salva recenziile în localStorage ori de câte ori se schimbă
    useEffect(() => {
        localStorage.setItem(`reviews_${vehicleId}`, JSON.stringify(reviews));
    }, [reviews, vehicleId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewReview({ ...newReview, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newReview.author && newReview.rating > 0 && newReview.comment) {
            const reviewToAdd: VehicleReview = {
                ...newReview,
                date: new Date().toISOString(),
            };
            setReviews(prev => [reviewToAdd, ...prev]);
            // Resetarea formularului
            setNewReview({ author: '', rating: 0, comment: '' });
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
                {reviews.length > 0 ? reviews.map((review, index) => (
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


import React, { useState, useEffect, useCallback } from 'react';
import { adminDataService } from '../../utils/adminDataService';
import { compressImage } from '../../utils/imageCompressor';
import { ImageIcon, XIcon } from '../../components/icons';
import type { UploadedImage } from '../../types'; // Importă tipul de imagine

const ImageGalleryPage: React.FC = () => {
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Funcție pentru a încărca imaginile din serviciul de date (Firestore)
    const loadImages = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await adminDataService.getUploadedImages();
            setImages(data);
        } catch (err) {
            console.error("Eroare la încărcarea imaginilor:", err);
            setError("Nu s-au putut încărca imaginile.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Încarcă imaginile la prima randare a componentei
    useEffect(() => {
        loadImages();
    }, [loadImages]);

    // Gestionează procesul de încărcare a unui fișier nou
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);

        try {
            // Comprimă imaginea pentru a optimiza stocarea și lățimea de bandă
            const compressedDataUrl = await compressImage(file, {
                maxSizeMB: 1.5,
                maxWidthOrHeight: 1920,
            });

            // Adaugă imaginea procesată în Firebase Storage și metadatele în Firestore
            await adminDataService.addUploadedImage(file, compressedDataUrl);
            
            // Reîncarcă lista de imagini pentru a afișa noua adăugare
            await loadImages();
        } catch (err: any) {
            console.error("Eroare la procesarea imaginii:", err);
            // Traducem erorile Firebase în mesaje prietenoase
            let errorMessage = "A apărut o eroare la încărcarea imaginii.";
            if (err.code) { // Verificăm dacă este o eroare Firebase
                 switch (err.code) {
                    case 'storage/unauthorized':
                        errorMessage = "Permisiuni insuficiente. Verificați regulile de securitate din Firebase Storage și configurația CORS.";
                        break;
                    case 'storage/canceled':
                        errorMessage = "Încărcarea a fost anulată.";
                        break;
                    case 'storage/bucket-not-found':
                         errorMessage = "Configurare greșită. 'storageBucket' din firebase.ts nu este corect.";
                         break;
                    case 'storage/unknown':
                        errorMessage = "Eroare de rețea sau server. Verificați conexiunea la internet.";
                        break;
                    default:
                        errorMessage = `Eroare necunoscută: ${err.message}`;
                }
            } else {
                 errorMessage = err.message || errorMessage;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
            event.target.value = '';
        }
    };

    // Gestionează ștergerea unei imagini
    const handleDelete = async (image: UploadedImage) => {
        if (window.confirm("Ești sigur că vrei să ștergi această imagine?")) {
            try {
                await adminDataService.deleteUploadedImage(image);
                await loadImages();
            } catch (err) {
                 console.error("Eroare la ștergerea imaginii:", err);
                 setError("Nu s-a putut șterge imaginea.");
            }
        }
    };

    // Copiază URL-ul imaginii în clipboard
    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(url).then(() => {
            alert("Link-ul imaginii a fost copiat în clipboard!");
        }, (err) => {
            console.error('Nu s-a putut copia textul: ', err);
            alert("Eroare la copierea link-ului.");
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-text-main flex items-center gap-3">
                <ImageIcon className="w-8 h-8"/>
                Galerie Ilustrații
            </h1>

            {/* Secțiunea de încărcare */}
            <div className="bg-white p-6 rounded-lg shadow-soft">
                <h2 className="text-lg font-semibold mb-4">Încarcă o imagine nouă</h2>
                <p className="text-sm text-muted mb-4">
                    Imaginile sunt comprimate și stocate online. Alege un fișier pentru a-l adăuga.
                </p>
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
                />
                {isLoading && <p className="text-sm text-primary mt-2">Se procesează imaginea...</p>}
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </div>

            {/* Galeria de imagini */}
            <div className="bg-white p-6 rounded-lg shadow-soft">
                 <h2 className="text-lg font-semibold mb-4">Imagini încărcate ({images.length})</h2>
                {isLoading && images.length === 0 ? (
                    <p className="text-center text-muted py-8">Se încarcă galeria...</p>
                ) : images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map(image => (
                            <div key={image.id} className="group relative border rounded-lg overflow-hidden">
                                <img src={image.downloadUrl} alt={image.name} className="w-full h-32 object-cover bg-gray-100" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col justify-between p-2">
                                    <button
                                        onClick={() => handleDelete(image)}
                                        className="self-end p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Șterge imaginea"
                                    >
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleCopyUrl(image.downloadUrl)}
                                        className="w-full bg-primary text-white text-xs font-semibold py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Copiază Link
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted py-8">Galeria este goală. Încarcă prima ta imagine.</p>
                )}
            </div>
        </div>
    );
};

export default ImageGalleryPage;

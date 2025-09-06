// utils/imageCompressor.ts

interface CompressOptions {
    maxSizeMB: number;
    maxWidthOrHeight: number;
    mimeType?: string;
    quality?: number;
}

/**
 * Comprimă un fișier de imagine direct în browser înainte de a-l salva.
 * Redimensionează imaginea la o dimensiune maximă și ajustează calitatea pentru a reduce dimensiunea fișierului.
 * @param file Fișierul de imagine (ex: de la un input[type=file]).
 * @param options Opțiuni de compresie, inclusiv dimensiunea maximă în MB și lățimea/înălțimea maximă în pixeli.
 * @returns O promisiune care se rezolvă cu imaginea comprimată sub formă de string Base64.
 * @throws O eroare dacă imaginea rezultată este încă prea mare sau dacă procesarea eșuează.
 */
export const compressImage = (file: File, options: CompressOptions): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); // Citește fișierul ca Data URL (Base64)

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                // 1. Logica de redimensionare
                // Păstrează proporțiile imaginii, asigurându-se că nici lățimea, nici înălțimea nu depășesc maxWidthOrHeight.
                if (width > height) {
                    if (width > options.maxWidthOrHeight) {
                        height *= options.maxWidthOrHeight / width;
                        width = options.maxWidthOrHeight;
                    }
                } else {
                    if (height > options.maxWidthOrHeight) {
                        width *= options.maxWidthOrHeight / height;
                        height = options.maxWidthOrHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error('Nu s-a putut obține contextul canvas pentru procesarea imaginii.'));
                }
                // Desenează imaginea redimensionată pe canvas
                ctx.drawImage(img, 0, 0, width, height);
                
                // 2. Logica de compresie
                // Convertește conținutul canvas-ului înapoi într-un Data URL, aplicând compresia.
                const mimeType = options.mimeType || 'image/jpeg'; // JPEG este ideal pentru compresie
                const quality = options.quality || 0.85; // O calitate de 85% oferă un echilibru bun
                
                const dataUrl = canvas.toDataURL(mimeType, quality);

                // 3. Validarea dimensiunii finale
                // Calculează dimensiunea aproximativă în bytes a string-ului Base64.
                const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
                const sizeInBytes = base64Length * (3 / 4);
                const sizeInMB = sizeInBytes / (1024 * 1024);

                if (sizeInMB > options.maxSizeMB) {
                    // Dacă imaginea este încă prea mare chiar și după compresie, aruncă o eroare.
                    return reject(new Error(`Imaginea este prea mare (${sizeInMB.toFixed(2)}MB) chiar și după compresie. Limita este ${options.maxSizeMB}MB. Vă rugăm alegeți o imagine mai mică sau mai puțin complexă.`));
                }
                
                // Rezolvă promisiunea cu imaginea procesată cu succes.
                resolve(dataUrl);
            };
            img.onerror = (error) => reject(new Error('A apărut o eroare la încărcarea imaginii pentru procesare.'));
        };
        reader.onerror = (error) => reject(new Error('A apărut o eroare la citirea fișierului de imagine.'));
    });
};

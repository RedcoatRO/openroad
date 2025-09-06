import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from './Image';

interface Vehicle360ViewerProps {
    frames: string[];
}

const Vehicle360Viewer: React.FC<Vehicle360ViewerProps> = ({ frames }) => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(0);
    const dragStartXRef = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Pre-încărcarea imaginilor pentru a asigura o tranziție fluidă
    useEffect(() => {
        setIsLoading(true);
        setLoadedImages(0);
        let loadedCount = 0;
        
        frames.forEach((src) => {
            const img = new window.Image();
            img.src = src;
            img.onload = () => {
                loadedCount++;
                setLoadedImages(loadedCount);
                if (loadedCount === frames.length) {
                    setIsLoading(false);
                }
            };
        });
    }, [frames]);
    
    // Funcție pentru a calcula noul index al cadrului pe baza mișcării
    const updateFrame = useCallback((currentX: number) => {
        if (!containerRef.current) return;
        
        const sensitivity = 2; // O valoare mai mare înseamnă o rotație mai lentă
        const dx = currentX - dragStartXRef.current;
        const frameChange = Math.floor(dx / (containerRef.current.offsetWidth / (frames.length / sensitivity)));

        if (frameChange !== 0) {
            // Se calculează noul index, asigurând că rămâne în limite (0 to frames.length - 1)
            let nextFrame = (currentFrame - frameChange + frames.length) % frames.length;
            setCurrentFrame(nextFrame);
            // Se resetează punctul de start pentru o mișcare continuă
            dragStartXRef.current = currentX;
        }
    }, [currentFrame, frames.length]);

    // Handlere pentru evenimentele de mouse
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        dragStartXRef.current = e.clientX;
        e.preventDefault();
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) {
            updateFrame(e.clientX);
        }
    }, [isDragging, updateFrame]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Handlere pentru evenimentele de touch
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setIsDragging(true);
        dragStartXRef.current = e.touches[0].clientX;
    };
    
    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (isDragging) {
            updateFrame(e.touches[0].clientX);
        }
    }, [isDragging, updateFrame]);

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
    }, []);
    
    // Adăugarea și eliminarea event listener-ilor globali pentru mousemove și mouseup
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleTouchEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    return (
        <div 
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center touch-none select-none overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 z-20">
                    <div className="text-muted dark:text-gray-400">Se încarcă vizualizarea 360°...</div>
                    <div className="w-1/2 mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(loadedImages / frames.length) * 100}%` }}></div>
                    </div>
                     <div className="text-xs mt-1 text-muted dark:text-gray-500">{loadedImages} / {frames.length}</div>
                </div>
            )}
            
            {/* Afișează toate imaginile, dar doar cea curentă este vizibilă */}
            {frames.map((src, index) => (
                <Image
                    key={index}
                    src={src}
                    alt={`Vehicul, unghi ${index + 1}`}
                    className={`absolute w-full h-full object-contain transition-opacity duration-100 ${index === currentFrame ? 'opacity-100' : 'opacity-0'}`}
                    draggable="false"
                />
            ))}
             <div className="absolute bottom-4 text-xs bg-black/50 text-white px-3 py-1 rounded-full">
                Trageți pentru a roti imaginea
            </div>
        </div>
    );
};

export default Vehicle360Viewer;

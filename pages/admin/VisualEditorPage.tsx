
import React, { useState, useEffect, useRef } from 'react';
import { adminDataService } from '../../utils/adminDataService';
import type { Testimonial } from '../../types';
import { PaletteIcon, XIcon } from '../../components/icons';
import Image from '../../components/Image';

// Componenta pentru panoul de editare a unui element (text sau imagine)
const EditPanel: React.FC<{
    element: { id: string; type: 'text' | 'image'; content: string };
    onSave: (id: string, newContent: string) => void;
    onClose: () => void;
}> = ({ element, onSave, onClose }) => {
    const [content, setContent] = useState(element.content);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Actualizează starea internă dacă elementul selectat se schimbă
    useEffect(() => {
        setContent(element.content);
    }, [element]);

    const handleSave = () => {
        onSave(element.id, content);
    };

    // Gestionează încărcarea unei imagini noi și o convertește în Base64
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setContent(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg border space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm">Editare: <code className="bg-gray-100 p-1 rounded text-xs">{element.id}</code></h3>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><XIcon className="w-4 h-4"/></button>
            </div>
            {element.type === 'text' ? (
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded-md text-sm"
                />
            ) : (
                <div className="space-y-2">
                    <img src={content} alt="Preview" className="max-h-40 rounded-md border" />
                    <button onClick={() => fileInputRef.current?.click()} className="w-full text-sm bg-gray-200 py-2 rounded-md hover:bg-gray-300">Încarcă imagine nouă</button>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                </div>
            )}
            <button onClick={handleSave} className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary-600">Salvează</button>
        </div>
    );
};

// Componenta pentru managementul testimonialelor
const TestimonialManager: React.FC<{ onContentUpdate: () => void }> = ({ onContentUpdate }) => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    
    useEffect(() => {
        setTestimonials(adminDataService.getTestimonials());
    }, []);

    const handleSave = () => {
        adminDataService.updateTestimonials(testimonials);
        alert('Testimonialele au fost salvate!');
        onContentUpdate(); // Notifică părintele să reîncarce iframe-ul
    };

    const handleFieldChange = (index: number, field: keyof Testimonial, value: string) => {
        const newTestimonials = [...testimonials];
        newTestimonials[index] = { ...newTestimonials[index], [field]: value };
        setTestimonials(newTestimonials);
    };

    const addTestimonial = () => {
        setTestimonials([...testimonials, { quote: '', author: '', role: '', company: '' }]);
    };
    
    const removeTestimonial = (index: number) => {
        setTestimonials(testimonials.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg border space-y-4">
            <h3 className="font-semibold text-lg">Management Testimoniale</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto p-2">
                {testimonials.map((t, index) => (
                    <div key={index} className="p-3 border rounded-md space-y-2 relative">
                        <button onClick={() => removeTestimonial(index)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-full"><XIcon className="w-4 h-4"/></button>
                        <textarea value={t.quote} onChange={e => handleFieldChange(index, 'quote', e.target.value)} placeholder="Citat" rows={3} className="w-full p-2 border rounded-md text-sm" />
                        <input type="text" value={t.author} onChange={e => handleFieldChange(index, 'author', e.target.value)} placeholder="Autor" className="w-full p-2 border rounded-md text-sm" />
                        <input type="text" value={t.role} onChange={e => handleFieldChange(index, 'role', e.target.value)} placeholder="Rol" className="w-full p-2 border rounded-md text-sm" />
                        <input type="text" value={t.company} onChange={e => handleFieldChange(index, 'company', e.target.value)} placeholder="Companie" className="w-full p-2 border rounded-md text-sm" />
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <button onClick={addTestimonial} className="bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 text-sm">Adaugă</button>
                <button onClick={handleSave} className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-600 text-sm">Salvează</button>
            </div>
        </div>
    );
};

// Componenta principală a paginii Editorului Vizual
const VisualEditorPage: React.FC = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isIframeReady, setIsIframeReady] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingElement, setEditingElement] = useState<{ id: string; type: 'text' | 'image'; content: string } | null>(null);

    // Ascultă mesajele venite de la iframe (site-ul public)
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, payload } = event.data;
            if (type === 'FL_PRO_IFRAME_READY') {
                setIsIframeReady(true);
            } else if (type === 'FL_PRO_ELEMENT_CLICKED') {
                setEditingElement(payload);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Funcția de reîncărcare a iframe-ului pentru a afișa modificările
    const reloadIframe = () => {
        if (iframeRef.current) {
            iframeRef.current.src = iframeRef.current.src;
        }
    };
    
    // Activează/dezactivează modul de editare și trimite mesaj către iframe
    const toggleEditMode = () => {
        if (!isIframeReady) {
            alert("Previzualizarea nu este încă încărcată. Vă rugăm așteptați.");
            return;
        }
        const newMode = !isEditMode;
        setIsEditMode(newMode);
        if (newMode) {
            iframeRef.current?.contentWindow?.postMessage({ type: 'FL_PRO_EDIT_MODE' }, '*');
        } else {
            reloadIframe(); // Reîncarcă iframe-ul pentru a ieși curat din modul de editare
            setEditingElement(null);
        }
    };
    
    // Salvează modificarea unui element
    const handleSaveElement = (id: string, newContent: string) => {
        adminDataService.setContentOverride(id, newContent);
        // Trimite mesaj către iframe pentru actualizare în timp real
        iframeRef.current?.contentWindow?.postMessage({
            type: 'FL_PRO_UPDATE_CONTENT',
            payload: { id, content: newContent }
        }, '*');
        setEditingElement(null);
    };

    return (
        <div className="flex h-full -m-4 sm:-m-6 lg:-m-8">
            {/* Panoul de control din stânga */}
            <aside className="w-80 bg-bg-admin-alt border-r p-4 space-y-4 flex-shrink-0 flex flex-col">
                <h1 className="text-xl font-semibold text-text-main flex items-center gap-2"><PaletteIcon /> Editor Vizual</h1>
                
                <button
                    onClick={toggleEditMode}
                    className={`w-full font-semibold py-2.5 rounded-lg text-white transition-colors ${isEditMode ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-600'}`}
                >
                    {isEditMode ? 'Oprește Editarea' : 'Activează Editarea'}
                </button>
                
                {isEditMode && !editingElement && (
                    <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                        Navighează în fereastra din dreapta și dă click pe un text sau o imagine pentru a le modifica.
                    </div>
                )}
                
                {editingElement && (
                    <EditPanel 
                        element={editingElement}
                        onSave={handleSaveElement}
                        onClose={() => setEditingElement(null)}
                    />
                )}

                <div className="flex-grow pt-4 border-t overflow-y-auto">
                    <TestimonialManager onContentUpdate={reloadIframe} />
                    {/* Managementul partenerilor poate fi adăugat aici într-un mod similar */}
                </div>
            </aside>

            {/* Iframe pentru previzualizarea site-ului */}
            <main className="flex-1 bg-gray-300">
                <iframe
                    ref={iframeRef}
                    src="/"
                    title="Previzualizare Site"
                    className="w-full h-full border-0"
                />
            </main>
        </div>
    );
};

export default VisualEditorPage;


import React, { useState, useEffect, useRef } from 'react';
import { adminDataService } from '../../utils/adminDataService';
import type { Testimonial } from '../../types';
import { PaletteIcon, XIcon } from '../../components/icons';

// Componenta pentru panoul de editare a unui element (text sau imagine)
const EditPanel: React.FC<{
    element: { id: string; type: 'text' | 'image'; content: string };
    onSave: (id: string, newContent: string) => void;
    onClose: () => void;
}> = ({ element, onSave, onClose }) => {
    // Starea internă pentru conținutul elementului (text sau URL imagine)
    const [content, setContent] = useState(element.content);

    // Actualizează starea internă dacă elementul selectat se schimbă
    useEffect(() => {
        setContent(element.content);
    }, [element]);

    const handleSave = () => {
        // Salvează noul conținut (text sau URL)
        onSave(element.id, content);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg border space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm">Editare: <code className="bg-gray-100 p-1 rounded text-xs">{element.id}</code></h3>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><XIcon className="w-4 h-4"/></button>
            </div>
            {element.type === 'text' ? (
                // Câmp de text pentru editarea textelor
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded-md text-sm"
                />
            ) : (
                // Interfață nouă pentru editarea imaginilor prin URL
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">URL Imagine</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={3}
                        className="w-full p-2 border rounded-md text-sm font-mono"
                        placeholder="https://exemplu.com/imagine.jpg sau data:image/..."
                    />
                    <p className="text-xs text-muted">
                        Lipește un link direct către o imagine sau folosește un link din Galeria de Ilustrații.
                    </p>
                    {/* Previzualizare imagine, dacă URL-ul este valid */}
                    {content && (
                        <div>
                            <p className="text-xs font-medium text-gray-600 mb-1">Previzualizare:</p>
                            <img src={content} alt="Previzualizare" className="max-h-24 w-full object-contain rounded-md border bg-gray-50" />
                        </div>
                    )}
                </div>
            )}
            <button 
                onClick={handleSave} 
                className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary-600"
            >
                Salvează
            </button>
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

// Lista de pagini disponibile pentru editare
const editablePages = [
    { name: 'Acasă', path: '/' },
    { name: 'Despre noi', path: '/#/despre-noi' },
    { name: 'Servicii', path: '/#/servicii' },
    { name: 'Leasing Operațional', path: '/#/servicii/leasing-operational' },
    { name: 'Închiriere Termen Lung', path: '/#/servicii/inchiriere-termen-lung' },
];

// Componenta principală a paginii Editorului Vizual
const VisualEditorPage: React.FC = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isIframeReady, setIsIframeReady] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingElement, setEditingElement] = useState<{ id: string; type: 'text' | 'image'; content: string } | null>(null);
    const [currentPage, setCurrentPage] = useState(editablePages[0].path);

    // Ascultă mesajele venite de la iframe (site-ul public)
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, payload } = event.data;
            if (type === 'FL_PRO_IFRAME_READY') {
                setIsIframeReady(true);
                // Dacă modul de editare este deja activ, îl reactivăm pentru noua pagină
                if (isEditMode) {
                    iframeRef.current?.contentWindow?.postMessage({ type: 'FL_PRO_EDIT_MODE' }, '*');
                }
            } else if (type === 'FL_PRO_ELEMENT_CLICKED') {
                setEditingElement(payload);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [isEditMode]); // Adăugăm isEditMode ca dependență

    // Funcția de reîncărcare a iframe-ului pentru a afișa modificările
    const reloadIframe = (forceReload: boolean = false) => {
        if (iframeRef.current) {
            // Reîncărcarea forțată este necesară după salvarea datelor structurate (ex: testimoniale)
            if (forceReload) {
                iframeRef.current.src = iframeRef.current.src;
            }
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
            reloadIframe(true); // Reîncarcă iframe-ul pentru a ieși curat din modul de editare
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
    
    // Schimbă pagina afișată în iframe
    const handlePageChange = (path: string) => {
        if (iframeRef.current) {
            setIsIframeReady(false); // Resetează starea 'ready' la schimbarea paginii
            setEditingElement(null); // Închide panoul de editare
            iframeRef.current.src = path;
            setCurrentPage(path);
        }
    };

    return (
        <div className="flex h-full -m-4 sm:-m-6 lg:-m-8">
            {/* Panoul de control din stânga */}
            <aside className="w-80 bg-bg-admin-alt border-r p-4 space-y-4 flex-shrink-0 flex flex-col">
                <h1 className="text-xl font-semibold text-text-main flex items-center gap-2"><PaletteIcon /> Editor Vizual</h1>
                
                {/* Selector de pagină */}
                <div>
                    <label className="text-sm font-medium">Editează Pagina:</label>
                    <select
                        value={currentPage}
                        onChange={(e) => handlePageChange(e.target.value)}
                        className="w-full p-2 mt-1 border rounded-md"
                    >
                        {editablePages.map(page => (
                            <option key={page.path} value={page.path}>{page.name}</option>
                        ))}
                    </select>
                </div>

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

                {/* Afișează managerul de testimoniale doar pe pagina Acasă */}
                {currentPage === '/' && (
                    <div className="flex-grow pt-4 border-t overflow-y-auto">
                        <TestimonialManager onContentUpdate={() => reloadIframe(true)} />
                    </div>
                )}
            </aside>

            {/* Iframe pentru previzualizarea site-ului */}
            <main className="flex-1 bg-gray-300">
                <iframe
                    ref={iframeRef}
                    src={currentPage}
                    title="Previzualizare Site"
                    className="w-full h-full border-0"
                />
            </main>
        </div>
    );
};

export default VisualEditorPage;
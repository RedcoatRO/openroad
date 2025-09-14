
import React, { useState, useEffect, useCallback } from 'react';
import { adminDataService } from '../../utils/adminDataService';
import { fallbackLogoUri } from '../../utils/siteData';

interface GlobalSettingsPanelProps {
    onContentUpdate: () => void;
}

const GlobalSettingsPanel: React.FC<GlobalSettingsPanelProps> = ({ onContentUpdate }) => {
    const [logoUrl, setLogoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const loadLogoUrl = useCallback(async () => {
        setIsLoading(true);
        try {
            const content = await adminDataService.getContentOverrides();
            setLogoUrl(content['site-logo'] || fallbackLogoUri);
        } catch (error) {
            console.error("Failed to load logo URL:", error);
            setLogoUrl(fallbackLogoUri); // Use fallback on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLogoUrl();
    }, [loadLogoUrl]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await adminDataService.setContentOverride('site-logo', logoUrl);
            alert('Logo-ul a fost salvat cu succes!');
            // Trigger a full refresh of the parent to reload the iframe and show changes
            onContentUpdate();
        } catch (error) {
            console.error("Failed to save logo URL:", error);
            alert('A apărut o eroare la salvarea logo-ului.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg border space-y-4">
            <h3 className="font-semibold text-lg">Setări Globale</h3>
            
            {isLoading ? (
                <p>Se încarcă setările...</p>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL Logo Site
                        </label>
                        <textarea
                            value={logoUrl}
                            onChange={(e) => setLogoUrl(e.target.value)}
                            rows={3}
                            className="w-full p-2 border rounded-md text-sm font-mono"
                            placeholder="https://.../logo.png"
                        />
                         <p className="text-xs text-muted mt-1">
                            Lipește un link din Galeria de Ilustrații. Dimensiune recomandată: <strong>190x32 pixeli</strong>.
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Previzualizare:</p>
                        <div className="p-4 bg-gray-100 border rounded-md flex items-center justify-center">
                            <img 
                                src={logoUrl} 
                                alt="Previzualizare Logo" 
                                className="h-8 w-auto" 
                                onError={(e) => (e.currentTarget.src = fallbackLogoUri)} // Fallback if the URL is broken
                            />
                        </div>
                    </div>
                </div>
            )}

            <button 
                onClick={handleSave} 
                disabled={isSaving || isLoading}
                className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary-600 disabled:bg-gray-400"
            >
                {isSaving ? 'Se salvează...' : 'Salvează Logo'}
            </button>
        </div>
    );
};

export default GlobalSettingsPanel;

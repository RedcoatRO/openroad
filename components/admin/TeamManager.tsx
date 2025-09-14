import React, { useState, useEffect, useCallback } from 'react';
import { adminDataService } from '../../utils/adminDataService';
import type { TeamMember } from '../../types';
import { XIcon } from '../icons';

interface TeamManagerProps {
    onContentUpdate: () => void;
}

const TeamManager: React.FC<TeamManagerProps> = ({ onContentUpdate }) => {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const loadTeam = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await adminDataService.getTeamMembers();
            setTeam(data);
        } catch (error) {
            console.error("Failed to load team members:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTeam();
    }, [loadTeam]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await adminDataService.updateTeamMembers(team);
            alert('Membrii echipei au fost salvați!');
            onContentUpdate();
        } catch (error) {
            console.error("Failed to save team members:", error);
            alert('A apărut o eroare la salvare.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFieldChange = (index: number, field: keyof TeamMember, value: string) => {
        const newTeam = [...team];
        newTeam[index] = { ...newTeam[index], [field]: value };
        setTeam(newTeam);
    };

    const addMember = () => {
        setTeam([...team, { name: '', role: '', quote: '', image: '' }]);
    };
    
    const removeMember = (index: number) => {
        if (window.confirm("Sunteți sigur că doriți să eliminați acest membru?")) {
            setTeam(team.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg border space-y-4">
            <h3 className="font-semibold text-lg">Management Echipă</h3>
            {isLoading ? <p>Se încarcă...</p> : (
                 <div className="space-y-4 max-h-96 overflow-y-auto p-2">
                    {team.map((member, index) => (
                        <div key={index} className="p-3 border rounded-md space-y-2 relative bg-gray-50">
                            <button onClick={() => removeMember(index)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full"><XIcon className="w-4 h-4"/></button>
                            <input type="text" value={member.name} onChange={e => handleFieldChange(index, 'name', e.target.value)} placeholder="Nume" className="w-full p-2 border rounded-md text-sm" />
                            <input type="text" value={member.role} onChange={e => handleFieldChange(index, 'role', e.target.value)} placeholder="Rol" className="w-full p-2 border rounded-md text-sm" />
                            <input type="text" value={member.image} onChange={e => handleFieldChange(index, 'image', e.target.value)} placeholder="URL Imagine" className="w-full p-2 border rounded-md text-sm" />
                            <textarea value={member.quote} onChange={e => handleFieldChange(index, 'quote', e.target.value)} placeholder="Citat" rows={2} className="w-full p-2 border rounded-md text-sm" />
                        </div>
                    ))}
                </div>
            )}
            <div className="flex gap-2">
                <button onClick={addMember} className="bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 text-sm">Adaugă Membru</button>
                <button onClick={handleSave} disabled={isSaving} className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-600 text-sm disabled:bg-gray-400">
                    {isSaving ? 'Se salvează...' : 'Salvează Modificările'}
                </button>
            </div>
        </div>
    );
};

export default TeamManager;

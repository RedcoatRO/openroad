
import React, { useState, useEffect, useCallback } from 'react';
import { adminDataService } from '../../utils/adminDataService';
import type { User, UserRole } from '../../types';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await adminDataService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Eroare la încărcarea utilizatorilor:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            try {
                await adminDataService.updateUser({ ...user, role: newRole });
                await loadUsers(); // Reîncarcă lista pentru a reflecta modificarea
            } catch (error) {
                console.error("Eroare la actualizarea rolului:", error);
            }
        }
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
    };

    const confirmDelete = async () => {
        if (userToDelete) {
            try {
                await adminDataService.deleteUser(userToDelete.id);
                setUserToDelete(null);
                await loadUsers(); // Reîncarcă lista după ștergere
            } catch (error) {
                console.error("Eroare la ștergerea utilizatorului:", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-text-main">Management Utilizatori</h1>

            <div className="bg-white p-6 rounded-lg shadow-soft overflow-x-auto">
                {isLoading ? (
                    <div className="text-center py-8">Se încarcă utilizatorii...</div>
                ) : (
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Nume</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Rol</th>
                                <th className="px-6 py-3">Ultimul Login</th>
                                <th className="px-6 py-3">Acțiuni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                            className="p-1.5 text-xs font-semibold rounded-md border bg-gray-50"
                                        >
                                            <option>Admin</option>
                                            <option>Manager Vânzări</option>
                                            <option>Operator</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">{new Date(user.lastLogin).toLocaleString('ro-RO')}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleDeleteClick(user)} className="text-red-600 hover:underline font-medium">Șterge</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {userToDelete && (
                <ConfirmDeleteModal
                    isOpen={!!userToDelete}
                    onClose={() => setUserToDelete(null)}
                    onConfirm={confirmDelete}
                    itemName={userToDelete.name}
                />
            )}
        </div>
    );
};

export default UserManagementPage;

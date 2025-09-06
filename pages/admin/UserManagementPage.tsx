
import React, { useState, useEffect } from 'react';
import { adminDataService } from '../../utils/adminDataService';
import type { User, UserRole } from '../../types';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    useEffect(() => {
        setUsers(adminDataService.getUsers());
    }, []);

    const handleRoleChange = (userId: number, newRole: UserRole) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            adminDataService.updateUser({ ...user, role: newRole });
            setUsers(adminDataService.getUsers());
        }
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            adminDataService.deleteUser(userToDelete.id);
            setUsers(adminDataService.getUsers());
            setUserToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-text-main">Management Utilizatori</h1>

            <div className="bg-white p-6 rounded-lg shadow-soft overflow-x-auto">
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

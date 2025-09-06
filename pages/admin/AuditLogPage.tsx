
import React, { useState, useEffect } from 'react';
import { adminDataService } from '../../utils/adminDataService';
import type { AuditLogEntry } from '../../types';
import { HistoryIcon } from '../../components/icons';

const AuditLogPage: React.FC = () => {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);

    useEffect(() => {
        setLogs(adminDataService.getLogs());
    }, []);

    const getActionStyle = (action: string) => {
        if (action.includes('add')) return 'bg-green-100 text-green-800';
        if (action.includes('update')) return 'bg-yellow-100 text-yellow-800';
        if (action.includes('delete')) return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-text-main flex items-center gap-3">
                <HistoryIcon className="w-8 h-8"/>
                Istoric Modificări (Audit Log)
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-soft overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Dată și Oră</th>
                            <th className="px-6 py-3">Utilizator</th>
                            <th className="px-6 py-3">Acțiune</th>
                            <th className="px-6 py-3">Detalii</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(log.timestamp).toLocaleString('ro-RO')}</td>
                                <td className="px-6 py-4">{log.user}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionStyle(log.action)}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-800">{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogPage;


import React from 'react';
import { NavLink } from 'react-router-dom';
import { UsersIcon, LineChartIcon, HistoryIcon, PaletteIcon, ExternalLinkIcon, ImageIcon } from '../icons'; // Am adăugat iconițe noi
import { fallbackLogoUri } from '../../utils/siteData';

interface SidebarProps {
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
}

// Am adăugat un link către site-ul public și am structurat item-urile
// pentru a gestiona mai bine starea 'activă' a link-ului.
const navItems = [
    { to: '/', label: 'Mergi la Site', icon: <ExternalLinkIcon className="w-4 h-4 mr-3" />, end: true },
    { to: '/admin', label: 'Panou general', end: true },
    { to: '/admin/autoturisme', label: 'Autoturisme' },
    { to: '/admin/solicitari', label: 'Solicitări' },
    { to: '/admin/clienti', label: 'Clienți', icon: <UsersIcon className="w-4 h-4 mr-3" /> },
    { to: '/admin/utilizatori', label: 'Utilizatori' },
    { to: '/admin/continut', label: 'Conținut' },
    { to: '/admin/editor-vizual', label: 'Editor Vizual', icon: <PaletteIcon className="w-4 h-4 mr-3" /> },
    { to: '/admin/ilustratii', label: 'Galerie Ilustrații', icon: <ImageIcon className="w-4 h-4 mr-3" /> },
    { to: '/admin/rapoarte', label: 'Rapoarte', icon: <LineChartIcon className="w-4 h-4 mr-3" /> },
    { to: '/admin/istoric', label: 'Istoric Modificări', icon: <HistoryIcon className="w-4 h-4 mr-3" /> },
];

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
    return (
        <>
            <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
        
            <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-border z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex-shrink-0`}>
                <div className="p-6">
                    <img src={fallbackLogoUri} alt="Open Road Leasing Logo" className="h-8 w-auto" />
                </div>
                <nav className="mt-6 px-4">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.to}>
                                <NavLink 
                                    to={item.to}
                                    end={item.end} // Folosim proprietatea 'end' pentru a asigura potrivirea exactă a rutei
                                    className={({ isActive }) => `flex items-center px-4 py-2.5 my-1 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'text-muted hover:bg-gray-100 hover:text-text-main'}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    {item.icon}
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
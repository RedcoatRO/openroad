import React from 'react';
import { NavLink } from 'react-router-dom';
import { Logo, UsersIcon, LineChartIcon, HistoryIcon, HomeIcon } from '../icons'; // Am adăugat HomeIcon

interface SidebarProps {
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
}

// Am actualizat item-urile de navigare pentru a reflecta noile pagini
const navItems = [
    { to: '/admin', label: 'Panou general' },
    { to: '/admin/autoturisme', label: 'Autoturisme' },
    { to: '/admin/solicitari', label: 'Solicitări' },
    { to: '/admin/clienti', label: 'Clienți', icon: <UsersIcon className="w-4 h-4 mr-3" /> },
    { to: '/admin/utilizatori', label: 'Utilizatori' },
    { to: '/admin/continut', label: 'Conținut' },
    { to: '/admin/rapoarte', label: 'Rapoarte', icon: <LineChartIcon className="w-4 h-4 mr-3" /> },
    { to: '/admin/istoric', label: 'Istoric Modificări', icon: <HistoryIcon className="w-4 h-4 mr-3" /> },
];

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
    return (
        <>
            <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
        
            <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-border z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex-shrink-0 flex flex-col`}>
                <div>
                    <div className="p-6">
                        <Logo />
                    </div>
                    <nav className="mt-6 px-4">
                        <ul>
                            {navItems.map(item => (
                                <li key={item.to}>
                                    <NavLink 
                                        to={item.to}
                                        end={item.to === '/admin'}
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
                </div>
                 {/* Butonul de întoarcere la site, poziționat în partea de jos */}
                <div className="mt-auto p-4 border-t border-border">
                    <NavLink
                        to="/"
                        className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-muted hover:bg-gray-100 hover:text-text-main transition-colors"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <HomeIcon className="w-4 h-4 mr-3" />
                        Înapoi la site
                    </NavLink>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

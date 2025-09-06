
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../Image';
import { AuthContext } from '../../contexts/AuthContext';

interface TopbarProps {
    onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const handleLogout = () => {
        if (auth) {
            auth.logout();
            navigate('/admin/login');
        }
    };

    return (
        <header className="bg-white border-b border-border p-4 flex justify-between items-center flex-shrink-0">
            {/* Hamburger for mobile */}
            <button onClick={onMenuClick} className="lg:hidden text-muted p-2">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            
            <div className="hidden md:block w-1/3">
                 {/* Search bar can be added here */}
            </div>

            <div className="flex items-center space-x-4">
                <button className="text-muted relative p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="relative">
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2">
                        <Image 
                            className="h-8 w-8 rounded-full object-cover" 
                            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&h=100&fit=crop&fm=jpg" 
                            alt="Admin avatar" />
                        <span className="hidden sm:inline text-sm font-medium text-text-main">Admin</span>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-border">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Deconectare
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;

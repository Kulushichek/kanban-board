import { useNavigate } from 'react-router-dom';
import ProfileModal from './ProfileModal';
import { useState } from 'react';

export default function Header() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'User';
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <header className="max-w-[1096px] w-full mx-auto bg-white rounded-[20px] shadow-board px-6 py-3 flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
                <div className="flex gap-1">
                    <div className="w-3 h-5 bg-purple-400 rounded-sm"></div>
                    <div className="w-3 h-5 bg-pink-200 rounded-sm"></div>
                </div>
                <span className="text-[#632289] font-semibold text-lg">My boards</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div
                        onClick={() => setIsProfileModalOpen(true)}
                        className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 cursor-pointer hover:bg-blue-200 transition-colors shadow-sm"
                        title="Profile settings"
                    >
                        {username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-600 font-medium hidden sm:block">{username}</span>
                </div>

                <button
                    onClick={handleLogout}
                    className="bg-[#F8E5F0] hover:bg-[#F0D4E4] text-[#8C528A] px-6 py-2 rounded-full font-medium transition-colors"
                >Log out
                </button>
            </div>
            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </header>
    )
}
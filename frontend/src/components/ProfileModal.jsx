import { useState } from 'react';
import api from '../api/axios';

export default function ProfileModal({ isOpen, onClose }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const userId = localStorage.getItem('userId');

    if (!isOpen) return null;

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        try {
            await api.put(`/users/${userId}/change-password`, {
                old_password: oldPassword,
                new_password: newPassword
            });

            setSuccessMsg('The password has been successfully changed!');

            setTimeout(() => {
                handleClose();
            }, 2000);

        } catch (error) {
            console.error('Password change error:', error);

            const responseData = error.response?.data;
            let errorMessage = 'Incorrect old password or server error.';

            if (responseData?.details && responseData.details.length > 0) {
                errorMessage = responseData.details[0].message;
            }
            else if (responseData?.detail) {
                errorMessage = responseData.detail;
            }

            setErrorMsg(errorMessage);
        }
    };

    const handleClose = () => {
        setOldPassword('');
        setNewPassword('');
        setErrorMsg('');
        setSuccessMsg('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-[#5B4A82]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-[400px] rounded-[24px] shadow-2xl p-8 relative">

                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-[#E61383] transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <h2 className="text-2xl font-bold text-[#5B4A82] mb-6 text-center">Change Password</h2>

                <form onSubmit={handleChangePassword} className="flex flex-col gap-4">

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-[#9DB2F5] px-1">Old Password</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Enter current password"
                            required
                            className="w-full bg-[#9DB2F5]/10 rounded-[12px] px-4 py-3 text-[#632289] text-sm outline-none border border-transparent focus:border-[#9DB2F5] transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-[#9DB2F5] px-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                            className="w-full bg-[#9DB2F5]/10 rounded-[12px] px-4 py-3 text-[#632289] text-sm outline-none border border-transparent focus:border-[#9DB2F5] transition-colors"
                        />
                    </div>

                    {errorMsg && (
                        <p className="text-red-500 text-sm text-center font-medium">
                            {errorMsg}
                        </p>
                    )}
                    {successMsg && (
                        <p className="text-green-500 text-sm text-center font-medium">
                            {successMsg}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2 rounded-full font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!oldPassword || !newPassword}
                            className="bg-gradient-to-r from-[#A85EAA] to-[#DD6DBC] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2 rounded-full font-medium transition-all shadow-md"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
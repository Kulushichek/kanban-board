import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userRegIcon from '../assets/userRegisterIcon.png';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
    const navigate = useNavigate();

    // Три ячейки памяти
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const getErrorMessage = (error, defaultMsg) => {
        const responseData = error?.response?.data;

        if (responseData?.details && responseData.details.length > 0) {
            let msg = responseData.details[0].message;
            return msg;
        }

        if (responseData?.detail) return responseData.detail;
        return defaultMsg;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            const response = await api.post('/users/create', {
                email: email,
                password: password,
                username: username
            });
            localStorage.setItem('userId', response.data.id);
            localStorage.setItem('username', username);
            navigate('/');

        } catch (error) {
            console.error('Error during registration:', error);
            const errorMsg = getErrorMessage(error, 'Failed to register.');
            setErrorMsg(errorMsg);
        }
    };

    return (
        <AuthLayout
            title="Create Account"
            icon={userRegIcon}
            footerText="Already have an account?"
            footerButtonText="Sign in"
            onFooterClick={() => navigate('/login')}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />

                {errorMsg && (
                    <p className="text-red-500 text-sm text-center font-medium">
                        {errorMsg}
                    </p>
                )}

                <button
                    type="submit"
                    className="self-center px-12 bg-[#6564AF] hover:bg-[#4745B3] text-white font-semibold py-2 rounded-md transition-colors mt-2"
                >
                    Create account
                </button>
            </form>
        </AuthLayout>
    )
}
import { useState } from 'react';
import userIcon from '../assets/userIcon.png';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';

import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        e.preventDefault(); // Запрещаем страничке перезагружаться
        setErrorMsg('');

        try {
            const response = await api.post('/users/login', {
                email: email,
                password: password
            });
            const userData = response.data;

            dispatch(setUser({
                userId: userData.id,
                userName: userData.username
            }));

            // Перекидываем на главную страницу
            navigate('/');
        }
        catch (error) {
            console.error('Login error:', error);
            const errorMsg = getErrorMessage(error, "Invalid email or password!");
            setErrorMsg(errorMsg);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            icon={userIcon}
            footerText="Don't have an account?"
            footerButtonText="Create account"
            onFooterClick={() => navigate('/register')}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                    maxLength={72}
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
                    Sign in
                </button>
            </form>
        </AuthLayout>
    )
}
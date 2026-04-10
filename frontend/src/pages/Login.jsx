import { useState } from 'react';
import userIcon from '../assets/userIcon.png';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Запрещаем страничке перезагружаться
        try {
            const response = await api.post('/users/login', {
                email: email,
                password: password
            });
            const userData = response.data;

            // Сохраняем идентификатор пользователя
            localStorage.setItem('userId', userData.id);
            localStorage.setItem('username', userData.username);

            // Перекидываем на главную страницу
            navigate('/');
        }
        catch (error) {
            console.error('Ошибка входа:', error);
            alert('Неверная почта или пароль!');
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
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
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
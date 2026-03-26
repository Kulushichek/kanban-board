import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userRegIcon from '../assets/userRegisterIcon.png';
import api from '../api/axios';

export default function Register() {
    const navigate = useNavigate();

    // Три ячейки памяти
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/users/create', {
                email: email,
                password: password,
                username: username
            });
            navigate('/login');

        } catch (error) {
            console.error('Ошибка сервера:', error);
            alert('Не удалось зарегистрироваться. Возможно, такой Email уже есть.');
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">

            {/* Сама карточка*/}
            <div className="w-[350px] bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Верхняя часть*/}
                <div className="h-48 flex flex-col items-center justify-center bg-[linear-gradient(243deg,#F574A9_7%,#E76877_38%,#6E58A5_91%)]">
                    <img
                        src={userRegIcon}
                        alt="User Profile Icon"
                        className="w-16 h-16 mb-2"
                    />
                    <h2 className="text-white text-2xl mt-2">Create Account</h2>
                </div>

                {/*Нижняя часть с формой*/}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Поле Username */}
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        />

                        {/* Поле Email */}
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        />

                        {/* Поле Password */}
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        />

                        {/* Кнопка Sign in */}
                        <button
                            type="submit"
                            className="self-center px-12 bg-[#6564AF] hover:bg-[#4745B3] text-white font-semibold py-2 rounded-md transition-colors mt-2"
                        >
                            Create account
                        </button>

                    </form>

                    {/* Ссылка на регистрацию */}
                    <div className="mt-6 pt-4 border-t border-dashed border-gray-300 flex justify-between items-center text-sm">
                        <span className="text-gray-600">Already have an account?</span>
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="bg-pink-200 text-pink-800 px-3 py-1 rounded-md hover:bg-pink-300 transition-colors">
                            Sign in
                        </button>
                    </div>
                </div>

            </div>

        </div>
    )
}
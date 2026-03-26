import { useState } from 'react';
import userIcon from '../assets/userIcon.png';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

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
            console.log('Успешный вход! Данные:', userData);

            // Сохраняем идентификатор пользователя для дальнейшей работы
            localStorage.setItem('userId', userData.id);

            // Перекидываем на главную страницу
            navigate('/');
        }
        catch (error) {
            console.error('Ошибка входа:', error);
            alert('Неверная почта или пароль!');
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">

            {/* Сама карточка*/}
            <div className="w-[350px] bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Верхняя часть*/}
                <div className="h-48 flex flex-col items-center justify-center bg-[linear-gradient(243deg,#F574A9_7%,#E76877_38%,#6E58A5_91%)]">
                    <img
                        src={userIcon}
                        alt="User Profile Icon"
                        className="w-16 h-16 mb-2"
                    />
                    <h2 className="text-white text-2xl mt-2">Welcome back</h2>
                </div>

                {/*Нижняя часть с формой*/}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

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
                            Sign in
                        </button>

                    </form>

                    {/* Ссылка на регистрацию */}
                    <div className="mt-6 pt-4 border-t border-dashed border-gray-300 flex justify-between items-center text-sm">
                        <span className="text-gray-600">Don't have an account?</span>
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="bg-pink-200 text-pink-800 px-3 py-1 rounded-md hover:bg-pink-300 transition-colors"
                        >
                            Create account
                        </button>
                    </div>
                </div>

            </div>

        </div>
    )
}
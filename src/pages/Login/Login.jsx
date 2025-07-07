import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/Auth/AuthContext.jsx';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {login} = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log("calling handleLogin");
            await login(email, password);  // <-- this must trigger the context method
            console.log("login successful");
            navigate('/');
        } catch (err) {
            console.error('LoginPage error:', err);
            setError('Login failed. Please check your email or password.');
        }
    };


    return (
        <div className="flex h-[700px] w-full">
            <div className="w-full hidden md:inline-block">
                <img
                    className="h-full"
                    src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
                    alt="leftSideImage"
                />
            </div>

            <div className="w-full flex flex-col items-center justify-center">
                <form
                    className="md:w-96 w-80 flex flex-col items-center justify-center"
                    onSubmit={handleLogin}
                >
                    <h2 className="text-4xl text-gray-900 font-medium">Sign in</h2>
                    <p className="text-sm text-gray-500/90 mt-3">
                        Welcome back! Please sign in to continue
                    </p>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mt-6">
                        <input
                            type="email"
                            placeholder="Email"
                            className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <input
                            type="password"
                            placeholder="Password"
                            className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="w-full flex items-center justify-between mt-6 text-gray-500/80">
                        <div className="flex items-center gap-2">
                            <input className="h-5" type="checkbox" id="checkbox" />
                            <label className="text-sm" htmlFor="checkbox">Remember me</label>
                        </div>
                        <a className="text-sm underline" href="#">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
                    >
                        Login
                    </button>

                    <p className="text-gray-500/90 text-sm mt-4">
                        Don’t have an account?{' '}
                        <a className="text-indigo-400 hover:underline" href="/register">
                            Sign up
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
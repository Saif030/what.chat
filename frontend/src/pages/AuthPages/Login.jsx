import { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Eye } from 'lucide-react';
import { icon } from '../../assets/assets.js';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';

const Login = () => {
    const navigate = useNavigate();
    const { register , handleSubmit , reset } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);

    const onSubmit = async (data) => {
        try {
            const response = await login(data);
            if (response?.success) {
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
        reset();
    };

    return (
        <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center px-4">
            {/* DeepSeek Logo */}
            <div className="mb-2 flex items-center justify-center">
                <img src={icon} alt="DeepSeek Logo" className='h-24' />
            </div>

            {/* Login Card */}
            <div className="w-full max-w-xs mb-[5vw]">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            {...register("email", { required: "Email is required" })}
                            placeholder="Phone number / email address"
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-full px-5 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors text-sm"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            {...register("password", { required: "Password is required" })}
                            placeholder="Password"
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-full px-5 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400"
                        >
                            <Eye size={18} />
                        </button>
                    </div>

                    {/* Consent Text */}
                    <p className="text-xs text-zinc-500 text-start px-2">
                        By signing up or logging in, you consent to DeepSeek's{' '}
                        <a href="#" className="underline text-white hover:text-zinc-400">Terms of Use</a>
                        {' '}and{' '}
                        <a href="#" className="underline text-white hover:text-zinc-400">Privacy Policy</a>
                    </p>

                    {/* Links */}
                    <div className="flex items-center justify-between text-xs px-1">
                        <a href="#" className="text-blue-500 hover:text-zinc-400">Forgot password?</a>
                        <Link to="/signup" className="text-blue-500 hover:text-zinc-400">Sign up</Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-400 text-white font-medium py-3 rounded-full transition-colors"
                    >
                        Log in
                    </button>
                </form>

                <Link
                    to="/signup"
                    className="w-full bg-transparent hover:bg-zinc-800 text-white mt-4 flex justify-center items-center font-medium py-3 rounded-full transition-colors"
                >
                    Sign up
                </Link>
            </div>

            {/* Footer */}
            <div className="fixed bottom-6 text-xs text-zinc-600">
                copyright © 2026 what.chat. All rights reserved. <a href="#" className="hover:text-zinc-500">Contact us</a>
            </div>
        </div>
    );
};

export default Login;
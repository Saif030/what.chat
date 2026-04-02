import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { icon } from '../../assets/assets.js';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';

const Signup = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register , handleSubmit , reset , formState: { errors } } = useForm();
    const { signup } = useContext(AuthContext);

    const onSubmit = async (data) => {
        try {
            const response = await signup(data);
            if (response?.success || response?.userData) {
                navigate("/login");
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

            <div className="w-full max-w-xs mb-[2vw]">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="relative">
                        <input
                            {...register("name", { required: true })}
                            type="text"
                            placeholder="Username"
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-full px-5 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors text-sm"
                        />
                        {errors.name && <span className='text-xs text-red-400 px-2'>This field is required</span>}
                    </div>
                    <div className="relative">
                        <input
                            {...register("email", { required: true })}
                            type="text"
                            placeholder="Email address"
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-full px-5 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors text-sm"
                        />
                        {errors.email && <span className='text-xs text-red-400 px-2'>This field is required</span>}
                    </div>

                    <div className="relative">
                        <input
                            {...register("password", { required: true })}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-full px-5 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors text-sm"
                        />
                        {errors.password && <span className='text-xs text-red-400 px-2'>This field is required</span>}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400"
                        >
                            <Eye size={18} />
                        </button>
                    </div>
        
                    <div className="relative">
                        <input
                            {...register("confirmPassword", { 
                                required: true,
                                validate: (value) => value === password || "Passwords do not match"
                            })}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-full px-5 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors text-sm"
                        />
                        {errors.confirmPassword && (
                            <span className='text-xs text-red-400 px-2'>
                                {errors.confirmPassword.message || "This field is required"}
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400"
                        >
                            <Eye size={18} />
                        </button>
                    </div>


                    {/* Consent Text */}
                    <p className="text-xs text-zinc-500 text-center px-2">
                        By signing up or logging in, you consent to DeepSeek's{' '}
                        <a href="#" className="underline text-white hover:text-zinc-400">Terms of Use</a>
                        {' '}and{' '}
                        <a href="#" className="underline text-white hover:text-zinc-400">Privacy Policy</a>
                    </p>

                    {/* Links */}
                    <div className="flex items-center justify-start text-xs px-1">
                        <Link to="/login" className="text-blue-500 hover:text-zinc-400">Already have an account? Log in</Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-400 text-white font-medium py-3 rounded-full transition-colors"
                    >
                        Sign up
                    </button>
                </form>
                <Link
                    to="/login"
                    className="w-full bg-transparent hover:bg-zinc-800 text-white mt-4 flex justify-center items-center font-medium py-3 rounded-full transition-colors"
                >
                    Log in
                </Link>

                <div className="fixed bottom-6 text-xs text-zinc-600">
                    copyright © 2026 what.chat. All rights reserved. <a href="#" className="hover:text-zinc-500">Contact us</a>
                </div>
            </div>
        </div>
    );
};

export default Signup;
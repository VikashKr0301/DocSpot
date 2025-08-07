import React, { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    const token = searchParams.get('token');
    const type = searchParams.get('type'); // 'doctor' or undefined (user)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return toast.error('Passwords do not match');
        }

        if (newPassword.length < 8) {
            return toast.error('Password must be at least 8 characters long');
        }

        setIsLoading(true);

        try {
            const endpoint = type === 'doctor'
                ? '/api/doctor/reset-password'
                : '/api/user/reset-password';

            const { data } = await axios.post(backendUrl + endpoint, {
                token,
                newPassword
            });

            if (data.success) {
                toast.success(data.message);
                // Redirect to appropriate login page
                setTimeout(() => {
                    if (type === 'doctor') {
                        window.location.href = 'http://localhost:5174';
                    } else {
                        navigate('/login');
                    }
                }, 2000);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className='min-h-[80vh] flex items-center justify-center bg-slate-50'>
                <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 text-center'>
                    <h2 className='text-xl font-semibold text-red-600 mb-4'>Invalid Reset Link</h2>
                    <p className='text-slate-600 mb-4'>This password reset link is invalid or has expired.</p>
                    <button
                        onClick={() => navigate('/forgot-password')}
                        className='bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors'
                    >
                        Request New Link
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-[80vh] flex items-center justify-center bg-slate-50'>
            <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4'>
                <h2 className='text-2xl font-semibold text-slate-800 mb-6 text-center'>
                    Reset {type === 'doctor' ? 'Doctor ' : ''}Password
                </h2>
                <p className='text-center mb-6 text-slate-600'>Enter your new password below</p>

                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-slate-700 mb-2'>New Password</label>
                        <div className='relative'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className='w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors pr-10'
                                placeholder='Enter new password (min 8 characters)'
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700'
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className='mb-6'>
                        <label className='block text-sm font-medium text-slate-700 mb-2'>Confirm Password</label>
                        <div className='relative'>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className='w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors pr-10'
                                placeholder='Confirm new password'
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700'
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <p className='text-red-500 text-sm mt-1'>Passwords do not match</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || (newPassword && confirmPassword && newPassword !== confirmPassword)}
                        className='w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {isLoading && <FaSpinner className="animate-spin" />}
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className='mt-4 text-center'>
                    <button
                        onClick={() => navigate('/login')}
                        className='text-primary hover:underline text-sm'
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
import React, { useState, useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Get backend URL from context
    const adminContext = useContext(AdminContext);
    const doctorContext = useContext(DoctorContext);
    const backendUrl = adminContext?.backendUrl || doctorContext?.backendUrl || import.meta.env.VITE_BACKEND_URL;

    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const type = urlParams.get('type');

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
            const { data } = await axios.post(backendUrl + '/api/doctor/reset-password', {
                token,
                newPassword
            });

            if (data.success) {
                toast.success(data.message);
                setTimeout(() => {
                    window.location.href = '/'; // Redirect to admin login
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
            <div className='min-h-screen flex items-center justify-center bg-slate-50'>
                <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 text-center'>
                    <h2 className='text-xl font-semibold text-red-600 mb-4'>Invalid Reset Link</h2>
                    <p className='text-slate-600 mb-4'>This password reset link is invalid or has expired.</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className='bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors'
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-slate-50'>
            <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4'>
                <div className='text-center mb-6'>
                    <h2 className='text-2xl font-semibold text-slate-800 mb-2'>
                        Reset Doctor Password
                    </h2>
                    <p className='text-slate-600'>Enter your new password below</p>
                </div>

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
                        className='w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                    >
                        {isLoading && <FaSpinner className="animate-spin" />}
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className='mt-4 text-center'>
                    <button
                        onClick={() => window.location.href = '/'}
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
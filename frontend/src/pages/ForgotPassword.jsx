import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaSpinner, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data } = await axios.post(backendUrl + '/api/user/request-password-reset', { email });

            if (data.success) {
                setEmailSent(true);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to send reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className='min-h-[80vh] flex items-center justify-center bg-slate-50'>
                <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 text-center'>
                    <FaEnvelope className='text-4xl text-primary mx-auto mb-4' />
                    <h2 className='text-2xl font-semibold text-slate-800 mb-4'>Check Your Email</h2>
                    <p className='text-slate-600 mb-6'>
                        We've sent a password reset link to <strong>{email}</strong>.
                        Please check your inbox and follow the instructions.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className='bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors'
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-[80vh] flex items-center justify-center bg-slate-50'>
            <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4'>
                <h2 className='text-2xl font-semibold text-slate-800 mb-2 text-center'>Forgot Password?</h2>
                <p className='text-slate-600 mb-6 text-center'>
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-slate-700 mb-2'>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'
                            placeholder='Enter your email'
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className='w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50'
                    >
                        {isLoading && <FaSpinner className="animate-spin" />}
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className='mt-4 text-center'>
                    <button
                        onClick={() => navigate('/login')}
                        className='text-primary hover:underline'
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
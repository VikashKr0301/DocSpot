import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { backendUrl, setToken } = useContext(AppContext);

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            verifyEmail(token);
        } else {
            setVerificationStatus('error');
            setMessage('Invalid verification link');
        }
    }, [searchParams]);

    const verifyEmail = async (token) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/verify-email', { token });

            if (data.success) {
                setVerificationStatus('success');
                setMessage(data.message);
                localStorage.setItem('token', data.token);
                setToken(data.token);

                // Redirect to home after 3 seconds
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } else {
                setVerificationStatus('error');
                setMessage(data.message);
            }
        } catch (error) {
            setVerificationStatus('error');
            setMessage('Verification failed. Please try again.');
        }
    };

    return (
        <div className='min-h-[80vh] flex items-center justify-center bg-slate-50'>
            <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 text-center'>
                {verificationStatus === 'verifying' && (
                    <>
                        <FaSpinner className='animate-spin text-4xl text-primary mx-auto mb-4' />
                        <h2 className='text-xl font-semibold text-slate-800 mb-2'>Verifying Email</h2>
                        <p className='text-slate-600'>Please wait while we verify your email address...</p>
                    </>
                )}

                {verificationStatus === 'success' && (
                    <>
                        <FaCheckCircle className='text-4xl text-green-500 mx-auto mb-4' />
                        <h2 className='text-xl font-semibold text-slate-800 mb-2'>Email Verified!</h2>
                        <p className='text-slate-600 mb-4'>{message}</p>
                        <p className='text-sm text-slate-500'>Redirecting to home page...</p>
                    </>
                )}

                {verificationStatus === 'error' && (
                    <>
                        <FaTimesCircle className='text-4xl text-red-500 mx-auto mb-4' />
                        <h2 className='text-xl font-semibold text-slate-800 mb-2'>Verification Failed</h2>
                        <p className='text-slate-600 mb-4'>{message}</p>
                        <button
                            onClick={() => navigate('/login')}
                            className='bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors'
                        >
                            Go to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
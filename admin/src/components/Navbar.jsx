import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiX } from 'react-icons/fi';

const Navbar = () => {
    const { dToken, setDToken } = useContext(DoctorContext);
    const { aToken, setAToken } = useContext(AdminContext);
    const navigate = useNavigate();

    // --- State for the confirmation modal ---
    const [isConfirming, setIsConfirming] = useState(false);

    const logout = () => {
        navigate('/');
        if (dToken) {
            setDToken('');
            localStorage.removeItem('dToken');
        }
        if (aToken) {
            setAToken('');
            localStorage.removeItem('aToken');
        }
        setIsConfirming(false); // Close modal after logout
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 }
    };

    return (
        <>
            <div className='fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-10 py-3 border-b border-slate-200 bg-white shadow-sm'>
                <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate('/admin-dashboard')}>
                        <img className='w-10' src={assets.admin_logo} alt="DocSpot Logo" />
                        <span className='font-bold text-xl text-slate-800 hidden sm:block'>DocSpot Panel</span>
                    </div>
                    <p className={`text-xs font-bold py-1 px-3 rounded-full ${aToken ? 'bg-slate-700 text-white' : 'bg-primary/20 text-primary'}`}>
                        {aToken ? 'Admin' : 'Doctor'}
                    </p>
                </div>
                <button
                    onClick={() => setIsConfirming(true)}
                    className='text-sm font-medium border border-red-500 text-red-500 px-6 py-2 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-300 flex items-center gap-2'
                >
                    <FiLogOut />
                    Logout
                </button>
            </div>

            {/* --- Confirmation Modal --- */}
            <AnimatePresence>
                {isConfirming && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center"
                        >
                            <h2 className="text-2xl font-bold text-slate-800">Confirm Logout</h2>
                            <p className="text-slate-500 mt-2 mb-6">
                                Are you sure you want to log out of your account?
                            </p>
                            <div className="mt-6 flex justify-center gap-4">
                                <button
                                    onClick={() => setIsConfirming(false)}
                                    className="px-6 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={logout}
                                    className="px-6 py-2 rounded-md bg-red-600 text-white font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <FiLogOut />
                                    Confirm & Logout
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
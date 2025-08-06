import React, { useEffect, useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { FaCalendarCheck, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const AllAppointments = () => {
    const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext);
    const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

    // --- State for the confirmation modal ---
    const [isConfirming, setIsConfirming] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- Time formatting function ---
    const formatTimeTo12Hour = (time24) => {
        if (!time24) return time24;

        const timeStr = time24.toString().toLowerCase();

        // If already in 12-hour format, return as is
        if (timeStr.includes('am') || timeStr.includes('pm')) {
            return time24;
        }

        // Parse 24-hour format (e.g., "14:30" or "2:30")
        const [hours, minutes] = timeStr.split(':');
        const hour24 = parseInt(hours);
        const min = minutes || '00';

        if (hour24 === 0) {
            return `12:${min} AM`;
        } else if (hour24 < 12) {
            return `${hour24}:${min} AM`;
        } else if (hour24 === 12) {
            return `12:${min} PM`;
        } else {
            return `${hour24 - 12}:${min} PM`;
        }
    };

    useEffect(() => {
        if (aToken) {
            getAllAppointments();
        }
    }, [aToken, getAllAppointments]);

    // --- Handlers for the cancel confirmation flow ---
    const handleCancelClick = (appointment) => {
        setSelectedAppointment(appointment);
        setIsConfirming(true);
    };

    const handleConfirmCancel = async () => {
        if (!selectedAppointment) return;
        setIsLoading(true);
        try {
            await cancelAppointment(selectedAppointment._id);
        } catch (error) {
            toast.error("Failed to cancel the appointment.");
        } finally {
            setIsLoading(false);
            setIsConfirming(false);
            setSelectedAppointment(null);
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 }
    };

    return (
        <div className='ml-16 md:ml-64 pt-24 px-4 sm:px-6 lg:px-8 w-full min-h-screen bg-[#F8F9FD]'>
            <div className='flex items-center gap-3 mb-6'>
                <FaCalendarCheck className='text-3xl text-primary' />
                <h1 className='text-2xl font-bold text-slate-800'>All Appointments</h1>
            </div>

            <div className='bg-white border border-slate-200 rounded-lg shadow-sm text-sm overflow-x-auto'>
                <div className='hidden sm:grid grid-cols-[0.3fr_2fr_0.5fr_1.5fr_2fr_0.5fr_1fr] items-center py-3 px-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-600'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Doctor</p>
                    <p>Fees</p>
                    <p className='text-center'>Action</p>
                </div>

                <div className='divide-y divide-slate-200'>
                    {appointments.map((item, index) => (
                        <div className='p-4 sm:grid sm:grid-cols-[0.3fr_2fr_0.5fr_1.5fr_2fr_0.5fr_1fr] sm:items-center hover:bg-slate-50/50' key={item._id}>

                            {/* Mobile View */}
                            <div className='sm:hidden'>
                                <div className='flex justify-between items-start'>
                                    <div className='flex items-center gap-3 font-medium'>
                                        <img src={item.userData.image} className='w-10 h-10 rounded-full object-cover' alt={item.userData.name} />
                                        <div>
                                            <p>{item.userData.name}</p>
                                            <p className='text-xs text-slate-500'>Age: {calculateAge(item.userData.dob) || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <p className='font-semibold'>{currency}{isNaN(item.amount) ? 'N/A' : item.amount}</p>
                                        <p className='text-xs text-slate-500'>{item.payment ? 'Online' : 'CASH'}</p>
                                    </div>
                                </div>
                                <div className='mt-3 pt-3 border-t border-slate-100 flex justify-between items-center'>
                                    <div className='text-xs text-slate-500'>
                                        <p className='font-medium text-slate-700'>{item.docData.name}</p>
                                        <p>{slotDateFormat(item.slotDate)}, {formatTimeTo12Hour(item.slotTime)}</p>
                                    </div>
                                    <div className='flex justify-end'>
                                        {item.cancelled ? (
                                            <p className='text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-800'>Cancelled</p>
                                        ) : item.isCompleted ? (
                                            <p className='text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800'>Completed</p>
                                        ) : (
                                            <button onClick={() => handleCancelClick(item)} className='text-xs font-semibold border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition-colors'>Cancel</button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Desktop View */}
                            <p className='text-slate-500 font-medium hidden sm:block'>{index + 1}</p>
                            <div className='hidden sm:flex items-center gap-3 font-medium'>
                                <img src={item.userData.image} className='w-9 h-9 rounded-full object-cover' alt={item.userData.name} />
                                <p>{item.userData.name}</p>
                            </div>
                            <p className='text-slate-500 hidden sm:block'>{calculateAge(item.userData.dob) || 'N/A'}</p>
                            <p className='hidden sm:block'>{slotDateFormat(item.slotDate)}, {formatTimeTo12Hour(item.slotTime)}</p>
                            <div className='hidden sm:flex items-center gap-3'>
                                <img src={item.docData.image} className='w-9 h-9 rounded-full object-cover bg-primary/20' alt={item.docData.name} />
                                <p>{item.docData.name}</p>
                            </div>
                            <p className='text-slate-500 font-medium hidden sm:block'>{currency}{isNaN(item.amount) ? 'N/A' : item.amount}</p>
                            <div className='hidden sm:flex justify-center items-center'>
                                {item.cancelled ? (
                                    <p className='text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-800'>Cancelled</p>
                                ) : item.isCompleted ? (
                                    <p className='text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800'>Completed</p>
                                ) : (
                                    <button onClick={() => handleCancelClick(item)} className='text-xs font-semibold border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition-colors'>Cancel</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
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
                            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center"
                        >
                            <h2 className="text-2xl font-bold text-slate-800">Confirm Cancellation</h2>
                            <p className="text-slate-500 mt-2 mb-6">
                                Are you sure you want to cancel the appointment for <strong className="text-slate-700">{selectedAppointment?.userData.name}</strong> with <strong className="text-slate-700">{selectedAppointment?.docData.name}</strong>?
                            </p>

                            <div className="mt-6 flex justify-center gap-4">
                                <button
                                    onClick={() => setIsConfirming(false)}
                                    className="px-6 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                                    disabled={isLoading}
                                >
                                    Go Back
                                </button>
                                <button
                                    onClick={handleConfirmCancel}
                                    className="px-6 py-2 rounded-md bg-red-600 text-white font-bold hover:bg-red-700 transition-colors flex items-center gap-2 disabled:bg-red-400"
                                    disabled={isLoading}
                                >
                                    {isLoading && <FaSpinner className="animate-spin" />}
                                    {isLoading ? 'Cancelling...' : 'Confirm & Cancel'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AllAppointments;
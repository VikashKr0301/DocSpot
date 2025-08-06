import React, { useEffect, useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { FaUserMd, FaCalendarCheck, FaUsers, FaListAlt, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext);
    const { slotDateFormat } = useContext(AppContext);

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
            getDashData();
        }
    }, [aToken, getDashData]);

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
            // After cancelling, refresh the dashboard data
            getDashData();
        } catch (error) {
            toast.error("Failed to cancel the appointment.");
        } finally {
            setIsLoading(false);
            setIsConfirming(false);
            setSelectedAppointment(null);
        }
    };

    if (!dashData) {
        return (
            <div className='lg:ml-64 pt-24 px-4 sm:px-6 lg:px-8 w-full min-h-screen bg-[#F8F9FD] flex items-center justify-center'>
                <FaSpinner className="animate-spin text-4xl text-primary" />
            </div>
        );
    }

    const StatCard = ({ icon, label, value }) => (
        <div className='flex items-center gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-sm'>
            <div className='p-3 bg-primary/10 rounded-full'>
                {icon}
            </div>
            <div>
                <p className='text-2xl font-bold text-slate-800'>{value}</p>
                <p className='text-sm text-slate-500'>{label}</p>
            </div>
        </div>
    );

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 }
    };

    return dashData && (
        <div className='ml-16 md:ml-64 pt-24 px-4 sm:px-6 lg:px-8 w-full min-h-screen bg-[#F8F9FD]'>
            {/* Welcome header */}
            <div>
                <h1 className='text-3xl font-bold text-slate-800'>Dashboard</h1>
                <p className='text-slate-500 mt-1'>Welcome back! Here's a summary of your clinic's activity.</p>
            </div>

            {/* Stat cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
                <StatCard icon={<FaUserMd className='text-xl text-primary' />} label="Total Doctors" value={dashData.doctors} />
                <StatCard icon={<FaCalendarCheck className='text-xl text-primary' />} label="Appointments" value={dashData.appointments} />
                <StatCard icon={<FaUsers className='text-xl text-primary' />} label="Total Patients" value={dashData.patients} />
            </div>

            {/* Latest bookings widget */}
            <div className='mt-10 bg-white border border-slate-200 rounded-lg shadow-sm'>
                <div className='flex items-center gap-3 p-4 border-b border-slate-200'>
                    <FaListAlt className='text-primary' />
                    <h2 className='font-semibold text-slate-800'>Latest Bookings</h2>
                </div>
                <div>
                    {dashData.latestAppointments.slice(0, 5).map((item) => (
                        <div className='grid grid-cols-[1fr_auto] items-center p-3 sm:p-4 border-b border-slate-200 last:border-b-0 hover:bg-slate-50/50' key={item._id}>
                            <div className='flex items-center gap-4'>
                                <img className='w-10 h-10 rounded-full object-cover bg-primary/10' src={item.docData.image} alt={item.docData.name} />
                                <div className='text-sm'>
                                    <p className='font-medium text-slate-800'>{item.docData.name}</p>
                                    <p className='text-slate-500'>Booking on {slotDateFormat(item.slotDate)} at {formatTimeTo12Hour(item.slotTime)}</p>
                                </div>
                            </div>
                            <div className='flex justify-end'>
                                {item.cancelled ? (
                                    <p className='text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-800'>Cancelled</p>
                                ) : item.isCompleted ? (
                                    <p className='text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800'>Completed</p>
                                ) : (
                                    <button onClick={() => handleCancelClick(item)} className='text-xs font-semibold border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition-colors'>
                                        Cancel
                                    </button>
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
                                Are you sure you want to cancel this appointment? This action cannot be undone.
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

export default Dashboard;
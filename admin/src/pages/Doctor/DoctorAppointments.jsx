import React, { useEffect, useContext, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { FaCalendarCheck, FaSpinner, FaCalendarDay, FaCalendarAlt, FaHistory, FaChevronDown, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const DoctorAppointments = () => {
    const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext);
    const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

    // --- State management ---
    const [isConfirming, setIsConfirming] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [actionType, setActionType] = useState(''); // 'cancel' or 'complete'
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [expandedDates, setExpandedDates] = useState(new Set());

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

    // Parse date from format "DD_MM_YYYY" to Date object
    const parseSlotDate = (slotDate) => {
        try {
            const [day, month, year] = slotDate.split('_').map(Number);
            return new Date(year, month - 1, day);
        } catch (error) {
            console.error('Error parsing date:', slotDate);
            return new Date();
        }
    };

    // Group appointments by date and filter by status
    const getGroupedAppointments = () => {
        if (!appointments || appointments.length === 0) return {};

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Sort and filter appointments
        let filteredAppointments = [...appointments];

        // Apply filter based on active tab
        if (activeTab === 'today') {
            filteredAppointments = filteredAppointments.filter(app => {
                const appDate = parseSlotDate(app.slotDate);
                return appDate.getTime() === today.getTime();
            });
        } else if (activeTab === 'upcoming') {
            filteredAppointments = filteredAppointments.filter(app => {
                const appDate = parseSlotDate(app.slotDate);
                return appDate > today && !app.cancelled && !app.isCompleted;
            });
        } else if (activeTab === 'completed') {
            filteredAppointments = filteredAppointments.filter(app => app.isCompleted);
        } else if (activeTab === 'cancelled') {
            filteredAppointments = filteredAppointments.filter(app => app.cancelled);
        }

        // Sort by date and time
        filteredAppointments.sort((a, b) => {
            const dateA = parseSlotDate(a.slotDate);
            const dateB = parseSlotDate(b.slotDate);
            if (dateA.getTime() === dateB.getTime()) {
                // If same date, sort by time
                return a.slotTime.localeCompare(b.slotTime);
            }
            return dateA - dateB;
        });

        // Group by date
        const grouped = {};
        filteredAppointments.forEach(app => {
            if (!grouped[app.slotDate]) {
                grouped[app.slotDate] = [];
            }
            grouped[app.slotDate].push(app);
        });

        return grouped;
    };

    useEffect(() => {
        if (dToken) {
            getAppointments();
        }
    }, [dToken]);

    // Initialize expanded dates based on current appointments
    useEffect(() => {
        const groupedAppointments = getGroupedAppointments();
        const dates = Object.keys(groupedAppointments);
        setExpandedDates(new Set(dates));
    }, [appointments, activeTab]);

    // --- Handlers for actions ---
    const handleActionClick = (appointment, action) => {
        setSelectedAppointment(appointment);
        setActionType(action);
        setIsConfirming(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedAppointment) return;
        setIsLoading(true);
        try {
            if (actionType === 'cancel') {
                await cancelAppointment(selectedAppointment._id);
            } else if (actionType === 'complete') {
                await completeAppointment(selectedAppointment._id);
            }
        } catch (error) {
            console.error('Action error:', error);
            toast.error(`Failed to ${actionType} the appointment.`);
        } finally {
            setIsLoading(false);
            setIsConfirming(false);
            setSelectedAppointment(null);
            setActionType('');
        }
    };

    const toggleDateExpansion = (date) => {
        const newExpandedDates = new Set(expandedDates);
        if (newExpandedDates.has(date)) {
            newExpandedDates.delete(date);
        } else {
            newExpandedDates.add(date);
        }
        setExpandedDates(newExpandedDates);
    };

    const StatusBadge = ({ text, colorClass }) => (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}>
            {text}
        </span>
    );

    //Payment Badge with icons
    const PaymentBadge = ({ isOnline }) => (
        <div className="flex items-center justify-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${isOnline
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                {isOnline ? (
                    <>
                        <FaCreditCard className="w-3 h-3" />
                        Online
                    </>
                ) : (
                    <>
                        <FaMoneyBillWave className="w-3 h-3" />
                        Cash
                    </>
                )}
            </span>
        </div>
    );

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 }
    };

    const groupedAppointments = getGroupedAppointments();
    const groupedDates = Object.keys(groupedAppointments);
    const hasAppointments = groupedDates.length > 0;

    // Loading state
    if (!appointments) {
        return (
            <div className='ml-16 md:ml-64 pt-24 px-4 sm:px-6 lg:px-8 w-full min-h-screen bg-[#F8F9FD] flex items-center justify-center'>
                <div className="text-center">
                    <FaSpinner className="animate-spin text-primary text-3xl mx-auto mb-4" />
                    <p className="text-slate-600">Loading appointments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='ml-16 md:ml-64 pt-24 px-4 sm:px-6 lg:px-8 w-full min-h-screen bg-[#F8F9FD]'>
            <div className='flex items-center gap-3 mb-6'>
                <FaCalendarCheck className='text-3xl text-primary' />
                <h1 className='text-2xl font-bold text-slate-800'>Your Appointments</h1>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-lg p-2 shadow-sm border border-slate-200">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    <FaCalendarAlt />
                    All ({appointments?.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab('today')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'today' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    <FaCalendarDay />
                    Today
                </button>
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'upcoming' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    <FaCalendarCheck />
                    Upcoming
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'completed' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    <FaHistory />
                    Completed
                </button>
                <button
                    onClick={() => setActiveTab('cancelled')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'cancelled' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    <FaHistory />
                    Cancelled
                </button>
            </div>

            {!hasAppointments && (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-slate-100 mb-4">
                        <FaCalendarAlt className="text-slate-400 text-xl" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-700">No appointments found</h2>
                    <p className="text-slate-500 mt-2">
                        {activeTab === 'today'
                            ? "You have no appointments scheduled for today."
                            : activeTab === 'upcoming'
                                ? "No upcoming appointments found."
                                : activeTab === 'completed'
                                    ? "No completed appointments found."
                                    : activeTab === 'cancelled'
                                        ? "No cancelled appointments found."
                                        : "You have no appointments scheduled."}
                    </p>
                </div>
            )}

            {hasAppointments && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    {groupedDates.map(date => (
                        <div key={date} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            <button
                                onClick={() => toggleDateExpansion(date)}
                                className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                        {parseSlotDate(date).getDate()}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-slate-800">{slotDateFormat(date)}</h3>
                                        <p className="text-xs text-slate-500">
                                            {groupedAppointments[date].length} appointment{groupedAppointments[date].length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                                <FaChevronDown className={`text-slate-400 transition-transform duration-300 ${expandedDates.has(date) ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {expandedDates.has(date) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className='hidden sm:grid grid-cols-[0.3fr_2fr_1.2fr_0.5fr_1fr_0.5fr_1.2fr] items-center py-3 px-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-600'>
                                            <p>#</p>
                                            <p>Patient</p>
                                            <p className="text-center">Payment</p>
                                            <p>Age</p>
                                            <p>Time</p>
                                            <p>Fees</p>
                                            <p className='text-center'>Action</p>
                                        </div>

                                        <div className='divide-y divide-slate-200'>
                                            {groupedAppointments[date].map((item, index) => (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className='p-4 sm:grid sm:grid-cols-[0.3fr_2fr_1.2fr_0.5fr_1fr_0.5fr_1.2fr] sm:items-center hover:bg-slate-50/50'
                                                    key={item._id}
                                                >
                                                    {/* Mobile View */}
                                                    <div className='sm:hidden'>
                                                        <div className='flex justify-between items-start'>
                                                            <div className='flex items-center gap-3 font-medium'>
                                                                <img
                                                                    src={item.userData?.image || '/default-avatar.png'}
                                                                    className='w-10 h-10 rounded-full object-cover'
                                                                    alt={item.userData?.name || 'Patient'}
                                                                    onError={(e) => { e.target.src = '/default-avatar.png' }}
                                                                />
                                                                <div>
                                                                    <p>{item.userData?.name || 'N/A'}</p>
                                                                    <p className='text-xs text-slate-500'>Age: {calculateAge(item.userData?.dob) || 'N/A'}</p>
                                                                </div>
                                                            </div>
                                                            <div className='text-right'>
                                                                <p className='font-semibold'>{currency}{isNaN(item.amount) ? 'N/A' : item.amount}</p>
                                                                <p className='text-xs text-slate-500'>{formatTimeTo12Hour(item.slotTime)}</p>
                                                            </div>
                                                        </div>
                                                        <div className='mt-3 pt-3 border-t border-slate-100 flex justify-between items-center'>
                                                            <PaymentBadge isOnline={item.payment} />
                                                            <div className='flex gap-2'>
                                                                {item.cancelled ? (
                                                                    <StatusBadge text="Cancelled" colorClass="bg-red-100 text-red-800 border border-red-200" />
                                                                ) : item.isCompleted ? (
                                                                    <StatusBadge text="Completed" colorClass="bg-green-100 text-green-800 border border-green-200" />
                                                                ) : (
                                                                    <div className='flex gap-2'>
                                                                        <button onClick={() => handleActionClick(item, 'cancel')} className='text-xs font-semibold border border-red-500 text-red-500 px-2 py-1 rounded-md hover:bg-red-500 hover:text-white transition-colors'>Cancel</button>
                                                                        <button onClick={() => handleActionClick(item, 'complete')} className='text-xs font-semibold bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition-colors'>Complete</button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Desktop View */}
                                                    <p className='text-slate-500 font-medium hidden sm:block'>{index + 1}</p>
                                                    <div className='hidden sm:flex items-center gap-3 font-medium'>
                                                        <img
                                                            src={item.userData?.image || '/default-avatar.png'}
                                                            className='w-9 h-9 rounded-full object-cover'
                                                            alt={item.userData?.name || 'Patient'}
                                                            onError={(e) => { e.target.src = '/default-avatar.png' }}
                                                        />
                                                        <p>{item.userData?.name || 'N/A'}</p>
                                                    </div>
                                                    <div className='hidden sm:block'>
                                                        <PaymentBadge isOnline={item.payment} />
                                                    </div>
                                                    <p className='text-slate-500 hidden sm:block'>{calculateAge(item.userData?.dob) || 'N/A'}</p>
                                                    <p className='hidden sm:block font-medium'>{formatTimeTo12Hour(item.slotTime)}</p>
                                                    <p className='text-slate-500 font-medium hidden sm:block'>{currency}{isNaN(item.amount) ? 'N/A' : item.amount}</p>
                                                    <div className='hidden sm:flex justify-center items-center gap-2'>
                                                        {item.cancelled ? (
                                                            <StatusBadge text="Cancelled" colorClass="bg-red-100 text-red-800 border border-red-200" />
                                                        ) : item.isCompleted ? (
                                                            <StatusBadge text="Completed" colorClass="bg-green-100 text-green-800 border border-green-200" />
                                                        ) : (
                                                            <div className='flex gap-2'>
                                                                <button onClick={() => handleActionClick(item, 'cancel')} className='text-xs font-semibold border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition-colors'>Cancel</button>
                                                                <button onClick={() => handleActionClick(item, 'complete')} className='text-xs font-semibold bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors'>Complete</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </motion.div>
            )}

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
                            <h2 className="text-2xl font-bold text-slate-800">
                                Confirm {actionType === 'cancel' ? 'Cancellation' : 'Completion'}
                            </h2>
                            <p className="text-slate-500 mt-2 mb-6">
                                Are you sure you want to {actionType} the appointment for <strong className="text-slate-700">{selectedAppointment?.userData?.name}</strong>?
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
                                    onClick={handleConfirmAction}
                                    className={`px-6 py-2 rounded-md font-bold transition-colors flex items-center gap-2 disabled:opacity-50 ${actionType === 'cancel'
                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                        }`}
                                    disabled={isLoading}
                                >
                                    {isLoading && <FaSpinner className="animate-spin" />}
                                    {isLoading ? `${actionType}ing...` : `Confirm & ${actionType === 'cancel' ? 'Cancel' : 'Complete'}`}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DoctorAppointments;
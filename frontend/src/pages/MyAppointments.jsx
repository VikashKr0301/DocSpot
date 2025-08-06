import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSpinner } from 'react-icons/fa'

const MyAppointments = () => {

    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')

    // --- State for the confirmation modal ---
    const [isConfirming, setIsConfirming] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        // Corrected month index by subtracting 1
        return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]
    }

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

    // Getting User Appointments Data Using API
    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // --- Handlers for the cancel confirmation flow ---
    const handleCancelClick = (appointment) => {
        setSelectedAppointment(appointment);
        setIsConfirming(true);
    };

    const handleConfirmCancel = async () => {
        if (!selectedAppointment) return;
        setIsLoading(true);
        try {
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId: selectedAppointment._id }, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                getUserAppointments(); 
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to cancel the appointment.");
        } finally {
            setIsLoading(false);
            setIsConfirming(false);
            setSelectedAppointment(null);
        }
    };


    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: "Appointment Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                console.log(response)
                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
                    if (data.success) {
                        navigate('/my-appointments')
                        getUserAppointments()
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // Function to make payment using razorpay
    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
            if (data.success) {
                initPay(data.order)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 }
    };

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>

            <div className='mb-12'>
                <h1 className='text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight'>My Appointments</h1>
                <p className='mt-2 text-lg text-slate-500'>View and manage your upcoming and past appointments.</p>
            </div>
            <div className='space-y-6'>
                {appointments.map((item) => (

                    <div key={item._id} className='bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] items-center gap-6'>

                        {/* Doctor Image */}
                        <div>
                            <img className='w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover bg-primary/20' src={item.docData.image} alt={item.docData.name} />
                        </div>

                        {/* Appointment Info */}
                        <div className='text-sm text-slate-600'>
                            <p className='text-slate-800 text-lg font-bold'>{item.docData.name}</p>
                            <p>{item.docData.speciality}</p>
                            <p className='text-slate-500 mt-2'>{item.docData.address.line1}, {item.docData.address.line2}</p>
                            <p className='mt-2'><span className='font-semibold text-slate-700'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {formatTimeTo12Hour(item.slotTime)}</p>
                        </div>

                        {/* Actions & Status */}
                        <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                            {/* Pay Online Button */}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && <button onClick={() => setPayment(item._id)} className='sm:min-w-48 py-2 px-4 bg-primary text-stone-800 font-bold rounded-md hover:bg-opacity-90 transition-all'>Pay Online</button>}

                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => appointmentRazorpay(item._id)} className='sm:min-w-48 py-2 border border-slate-300 rounded-md hover:bg-slate-100 transition-all duration-300 flex items-center justify-center'><img className='max-w-20 max-h-5' src={assets.razorpay_logo} alt="Pay with Razorpay" /></button>}

                            {/* Status Badges */}
                            {!item.cancelled && item.payment && !item.isCompleted && <p className='sm:min-w-48 py-2 border border-blue-200 rounded-md text-blue-800 bg-blue-50 font-semibold'>Paid</p>}
                            {item.isCompleted && <p className='sm:min-w-48 py-2 border border-green-200 rounded-md text-green-800 bg-green-50 font-semibold'>Completed</p>}

                            {/* Cancel / Cancelled Status */}
                            {!item.cancelled && !item.isCompleted && <button onClick={() => handleCancelClick(item)} className='sm:min-w-48 py-2 border border-red-500 text-red-500 rounded-md font-semibold hover:bg-red-500 hover:text-white transition-all'>Cancel Appointment</button>}
                            {item.cancelled && !item.isCompleted && <p className='sm:min-w-48 py-2 border border-red-200 rounded-md text-red-800 bg-red-50 font-semibold'>Cancelled</p>}
                        </div>
                    </div>
                ))}
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
                                Are you sure you want to cancel your appointment with <strong className="text-slate-700">{selectedAppointment?.docData?.name}</strong>?
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
    )
}

export default MyAppointments;
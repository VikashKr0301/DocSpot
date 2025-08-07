import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    const [hasExistingAppointment, setHasExistingAppointment] = useState(false);
    const [existingAppointment, setExistingAppointment] = useState(null);
    const [isCheckingAppointment, setIsCheckingAppointment] = useState(false);

    const navigate = useNavigate();

    const fetchDocInfo = async () => {
        const docInfoData = doctors.find((doc) => doc._id === docId);
        setDocInfo(docInfoData);
    };

    // Check if user has existing appointment with this doctor
    const checkExistingAppointment = async () => {
        if (!token) return;

        setIsCheckingAppointment(true);
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', {
                headers: { token }
            });

            if (data.success) {
                // Find any appointment with this doctor that's not cancelled or completed
                const existingAppt = data.appointments.find(appointment =>
                    appointment.docData._id === docId &&
                    !appointment.cancelled &&
                    !appointment.isCompleted
                );

                if (existingAppt) {
                    setHasExistingAppointment(true);
                    setExistingAppointment(existingAppt);
                } else {
                    setHasExistingAppointment(false);
                    setExistingAppointment(null);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsCheckingAppointment(false);
        }
    };

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

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dateArray = slotDate.split('_');
        return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2];
    };

    // Function to get available time slots for the next 7 days
    const getAvailableSolts = async () => {
        setDocSlots([]);
        let today = new Date();
        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            let endTime = new Date();
            endTime.setDate(today.getDate() + i);
            endTime.setHours(21, 0, 0, 0);

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeSlots = [];
            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                let day = currentDate.getDate();
                let month = currentDate.getMonth() + 1;
                let year = currentDate.getFullYear();
                const slotDate = day + "_" + month + "_" + year;
                const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(formattedTime) ? false : true;

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime,
                        displayTime: formatTimeTo12Hour(formattedTime) // Add 12-hour formatted time for display
                    });
                }
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }
            setDocSlots(prev => ([...prev, timeSlots]));
        }
    };

    //Original logic for booking an appointment
    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Login to book appointment');
            return navigate('/login');
        }

        if (hasExistingAppointment) {
            toast.error('You already have a pending appointment with this doctor. Please complete or cancel your existing appointment first.');
            return;
        }

        if (!slotTime) {
            return toast.warning('Please select a time slot.');
        }

        const date = docSlots[slotIndex][0].datetime;
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        const slotDate = day + "_" + month + "_" + year;

        try {
            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                getDoctosData();
                navigate('/my-appointments');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo();
        }
        window.scrollTo(0, 0);
    }, [doctors, docId]);

    useEffect(() => {
        if (docInfo) {
            // Fetch available slots only if doctor info is available
            getAvailableSolts();

            // Check for existing appointment only if user is logged in
            if (token) {
                checkExistingAppointment();
            }
        }
    }, [docInfo, token]);

    // Show loading spinner while checking appointment
    if (isCheckingAppointment) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    return docInfo ? (
        <div className='bg-slate-50 py-12'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Check if doctor is available/active */}
                {docInfo.available === false && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Doctor Currently Unavailable
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>
                                        Dr. {docInfo.name} is currently not accepting new appointments.
                                        This could be due to vacation, medical leave, or schedule updates.
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={() => navigate('/doctors')}
                                        className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                                    >
                                        Find Other Doctors
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Existing appointment warning - only show if logged in */}
                {token && hasExistingAppointment && existingAppointment && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                    Existing Appointment Found
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <p>
                                        You already have a pending appointment with Dr. {docInfo.name} on{' '}
                                        <strong>{slotDateFormat(existingAppointment.slotDate)}</strong> at{' '}
                                        <strong>{formatTimeTo12Hour(existingAppointment.slotTime)}</strong>.
                                    </p>
                                    <p className="mt-2">
                                        Please wait for complete or cancel your existing appointment before booking a new one.
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={() => navigate('/my-appointments')}
                                        className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-200 transition-colors"
                                    >
                                        View My Appointments
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className='flex flex-col sm:flex-row gap-8'>
                    <div className='sm:w-1/3'>
                        <img className='w-full rounded-lg shadow-lg bg-primary' src={docInfo.image} alt={docInfo.name} />
                    </div>
                    <div className='flex-1 border border-slate-200 rounded-lg p-6 bg-white shadow-sm'>
                        <div className='flex items-center gap-2'>
                            <p className='text-3xl font-bold text-slate-800'>{docInfo.name}</p>
                            <img className='w-6' src={assets.verified_icon} alt="Verified Doctor" />
                        </div>
                        <div className='flex flex-wrap items-center gap-2 mt-2 text-slate-600'>
                            <p>{docInfo.degree} - {docInfo.speciality}</p>
                            <p className='py-0.5 px-3 bg-slate-100 text-xs font-semibold rounded-full'>{docInfo.experience}</p>
                        </div>
                        <div className='mt-4'>
                            <p className='flex items-center gap-1.5 text-sm font-semibold text-slate-800'>About <img className='w-4' src={assets.info_icon} alt="Info" /></p>
                            <p className='text-sm text-slate-600 max-w-2xl mt-1'>{docInfo.about}</p>
                        </div>
                        <p className='text-slate-800 font-bold text-lg mt-5'>Appointment Fee: <span className='text-primary'>{currencySymbol}{docInfo.fees}</span></p>
                    </div>
                </div>

                <div className='mt-12'>
                    <h3 className='text-2xl font-bold text-slate-800 mb-4'>Available Time Slots</h3>

                    {docInfo.available !== false ? (
                        <>
                            {/* Date selection - always visible */}
                            <div className='flex gap-3 items-center w-full overflow-x-auto no-scrollbar pb-3'>
                                {docSlots.length > 0 && docSlots.map((item, index) => (
                                    <button onClick={() => setSlotIndex(index)} key={index} className={`flex flex-col items-center justify-center text-center py-3 w-16 h-20 rounded-lg cursor-pointer flex-shrink-0 transition-colors ${slotIndex === index ? 'bg-primary text-stone-800 font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                                        <p className='text-xs'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                                        <p className='text-xl font-bold'>{item[0] && item[0].datetime.getDate()}</p>
                                    </button>
                                ))}
                            </div>

                            {/* Time slots - always visible */}
                            <div className='flex items-center gap-3 w-full overflow-x-auto mt-6 no-scrollbar pb-3'>
                                {docSlots.length > 0 && docSlots[slotIndex].length > 0 ? (
                                    docSlots[slotIndex].map((item) => (
                                        <button
                                            onClick={() => token ? setSlotTime(item.time) : null}
                                            key={item.time}
                                            className={`text-sm font-medium flex-shrink-0 px-5 py-2 rounded-full transition-colors ${token && item.time === slotTime
                                                    ? 'bg-primary text-stone-800'
                                                    : token
                                                        ? 'text-slate-600 border border-slate-300 hover:bg-slate-100 cursor-pointer'
                                                        : 'text-slate-600 border border-slate-300 cursor-default'
                                                }`}
                                        >
                                            {item.displayTime || formatTimeTo12Hour(item.time)}
                                        </button>
                                    ))
                                ) : (
                                    <p className='text-slate-500'>No slots available for this day.</p>
                                )}
                            </div>

                            {/* Login or book button */}
                            {!token ? (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-8">
                                    <div className="text-center">
                                        <p className="text-blue-800 font-medium mb-4">
                                            Please login to book an appointment
                                        </p>
                                        <button
                                            onClick={() => navigate('/login')}
                                            className="bg-primary text-white font-bold px-8 py-3 rounded-md hover:bg-primary/90 transition-colors"
                                        >
                                            Login to Book
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    disabled={!slotTime || hasExistingAppointment}
                                    onClick={bookAppointment}
                                    className='bg-primary text-stone-800 font-bold px-12 py-3 rounded-md my-8 transition-all disabled:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-400 hover:bg-opacity-90'
                                >
                                    Book Appointment
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-slate-500 text-lg">
                                This doctor is currently not accepting appointments.
                            </p>
                            <button
                                onClick={() => navigate('/doctors')}
                                className="mt-4 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
                            >
                                Find Other Doctors
                            </button>
                        </div>
                    )}
                </div>
                <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
            </div>
        </div>
    ) : null;
};

export default Appointment;
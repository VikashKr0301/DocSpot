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

    const navigate = useNavigate();

    const fetchDocInfo = async () => {
        const docInfoData = doctors.find((doc) => doc._id === docId);
        setDocInfo(docInfoData);
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

    // Original logic for generating available time slots
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
            getAvailableSolts();
        }
    }, [docInfo]);

    return docInfo ? (
        <div className='bg-slate-50 py-12'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
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
                    <h3 className='text-2xl font-bold text-slate-800 mb-4'>Book a Slot</h3>
                    <div className='flex gap-3 items-center w-full overflow-x-auto no-scrollbar pb-3'>
                        {docSlots.length > 0 && docSlots.map((item, index) => (
                            <button onClick={() => setSlotIndex(index)} key={index} className={`flex flex-col items-center justify-center text-center py-3 w-16 h-20 rounded-lg cursor-pointer flex-shrink-0 transition-colors ${slotIndex === index ? 'bg-primary text-stone-800 font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                                <p className='text-xs'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                                <p className='text-xl font-bold'>{item[0] && item[0].datetime.getDate()}</p>
                            </button>
                        ))}
                    </div>

                    <div className='flex items-center gap-3 w-full overflow-x-auto mt-6 no-scrollbar pb-3'>
                        {docSlots.length > 0 && docSlots[slotIndex].length > 0 ? (
                            docSlots[slotIndex].map((item) => (
                                <button onClick={() => setSlotTime(item.time)} key={item.time} className={`text-sm font-medium flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-colors ${item.time === slotTime ? 'bg-primary text-stone-800' : 'text-slate-600 border border-slate-300 hover:bg-slate-100'}`}>
                                    {item.displayTime || formatTimeTo12Hour(item.time)}
                                </button>
                            ))
                        ) : (
                            <p className='text-slate-500'>No slots available for this day.</p>
                        )}
                    </div>

                    <button disabled={!slotTime} onClick={bookAppointment} className='bg-primary text-stone-800 font-bold px-12 py-3 rounded-md my-8 transition-all disabled:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-400 hover:bg-opacity-90'>
                        Book Appointment
                    </button>
                </div>
                <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
            </div>
        </div>
    ) : null;
};

export default Appointment;
import React, { useEffect, useContext } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { FaCalendarCheck } from "react-icons/fa";

const DoctorAppointments = () => {
    const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext);
    const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

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
        if (dToken) {
            getAppointments();
        }
    }, [dToken]);

    const StatusBadge = ({ text, colorClass }) => (
        <p className={`text-xs font-semibold px-2.5 py-1 rounded-full text-center ${colorClass}`}>
            {text}
        </p>
    );

    return (
        <div className='ml-16 md:ml-64 pt-24 px-4 sm:px-6 lg:px-8 w-full min-h-screen bg-[#F8F9FD]'>
            <div className='flex items-center gap-3 mb-6'>
                <FaCalendarCheck className='text-3xl text-primary' />
                <h1 className='text-2xl font-bold text-slate-800'>Your Appointments</h1>
            </div>

            <div className='bg-white border border-slate-200 rounded-lg shadow-sm text-sm overflow-x-auto'>
                {/* Table Header */}
                <div className='hidden sm:grid grid-cols-[0.3fr_2fr_1fr_0.5fr_1.5fr_0.5fr_1.2fr] items-center py-3 px-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-600'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Payment</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Fees</p>
                    <p className='text-center'>Action</p>
                </div>

                {appointments.length > 0 ? (
                    appointments.map((item, index) => (
                        <div className='flex flex-wrap justify-between items-center gap-y-3 gap-x-4 sm:grid sm:grid-cols-[0.3fr_2fr_1fr_0.5fr_1.5fr_0.5fr_1.2fr] text-slate-700 p-4 border-b border-slate-200 last:border-b-0 hover:bg-slate-50/50' key={item._id}>
                            <p className='text-slate-500 font-medium max-sm:hidden'>{index + 1}</p>

                            <div className='flex items-center gap-3 font-medium'>
                                <img src={item.userData.image} className='w-9 h-9 rounded-full object-cover' alt={item.userData.name} />
                                <p>{item.userData.name}</p>
                            </div>

                            <div>
                                <StatusBadge text={item.payment ? 'Online' : 'CASH'} colorClass={item.payment ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'} />
                            </div>

                            <p className='text-slate-500 max-sm:hidden'>{calculateAge(item.userData.dob) || 'N/A'}</p>

                            <p>{slotDateFormat(item.slotDate)}, {formatTimeTo12Hour(item.slotTime)}</p>

                            <p className='text-slate-500 font-medium'>{currency}{isNaN(item.amount) ? 'N/A' : item.amount}</p>

                            <div className='flex justify-center items-center'>
                                {item.cancelled ? (
                                    <StatusBadge text="Cancelled" colorClass="bg-red-100 text-red-800" />
                                ) : item.isCompleted ? (
                                    <StatusBadge text="Completed" colorClass="bg-green-100 text-green-800" />
                                ) : (
                                    <div className='flex items-center gap-2'>
                                        <button onClick={() => cancelAppointment(item._id)} className='text-xs font-semibold border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition-colors'>Cancel</button>
                                        <button onClick={() => completeAppointment(item._id)} className='text-xs font-semibold bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors'>Complete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-center p-10'>
                        <p className='text-slate-500'>You have no appointments scheduled.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorAppointments;
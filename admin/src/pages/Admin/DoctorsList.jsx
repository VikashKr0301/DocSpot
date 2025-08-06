import React, { useEffect, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { FaListUl } from "react-icons/fa";

const DoctorsList = () => {
    const { doctors, changeAvailability, aToken, getAllDoctors } = useContext(AdminContext);

    useEffect(() => {
        if (aToken) {
            getAllDoctors();
        }
    }, [aToken, getAllDoctors]);

    return (
        <div className='ml-16 md:ml-64 pt-24 px-4 sm:px-6 lg:px-8 w-full min-h-screen bg-[#F8F9FD]'>
            <div className='flex items-center gap-3 mb-6'>
                <FaListUl className='text-3xl text-primary' />
                <h1 className='text-2xl font-bold text-slate-800'>All Doctors</h1>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                {doctors.map((item) => (
                    <div className='bg-white border border-slate-200 rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-xl' key={item._id}>
                        <div className='aspect-w-1 aspect-h-1 bg-primary/10'>
                            <img
                                className='w-full h-full object-cover object-center'
                                src={item.image}
                                alt={item.name}
                            />
                        </div>
                        <div className='p-4'>
                            <p className='text-slate-800 text-lg font-semibold truncate'>{item.name}</p>
                            <p className='text-slate-500 text-sm'>{item.speciality}</p>

                            <div className='mt-4 flex items-center justify-between'>
                                <label htmlFor={`available-${item._id}`} className='text-sm font-medium text-slate-600'>Available</label>
                                <label htmlFor={`available-${item._id}`} className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input
                                            id={`available-${item._id}`}
                                            type="checkbox"
                                            className="sr-only"
                                            checked={item.available}
                                            onChange={() => changeAvailability(item._id)}
                                        />
                                        <div className={`block w-12 h-6 rounded-full ${item.available ? 'bg-primary' : 'bg-slate-300'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${item.available ? 'translate-x-6' : ''}`}></div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorsList;
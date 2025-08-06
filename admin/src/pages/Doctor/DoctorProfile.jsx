import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaUserCircle } from "react-icons/fa";

const DoctorProfile = () => {
    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext);
    const { currency, backendUrl } = useContext(AppContext);
    const [isEdit, setIsEdit] = useState(false);

    // This is a handler for the "Cancel" button
    const handleCancel = () => {
        setIsEdit(false); // Exit edit mode
        getProfileData(); // Fetch the latest profile data
    };

    const updateProfile = async () => {
        try {
            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            };
            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } });

            if (data.success) {
                toast.success(data.message);
                setIsEdit(false);
                await getProfileData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    useEffect(() => {
        if (dToken) {
            getProfileData();
        }
    }, [dToken]);

    // This is a reusable style for input fields
    const inputStyle = 'w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors bg-slate-50';

    return profileData && (
        <div className='ml-16 md:ml-64 pt-24 px-4 sm:px-6 lg:px-8 w-full min-h-screen bg-[#F8F9FD]'>
            <div className='flex items-center gap-3 mb-6'>
                <FaUserCircle className='text-3xl text-primary' />
                <h1 className='text-2xl font-bold text-slate-800'>My Profile</h1>
            </div>

            <div className='bg-white p-6 sm:p-8 rounded-lg shadow-md border border-slate-200'>
                <div className='flex flex-col md:flex-row gap-8'>
                    {/* --- Left Side: Image and Static Info --- */}
                    <div className='flex-shrink-0 md:w-1/3 text-center md:text-left'>
                        <img className='w-40 h-40 rounded-full object-cover mx-auto md:mx-0 border-4 border-white shadow-lg' src={profileData.image} alt={profileData.name} />
                        <h2 className='text-2xl font-bold text-slate-800 mt-4'>{profileData.name}</h2>
                        <p className='text-slate-500'>{profileData.degree}</p>
                        <p className='text-primary font-semibold mt-1'>{profileData.speciality}</p>
                        <p className='mt-2'><span className='py-0.5 px-3 bg-slate-100 text-xs font-semibold rounded-full'>{profileData.experience}</span></p>
                    </div>

                    {/* --- Right Side: Editable Info --- */}
                    <div className='flex-1 space-y-6'>
                        <div>
                            <label className='block text-sm font-medium text-slate-700 mb-1'>About Me</label>
                            {isEdit ?
                                <textarea onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} className={`${inputStyle} min-h-32`} value={profileData.about} /> :
                                <p className='text-slate-600 text-sm leading-relaxed'>{profileData.about}</p>
                            }
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div>
                                <label className='block text-sm font-medium text-slate-700 mb-1'>Appointment Fee ({currency})</label>
                                {isEdit ?
                                    <input type='number' onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} className={inputStyle} /> :
                                    <p className='text-slate-600'>{currency}{profileData.fees}</p>
                                }
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-slate-700 mb-1'>Availability</label>
                                <div className='flex items-center'>
                                    <label htmlFor="available" className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input id="available" type="checkbox" className="sr-only" checked={profileData.available} onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} />
                                            <div className={`block w-12 h-6 rounded-full ${profileData.available ? 'bg-primary' : 'bg-slate-300'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${profileData.available ? 'translate-x-6' : ''}`}></div>
                                        </div>
                                        <div className="ml-3 text-slate-600 font-medium text-sm">{profileData.available ? "Available" : "Not Available"}</div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-slate-700 mb-1'>Address</label>
                            {isEdit ?
                                <div className='space-y-2'>
                                    <input type='text' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData.address.line1} className={inputStyle} placeholder='Clinic/Hospital Name, Building' />
                                    <input type='text' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileData.address.line2} className={inputStyle} placeholder='Area, City, Pincode' />
                                </div> :
                                <p className='text-slate-600'>{profileData.address.line1}, {profileData.address.line2}</p>
                            }
                        </div>

                        {/* --- Action Buttons --- */}
                        <div className='pt-4 flex gap-3'>
                            {isEdit ? (
                                <>
                                    <button onClick={updateProfile} className='bg-primary text-stone-800 font-bold px-8 py-2 rounded-md hover:bg-opacity-90 transition-all'>Save Profile</button>
                                    <button onClick={handleCancel} className='bg-slate-200 text-slate-800 font-bold px-8 py-2 rounded-md hover:bg-slate-300 transition-all'>Cancel</button>
                                </>
                            ) : (
                                <button onClick={() => setIsEdit(true)} className='bg-primary text-stone-800 font-bold px-8 py-2 rounded-md hover:bg-opacity-90 transition-all'>Edit Profile</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
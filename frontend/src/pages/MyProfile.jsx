import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { FaCamera } from "react-icons/fa";

const MyProfile = () => {
    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext);

    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(null);

    // This is a handler for the "Cancel" button
    const handleCancel = () => {
        setIsEdit(false);
        setImage(null); // Discard the selected image
        loadUserProfileData(); // Reload original data to discard any input changes
    };

    // Original logic for updating the user profile
    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();
            formData.append('name', userData.name);
            formData.append('phone', userData.phone);
            formData.append('address', JSON.stringify(userData.address));
            formData.append('gender', userData.gender);
            formData.append('dob', userData.dob);
            if (image) {
                formData.append('image', image);
            }

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } });

            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();
                setIsEdit(false);
                setImage(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    return userData ? (

        <div className='bg-slate-50 py-12'>
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='bg-white p-6 sm:p-8 rounded-lg shadow-md'>
                    <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6'>

                        {/* --- Profile Picture Section --- */}
                        <div className='flex-shrink-0'>
                            {isEdit ? (
                                <label htmlFor='image' className='relative cursor-pointer group'>
                                    <img className='w-32 h-32 rounded-full object-cover border-4 border-white shadow-sm' src={image ? URL.createObjectURL(image) : userData.image} alt="Profile Preview" />
                                    <div className='absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                                        <FaCamera className='text-white text-3xl' />
                                    </div>
                                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                                </label>
                            ) : (
                                <img className='w-32 h-32 rounded-full object-cover border-4 border-white shadow-sm' src={userData.image} alt="User Profile" />
                            )}
                        </div>

                        {/* --- Main Info Section --- */}
                        <div className='flex-1 w-full'>
                            {isEdit ? (
                                <input className='w-full text-3xl font-bold text-slate-800 bg-slate-100 p-2 rounded-md border border-slate-300' type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
                            ) : (
                                <p className='text-3xl font-bold text-slate-800'>{userData.name}</p>
                            )}

                            <hr className='my-6 border-slate-200' />


                            <div className='space-y-6'>
                                <div>
                                    <h3 className='text-sm font-bold text-primary uppercase tracking-wider mb-3'>Contact Information</h3>
                                    <div className='grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-x-4 gap-y-3 text-sm'>
                                        <p className='font-medium text-slate-500'>Email Address:</p>
                                        <p className='text-slate-700'>{userData.email}</p>

                                        <p className='font-medium text-slate-500'>Phone:</p>
                                        {isEdit ? <input className='w-full bg-slate-100 p-2 rounded-md border border-slate-300' type="text" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} /> : <p className='text-slate-700'>{userData.phone}</p>}

                                        <p className='font-medium text-slate-500'>Address:</p>
                                        {isEdit ? <div className='space-y-2'><input className='w-full bg-slate-100 p-2 rounded-md border border-slate-300' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} /><input className='w-full bg-slate-100 p-2 rounded-md border border-slate-300' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} /></div> : <p className='text-slate-700'>{userData.address.line1}, {userData.address.line2}</p>}
                                    </div>
                                </div>
                                <div>
                                    <h3 className='text-sm font-bold text-primary uppercase tracking-wider mb-3'>Basic Information</h3>
                                    <div className='grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-x-4 gap-y-3 text-sm'>
                                        <p className='font-medium text-slate-500'>Gender:</p>
                                        {isEdit ? <select className='w-full bg-slate-100 p-2 rounded-md border border-slate-300' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender} ><option value="Not Selected">Not Selected</option><option value="Male">Male</option><option value="Female">Female</option></select> : <p className='text-slate-700'>{userData.gender}</p>}

                                        <p className='font-medium text-slate-500'>Birthday:</p>
                                        {isEdit ? <input className='w-full bg-slate-100 p-2 rounded-md border border-slate-300' type='date' onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} /> : <p className='text-slate-700'>{userData.dob}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* --- Action Buttons --- */}
                            <div className='mt-8 flex gap-3'>
                                {isEdit ? (
                                    <>
                                        <button onClick={updateUserProfileData} className='bg-primary text-stone-800 font-bold px-8 py-2 rounded-md hover:bg-opacity-90 transition-all'>Save Changes</button>

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
        </div>
    ) : null;
};

export default MyProfile;
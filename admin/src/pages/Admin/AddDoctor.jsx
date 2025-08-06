import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { FaUserMd, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const AddDoctor = () => {
    // Form State
    const [docImg, setDocImg] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [experience, setExperience] = useState('1 Year');
    const [fees, setFees] = useState('');
    const [about, setAbout] = useState('');
    const [speciality, setSpeciality] = useState('General physician');
    const [degree, setDegree] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');

    // Control State
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    const { backendUrl } = useContext(AppContext);
    const { aToken } = useContext(AdminContext);

    const resetForm = () => {
        setDocImg(false);
        setName('');
        setPassword('');
        setEmail('');
        setAddress1('');
        setAddress2('');
        setDegree('');
        setAbout('');
        setFees('');
        setExperience('1 Year');
        setSpeciality('General physician');
        document.getElementById('doc-img').value = '';
    };

    // Open confirmation modal
    const onReviewHandler = (event) => {
        event.preventDefault();
        if (!docImg) {
            return toast.error('Please select a profile picture for the doctor.');
        }
        setIsConfirming(true);
    };

    // Handle the final submission
    const onConfirmHandler = async () => {
        setIsLoading(true);

        const formData = new FormData();
        formData.append('image', docImg);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('experience', experience);
        formData.append('fees', Number(fees));
        formData.append('about', about);
        formData.append('speciality', speciality);
        formData.append('degree', degree);
        formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, { headers: { aToken } });
            if (data.success) {
                toast.success(data.message);
                resetForm();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred.');
        } finally {
            setIsLoading(false);
            setIsConfirming(false);
        }
    };

    const inputStyle = 'w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors';

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 }
    };

    return (
        <div className='ml-16 md:ml-64 pt-24 px-4 sm:px-6 lg:px-8 w-full min-h-screen bg-[#F8F9FD]'>
            <div className='flex items-center gap-3 mb-6'>
                <FaUserMd className='text-3xl text-primary' />
                <h1 className='text-2xl font-bold text-slate-800'>Add New Doctor</h1>
            </div>

            <form id="add-doctor-form" onSubmit={onReviewHandler} className='bg-white p-6 rounded-lg shadow-md border border-slate-200'>
                <div className='mb-6'>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>Doctor's Picture</label>
                    <label htmlFor="doc-img" className='cursor-pointer flex items-center gap-4'>
                        <img className='w-24 h-24 rounded-full object-cover border-2 border-dashed border-slate-300 p-1' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="Upload preview" />
                        <div className="flex flex-col">
                            <span className='text-primary font-semibold'>Click to upload</span>
                            <span className='text-slate-500 text-xs'>PNG, JPG (MAX. 2MB)</span>
                        </div>
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" accept="image/*" hidden required />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4'>
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-slate-700 mb-1'>Full Name</label>
                            <input onChange={e => setName(e.target.value)} value={name} className={inputStyle} type="text" placeholder='e.g., Dr. Vikax Kr' required />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-slate-700 mb-1'>Email Address</label>
                            <input onChange={e => setEmail(e.target.value)} value={email} className={inputStyle} type="email" placeholder='e.g., name@example.com' required />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-slate-700 mb-1'>Set Password</label>
                            <input onChange={e => setPassword(e.target.value)} value={password} className={inputStyle} type="password" placeholder='Enter a secure password' required />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-slate-700 mb-1'>Experience</label>
                                <select onChange={e => setExperience(e.target.value)} value={experience} className={inputStyle} >
                                    {[...Array(20)].map((_, i) => {
                                        const yearText = `${i + 1} Year${i > 0 ? 's' : ''}`;
                                        return <option key={i} value={yearText}>{yearText}</option>
                                    })}
                                </select>
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-slate-700 mb-1'>Fees ({import.meta.env.VITE_CURRENCY})</label>
                                <input onChange={e => setFees(e.target.value)} value={fees} className={inputStyle} type="number" placeholder='e.g., 500' required />
                            </div>
                        </div>
                    </div>
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-slate-700 mb-1'>Speciality</label>
                            <select onChange={e => setSpeciality(e.target.value)} value={speciality} className={inputStyle}>
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                                <option value="Cardiologist">Cardiologist</option>
                                <option value="Orthopedician">Orthopedician</option>
                            </select>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-slate-700 mb-1'>Degree</label>
                            <input onChange={e => setDegree(e.target.value)} value={degree} className={inputStyle} type="text" placeholder='e.g., MBBS, MD' required />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-slate-700 mb-1'>Address</label>
                            <input onChange={e => setAddress1(e.target.value)} value={address1} className={inputStyle} type="text" placeholder='Clinic/Hospital Name, Building' required />
                            <input onChange={e => setAddress2(e.target.value)} value={address2} className={`${inputStyle} mt-2`} type="text" placeholder='Area, City, Pincode' required />
                        </div>
                    </div>
                </div>

                <div className='mt-6'>
                    <label className='block text-sm font-medium text-slate-700 mb-1'>About Doctor</label>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className={`${inputStyle} min-h-24`} placeholder='Write a brief introduction about the doctor...' required></textarea>
                </div>

                <div className='mt-6 flex justify-end'>
                    <button type='submit' className='bg-primary text-white font-bold px-8 py-2.5 rounded-md hover:bg-primary/90 transition-all'>Review & Proceed</button>
                </div>
            </form>

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
                            <h2 className="text-2xl font-bold text-slate-800">Confirm Details</h2>
                            <p className="text-slate-500 mt-2 mb-6">Please review the doctor's information before adding them to the system.</p>

                            <div className="text-left bg-slate-50 p-4 rounded-md border border-slate-200 space-y-2">
                                <p><strong>Name:</strong> {name}</p>
                                <p><strong>Email:</strong> {email}</p>
                                <p><strong>Speciality:</strong> {speciality}</p>
                            </div>

                            <div className="mt-6 flex justify-center gap-4">
                                <button
                                    onClick={() => setIsConfirming(false)}
                                    className="px-6 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirmHandler}
                                    className="px-6 py-2 rounded-md bg-primary text-white font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:bg-primary/50"
                                    disabled={isLoading}
                                >
                                    {isLoading && <FaSpinner className="animate-spin" />}
                                    {isLoading ? 'Adding...' : 'Confirm & Add Doctor'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AddDoctor;

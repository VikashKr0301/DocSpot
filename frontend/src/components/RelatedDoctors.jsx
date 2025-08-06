import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const RelatedDoctors = ({ speciality, docId }) => {
    const { doctors } = useContext(AppContext);
    const [relDoc, setRelDoc] = useState([]);

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId);
            setRelDoc(doctorsData);
        }
    }, [doctors, speciality, docId]);

    if (relDoc.length === 0) {
        return null;
    }

    return (

        <div className='flex flex-col items-center gap-5 my-16 text-slate-800 px-4 md:px-10'>
            <h2 className='text-3xl font-semibold'>Related Doctors</h2>
            <p className='max-w-xl text-center text-slate-600'>Here are other trusted doctors with the same speciality.</p>


            <div className='w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-5'>
                {relDoc.map((item) => (

                    <Link
                        to={`/appointment/${item._id}`}
                        onClick={() => window.scrollTo(0, 0)}
                        className='block border border-gray-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl'
                        key={item._id}
                    >

                        <div className='aspect-square bg-primary/20'>
                            <img
                                className='w-full h-full object-cover'
                                src={item.image}

                                alt={item.name}
                            />
                        </div>
                        <div className='p-4'>
                            <div className={`flex items-center gap-2 text-sm font-medium ${item.available ? 'text-green-600' : "text-gray-500"}`}>
                                <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p>
                                <p>{item.available ? 'Available' : "Not Available"}</p>
                            </div>
                            <p className='text-gray-800 text-lg font-semibold mt-1 truncate'>{item.name}</p>
                            <p className='text-gray-500 text-sm'>{item.speciality}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RelatedDoctors;
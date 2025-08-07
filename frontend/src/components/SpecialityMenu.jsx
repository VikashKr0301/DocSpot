import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';

const SpecialityMenu = () => {
    return (

        <div id='speciality' className='flex flex-col items-center gap-5 py-16 px-4 md:px-8'>


            <h1 className='text-3xl font-bold text-slate-800'>Find by <span className='text-primary'>Speciality</span></h1>
            <p className='max-w-xl text-center text-slate-600'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>


            <div className='w-full max-w-7xl flex justify-start gap-4 md:gap-6 pt-8 overflow-x-auto no-scrollbar'>
                {specialityData.map((item, index) => (

                    <Link
                        to={`/doctors/${item.speciality}`}
                        onClick={() => scrollTo(0, 0)}
                        className='flex flex-col items-center text-center group cursor-pointer flex-shrink-0 w-36 transition-transform duration-300 hover:-translate-y-2'
                        key={index}
                    >

                        <img
                            className='w-28 h-28 object-contain p-5 bg-primary/10 rounded-full transition-colors group-hover:bg-primary/20'
                            src={item.image}
                            alt=""
                        />

                        <p className='font-semibold text-slate-700 mt-4'>{item.speciality}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SpecialityMenu;
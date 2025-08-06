import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Link, useParams } from 'react-router-dom';
import { FaFilter } from "react-icons/fa"; // Using an icon for the mobile filter button

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);

  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  // Refactored: A single list of specialities to avoid code repetition
  const specialitiesList = [
    'General physician', 'Gynecologist', 'Dermatologist',
    'Pediatricians', 'Neurologist', 'Gastroenterologist', 'Cardiologist', 'Orthopedician'
  ];

  useEffect(() => {
    // Simplified filter logic
    if (speciality) {
      setFilteredDoctors(doctors.filter(doc => doc.speciality === speciality));
    } else {
      setFilteredDoctors(doctors); // If no speciality in URL, show all
    }
    window.scrollTo(0, 0);
  }, [doctors, speciality]);

  //  Reusable style strings for cleaner JSX
  const activeFilterClasses = "bg-primary text-stone-800 font-semibold";
  const inactiveFilterClasses = "bg-slate-100 hover:bg-slate-200";

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      {/* --- Page Header --- */}
      <div className='text-center mb-12'>
        <h1 className='text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight'>
          Find Your <span className='text-primary'>Doctor</span>
        </h1>
        <p className='mt-2 text-lg text-slate-500'>Browse by speciality or see all available healthcare professionals.</p>
      </div>

      {/* --- Main Layout: Filters + Grid --- */}
      <div className='flex flex-col sm:flex-row items-start gap-8'>

        {/* --- Filter Toggle for Mobile --- */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`flex items-center gap-2 py-2 px-4 border rounded-md text-sm font-semibold transition-colors sm:hidden w-full justify-center ${showFilter ? 'bg-primary/20 text-primary' : 'bg-slate-100'}`}
        >
          <FaFilter /> Filters
        </button>

        {/* --- Filter Sidebar --- */}
        <div className={`flex-col gap-2 text-sm text-slate-600 ${showFilter ? 'flex w-full' : 'hidden sm:flex'}`}>
          <h3 className='text-lg font-bold text-slate-800 mb-2 px-1'>Specialities</h3>
          <Link to='/doctors' className={`block w-full sm:w-auto px-4 py-2 rounded-md transition-colors ${!speciality ? activeFilterClasses : inactiveFilterClasses}`}>
            All Doctors
          </Link>
          {/*  Generating filters by mapping over the array */}
          {specialitiesList.map(spec => (
            <Link
              key={spec}
              to={`/doctors/${spec}`}
              className={`block w-full sm:w-auto px-4 py-2 rounded-md transition-colors ${speciality === spec ? activeFilterClasses : inactiveFilterClasses}`}
            >
              {spec}
            </Link>
          ))}
        </div>

        {/* --- Doctors Grid --- */}
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((item) => (
              //  Using the consistent, themed Doctor Card component style
              <Link
                to={`/appointment/${item._id}`}
                className='block border border-gray-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl'
                key={item._id}
              >
                <div className='aspect-square bg-primary/20'>
                  <img className='w-full h-full object-cover' src={item.image} alt={item.name} />
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
            ))
          ) : (
            // Message for when no doctors match the filter
            <p className='col-span-full text-center text-slate-500 py-10'>No doctors found for this speciality.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
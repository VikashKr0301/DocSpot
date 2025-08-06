import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';
import { FaTachometerAlt, FaCalendarCheck, FaUserPlus, FaListUl, FaUserCircle } from "react-icons/fa";

// Data for Admin links
const adminLinks = [
  { to: '/admin-dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
  { to: '/all-appointments', icon: <FaCalendarCheck />, label: 'Appointments' },
  { to: '/add-doctor', icon: <FaUserPlus />, label: 'Add Doctor' },
  { to: '/doctor-list', icon: <FaListUl />, label: 'Doctors List' },
];

// Data for Doctor links
const doctorLinks = [
  { to: '/doctor-dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
  { to: '/doctor-appointments', icon: <FaCalendarCheck />, label: 'Appointments' },
  { to: '/doctor-profile', icon: <FaUserCircle />, label: 'Profile' },
];

const Sidebar = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);

  // NavLink styles
  const navLinkClassName = ({ isActive }) =>
    `flex items-center justify-center md:justify-start gap-4 py-3 px-4 md:px-6 transition-colors duration-200 w-full` +
    (isActive
      ? 'bg-primary/10 text-primary md:border-r-4 border-primary'
      : 'hover:bg-slate-100');

  return (
    <div className='fixed left-0 top-16 h-screen w-16 md:w-64 lg:w-64 bg-white border-r border-slate-200 z-40 overflow-y-auto'>
      <div className='text-slate-600 font-medium pt-5'>

        {aToken && (
          <ul>
            {adminLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={navLinkClassName}>
                  <span className='text-xl'>{link.icon}</span>
                  <p className='hidden md:block'>{link.label}</p>
                </NavLink>
              </li>
            ))}
          </ul>
        )}

        {dToken && (
          <ul>
            {doctorLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={navLinkClassName}>
                  <span className='text-xl'>{link.icon}</span>
                  <p className='hidden md:block'>{link.label}</p>
                </NavLink>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
};

export default Sidebar;
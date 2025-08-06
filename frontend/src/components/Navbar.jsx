import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMenu } from 'react-icons/fi';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  // --- State to track hovered link for the sliding underline ---
  const [hoveredPath, setHoveredPath] = useState(null);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/doctors', label: 'ALL DOCTORS' },
    { path: '/about', label: 'ABOUT' },
    { path: '/contact', label: 'CONTACT' },
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.1 } }
  };

  // --- Variants for staggering mobile menu items ---
  const mobileListVariants = {
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    },
    hidden: {}
  };

  const mobileItemVariants = {
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    hidden: { opacity: 0, x: -20 }
  };

  return (
    <div className='sticky top-0 z-50 bg-white border-b border-gray-200'>
      <div className='flex items-center justify-between py-4 px-4 lg:px-8 max-w-7xl mx-auto'>
        <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate('/')}>
          <img className='w-10' src={assets.logo} alt="DocSpot Logo" />
          <span className='font-bold text-xl text-gray-800'>DocSpot</span>
        </div>

        {/* ---- Desktop Menu with Sliding Underline ---- */}
        <ul onMouseLeave={() => setHoveredPath(null)} className='lg:flex items-center gap-8 font-medium hidden'>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li
                key={link.path}
                onMouseEnter={() => setHoveredPath(link.path)}
                className="relative py-2"
              >
                <NavLink to={link.path} className={`relative transition-colors ${hoveredPath === link.path || isActive ? 'text-primary' : 'text-gray-600'}`}>
                  {link.label}
                </NavLink>
                {(isActive || hoveredPath === link.path) && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-full"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        <div className='flex items-center gap-4'>
          {token && userData ? (
            <div className='group relative hidden lg:flex cursor-pointer items-center gap-2'>
              <img className='w-10 h-10 rounded-full object-cover border-2 border-primary/50' src={userData.image} alt="User" />
              <img className='w-2.5 transition-transform duration-300 group-hover:rotate-180' src={assets.dropdown_icon} alt="" />
              <AnimatePresence>
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className='absolute top-full right-0 z-20 mt-3 hidden min-w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-300 group-hover:block'>
                  <div className='flex flex-col gap-1 p-2 text-gray-700'>
                    <p onClick={() => navigate('/my-profile')} className='cursor-pointer rounded-md px-3 py-2 hover:bg-primary/10 hover:text-primary'>My Profile</p>
                    <p onClick={() => navigate('/my-appointments')} className='cursor-pointer rounded-md px-3 py-2 hover:bg-primary/10 hover:text-primary'>My Appointments</p>
                    <hr className='my-1' />
                    <p onClick={logout} className='cursor-pointer rounded-md px-3 py-2 hover:bg-red-500/10 hover:text-red-500'>Logout</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className='hidden rounded-full bg-primary px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 lg:block'>
              Create account
            </button>
          )}
          <button onClick={() => setShowMenu(true)} className='p-2 lg:hidden text-2xl'>
            <FiMenu />
          </button>
        </div>

        {/* ---- Mobile Menu with Staggered Items ---- */}
        <AnimatePresence>
          {showMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMenu(false)}
                className="fixed inset-0 bg-black/40 z-20 lg:hidden"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`fixed top-0 right-0 bottom-0 z-30 w-4/5 max-w-sm bg-white lg:hidden`}
              >
                <div className='h-full flex flex-col'>
                  <div className='flex items-center justify-between px-5 py-6 border-b'>
                    <span className='font-bold text-xl text-gray-800'>DocSpot</span>
                    <button onClick={() => setShowMenu(false)} className='p-2 text-2xl'>
                      <FiX />
                    </button>
                  </div>
                  <motion.ul
                    variants={mobileListVariants}
                    initial="hidden"
                    animate="visible"
                    className='flex-grow mt-8 flex flex-col gap-4 px-5 text-lg font-medium'>
                    {navLinks.map((link) => (
                      <motion.li key={link.path} variants={mobileItemVariants}>
                        <NavLink onClick={() => setShowMenu(false)} to={link.path} className={({ isActive }) => `block w-full text-center rounded-lg py-3 ${isActive ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}>
                          {link.label}
                        </NavLink>
                      </motion.li>
                    ))}
                  </motion.ul>

                  <div className="mt-auto border-t p-5">
                    {token && userData ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <img className='w-12 h-12 rounded-full object-cover border-2 border-primary/50' src={userData.image} alt="User" />
                          <div>
                            <p className="font-semibold text-gray-700">Welcome,</p>
                            <p className="text-primary font-bold">{userData.name}</p>
                          </div>
                        </div>
                        <div className='flex flex-col gap-2 text-center text-gray-700 font-medium'>
                          <p onClick={() => { navigate('/my-profile'); setShowMenu(false); }} className='cursor-pointer rounded-md py-2.5 hover:bg-primary/10 hover:text-primary'>My Profile</p>
                          <p onClick={() => { navigate('/my-appointments'); setShowMenu(false); }} className='cursor-pointer rounded-md py-2.5 hover:bg-primary/10 hover:text-primary'>My Appointments</p>
                          <p onClick={() => { logout(); setShowMenu(false); }} className='cursor-pointer rounded-md py-2.5 hover:bg-red-500/10 text-red-500'>Logout</p>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => { navigate('/login'); setShowMenu(false); }} className='w-full rounded-full bg-primary py-3 font-semibold text-white'>
                        Login / Create Account
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
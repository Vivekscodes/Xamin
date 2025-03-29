import React from 'react'

const Navbar = () => {
    return (
        <div className='flex items-center justify-between py-4 px-6 bg-white shadow-lg border-b border-gray-200 rounded-lg mx-4 mt-4'>
            <div className='flex items-center'>
                <h1 className='text-2xl font-bold bg-gradient-to-r from-teal-600 to-orange-600 bg-clip-text text-transparent'>
                    Admin Panel
                </h1>
            </div>

            <div className='flex items-center gap-4'>
                <p className='text-gray-700 font-medium max-sm:hidden'>Hi, Anant</p>
                <div className='relative group'>
                    <div className='w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-orange-500 flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-md transition-shadow'>
                        A
                    </div>
                    <div className='absolute hidden group-hover:block top-full right-0 mt-2 w-48 z-10'>
                        <ul className='bg-white rounded-xl shadow-xl border border-gray-100'>
                            <li className='px-4 py-3 hover:bg-gray-50 transition-colors duration-200 text-gray-700 cursor-pointer flex items-center gap-2 rounded-xl'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
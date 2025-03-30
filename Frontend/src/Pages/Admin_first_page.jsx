import React from 'react'
import { Link } from 'react-router-dom'

const Admin_first_page = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 p-8'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-4xl font-bold text-center mb-12 text-gray-800 relative'>
          <span className='relative inline-block after:content-[""] after:absolute after:-bottom-4 after:left-1/4 after:w-1/2 after:h-1 after:bg-teal-500'> 
            Admin Dashboard
          </span>
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8'>
          
          {/* Paper Setter Card */}
          <div className='bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100'>
            <div className='text-teal-600 mb-4'>
              {/* You can add an icon here */}
            </div>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Paper Setter</h2>
            <p className='text-gray-600 mb-6'>View and manage paper setter activities and history.</p>
            <Link 
              to="/admin/paper-setter" 
              className='inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-300 font-medium w-full text-center'
            >
              View Details →
            </Link>
          </div>

          {/* Formatter Card */}
          <div className='bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100'>
            <div className='text-teal-600 mb-4'>
              {/* You can add an icon here */}
            </div>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Paper Formatter</h2>
            <p className='text-gray-600 mb-6'>Access and review paper formatting history and tasks.</p>
            <Link 
              to="/admin/formatter" 
              className='inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-300 font-medium w-full text-center'
            >
              View Details →
            </Link>
          </div>

          {/* Board Member Card */}
          <div className='bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100'>
            <div className='text-teal-600 mb-4'>
              {/* You can add an icon here */}
            </div>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Board Member</h2>
            <p className='text-gray-600 mb-6'>Oversee and approve examination related decisions.</p>
            <Link 
              to="/admin/board-member" 
              className='inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-300 font-medium w-full text-center'
            >
              View Details →
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Admin_first_page
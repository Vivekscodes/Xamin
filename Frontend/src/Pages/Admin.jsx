import React from 'react'
import Navbar from '../Components/Navbar'
import Add_Exam from '../Components/Add_Exam'
import {useState} from 'react'
import axios from 'axios';


const Admin = () => {

  async function fetchUserRoleExams(userId) {
    try {
      
      const response = await axios.get(http://localhost:3000/exams/:);
      const allExams = response.data.data;
      
      const userRoleExams = {
        boardMember: allExams.filter(exam => exam.b_members.includes(userId)),
        paperFormatter: allExams.filter(exam => exam.p_formaters.includes(userId)),
        paperSetter: allExams.filter(exam => exam.papers.some(paper => paper.setter === userId))
      };
      
      return userRoleExams;
      
    
    } catch (error) {
      console.error('Error fetching user role exams:', error);
      throw error;
    }
  }


   
    const [isAddExamOpen, setIsAddExamOpen] = useState(false)

    const handleAddExam = (newExam) => {
        // Handle the new exam data here
        console.log('New exam:', newExam)
        setIsAddExamOpen(false)
      }
  const examData = [
    {
      id: 1,
      examName: "JEE Main 2024",
      duration: "3 hours",
      date: "2024-04-15",
      totalStudents: 1200000,
      status: "Upcoming"
    },
    {
      id: 2,
      examName: "NEET UG 2024",
      duration: "3.5 hours",
      date: "2024-05-05",
      totalStudents: 1800000,
      status: "Upcoming"
    },
    {
      id: 3,
      examName: "CUET UG 2024",
      duration: "4 hours",
      date: "2024-05-20",
      totalStudents: 1500000,
      status: "Upcoming"
    },
    {
      id: 4,
      examName: "JEE Advanced 2024",
      duration: "3 hours",
      date: "2024-06-10",
      totalStudents: 250000,
      status: "Upcoming"
    },
    {
      id: 5,
      examName: "GATE 2024",
      duration: "2.5 hours",
      date: "2024-02-10",
      totalStudents: 98000,
      status: "Completed"
    },
    {
      id: 6,
      examName: "CAT 2023",
      duration: "2 hours",
      date: "2023-11-26",
      totalStudents: 250000,
      status: "Completed"
    }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-b from-teal-50 to-orange-50'>
      <Navbar />
      <div className='px-4 sm:px-10 md:px-14 lg:px-28 py-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-6'>Exam Dashboard</h1>
        
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-semibold mb-4'>Recent Examinations</h2>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Exam Name</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Duration</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Date</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Students</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {examData.map((exam) => (
                  <tr key={exam.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>{exam.examName}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>{exam.duration}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>{exam.date}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>{exam.totalStudents}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        exam.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {exam.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <button 
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-teal-500 to-orange-500 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow duration-300 text-white"
        onClick={() => setIsAddExamOpen(true)}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 4v16m8-8H4" 
          />
        </svg>
      </button>

      <Add_Exam 
        isOpen={isAddExamOpen}
        onClose={() => setIsAddExamOpen(false)}
        onSubmit={handleAddExam}
      />
    </div>
  )
}

export default Admin
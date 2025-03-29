import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Student = () => {
  const navigate = useNavigate();
  const screenVideoRef = useRef(null);
  const webcamVideoRef = useRef(null);
  const securityIntervalRef = useRef(null);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [streams, setStreams] = useState({ screen: null, webcam: null });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 minutes exam duration

  // Clean up function to stop all media streams
  const cleanupStreams = useCallback(() => {
    Object.values(streams).forEach(stream => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    });
  }, [streams]);

  // Enhanced end exam function with reason logging
  const endExam = useCallback((reason = 'Exam completed') => {
    // Log the reason to a server (would implement API call here)
    console.log(`Exam ended: ${reason}`);
    
    // Clean up resources
    cleanupStreams();
    
    // Exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error('Error exiting fullscreen:', err));
    }
    
    // Clear security interval
    if (securityIntervalRef.current) {
      clearInterval(securityIntervalRef.current);
    }
    
    // Remove event listeners
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('contextmenu', handleContextMenu);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    
    // Notify user and redirect
    alert(`Exam ended: ${reason}`);
    setIsExamStarted(false);
    navigate('/');
  }, [cleanupStreams, navigate]);

  // Event handlers for security measures
  const handleKeydown = useCallback((e) => {
    const blockedKeys = ['Tab', 'F12', 'Escape'];
    if (e.ctrlKey || e.altKey || e.metaKey || blockedKeys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      
      // Log attempt but don't end exam for single violation
      console.warn('Blocked key combination:', e.key);
    }
  }, []);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      endExam('Tab switching detected');
    }
  }, [endExam]);

  // Initialize media streams with improved error handling
  const initializeStreams = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Request screen sharing
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          cursor: 'always',
          displaySurface: 'monitor' // Prefer entire monitor
        },
        audio: false
      });

      // Request webcam with better quality
      const webcamStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      // Store references to streams
      setStreams({ screen: screenStream, webcam: webcamStream });

      // Connect streams to video elements and start playing
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = screenStream;
        screenVideoRef.current.play().catch(err => console.error('Error playing screen video:', err));
      }
      
      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = webcamStream;
        webcamVideoRef.current.play().catch(err => console.error('Error playing webcam video:', err));
      }

      // Add stream end detection with more detailed error messages
      screenStream.getVideoTracks()[0].onended = () => endExam('Screen sharing stopped by user');
      webcamStream.getVideoTracks()[0].onended = () => endExam('Webcam access stopped by user');

      return true;
    } catch (error) {
      console.error('Media initialization error:', error);
      
      // More specific error messages
      if (error.name === 'NotAllowedError') {
        setErrorMessage('Permission denied: Please allow camera and screen sharing access to continue');
      } else if (error.name === 'NotFoundError') {
        setErrorMessage('No camera detected. Please connect a webcam and try again');
      } else if (error.name === 'NotReadableError') {
        setErrorMessage('Your camera or screen is already in use by another application');
      } else {
        setErrorMessage(`Failed to initialize exam environment: ${error.message || 'Unknown error'}`);
      }
      
      // Clean up any partial success
      cleanupStreams();
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced security measures with more sophisticated detection
  const setupSecurityMeasures = useCallback(() => {
    // Add event listeners
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Set up security interval checks
    securityIntervalRef.current = setInterval(() => {
      // Check if DevTools is open (improved detection)
      const threshold = 160; // More lenient threshold
      const heightDiff = window.outerHeight - window.innerHeight;
      const widthDiff = window.outerWidth - window.innerWidth;
      
      if (heightDiff > threshold || widthDiff > threshold) {
        endExam('Developer tools detected');
      }

      // Check if still full screen
      if (!document.fullscreenElement) {
        endExam('Full screen mode exited');
      }
      
      // Additional check: monitor CPU usage via performance API
      // This could detect if other intensive applications are running
      if (window.performance && window.performance.memory) {
        const memoryUsage = window.performance.memory.usedJSHeapSize;
        const memoryLimit = window.performance.memory.jsHeapSizeLimit;
        if (memoryUsage > memoryLimit * 0.9) {
          console.warn('High memory usage detected');
        }
      }
    }, 2000); // Reduced check frequency for better performance

    // Start exam timer
    const timerInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          endExam('Time expired');
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute

    // Return cleanup function
    return () => {
      clearInterval(securityIntervalRef.current);
      clearInterval(timerInterval);
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [endExam, handleKeydown, handleContextMenu, handleVisibilityChange]);

  // Start exam with improved flow
  const startExam = async () => {
    setIsLoading(true);
    
    try {
      // Step 1: Initialize media streams
      const streamsInitialized = await initializeStreams();
      if (!streamsInitialized) return;

      // Step 2: Request fullscreen with fallbacks
      try {
        await document.documentElement.requestFullscreen();
      } catch (fullscreenError) {
        console.error('Fullscreen error:', fullscreenError);
        setErrorMessage('Fullscreen mode is required but failed. Please try a different browser.');
        cleanupStreams();
        setIsLoading(false);
        return;
      }

      // Step 3: Setup security measures
      setupSecurityMeasures();
      
      // Step 4: Start exam
      setIsExamStarted(true);
    } catch (error) {
      console.error('Start exam error:', error);
      setErrorMessage(`Failed to start exam: ${error.message || 'Unknown error'}`);
      cleanupStreams();
    } finally {
      setIsLoading(false);
    }
  };

  // Format minutes and seconds
  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m remaining`;
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupStreams();
      if (securityIntervalRef.current) {
        clearInterval(securityIntervalRef.current);
      }
    };
  }, [cleanupStreams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      {!isExamStarted ? (
        <div className="max-w-md mx-auto text-center bg-white p-6 md:p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-orange-600 bg-clip-text text-transparent">
            Secure Online Exam Portal
          </h1>
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              <p className="font-medium">Error</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          <div className="space-y-4 mb-6 text-left">
            <h2 className="font-semibold">Before starting:</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Enable camera access</li>
              <li>Allow screen sharing</li>
              <li>Close all other applications</li>
              <li>Ensure stable internet connection</li>
              <li>Prepare a valid ID for verification</li>
              <li>Test will run for 60 minutes</li>
            </ul>
          </div>

          <div className="p-3 bg-yellow-50 text-yellow-800 rounded-lg mb-6 text-sm">
            <p className="font-medium">Important</p>
            <p>Leaving the exam page, opening other tabs, or using keyboard shortcuts will end your exam.</p>
          </div>

          <button 
            onClick={startExam}
            disabled={isLoading}
            className={`
              w-full px-6 py-3 rounded-lg text-white font-medium
              transition-all duration-300
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-teal-500 to-orange-500 hover:shadow-lg hover:translate-y-px'
              }
            `}
            aria-label="Start secure exam"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Initializing...
              </span>
            ) : 'Start Exam'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-700">Screen Share</h2>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Live
              </span>
            </div>
            <video 
              ref={screenVideoRef}
              className="w-full aspect-video bg-gray-200 rounded"
              autoPlay
              muted
              playsInline
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-700">Webcam Feed</h2>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Live
              </span>
            </div>
            <video 
              ref={webcamVideoRef}
              className="w-full aspect-video bg-gray-200 rounded"
              autoPlay
              muted
              playsInline
            />
          </div>
          
          <div className="col-span-1 md:col-span-3 bg-white p-6 rounded-lg shadow-lg mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Exam Questions</h2>
              <div className="flex items-center">
                <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-medium">
                  {formatTime(timeRemaining)}
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to submit your exam?')) {
                      endExam('Exam submitted by user');
                    }
                  }}
                  className="ml-4 bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-1 rounded-full font-medium transition"
                >
                  Submit Exam
                </button>
              </div>
            </div>
            
            {/* Exam questions would go here */}
            <div className="p-4 bg-gray-50 rounded-lg">
              {/* This would be replaced with actual exam content */}
              <p className="text-gray-500 text-center py-10">Exam questions would appear here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Student;
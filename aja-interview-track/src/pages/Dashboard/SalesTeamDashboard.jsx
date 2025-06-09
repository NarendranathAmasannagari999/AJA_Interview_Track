import React, { useState, useEffect } from 'react';
import { 
  FiUsers, FiCalendar, FiFileText, FiCheck, FiX, FiSend, 
  FiDollarSign, FiFilter, FiSearch, FiChevronDown, FiChevronUp,
  FiBarChart2, FiPieChart, FiUpload, FiDownload, FiMessageSquare,
  FiMail, FiUserPlus, FiBriefcase, FiAward, FiClock, FiLayers,
  FiBook, FiUserCheck, FiUserX, FiShare2, FiToggleLeft, FiToggleRight,
  FiRefreshCw, FiUser
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import styles from './Sales.module.css';
import {
  getCandidates,
  scheduleClientInterview,
  updateClientInterview,
  getClientInterviews,
  addClient,
  getClients,
  addJobDescription,
  downloadJobDescription,
  deleteJobDescription,
  getAllJobDescriptions
} from '../../API/sales';

const ClientModal = ({
  show,
  onClose,
  onSubmit,
  fields,
  onFieldChange,
  error,
  success,
  loading,
  onTechChange
}) => {
  if (!show) return null;
  return (
    <div className={styles.modalOverlay}>
      <motion.div 
        className={styles.modal}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <form onSubmit={onSubmit}>
          <div className={styles.modalHeader}>
            <h3>Add New Client</h3>
            <button 
              className={styles.closeButton}
              type="button"
              onClick={onClose}
            >
              <FiX />
            </button>
          </div>
          <div className={styles.modalContent}>
            {error && (
              <div className={styles.errorMessage}>{error}</div>
            )}
            {success && (
              <div className={styles.successMessage}>{success}</div>
            )}
            <div className={styles.formGroup}>
              <label>Client Name *</label>
              <input
                type="text"
                value={fields.name}
                onChange={e => onFieldChange('name', e.target.value)}
                placeholder="Enter client name"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Contact Email *</label>
              <input
                type="email"
                value={fields.contactEmail}
                onChange={e => onFieldChange('contactEmail', e.target.value)}
                placeholder="Enter contact email"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Active Positions</label>
              <input
                type="number"
                min="0"
                value={fields.activePositions}
                onChange={e => onFieldChange('activePositions', parseInt(e.target.value) || 0)}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Technologies *</label>
              <div className={styles.technologyGrid}>
                {['Java', 'Python', '.NET', 'DevOps', 'SalesForce', 'UI', 'Testing'].map(tech => (
                  <label key={tech} className={styles.technologyCheckbox}>
                    <input
                      type="checkbox"
                      checked={fields.technologies.includes(tech)}
                      onChange={() => onTechChange(tech)}
                    />
                    <span>{tech}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={`${styles.button} ${styles.secondary}`}
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                className={`${styles.button} ${styles.primary}`}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Client'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Add the ScheduleInterviewModal component definition here, adapted for Sales Team context
const ScheduleInterviewModal = ({
    show,
    onClose,
    onSubmit,
    selectedCandidates, // Array of selected candidate objects/IDs
    interviewDetails,
    setInterviewDetails,
    clients, // Pass clients to the modal for the client dropdown
    jobDescriptions // Pass job descriptions for the JD dropdown
}) => {
    if (!show) return null;

    // Find the selected candidates' names for display
    // Assuming selectedCandidates is an array of candidate objects with a 'name' property
    const candidateNames = selectedCandidates.map(c => c.name).join(', ');


    return (
        <div className={styles.modalOverlay}>
            <motion.div
                className={styles.modal}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
            >
                <form onSubmit={(e) => {
                    e.preventDefault();
                    // Pass only the interviewDetails object to onSubmit
                    onSubmit(selectedCandidates.map(c => c.id), interviewDetails);
                }}>
                    <div className={styles.modalHeader}>
                        <h3>Schedule Client Interview</h3>
                        <button
                            className={styles.closeButton}
                            type="button"
                            onClick={onClose}
                        >
                            <FiX />
                        </button>
                    </div>
                    <div className={styles.modalContent}>
                        {/* Display selected candidates */}
                        <div className={styles.formGroup}>
                            <label>Candidate(s)</label>
                            <input
                                type="text"
                                value={candidateNames}
                                className={styles.input}
                                readOnly // Display only, not editable
                            />
                        </div>

                        {/* Client dropdown */}
                         <div className={styles.formGroup}>
                            <label>Client *</label>
                            <select
                                value={interviewDetails.client}
                                onChange={(e) => setInterviewDetails({
                                    ...interviewDetails,
                                    client: e.target.value
                                })}
                                className={styles.input}
                                required
                            >
                                <option value="">Select Client</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.name}>{client.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* JD dropdown */}
                         <div className={styles.formGroup}>
                            <label>Job Description *</label>
                            <select
                                value={interviewDetails.jobDescriptionTitle}
                                onChange={(e) => setInterviewDetails({
                                    ...interviewDetails,
                                    jobDescriptionTitle: e.target.value
                                })}
                                className={styles.input}
                                required
                            >
                                <option value="">Select JD</option>
                                {jobDescriptions.map(jd => (
                                    <option key={jd.id} value={jd.title}>{jd.title} ({jd.clientName})</option>
                                ))}
                            </select>
                        </div>

                        {/* Date & Time */}
                        <div className={styles.formGroup}>
                            <label>Date & Time *</label>
                            <div className={styles.dateTimeGroup}>
                                <input
                                    type="date"
                                    value={interviewDetails.date}
                                    onChange={(e) => setInterviewDetails({
                                        ...interviewDetails,
                                        date: e.target.value
                                    })}
                                    className={styles.input}
                                    required
                                />
                                <input
                                    type="time"
                                    value={interviewDetails.time}
                                    onChange={(e) => setInterviewDetails({
                                        ...interviewDetails,
                                        time: e.target.value
                                    })}
                                    className={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        {/* Interview Level */}
                         <div className={styles.formGroup}>
                            <label>Interview Level *</label>
                            <select
                                value={interviewDetails.level}
                                onChange={(e) => setInterviewDetails({
                                    ...interviewDetails,
                                    level: parseInt(e.target.value) || 1
                                })}
                                className={styles.input}
                                required
                            >
                                <option value={1}>Level 1</option>
                                <option value={2}>Level 2</option>
                                <option value={3}>Level 3</option>
                            </select>
                        </div>

                         {/* Mode */}
                        <div className={styles.formGroup}>
                            <label>Mode *</label>
                            <select
                                value={interviewDetails.mode}
                                onChange={(e) => setInterviewDetails({
                                    ...interviewDetails,
                                    mode: e.target.value
                                })}
                                className={styles.input}
                                required
                            >
                                <option value="virtual">Virtual</option>
                                <option value="in-person">In-Person</option>
                            </select>
                        </div>

                         {/* Link/Location based on mode */}
                        {interviewDetails.mode === 'virtual' && (
                            <div className={styles.formGroup}>
                                <label>Meeting Link *</label>
                                <input
                                    type="text"
                                    value={interviewDetails.link}
                                    onChange={(e) => setInterviewDetails({
                                        ...interviewDetails,
                                        link: e.target.value
                                    })}
                                    className={styles.input}
                                    placeholder="Enter meeting link"
                                    required
                                />
                            </div>
                        )}
                        {interviewDetails.mode === 'in-person' && (
                            <div className={styles.formGroup}>
                                <label>Location *</label>
                                <input
                                    type="text"
                                    value={interviewDetails.location}
                                    onChange={(e) => setInterviewDetails({
                                        ...interviewDetails,
                                        location: e.target.value
                                    })}
                                    className={styles.input}
                                    placeholder="Enter interview location"
                                    required
                                />
                            </div>
                        )}

                        {/* Interviewer (Optional based on backend) */}
                        {/* Keeping this as per image, but backend might not use it */}
                         <div className={styles.formGroup}>
                            <label>Interviewer</label>
                            <input
                                type="text"
                                value={interviewDetails.interviewerName} // Assuming you add this to interviewDetails state
                                onChange={(e) => setInterviewDetails({
                                    ...interviewDetails,
                                    interviewerName: e.target.value
                                })}
                                className={styles.input}
                                placeholder="Enter interviewer name"
                            />
                        </div>


                         {/* Notes */}
                        <div className={styles.formGroup}>
                            <label>Notes</label>
                            <textarea
                                value={interviewDetails.notes}
                                onChange={(e) => setInterviewDetails({
                                    ...interviewDetails,
                                    notes: e.target.value
                                })}
                                className={styles.input}
                                placeholder="Add notes about the interview..."
                            />
                        </div>


                        <div className={styles.modalFooter}>
                            <button
                                className={`${styles.button} ${styles.secondary}`}
                                type="button"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className={`${styles.button} ${styles.primary}`}
                                type="submit"
                                disabled={false} // Add loading state logic here if needed
                            >
                                Schedule Interview
                            </button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const SalesTeamDashboard = () => {
  // Main state
  const [activeTab, setActiveTab] = useState('jds');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedJD, setSelectedJD] = useState(null);
  const [sendFeedback, setSendFeedback] = useState(false);
  
  // Filter states
  const [filterTech, setFilterTech] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterResourceType, setFilterResourceType] = useState('all');
  const [filterInterviewLevel, setFilterInterviewLevel] = useState('all');
  
  // Data states
  const [candidates, setCandidates] = useState([]);
  const [clientInterviews, setClientInterviews] = useState([]);
  const [clients, setClients] = useState([]);
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [resumePool, setResumePool] = useState([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  
  // Deployment statistics
  const [deploymentStats, setDeploymentStats] = useState({
    profilesSent: 0,
    resumesSent: 0,
    interviewsScheduled: 0,
    deployed: 0,
    rejected: 0
  });

  // New state for interview scheduling
  const [showInterviewScheduler, setShowInterviewScheduler] = useState(false);
  const [selectedForInterview, setSelectedForInterview] = useState([]);
  const [interviewDetails, setInterviewDetails] = useState({
    level: 1,
    date: '',
    time: '',
    mode: 'virtual',
    link: '',
    location: '',
    notes: '',
    client: '',
    jobDescriptionTitle: '',
    interviewerName: ''
  });

  // Add loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add new state for pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Add new state for client management
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientModalFields, setClientModalFields] = useState({
    name: '',
    contactEmail: '',
    activePositions: 0,
    technologies: [],
  });
  const [clientModalError, setClientModalError] = useState('');
  const [clientModalSuccess, setClientModalSuccess] = useState('');
  const [clientModalLoading, setClientModalLoading] = useState(false);

  // Add new state for JD modal
  const [jdModalFields, setJDModalFields] = useState({
    title: '',
    client: '',
    technology: '',
    resourceType: '',
    description: '',
    receivedDate: '',
    deadline: '',
  });
  const [jdModalFile, setJDModalFile] = useState(null);
  const [jdModalError, setJDModalError] = useState('');
  const [jdModalSuccess, setJDModalSuccess] = useState('');
  const [jdModalLoading, setJDModalLoading] = useState(false);

  // Add new state for selected candidates for bulk scheduling
  const [bulkSelectedCandidates, setBulkSelectedCandidates] = useState([]);

  // New state for sales team user profile
  const [salesUserData, setSalesUserData] = useState({
    fullName: 'Ravi',
    email: 'ravi@gmail.com',
    role: 'ROLE_SALES_TEAM'
  });
  const [profilePic, setProfilePic] = useState(null); // Placeholder for profile picture

  // Add debounced search function
  const handleSearch = (value) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(setTimeout(() => {
      setSearchTerm(value);
      setCurrentPage(1); // Reset to first page on new search
    }, 500));
  };

  // Add refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchData();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Placeholder for profile picture change (similar to EmployeeDashboard)
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload this file and update the profilePic URL
      setProfilePic(URL.createObjectURL(file));
      // Optionally, add toast for success/error
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchData();
    // In a real app, you would fetch user data from an auth context or API here
    // For now, it's mocked in the state initialization
  }, []);

  const fetchData = async (retryCount = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch all data in parallel with proper error handling
      const [candidatesData, interviewsData, clientsData, jobDescriptionsData] = await Promise.all([
        getCandidates(filterTech, filterStatus, filterResourceType).catch(error => {
          console.error('Error fetching candidates:', error);
          if (error.response?.status === 401) {
            throw new Error('Please log in to view candidates');
          }
          if (error.response?.status === 400) {
            throw new Error('Invalid filter parameters');
          }
          return [];
        }),
        getClientInterviews().catch(error => {
          console.error('Error fetching interviews:', error);
          if (error.response?.status === 401) {
            throw new Error('Please log in to view interviews');
          }
          if (error.response?.status === 400) {
            throw new Error('Invalid search parameters');
          }
          return [];
        }),
        getClients().catch(error => {
          console.error('Error fetching clients:', error);
          if (error.response?.status === 401) {
            throw new Error('Please log in to view clients');
          }
          if (error.response?.status === 400) {
            throw new Error('Invalid search parameters');
          }
          return [];
        }),
        getAllJobDescriptions().catch(error => {
          console.error('Error fetching job descriptions:', error);
          if (error.response?.status === 401) {
            throw new Error('Please log in to view job descriptions');
          }
          if (error.response?.status === 403) {
            throw new Error('Access denied: Only sales team members can view all job descriptions');
          }
          return [];
        })
      ]);

      // Validate and transform data
      const validatedCandidates = candidatesData.map(candidate => ({
        ...candidate,
        status: candidate.status || 'pending',
        technology: candidate.technology || 'Unknown',
        resourceType: candidate.resourceType || 'TT'
      }));

      const validatedInterviews = interviewsData.map(interview => ({
        ...interview,
        overallStatus: interview.overallStatus || 'pending',
        levels: interview.levels || []
      }));

      // Update state with validated data
      setCandidates(validatedCandidates);
      setClientInterviews(validatedInterviews);
      setClients(clientsData);
      setJobDescriptions(jobDescriptionsData);

      // Calculate deployment stats
      const stats = {
        profilesSent: validatedCandidates.filter(c => c.status === 'profile_sent').length,
        resumesSent: validatedCandidates.filter(c => c.status === 'resume_sent').length,
        interviewsScheduled: validatedInterviews.filter(i => i.overallStatus === 'in_process').length,
        deployed: validatedInterviews.filter(i => i.result === 'hired').length,
        rejected: validatedInterviews.filter(i => i.result === 'rejected').length
      };
      setDeploymentStats(stats);

    } catch (error) {
      console.error('Error in fetchData:', error);
      if (retryCount < 3) {
        // Retry with exponential backoff
        setTimeout(() => {
          fetchData(retryCount + 1);
        }, Math.pow(2, retryCount) * 1000);
      } else {
        setError(error.message || 'Failed to load dashboard data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Refactor handleFileChange to accept form values
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a PDF or Word document.');
      return;
    }

    if (file.size > maxSize) {
      setError('File size too large. Maximum size is 5MB.');
      return;
    }

    // Note: This function is intended for handling file selection, 
    //       the actual JD upload happens in handleJDModalSubmit
    // setIsSubmitting(true);
    // setError(null);
    // try {
    //   const formData = new FormData();
    //   formData.append('file', file);
    //   formData.append('title', jdFormValues.title || 'New Job Description');
    //   formData.append('client', jdFormValues.client || '');
    //   formData.append('technology', jdFormValues.technology || '');
    //   formData.append('resourceType', jdFormValues.resourceType || '');
    //   formData.append('description', jdFormValues.description || 'Job description details...');
    //   formData.append('receivedDate', jdFormValues.receivedDate || new Date().toISOString().split('T')[0]);
    //   formData.append('deadline', jdFormValues.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    //   const response = await addJobDescription(
    //     formData.get('title'),
    //     formData.get('client'),
    //     formData.get('receivedDate'),
    //     formData.get('deadline'),
    //     formData.get('technology'),
    //     formData.get('resourceType'),
    //     formData.get('description'),
    //     file
    //   );

    //   setJobDescriptions(prev => [...prev, response]);
    //   setResumeStatus('submitted');
      
    //   // Show success message
    //   alert('Job description uploaded successfully!');
    // } catch (error) {
    //   console.error('Error uploading file:', error);
    //   setError(error.message || 'Failed to upload file');
    //   setResumeStatus('rejected');
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  // Enhanced interview scheduling with validation
  const notifyShortlistedCandidates = async (candidateIds, interviewDetails) => {
    // Validate interview details
    if (!interviewDetails.date || !interviewDetails.time) {
      // Use the general error state for display
      setError('Please select both date and time for the interview.');
      return;
    }

    // Ensure client and JD are selected for client interviews
    if (!interviewDetails.client) {
        setError('Please select a client for the interview.');
        return;
    }
    if (!interviewDetails.jobDescriptionTitle) {
        setError('Please select a job description for the interview.');
        return;
    }

    if (interviewDetails.mode === 'virtual' && !interviewDetails.link) {
      setError('Please provide a meeting link for virtual interviews.');
      return;
    }

    if (interviewDetails.mode === 'in-person' && !interviewDetails.location) {
      setError('Please provide a location for in-person interviews.');
      return;
    }

    setIsSubmitting(true);
    setError(null); // Clear previous errors

    try {
      const interviewPromises = candidateIds.map(candidateId => 
        scheduleClientInterview(
          candidateId, // empId
          interviewDetails.client, // client
          interviewDetails.date, // date
          interviewDetails.time, // time
          interviewDetails.level, // level
          interviewDetails.jobDescriptionTitle, // jobDescriptionTitle
          interviewDetails.mode === 'virtual' ? interviewDetails.link : interviewDetails.location // meetingLink or location
        )
      );

      const results = await Promise.all(interviewPromises);
      
      // Filter out any potential null or undefined results from the API calls
      const successfulResults = results.filter(result => result);

      // Update the interviews state with the new interviews
      setClientInterviews(prev => [...prev, ...successfulResults]);

      // Update the status of scheduled candidates to 'interview_scheduled'
      setCandidates(prev => prev.map(candidate => 
          candidateIds.includes(candidate.id) 
              ? { ...candidate, status: 'interview_scheduled' } 
              : candidate
      ));

      // Show success message using the general error state (or a dedicated success state if added)
      setError({ type: 'success', message: `Successfully scheduled ${successfulResults.length} interview(s)!` });

    // Close the scheduler
    setShowInterviewScheduler(false);
    setSelectedForInterview([]);
    setInterviewDetails({ // Reset interview details on close
      level: 1,
      date: '',
      time: '',
      mode: 'virtual',
      link: '',
      location: '',
      notes: '',
      client: '',
      jobDescriptionTitle: '',
      interviewerName: '' // This might not be needed based on backend schedule API
    });
    setBulkSelectedCandidates([]); // Clear bulk selections

    } catch (error) {
      console.error('Error scheduling interviews:', error);
      // Use the general error state for display
      setError({ 
        type: 'error', 
        message: error.message || 'Failed to schedule interviews. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add function to handle interview feedback submission
  const handleInterviewFeedback = async (interviewId, result, feedback, technicalScore, communicationScore) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const updatedInterview = await updateClientInterview(
        interviewId,
        result,
        feedback,
        technicalScore,
        communicationScore
      );

      // Update the interviews state with the updated interview
      setClientInterviews(prev => 
        prev.map(interview => 
          interview.id === interviewId ? updatedInterview : interview
        )
      );
    } catch (error) {
      console.error('Error updating interview feedback:', error);
      setError(error.message || 'Failed to update interview feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add function to handle job description download
  const handleDownloadJD = async (jdId) => {
    try {
      const blob = await downloadJobDescription(jdId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `job_description_${jdId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading job description:', error);
      if (error.response?.status === 401) {
        setError('Please log in to download job descriptions');
      } else if (error.response?.status === 400) {
        setError('Job description not found or invalid ID');
      } else {
        setError(error.message || 'Failed to download job description');
      }
    }
  };

  // Add function to handle job description deletion
  const handleDeleteJD = async (jdId) => {
    try {
      await deleteJobDescription(jdId);
      setJobDescriptions(prev => prev.filter(jd => jd.id !== jdId));
      setError({ type: 'success', message: 'Job description deleted successfully' });
    } catch (error) {
      console.error('Error deleting job description:', error);
      if (error.response?.status === 401) {
        setError('Please log in to delete job descriptions');
      } else if (error.response?.status === 400) {
        setError('Job description not found or invalid ID');
      } else {
        setError(error.message || 'Failed to delete job description');
      }
    }
  };

  // New function to open the interview scheduler
  const openInterviewScheduler = (candidateIds) => {
    setSelectedForInterview(candidateIds);
    setShowInterviewScheduler(true);
  };

  // Filter functions
  const filterCandidates = (candidates) => {
    return candidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          candidate.technology.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTech = filterTech === 'all' || candidate.technology === filterTech;
      const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus;
      const matchesResourceType = filterResourceType === 'all' || candidate.resourceType === filterResourceType;
      
      return matchesSearch && matchesTech && matchesStatus && matchesResourceType;
    });
  };

  const filterInterviews = (interviews) => {
    return interviews.filter(interview => {
      if (!interview) return false;

      const candidateName = interview.candidateName || '';
      const client = interview.client || '';
      const jd = interview.jd || '';
      const levels = interview.levels || [];

      const searchMatch = candidateName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jd.toLowerCase().includes(searchTerm.toLowerCase());
      
      const levelMatch = filterInterviewLevel === 'all' || 
                        levels.some(level => level && level.number && level.number.toString() === filterInterviewLevel);
      
      return searchMatch && levelMatch;
    });
  };

  // Tab components
  const JDTab = () => {
    const filteredJDs = jobDescriptions.filter(jd => 
      jd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jd.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={styles.contentSection}
      >
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search JDs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button 
            className={`${styles.button} ${styles.primary}`}
            onClick={() => setSelectedJD('new')}
          >
            <FiFileText /> Add New JD
          </button>
        </div>

        {filteredJDs.length > 0 ? (
          <div className={styles.cardGrid}>
            {filteredJDs.map(jd => (
              <motion.div
                key={jd.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={styles.jdCard}
                onClick={() => setSelectedJD(jd)}
              >
                <div className={styles.jdHeader}>
                  <h3 className={styles.jdTitle}>{jd.title}</h3>
                  <span className={styles.jdClient}>{jd.clientName}</span>
                </div>

                <div className={styles.jdDetails}>
                  <p>
                    <strong>Technology:</strong> 
                    <span className={`${styles.techBadge} ${styles[jd.technology.toLowerCase()]}`}>
                      {jd.technology}
                    </span>
                    <span className={`${styles.resourceBadge} ${styles[jd.resourceType.toLowerCase()]}`}>
                      {jd.resourceType}
                    </span>
                  </p>
                  <p><strong>Received:</strong> {jd.receivedDate}</p>
                  <p><strong>Status:</strong> 
                    <span className={`${styles.statusBadge} ${styles[jd.status]}`}>
                      {jd.status}
                    </span>
                  </p>
                </div>

                <div className={styles.jdActions}>
                  <button 
                    className={`${styles.button} ${styles.primary}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open JD sharing modal
                    }}
                  >
                    <FiShare2 /> Share JD
                  </button>
                  <button className={`${styles.button} ${styles.secondary}`}>
                    <FiUsers /> View Candidates
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiBook size={48} />
            <h4>No Job Descriptions found</h4>
            <p>Add new JDs received from clients or adjust your search.</p>
          </div>
        )}
      </motion.div>
    );
  };

  const ResumePoolTab = () => {
    const filteredResumes = resumePool.filter(resume => 
      resume.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.technology.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={styles.contentSection}
      >
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search resumes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button 
            className={`${styles.button} ${styles.primary}`}
            onClick={() => {/* Open bulk upload modal */}}
          >
            <FiUpload /> Bulk Upload
          </button>
        </div>

        {filteredResumes.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.resumeTable}>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Technology</th>
                  <th>Resource Type</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResumes.map(resume => (
                  <tr key={resume.id}>
                    <td>{resume.candidateName}</td>
                    <td>
                      <span className={`${styles.techBadge} ${styles[resume.technology.toLowerCase()]}`}>
                        {resume.technology}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.resourceBadge} ${styles[resume.resourceType.toLowerCase()]}`}>
                        {resume.resourceType}
                      </span>
                    </td>
                    <td>{resume.receivedDate}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[resume.status]}`}>
                        {resume.status}
                      </span>
                    </td>
                    <td>
                      <button className={`${styles.button} ${styles.small}`}>
                        <FiDownload /> Download
                      </button>
                      <button className={`${styles.button} ${styles.small} ${styles.primary}`}>
                        <FiCheck /> Shortlist
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiUpload size={48} />
            <h4>No resumes in pool</h4>
            <p>Upload resumes received from candidates or adjust your search.</p>
          </div>
        )}
      </motion.div>
    );
  };

  const handleSelectCandidateForBulkScheduling = (candidateId, isSelected) => {
    setBulkSelectedCandidates(prev => 
      isSelected 
        ? [...prev, candidateId] 
        : prev.filter(id => id !== candidateId)
    );
  };

  const ShortlistedTab = () => {
    const filteredShortlisted = shortlistedCandidates.filter(candidate => 
      candidate.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.technology.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={styles.contentSection}
      >
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search shortlisted..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button 
            className={`${styles.button} ${styles.primary}`}
            onClick={() => openInterviewScheduler(bulkSelectedCandidates)}
            disabled={bulkSelectedCandidates.length === 0}
          >
            <FiCalendar /> Schedule Interview
          </button>
        </div>

        {filteredShortlisted.length > 0 ? (
          <div className={styles.cardGrid}>
            {filteredShortlisted.map(candidate => (
              <motion.div
                key={candidate.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={styles.profileCard}
              >
                <div className={styles.profileSelection}>
                  <input 
                    type="checkbox"
                    checked={bulkSelectedCandidates.includes(candidate.id)}
                    onChange={(e) => handleSelectCandidateForBulkScheduling(candidate.id, e.target.checked)}
                  />
                </div>
                <div className={styles.profileHeader}>
                  <h3 className={styles.profileName}>{candidate.candidateName}</h3>
                  <span className={`${styles.statusBadge} ${styles.shortlisted}`}>
                    Shortlisted
                  </span>
                </div>

                <div className={styles.profileDetails}>
                  <p>
                    <strong>Technology:</strong> 
                    <span className={`${styles.techBadge} ${styles[candidate.technology.toLowerCase()]}`}>
                      {candidate.technology}
                    </span>
                    <span className={`${styles.resourceBadge} ${styles[candidate.resourceType.toLowerCase()]}`}>
                      {candidate.resourceType}
                    </span>
                  </p>
                  <p><strong>For JD:</strong> {candidate.jdTitle}</p>
                </div>

                <div className={styles.profileActions}>
                  <button className={`${styles.button} ${styles.secondary}`}>
                    <FiFileText /> View Resume
                  </button>
                  <button 
                    className={`${styles.button} ${styles.primary}`}
                    onClick={() => openInterviewScheduler([candidate.candidateId])}
                  >
                    <FiCalendar /> Schedule Interview
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiUserCheck size={48} />
            <h4>No shortlisted candidates</h4>
            <p>Shortlist candidates from the resume pool to proceed with client submission.</p>
          </div>
        )}
      </motion.div>
    );
  };

  const InterviewsTab = () => {
    const filteredInterviews = filterInterviews(clientInterviews);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={styles.contentSection}
      >
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search interviews..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Interview Level</label>
            <select 
              value={filterInterviewLevel} 
              onChange={(e) => setFilterInterviewLevel(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Levels</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
            </select>
          </div>
        </div>

        {filteredInterviews.length > 0 ? (
          <div>
            {filteredInterviews.map(interview => (
              <motion.div
                key={interview.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={styles.interviewCard}
              >
                <div className={styles.interviewHeader}>
                  <div>
                    <h4 className={styles.interviewTitle}>
                      {interview.client} - {interview.candidateName}
                    </h4>
                    <div className={styles.interviewMeta}>
                      <span><FiFileText /> {interview.jd}</span>
                      <span className={`${styles.statusBadge} ${styles[interview.overallStatus]}`}>
                        {interview.overallStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.interviewLevels}>
                  {interview.levels.map(level => (
                    <div 
                      key={level.number} 
                      className={`${styles.level} ${styles[level.status]}`}
                    >
                      <div className={styles.levelHeader}>
                        <span className={styles.levelNumber}>Level {level.number}</span>
                        <span className={styles.levelDate}>{level.date} at {level.time}</span>
                        <span className={styles.levelStatus}>
                          {level.status}
                          {level.notified && <FiCheck className={styles.notifiedIcon} title="Candidate notified" />}
                        </span>
                      </div>
                      
                      {level.status === 'scheduled' && (
                        <div className={styles.levelDetails}>
                          <p><strong>Mode:</strong> {level.mode}</p>
                          {level.mode === 'virtual' && (
                            <p><strong>Link:</strong> <a href={level.link} target="_blank" rel="noopener noreferrer">{level.link}</a></p>
                          )}
                          {level.mode === 'in-person' && (
                            <p><strong>Location:</strong> {level.location}</p>
                          )}
                          {!level.notified && (
                            <button 
                              className={`${styles.button} ${styles.small} ${styles.primary}`}
                              onClick={() => openInterviewScheduler([interview.candidateId])}
                            >
                              <FiMail /> Send Schedule to Candidate
                            </button>
                          )}
                        </div>
                      )}
                      
                      {level.status === 'completed' && (
                        <div className={styles.levelDetails}>
                          <div className={styles.scoreMeter}>
                            <span>Technical: {level.techScore}/10</span>
                            <div className={styles.scoreBar}>
                              <div 
                                className={styles.scoreFill}
                                style={{ width: `${level.techScore * 10}%` }}
                              />
                            </div>
                          </div>
                          <div className={styles.scoreMeter}>
                            <span>Communication: {level.commScore}/10</span>
                            <div className={styles.scoreBar}>
                              <div 
                                className={styles.scoreFill}
                                style={{ width: `${level.commScore * 10}%` }}
                              />
                            </div>
                          </div>
                          {level.feedback && (
                            <div className={styles.feedback}>
                              <strong>Feedback:</strong> {level.feedback}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {interview.overallStatus === 'completed' && (
                  <div className={styles.interviewOutcome}>
                    <h5>Final Outcome</h5>
                    {interview.result === 'hired' ? (
                      <div className={styles.outcomeHired}>
                        <FiUserCheck /> Candidate Hired
                      </div>
                    ) : (
                      <div className={styles.outcomeRejected}>
                        <FiUserX /> Candidate Rejected
                        <FeedbackSection 
                          candidate={interview.candidateName} 
                          interview={interview} 
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className={styles.interviewActions}>
                  {interview.levels.some(l => l.status === 'scheduled') && (
                    <>
                      <button className={`${styles.button} ${styles.primary}`}>
                        Confirm Interview
                      </button>
                      <button className={`${styles.button} ${styles.secondary}`}>
                        Reschedule
                      </button>
                    </>
                  )}
                  
                  {interview.overallStatus === 'in_process' && (
                    <button className={`${styles.button} ${styles.success}`}>
                      Mark as Completed
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiCalendar size={48} />
            <h4>No interviews scheduled</h4>
            <p>When candidates are sent to clients, their interviews will appear here.</p>
          </div>
        )}

        {/* Interview Scheduler Modal */}
        <AnimatePresence>
          {showInterviewScheduler && (
            <ScheduleInterviewModal
              show={showInterviewScheduler}
              onClose={() => {
                setShowInterviewScheduler(false);
                setSelectedForInterview([]); // Clear selected candidates on close
                setInterviewDetails({ // Reset interview details on close
                  level: 1,
                  date: '',
                  time: '',
                  mode: 'virtual',
                  link: '',
                  location: '',
                  notes: '',
                  client: '',
                  jobDescriptionTitle: '',
                  interviewerName: ''
                });
              }}
              onSubmit={notifyShortlistedCandidates} // Use the existing function to handle submission
              selectedCandidates={candidates.filter(c => selectedForInterview.includes(c.id))} // Pass selected candidate objects to the modal
              interviewDetails={interviewDetails}
              setInterviewDetails={setInterviewDetails}
              clients={clients} // Pass clients data to the modal
              jobDescriptions={jobDescriptions} // Pass job descriptions data to the modal
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const DeploymentsTab = () => {
    const deploymentData = [
      { name: 'Profiles Sent', value: deploymentStats.profilesSent, color: '#6366F1' },
      { name: 'Resumes Sent', value: deploymentStats.resumesSent, color: '#8B5CF6' },
      { name: 'Interviews', value: deploymentStats.interviewsScheduled, color: '#EC4899' },
      { name: 'Deployed', value: deploymentStats.deployed, color: '#10B981' },
      { name: 'Rejected', value: deploymentStats.rejected, color: '#EF4444' }
    ];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={styles.contentSection}
      >
        <div className={styles.deploymentOverview}>
          <h3>Deployment Pipeline</h3>
          
          <div className={styles.pipeline}>
            {deploymentData.map((stage, index) => (
              <motion.div 
                key={stage.name}
                className={styles.pipelineStage}
                whileHover={{ scale: 1.05 }}
              >
                <div 
                  className={styles.stageIndicator}
                  style={{ backgroundColor: stage.color }}
                />
                <div className={styles.stageContent}>
                  <div className={styles.stageName}>{stage.name}</div>
                  <div className={styles.stageValue}>{stage.value}</div>
                </div>
                {index < deploymentData.length - 1 && (
                  <div className={styles.stageConnector} />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className={styles.chartGrid}>
          <div className={styles.chartContainer}>
            <h4>Deployment Conversion</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deploymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {deploymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartContainer}>
            <h4>Monthly Placements</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: 'Jan', deployed: 5, rejected: 2 },
                  { name: 'Feb', deployed: 8, rejected: 3 },
                  { name: 'Mar', deployed: 12, rejected: 4 },
                  { name: 'Apr', deployed: 10, rejected: 3 },
                  { name: 'May', deployed: 7, rejected: 1 }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="deployed" fill="#10B981" name="Deployed" />
                <Bar dataKey="rejected" fill="#EF4444" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.techPlacementContainer}>
          <h4>Placements by Technology</h4>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={[
                { name: 'Java', deployed: 15, rejected: 5 },
                { name: 'Python', deployed: 12, rejected: 4 },
                { name: '.NET', deployed: 8, rejected: 3 },
                { name: 'DevOps', deployed: 10, rejected: 2 },
                { name: 'SalesForce', deployed: 5, rejected: 2 },
                { name: 'UI', deployed: 7, rejected: 3 },
                { name: 'Testing', deployed: 3, rejected: 1 }
              ]}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="deployed" fill="#10B981" name="Deployed" />
              <Bar dataKey="rejected" fill="#EF4444" name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  };

  const FeedbackSection = ({ candidate, interview }) => {
    const [techScore, setTechScore] = useState(0);
    const [commScore, setCommScore] = useState(0);
    const [feedback, setFeedback] = useState('');

    return (
      <div className={styles.feedbackForm}>
        <div className={styles.feedbackToggle}>
          <span>Send feedback to candidate</span>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              checked={sendFeedback}
              onChange={() => setSendFeedback(!sendFeedback)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        {sendFeedback && (
          <div className={styles.feedbackFields}>
            <div className={styles.scoreInput}>
              <label>Technical Score (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={techScore}
                onChange={(e) => setTechScore(e.target.value)}
              />
            </div>
            
            <div className={styles.scoreInput}>
              <label>Communication Score (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={commScore}
                onChange={(e) => setCommScore(e.target.value)}
              />
            </div>
            
            <div className={styles.feedbackInput}>
              <label>Detailed Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide constructive feedback for the candidate..."
              />
            </div>
            
            <button 
              className={`${styles.button} ${styles.primary}`}
              onClick={() => {
                // Save feedback
                alert(`Feedback sent to ${candidate}`);
                setSendFeedback(false);
              }}
            >
              Send Feedback
            </button>
          </div>
        )}
      </div>
    );
  };

  // Add pagination component
  const Pagination = ({ totalItems, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
      <div className={styles.pagination}>
        <button
          className={styles.pageButton}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pages.map(page => (
          <button
            key={page}
            className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className={styles.pageButton}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  // Enhanced loading state component
  const LoadingState = () => (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>{isRefreshing ? 'Refreshing data...' : 'Loading dashboard data...'}</p>
      {isRefreshing && (
        <div className={styles.progressBar}>
          <div className={styles.progressFill}></div>
        </div>
      )}
    </div>
  );

  // Enhanced error state component
  const ErrorState = ({ message, onRetry }) => (
    <div className={styles.errorContainer}>
      <h3>Error</h3>
      <p>{message}</p>
      <div className={styles.errorActions}>
        {onRetry && (
          <button 
            className={`${styles.button} ${styles.primary}`}
            onClick={onRetry}
          >
            Try Again
          </button>
        )}
        <button 
          className={`${styles.button} ${styles.secondary}`}
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    </div>
  );

  // Add refresh button to header
  const renderHeader = () => (
      <div className={styles.dashboardHeader}>
        <h1 className={styles.headerTitle}>
          <FiBriefcase /> AJA Sales Team Dashboard
        </h1>
      <div className={styles.headerActions}>
        <button 
          className={`${styles.button} ${styles.secondary}`}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <FiRefreshCw className={isRefreshing ? styles.spinning : ''} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
        <div className={styles.headerStats}>
          <div className={styles.statBadge}>
            <FiUsers /> <span>{candidates.length}</span> Candidates
          </div>
          <div className={styles.statBadge}>
            <FiCheck /> <span>{deploymentStats.deployed}</span> Deployed
          </div>
          <div className={styles.statBadge}>
            <FiDollarSign /> <span>$125K</span> Revenue
          </div>
        </div>
      </div>
      {/* Sales Team Profile */} 
      <div className={styles.userProfile}> 
        <div className={styles.userAvatar}> 
          {profilePic ? ( 
            <img src={profilePic} alt="Profile" /> 
          ) : ( 
            <FiUser size={18} /> 
          )} 
          <input 
            type="file" 
            id="salesProfilePicture" 
            accept="image/jpeg,image/png" 
            onChange={handleProfilePictureChange} 
            style={{ display: 'none' }} 
          /> 
          <label htmlFor="salesProfilePicture" className={styles.avatarUpload}> 
            <FiUpload size={14} /> 
          </label> 
        </div> 
        <div className={styles.userInfo}> 
          <span className={styles.userName}>{salesUserData.fullName}</span> 
          <span className={styles.userRole}>Sales Manager ({salesUserData.email})</span> 
          <span className={styles.userRole}>Sales Team</span> 
        </div> 
      </div> 
    </div>
  );

  // Add client management tab
  const ClientsTab = () => {
    const filteredClients = clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={styles.contentSection}
      >
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button 
            className={`${styles.button} ${styles.primary}`}
            onClick={() => setShowClientModal(true)}
          >
            <FiUserPlus /> Add New Client
          </button>
        </div>

        {filteredClients.length > 0 ? (
          <div className={styles.cardGrid}>
            {filteredClients.map(client => (
              <motion.div
                key={client.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={styles.clientCard}
              >
                <div className={styles.clientHeader}>
                  <h3 className={styles.clientName}>{client.name}</h3>
                  <span className={styles.clientEmail}>{client.contactEmail}</span>
                </div>

                <div className={styles.clientDetails}>
                  <p>
                    <strong>Active Positions:</strong> {client.activePositions}
                  </p>
                  <div className={styles.technologyTags}>
                    {client.technologies.map(tech => (
                      <span 
                        key={tech} 
                        className={`${styles.techBadge} ${styles[tech.toLowerCase()]}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.clientActions}>
                  <button className={`${styles.button} ${styles.secondary}`}>
                    <FiMail /> Contact
                  </button>
                  <button className={`${styles.button} ${styles.primary}`}>
                    <FiFileText /> View JDs
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiUsers size={48} />
            <h4>No clients found</h4>
            <p>Add new clients or adjust your search.</p>
          </div>
        )}
      </motion.div>
    );
  };

  // Update renderTabContent to include clients tab
  const renderTabContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState message={error} onRetry={fetchData} />;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    switch (activeTab) {
      case 'clients':
        return (
          <>
            <ClientsTab />
            <Pagination
              totalItems={clients.length}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        );
      case 'jds':
        return (
          <>
            <JDTab />
            <Pagination
              totalItems={jobDescriptions.length}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        );
      case 'resumePool':
        return (
          <>
            <ResumePoolTab />
            <Pagination
              totalItems={resumePool.length}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        );
      case 'shortlisted':
        return (
          <>
            <ShortlistedTab />
            <Pagination
              totalItems={shortlistedCandidates.length}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        );
      case 'interviews':
        return (
          <>
            <InterviewsTab />
            <Pagination
              totalItems={clientInterviews.length}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        );
      case 'deployments':
        return <DeploymentsTab />;
      default:
        return null;
    }
  };

  // Add reset function for JD modal
  const resetJDModal = () => {
    setJDModalFields({
      title: '',
      client: '',
      technology: '',
      resourceType: '',
      description: '',
      receivedDate: '',
      deadline: '',
    });
    setJDModalFile(null);
    setJDModalError('');
    setJDModalSuccess('');
    setJDModalLoading(false);
    setSelectedJD(null);
    setSelectedClient('');
    setFilterTech('all');
    setFilterResourceType('all');
  };

  // Add handleJDModalFieldChange function
  const handleJDModalFieldChange = (field, value) => {
    setJDModalFields(prev => ({ ...prev, [field]: value }));
    if (field === 'client') setSelectedClient(value);
    if (field === 'technology') setFilterTech(value);
    if (field === 'resourceType') setFilterResourceType(value);
  };

  // Add handleJDModalFileChange function
  const handleJDModalFileChange = (e) => {
    const file = e.target.files[0];
    setJDModalFile(file);
  };

  // Add handleJDModalSubmit function
  const handleJDModalSubmit = async (e) => {
    e.preventDefault();
    setJDModalError('');
    setJDModalSuccess('');
    
    // Validation
    if (!jdModalFields.title.trim() || !jdModalFields.client || !jdModalFields.technology || !jdModalFields.resourceType || !jdModalFile) {
      setJDModalError('Please fill all required fields and select a file.');
      return;
    }

    // File validation
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(jdModalFile.type)) {
      setJDModalError('Invalid file type. Please upload a PDF or Word document.');
      return;
    }

    if (jdModalFile.size > maxSize) {
      setJDModalError('File size too large. Maximum size is 5MB.');
      return;
    }

    setJDModalLoading(true);
    try {
      const response = await addJobDescription(
        jdModalFields.title,
        jdModalFields.client,
        jdModalFields.receivedDate || new Date().toISOString().split('T')[0],
        jdModalFields.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        jdModalFields.technology,
        jdModalFields.resourceType,
        jdModalFields.description,
        jdModalFile
      );

      setJobDescriptions(prev => [...prev, response]);
      setJDModalSuccess('Job description uploaded successfully!');
      
      // Reset form after success
      setTimeout(() => {
        resetJDModal();
      }, 1500);
    } catch (error) {
      console.error('Error uploading job description:', error);
      if (error.response?.status === 401) {
        setJDModalError('Please log in to upload job descriptions');
      } else if (error.response?.status === 400) {
        setJDModalError(error.response.data || 'Invalid job description data');
      } else {
        setJDModalError(error.message || 'Failed to upload job description');
      }
    } finally {
      setJDModalLoading(false);
    }
  };

  // Add reset function for client modal
  const resetClientModal = () => {
    setClientModalFields({
      name: '',
      contactEmail: '',
      activePositions: 0,
      technologies: [],
    });
    setClientModalError('');
    setClientModalSuccess('');
    setClientModalLoading(false);
    setShowClientModal(false);
  };

  // Add handleClientModalFieldChange function
  const handleClientModalFieldChange = (field, value) => {
    setClientModalFields(prev => ({ ...prev, [field]: value }));
  };

  // Add handleClientModalTechChange function
  const handleClientModalTechChange = (tech) => {
    setClientModalFields(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech],
    }));
  };

  // Add handleClientModalSubmit function
  const handleClientModalSubmit = async (e) => {
    e.preventDefault();
    setClientModalError('');
    setClientModalSuccess('');
    
    // Validation
    if (!clientModalFields.name.trim()) {
      setClientModalError('Client name is required');
      return;
    }
    if (!clientModalFields.contactEmail.trim()) {
      setClientModalError('Contact email is required');
      return;
    }
    if (!clientModalFields.contactEmail.includes('@')) {
      setClientModalError('Invalid email format');
      return;
    }
    if (clientModalFields.technologies.length === 0) {
      setClientModalError('At least one technology must be selected');
      return;
    }

    setClientModalLoading(true);
    try {
      const response = await addClient(
        clientModalFields.name,
        clientModalFields.contactEmail,
        clientModalFields.activePositions,
        clientModalFields.technologies
      );
      setClients(prev => [...prev, response]);
      setClientModalSuccess('Client added successfully!');
      setTimeout(() => {
        resetClientModal();
      }, 1500);
    } catch (error) {
      console.error('Error adding client:', error);
      if (error.response?.status === 401) {
        setClientModalError('Please log in to add clients');
      } else if (error.response?.status === 400) {
        setClientModalError(error.response.data || 'Invalid client data');
      } else {
        setClientModalError(error.message || 'Failed to add client');
      }
    } finally {
      setClientModalLoading(false);
    }
  };

  // Update handleScheduleInterview with better error handling
  const handleScheduleInterview = async (candidateId) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) {
      setError('Candidate not found');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await scheduleClientInterview(
        candidateId,
        selectedClient,
        interviewDetails.date,
        interviewDetails.time,
        interviewDetails.level,
        selectedJD?.title,
        interviewDetails.link
      );

      if (response) {
        // Update candidate status
        setCandidates(prev => prev.map(c => 
          c.id === candidateId 
            ? { ...c, status: 'interview_scheduled' }
            : c
        ));
        
        // Update interviews list
        setClientInterviews(prev => [...prev, response]);
        
        // Show success message
        setError({ type: 'success', message: 'Interview scheduled successfully' });
        
        // Close scheduler
        setShowInterviewScheduler(false);
        setSelectedForInterview([]);
        setInterviewDetails({
          level: 1,
          date: '',
          time: '',
          mode: 'virtual',
          link: '',
          location: '',
          notes: '',
          client: '',
          jobDescriptionTitle: '',
          interviewerName: ''
        });
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      if (error.response?.status === 401) {
        setError('Please log in to schedule interviews');
      } else if (error.response?.status === 403) {
        setError('Sales team can only schedule client interviews');
      } else if (error.response?.status === 400) {
        setError(error.response.data || 'Invalid interview data');
      } else {
        setError(error.message || 'Failed to schedule interview');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFeedback = async (interviewId, feedback) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await updateClientInterview(interviewId, {
        feedback,
        result: feedback.toLowerCase().includes('selected') ? 'hired' : 'rejected',
        overallStatus: 'completed'
      });

      if (response) {
        // Update interview status
        setClientInterviews(prev => prev.map(i => 
          i.id === interviewId 
            ? { ...i, feedback, result: response.result, overallStatus: 'completed' }
            : i
        ));
        // Refresh data
        fetchData();
        setError({ type: 'success', message: 'Feedback updated successfully' });
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
      if (error.response?.status === 401) {
        setError('Please log in to update feedback');
      } else if (error.response?.status === 400) {
        setError('Invalid feedback data. Please check your input.');
      } else {
        setError(error.message || 'Failed to update feedback');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {renderHeader()}
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'clients' ? styles.active : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          <FiUsers /> Clients
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'jds' ? styles.active : ''}`}
          onClick={() => setActiveTab('jds')}
        >
          <FiFileText /> Job Descriptions
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'resumePool' ? styles.active : ''}`}
          onClick={() => setActiveTab('resumePool')}
        >
          <FiUpload /> Resume Pool
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'shortlisted' ? styles.active : ''}`}
          onClick={() => setActiveTab('shortlisted')}
        >
          <FiCheck /> Shortlisted
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'interviews' ? styles.active : ''}`}
          onClick={() => setActiveTab('interviews')}
        >
          <FiCalendar /> Client Interviews
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'deployments' ? styles.active : ''}`}
          onClick={() => setActiveTab('deployments')}
        >
          <FiSend /> Deployments
        </button>
      </div>
      <div className={styles.contentContainer}>
        {renderTabContent()}
      </div>
      <ClientModal
        show={showClientModal}
        onClose={() => {
          setShowClientModal(false);
          setClientModalError('');
          setClientModalSuccess('');
        }}
        onSubmit={handleClientModalSubmit}
        fields={clientModalFields}
        onFieldChange={handleClientModalFieldChange}
        error={clientModalError}
        success={clientModalSuccess}
        loading={clientModalLoading}
        onTechChange={handleClientModalTechChange}
      />
      {selectedJD === 'new' && (
        <div className={styles.modalOverlay}>
          <motion.div 
            className={styles.modal}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <form onSubmit={handleJDModalSubmit}>
              <div className={styles.modalHeader}>
                <h3>Add New Job Description</h3>
                <button 
                  className={styles.closeButton}
                  type="button"
                  onClick={resetJDModal}
                >
                  <FiX />
                </button>
              </div>
              <div className={styles.modalContent}>
                {jdModalError && <div className={styles.errorMessage}>{jdModalError}</div>}
                {jdModalSuccess && <div className={styles.successMessage}>{jdModalSuccess}</div>}
                <div className={styles.formGroup}>
                  <label>Title *</label>
                  <input
                    type="text"
                    value={jdModalFields.title}
                    onChange={e => handleJDModalFieldChange('title', e.target.value)}
                    placeholder="Enter JD title"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Client *</label>
                  <select
                    value={jdModalFields.client}
                    onChange={e => handleJDModalFieldChange('client', e.target.value)}
                    className={styles.input}
                  >
                    <option value="">Select client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.name}>{client.name}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Technology *</label>
                  <select
                    value={jdModalFields.technology}
                    onChange={e => handleJDModalFieldChange('technology', e.target.value)}
                    className={styles.input}
                  >
                    <option value="">Select technology</option>
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                    <option value=".NET">.NET</option>
                    <option value="DevOps">DevOps</option>
                    <option value="SalesForce">SalesForce</option>
                    <option value="UI">UI</option>
                    <option value="Testing">Testing</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Resource Type *</label>
                  <select
                    value={jdModalFields.resourceType}
                    onChange={e => handleJDModalFieldChange('resourceType', e.target.value)}
                    className={styles.input}
                  >
                    <option value="">Select type</option>
                    <option value="OM">OM</option>
                    <option value="TCT1">TCT1</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    value={jdModalFields.description}
                    onChange={e => handleJDModalFieldChange('description', e.target.value)}
                    placeholder="Enter JD description"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Received Date</label>
                  <input
                    type="date"
                    value={jdModalFields.receivedDate}
                    onChange={e => handleJDModalFieldChange('receivedDate', e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={jdModalFields.deadline}
                    onChange={e => handleJDModalFieldChange('deadline', e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Upload JD File *</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleJDModalFileChange}
                    className={styles.input}
                  />
                  {jdModalFile && <span style={{fontSize:'0.9em'}}>{jdModalFile.name}</span>}
                </div>
                <div className={styles.modalFooter}>
                  <button 
                    className={`${styles.button} ${styles.secondary}`}
                    type="button"
                    onClick={resetJDModal}
                    disabled={jdModalLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    className={`${styles.button} ${styles.primary}`}
                    type="submit"
                    disabled={jdModalLoading}
                  >
                    {jdModalLoading ? 'Uploading...' : 'Submit'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SalesTeamDashboard;
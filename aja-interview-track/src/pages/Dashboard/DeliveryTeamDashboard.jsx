import React, { useState, useEffect, useCallback } from 'react';
import { 
  FiUsers, FiCalendar, FiCheckCircle, FiClock, FiFileText, 
  FiSend, FiEdit, FiPlus, FiFilter, FiSearch, FiBarChart2,
  FiChevronDown, FiChevronUp, FiExternalLink, FiMail, FiUser, FiX, FiPlay, FiImage, FiUpload, FiDownload
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import styles from './DeliveryTeamDashboard.module.css';
import { 
  getEmployees, 
  scheduleInterview,
  updateMockInterviewFeedback,
  getUpcomingInterviews,
  getCompletedInterviews,
  updateInterviewStatus,
  updateProfilePicture,
  getProfilePicture,
  getMockInterviewPerformance,
  getUserByRole 
} from '../../API/delivery';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import EvaluationModal from '../../components/EvaluationModal';
import { toast } from 'react-hot-toast';

const DeliveryTeamDashboard = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [mockInterviews, setMockInterviews] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [technologyFilter, setTechnologyFilter] = useState('all');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('all');
  const [isScheduling, setIsScheduling] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [profilesSentToSales, setProfilesSentToSales] = useState([]);
  const [deployedEmployees, setDeployedEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interviewType, setInterviewType] = useState('mock');
  const [client, setClient] = useState('');
  const [level, setLevel] = useState('');
  const [jobDescriptionTitle, setJobDescriptionTitle] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isEmployeesLoading, setIsEmployeesLoading] = useState(false);
  const [isInterviewsLoading, setIsInterviewsLoading] = useState(false);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [showInterviewScheduler, setShowInterviewScheduler] = useState(false);
  const [selectedEmployeeForScheduling, setSelectedEmployeeForScheduling] = useState(null);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    readyForSales: true,
    otherInterviews: true
  });
  const [completedTab, setCompletedTab] = useState('readyForSales');
  const [profilePic, setProfilePic] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    empId: '',
    id: ''
  });
  const [performanceData, setPerformanceData] = useState([]);
  const [feedbackFile, setFeedbackFile] = useState(null);

  const technologies = ['Java', 'Python', '.NET', 'DevOps', 'SalesForce', 'UI Development', 'Testing'];
  const resourceTypes = ['OM', 'TCT1', 'TCT2'];

  const LoadingSpinner = () => (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Loading dashboard data...</p>
    </div>
  );

  const ErrorMessage = ({ message, onRetry }) => (
    <div className={styles.errorContainer}>
      <h3>Error</h3>
      <p>{message}</p>
      <button 
        className={styles.primaryButton}
        onClick={onRetry}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Try Again'}
      </button>
    </div>
  );

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const employeesData = await getEmployees(technologyFilter, resourceTypeFilter);
      if (Array.isArray(employeesData)) {
        setEmployees(employeesData);
      } else {
        console.error('Invalid employees data received:', employeesData);
        setEmployees([]);
      }

      let upcomingData = [];
      try {
        upcomingData = await getUpcomingInterviews();
        if (!Array.isArray(upcomingData)) {
          console.error('Invalid upcoming interviews data received:', upcomingData);
          upcomingData = [];
        }
      } catch (error) {
        console.error('Error fetching upcoming interviews:', error);
        setError(error.message || 'Failed to load upcoming interviews');
      }

      let completedData = [];
      try {
        completedData = await getCompletedInterviews();
        if (!Array.isArray(completedData)) {
          console.error('Invalid completed interviews data received:', completedData);
          completedData = [];
        }
      } catch (error) {
        console.error('Error fetching completed interviews:', error);
        setError(error.message || 'Failed to load completed interviews');
      }

      const allInterviews = [
        ...upcomingData,
        ...completedData,
      ].map(interview => {
        const employee = employeesData.find(e => e && e.empId === interview.employeeId);
        return {
          ...interview,
          employeeName: employee?.user?.fullName || 'Unknown Employee',
          employee: employee
        };
      });
      setMockInterviews(allInterviews);

      const sentToSales = completedData
        .filter(i => i && i.sentToSales)
        .map(i => i.employeeId);
      setProfilesSentToSales(sentToSales);

      const deployed = completedData
        .filter(i => i && i.deployed)
        .map(i => i.employeeId);
      setDeployedEmployees(deployed);

      try {
        const performance = await getMockInterviewPerformance();
        if (Array.isArray(performance)) {
          setPerformanceData(performance);
        } else {
          console.error('Invalid performance data received:', performance);
          setPerformanceData([]);
        }
      } catch (error) {
        console.error('Error fetching performance data:', error);
        toast.error('Could not load performance data.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to load dashboard data');
      setEmployees([]);
      setMockInterviews([]);
      setProfilesSentToSales([]);
      setDeployedEmployees([]);
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [technologyFilter, resourceTypeFilter]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserByRole();
        setUserData({
          name: user.fullName || 'N/A',
          email: user.email || 'N/A',
          role: user.role || 'ROLE_DELIVERY_TEAM',
          empId: user.empId || 'N/A',
          id: user.id || 'N/A'
        });

        try {
          const response = await getProfilePicture(user.id);
          setProfilePic(response);
        } catch (error) {
          console.error('Error fetching profile picture:', error);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error(error.message || 'Failed to load user data');
      }
    };
    fetchUserData();
  }, []);

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setSelectedFile(file);
        await updateProfilePicture(userData.id, file);
        const response = await getProfilePicture(userData.id);
        setProfilePic(response);
        toast.success('Profile picture updated successfully!');
      } catch (error) {
        console.error('Error updating profile picture:', error);
        toast.error(error.message || 'Failed to update profile picture');
      }
    }
  };

  const handleFeedbackFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFeedbackFile(file);
    }
  };

  const downloadFile = async (s3Key) => {
    try {
      const presignedUrl = s3Key;
      const link = document.createElement('a');
      link.href = presignedUrl;
      link.download = s3Key.split('/').pop() || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('File download started.');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file.');
    }
  };

  const filteredEmployees = Array.isArray(employees) ?
    employees.filter(employee => {
      if (!employee || !employee.user) return false;
      const matchesSearch = employee.user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
      const matchesTechnology = technologyFilter === 'all' || (employee.technology?.toLowerCase() === technologyFilter.toLowerCase());
      const matchesResourceType = resourceTypeFilter === 'all' || (employee.resourceType?.toLowerCase() === resourceTypeFilter.toLowerCase());
      return matchesSearch && matchesTechnology && matchesResourceType;
    })
    : [];

  const upcomingInterviews = Array.isArray(mockInterviews) 
    ? mockInterviews.filter(i => i && i.status === 'scheduled')
    : [];

  const completedInterviews = Array.isArray(mockInterviews)
    ? mockInterviews.filter(i => i && i.status === 'completed')
    : [];

  const techPerformanceData = technologies.map(tech => {
    const techInterviews = completedInterviews.filter(i => {
      const emp = (employees || []).find(e => e && e.empId === i.employeeId);
      return emp && emp.technology === tech;
    });
    const avgTechnical = techInterviews.length > 0 
      ? techInterviews.reduce((sum, i) => sum + (i.technicalRating || 0), 0) / techInterviews.length
      : 0;
    const avgCommunication = techInterviews.length > 0 
      ? techInterviews.reduce((sum, i) => sum + (i.communicationRating || 0), 0) / techInterviews.length
      : 0;
    return { 
      name: tech, 
      technical: parseFloat(avgTechnical.toFixed(1)), 
      communication: parseFloat(avgCommunication.toFixed(1)),
      count: techInterviews.length
    };
  });

  const resourcePerformanceData = resourceTypes.map(type => {
    const typeInterviews = completedInterviews.filter(i => {
      const emp = (employees || []).find(e => e && e.empId === i.employeeId);
      return emp && emp.resourceType === type;
    });
    const avgTechnical = typeInterviews.length > 0 
      ? typeInterviews.reduce((sum, i) => sum + (i.technicalRating || 0), 0) / typeInterviews.length
      : 0;
    const avgCommunication = typeInterviews.length > 0 
      ? typeInterviews.reduce((sum, i) => sum + (i.communicationRating || 0), 0) / typeInterviews.length
      : 0;
    return { 
      name: type, 
      technical: parseFloat(avgTechnical.toFixed(1)), 
      communication: parseFloat(avgCommunication.toFixed(1)),
      count: typeInterviews.length
    };
  });

  const topPerformers = performanceData.filter(p => p.totalRating >= 16);

  const totalCompleted = completedInterviews.length;
  const totalSentToSales = completedInterviews.filter(i => i.sentToSales).length;
  const totalDeployed = completedInterviews.filter(i => i.deployed).length;

  const conversionData = [
    { name: 'Completed Interviews', value: totalCompleted },
    { name: 'Sent to Sales', value: totalSentToSales },
    { name: 'Deployed', value: totalDeployed }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const handleScheduleInterviewSubmit = async (interviewData) => {
    setIsLoading(true);
    setIsInterviewsLoading(true);
    setError(null);
    try {
      const response = await scheduleInterview({
        empId: interviewData.empId,
        date: interviewData.date,
        time: interviewData.time,
        interviewerId: interviewData.interviewerId,
        files: interviewData.files
      });
      if (response) {
        setMockInterviews(prev => {
          const newInterview = {
            ...response,
            employeeName: employees.find(e => e.empId === response.employeeId)?.user?.fullName || 'Unknown Employee',
            employee: employees.find(e => e.empId === response.employeeId)
          };
          return [...prev, newInterview];
        });
        setShowInterviewScheduler(false);
        setSelectedEmployeeForScheduling(null);
        toast.success('Interview scheduled successfully!');
        await fetchData();
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast.error(error.message || 'Failed to schedule interview. Please try again.');
    } finally {
      setIsLoading(false);
      setIsInterviewsLoading(false);
    }
  };

  const handleUpdateFeedback = async (data) => {
    setIsFeedbackLoading(true);
    setError(null);
    try {
      const updatedInterview = await updateMockInterviewFeedback(
        data.interviewId,
        data.technicalFeedback,
        data.communicationFeedback,
        data.technicalRating,
        data.communicationRating,
        data.sentToSales || false,
        feedbackFile
      );
      const updatedInterviews = mockInterviews.map(interview => {
        if (interview.id === data.interviewId) {
          return {
            ...interview,
            ...updatedInterview,
            status: 'completed'
          };
        }
        return interview;
      });
      setMockInterviews(updatedInterviews);
      setSelectedInterviewId(null);
      setFeedbackFile(null);
      toast.success('Feedback updated successfully!');
      const completedData = await getCompletedInterviews();
      if (Array.isArray(completedData)) {
        const allInterviews = [
          ...mockInterviews.filter(i => i.status === 'scheduled'),
          ...completedData
        ].map(interview => {
          const employee = employees.find(e => e && e.empId === interview.employeeId);
          return {
            ...interview,
            employeeName: employee?.user?.fullName || 'Unknown Employee',
            employee
          };
        });
        setMockInterviews(allInterviews);
      }
      return updatedInterview;
    } catch (error) {
      console.error('Error updating feedback:', error);
      toast.error(error.message || 'Failed to update feedback. Please try again.');
      throw error;
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  const handleCloseFeedbackModal = () => {
    setSelectedInterviewId(null);
    setFeedbackFile(null);
    setError(null);
  };

  const sendToSales = async (interview) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await updateMockInterviewFeedback(
        interview.id,
        interview.technicalFeedback,
        interview.communicationFeedback,
        interview.technicalRating,
        interview.communicationRating,
        true,
        null
      );
      toast.success('Profile sent to sales successfully!');
      await fetchData();
    } catch (error) {
      console.error('Error sending to sales:', error);
      toast.error(error.message || 'Failed to send profile to sales. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateInterviewStatus = async (interviewId) => {
    try {
      setIsLoading(true);
      await updateInterviewStatus(interviewId);
      toast.success('Interview status updated successfully!');
      await fetchData();
    } catch (error) {
      console.error('Error updating interview status:', error);
      toast.error(error.message || 'Failed to update interview status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getScoreColor = useCallback((score) => {
    if (score >= 8) return '#28a745';
    if (score >= 5) return '#ffc107';
    return '#dc3545';
  }, []);

  const renderTabContent = () => {
    if (isLoading && !isInitialLoading) {
      return <LoadingSpinner />;
    }

    if (error && !isInitialLoading) {
      return <ErrorMessage message={error} onRetry={fetchData} />;
    }

    switch (activeTab) {
      case 'employees':
        return (
          <div className={styles.sectionContainer}>
            <div className={styles.filterControls}>
              <div className={styles.searchBox}>
                <FiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button 
                className={styles.filterToggle}
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? <FiChevronUp /> : <FiChevronDown />} Filters
              </button>
              
              <button 
                className={styles.primaryButton}
                onClick={() => setShowInterviewScheduler(true)}
              >
                <FiPlus /> Schedule Interview
              </button>
            </div>
            
            {showFilters && (
              <div className={styles.advancedFilters}>
                <div className={styles.filterGroup}>
                  <label>Technology</label>
                  <select
                    value={technologyFilter}
                    onChange={(e) => setTechnologyFilter(e.target.value)}
                  >
                    <option value="all">All Technologies</option>
                    {technologies.map(tech => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.filterGroup}>
                  <label>Resource Type</label>
                  <select
                    value={resourceTypeFilter}
                    onChange={(e) => setResourceTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    {resourceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            
            <div className={styles.cardGrid}>
              {filteredEmployees.map(employee => (
                <motion.div
                  key={employee.id}
                  className={styles.card}
                  whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.userAvatar}>
                      {isLoading ? (
                        <div className={styles.loadingSpinner} />
                      ) : employee.profilePicS3Key ? (
                        <img
                          src={employee.profilePicS3Key}
                          alt={`${employee.user?.fullName || 'Employee'}'s profile`}
                          className={styles.profilePicture}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            console.error('Employee profile picture failed to load');
                          }}
                        />
                      ) : (
                        <FiUser />
                      )}
                    </div>
                    <div>
                      <h3>{employee.user?.fullName || 'Unknown Employee'}</h3>
                      <div className={styles.cardMeta}>
                        <span className={`${styles.techBadge} ${styles[employee.technology?.replace(' ', '')]}`}>
                          {employee.technology || 'Unknown'}
                        </span>
                        <span className={`${styles.resourceBadge} ${styles[employee.resourceType]}`}>
                          {employee.resourceType || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardDetails}>
                    <p><strong>Status:</strong> {employee.status || 'N/A'}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <button 
                      className={styles.secondaryButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEmployeeForScheduling(employee);
                        setShowInterviewScheduler(true);
                      }}
                    >
                      <FiCalendar /> Schedule
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'interviews':
        return (
          <div className={styles.sectionContainer}>
            <div className={styles.interviewTabs}>
              <button 
                className={`${styles.interviewTabButton} ${styles.active}`}
              >
                Upcoming Interviews
              </button>
            </div>
            
            <div className={styles.filterControls}>
              <div className={styles.filterGroup}>
                <label>Technology</label>
                <select
                  value={technologyFilter}
                  onChange={(e) => setTechnologyFilter(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All Technologies</option>
                  {technologies.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
              </div>
              
              <div className={styles.filterGroup}>
                <label>Resource Type</label>
                <select
                  value={resourceTypeFilter}
                  onChange={(e) => setResourceTypeFilter(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All Types</option>
                  {resourceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className={styles.interviewSummary}>
              <div className={styles.summaryCard}>
                <h4>Upcoming Interviews</h4>
                <p>{upcomingInterviews.length}</p>
              </div>
              <div className={styles.summaryCard}>
                <h4>Completed Interviews</h4>
                <p>{completedInterviews.length}</p>
              </div>
              <div className={styles.summaryCard}>
                <h4>Sent to Sales</h4>
                <p>{profilesSentToSales.length}</p>
              </div>
              <div className={styles.summaryCard}>
                <h4>Deployed</h4>
                <p>{deployedEmployees.length}</p>
              </div>
            </div>
            
            <div className={styles.interviewList}>
              <div className={styles.interviewListHeader}>
                <h4>Upcoming Mock Interviews</h4>
              </div>
              
              {upcomingInterviews.length === 0 ? (
                <div className={styles.emptyState}>
                  <FiCalendar size={48} />
                  <p>No upcoming interviews scheduled</p>
                </div>
              ) : (
                <div className={styles.employeeList}>
                  {upcomingInterviews
                    .filter(interview => {
                      const matchesTechnology = technologyFilter === 'all' || 
                        interview.employee?.technology === technologyFilter;
                      const matchesResourceType = resourceTypeFilter === 'all' || 
                        interview.employee?.resourceType === resourceTypeFilter;
                      return matchesTechnology && matchesResourceType;
                    })
                    .map(interview => (
                    <motion.div
                      key={interview.id}
                      className={styles.interviewCard}
                      whileHover={{ scale: 1.01 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.interviewHeader}>
                        <div className={styles.interviewHeaderLeft}>
                          <h4>{interview.employeeName || 'Unknown Employee'}</h4>
                          <div className={styles.interviewMeta}>
                            <span className={`${styles.techBadge} ${styles[interview.employee?.technology?.replace(' ', '')]}`}>
                              {interview.employee?.technology || 'Unknown'}
                            </span>
                            <span className={`${styles.resourceBadge} ${styles[interview.employee?.resourceType]}`}>
                              {interview.employee?.resourceType || 'Unknown'}
                            </span>
                          </div>
                        </div>
                        <div className={styles.interviewDate}>
                          <FiCalendar /> {interview.date} at {interview.time}
                        </div>
                      </div>
                      
                      <div className={styles.interviewDetails}>
                        <div className={styles.detailRow}>
                          <p><strong>Status:</strong> {interview.status || 'N/A'}</p>
                        </div>
                        <div className={styles.detailRow}>
                          <p><strong>Interviewer:</strong> {interview.interviewer?.fullName || 'N/A'}</p>
                        </div>
                        {interview.fileS3Keys && interview.fileS3Keys.length > 0 && (
                          <div className={styles.detailRow}>
                            <p><strong>Files:</strong></p>
                            {interview.fileS3Keys.map((s3Key, index) => (
                              <button
                                key={index}
                                className={styles.downloadButton}
                                onClick={() => downloadFile(s3Key)}
                              >
                                <FiDownload /> Download File {index + 1}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.interviewActions}>
                        <div className={styles.actionButtons}>
                          <button 
                            className={`${styles.button} ${styles.primary}`}
                            onClick={() => {/* handle start interview */}}
                          >
                            <FiPlay /> Start Interview
                          </button>
                          <button 
                            className={`${styles.button} ${styles.secondary}`}
                            onClick={() => {/* handle reschedule */}}
                          >
                            <FiCalendar /> Reschedule
                          </button>
                          <button 
                            className={`${styles.button} ${styles.success}`}
                            onClick={() => handleUpdateInterviewStatus(interview.id)}
                            disabled={isLoading}
                          >
                            <FiCheckCircle /> Update Interview
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'completed':
        return (
          <div className={styles.sectionContainer}>
            <div className={styles.interviewList}>
              <div className={styles.interviewListHeader}>
                <h4>Ready for Sales</h4>
                <p className={styles.sectionDescription}>Interviews with good ratings that can be sent to sales or need improvement</p>
              </div>
              
              {completedInterviews.length === 0 ? (
                <div className={styles.emptyState}>
                  <FiCheckCircle size={48} />
                  <p>No completed interviews</p>
                </div>
              ) : (
                completedInterviews
                  .filter(interview => interview.status === 'completed')
                  .map(interview => (
                    <motion.div
                      key={interview.id}
                      className={styles.interviewCard}
                      whileHover={{ scale: 1.01 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.interviewHeader}>
                        <div>
                          <h4>{interview.employeeName || 'Unknown Employee'}</h4>
                          <div className={styles.interviewMeta}>
                            <span className={`${styles.techBadge} ${styles[interview.employee?.technology?.replace(' ', '')]}`}>
                              {interview.employee?.technology || 'Unknown'}
                            </span>
                            <span className={`${styles.resourceBadge} ${styles[interview.employee?.resourceType]}`}>
                              {interview.employee?.resourceType || 'Unknown'}
                            </span>
                            <span className={styles.status}>
                              {interview.status}
                            </span>
                            {interview.sentToSales && (
                              <span className={styles.sentToSalesBadge}>
                                Sent to Sales
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={styles.interviewDate}>
                          <FiCalendar /> {interview.date} at {interview.time}
                        </div>
                      </div>
                      
                      <div className={styles.interviewDetails}>
                        <p><strong>Employee ID:</strong> {interview.employee?.empId || 'N/A'}</p>
                        <p><strong>Interviewer:</strong> {interview.interviewer?.fullName || 'N/A'}</p>
                        {interview.fileS3Keys && interview.fileS3Keys.length > 0 && (
                          <div className={styles.detailRow}>
                            <p><strong>Files:</strong></p>
                            {interview.fileS3Keys.map((s3Key, index) => (
                              <button
                                key={index}
                                className={styles.downloadButton}
                                onClick={() => downloadFile(s3Key)}
                              >
                                <FiDownload /> Download File {index + 1}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.interviewScores}>
                        <div className={styles.scoreMeter}>
                          <div className={styles.scoreLabel}>
                            Technical: {interview.technicalRating || 'N/A'}/10
                          </div>
                          <div className={styles.scoreBar}>
                            <div 
                              className={styles.scoreFill} 
                              style={{
                                width: `${(interview.technicalRating || 0) * 10}%`,
                                backgroundColor: getScoreColor(interview.technicalRating || 0)
                              }}
                            />
                          </div>
                        </div>
                        <div className={styles.scoreMeter}>
                          <div className={styles.scoreLabel}>
                            Communication: {interview.communicationRating || 'N/A'}/10
                          </div>
                          <div className={styles.scoreBar}>
                            <div 
                              className={styles.scoreFill} 
                              style={{
                                width: `${(interview.communicationRating || 0) * 10}%`,
                                backgroundColor: getScoreColor(interview.communicationRating || 0)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.feedback}>
                        <h5>Technical Feedback</h5>
                        <p>{interview.technicalFeedback || 'N/A'}</p>
                        
                        <h5>Communication Feedback</h5>
                        <p>{interview.communicationFeedback || 'N/A'}</p>
                      </div>
                      
                      <div className={styles.interviewActions}>
                        <button 
                          className={styles.secondaryButton}
                          onClick={() => {
                            setSelectedInterviewId(interview.id);
                            setFeedbackFile(null);
                          }}
                        >
                          <FiEdit /> Edit Feedback
                        </button>
                        
                        {!interview.sentToSales && (
                          <button
                            className={styles.successButton}
                            onClick={() => sendToSales(interview)}
                            disabled={isSubmitting}
                          >
                            <FiSend /> Send to Sales
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
              )}
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className={styles.analyticsContainer}>
            <div className={styles.statsGrid}>
              <motion.div 
                className={styles.statCard}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h5>Interviews Conducted</h5>
                <p className={styles.statValue}>{completedInterviews.length}</p>
                <p className={styles.statLabel}>This Month</p>
              </motion.div>
              <motion.div 
                className={styles.statCard}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h5>Avg Technical Score</h5>
                <p className={styles.statValue}>
                  {completedInterviews.length > 0 
                    ? (completedInterviews.reduce((sum, i) => sum + (i.technicalRating || 0), 0) / completedInterviews.length).toFixed(1)
                    : '0.0'}
                </p>
                <p className={styles.statLabel}>/ 10.0</p>
              </motion.div>
              <motion.div 
                className={styles.statCard}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <h5>Avg Communication Score</h5>
                <p className={styles.statValue}>
                  {completedInterviews.length > 0 
                    ? (completedInterviews.reduce((sum, i) => sum + (i.communicationRating || 0), 0) / completedInterviews.length).toFixed(1)
                    : '0.0'}
                </p>
                <p className={styles.statLabel}>/ 10.0</p>
              </motion.div>
              <motion.div 
                className={styles.statCard}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <h5>Profiles Sent</h5>
                <p className={styles.statValue}>
                  {profilesSentToSales.length}
                </p>
                <p className={styles.statLabel}>To Sales Team</p>
              </motion.div>
              <motion.div 
                className={styles.statCard}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <h5>Deployment Rate</h5>
                <p className={styles.statValue}>
                  {profilesSentToSales.length > 0 
                    ? Math.round((deployedEmployees.length / profilesSentToSales.length) * 100)
                    : '0'}%
                </p>
                <p className={styles.statLabel}>Hired by Clients</p>
              </motion.div>
            </div>
            
            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <h4>Performance by Technology</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={techPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="technical" fill="#8884d8" name="Technical" />
                    <Bar dataKey="communication" fill="#82ca9d" name="Communication" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className={styles.chartCard}>
                <h4>Performance by Resource Type</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={resourcePerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="technical" fill="#8884d8" name="Technical" />
                    <Bar dataKey="communication" fill="#82ca9d" name="Communication" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <h4>Interview Conversion</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={conversionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {conversionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} interviews`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className={styles.chartCard}>
                <h4>Top Performers</h4>
                <div className={styles.topPerformersList}>
                  {topPerformers.length > 0 ? (
                    topPerformers.map((performer, index) => (
                      <div key={index} className={styles.performerCard}>
                        <div className={styles.performerInfo}>
                          <div className={styles.userAvatarSmall}>
                            {isLoading ? (
                              <div className={styles.loadingSpinner} />
                            ) : performer.profilePicS3Key ? (
                              <img
                                src={performer.profilePicS3Key}
                                alt={`${performer.employeeName || 'Performer'}'s profile`}
                                className={styles.profilePictureSmall}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  console.error('Top performer profile picture failed to load');
                                }}
                              />
                            ) : (
                              <FiUser />
                            )}
                          </div>
                          <div>
                            <h5>{performer.employeeName}</h5>
                            <div className={styles.performerMeta}>
                              <span className={`${styles.techBadge} ${styles[performer.technology?.replace(' ', '')]}`}>
                                {performer.technology}
                              </span>
                              <span className={`${styles.resourceBadge} ${styles[performer.resourceType]}`}>
                                {performer.resourceType}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.performerScore}>
                          <span>{performer.totalRating / 2}</span>
                          /10
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyState}>
                      <p>No top performers yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className={styles.sectionContainer}>
            <h3 className={styles.sectionTitle}>My Profile</h3>
            <div className={styles.profileSection}>
              <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                  <div className={styles.profilePictureContainer}>
                    {isLoading ? (
                      <div className={styles.loadingSpinner} />
                    ) : profilePic ? (
                      <img
                        src={profilePic}
                        alt={`${userData.name || 'User'}'s profile`}
                        className={styles.profilePicture}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          console.error('Profile picture failed to load');
                        }}
                      />
                    ) : (
                      <div className={styles.noProfilePic}>
                        <FiUser size={48} />
                      </div>
                    )}
                    <input
                      type="file"
                      id="profilePictureUpload"
                      accept="image/jpeg,image/png"
                      onChange={handleProfilePictureChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="profilePictureUpload" className={styles.profilePictureUpload}>
                      <FiUpload size={18} /> Update Photo
                    </label>
                  </div>
                  <div className={styles.profileInfo}>
                    <h2>{userData.name}</h2>
                    <p className={styles.profileRole}>{userData.role}</p>
                    <p className={styles.profileEmail}>{userData.email}</p>
                  </div>
                </div>
                
                <div className={styles.profileDetails}>
                  <h4>Profile Details</h4>
                  <div className={styles.profileTable}>
                    <div className={styles.tableRow}>
                      <div className={styles.tableHeader}>Name</div>
                      <div className={styles.tableValue}>{userData.name}</div>
                    </div>
                    <div className={styles.tableRow}>
                      <div className={styles.tableHeader}>Email</div>
                      <div className={styles.tableValue}>{userData.email}</div>
                    </div>
                    <div className={styles.tableRow}>
                      <div className={styles.tableHeader}>Role</div>
                      <div className={styles.tableValue}>{userData.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderModalActions = useCallback(() => (
    <div className={styles.modalActions}>
      <button 
        type="button" 
        className={styles.secondaryButton}
        onClick={handleCloseFeedbackModal}
        disabled={isSubmitting || isFeedbackLoading}
      >
        Cancel
      </button>
      <button 
        type="submit" 
        className={styles.primaryButton}
        disabled={isSubmitting || isFeedbackLoading}
      >
        {isSubmitting ? 'Updating...' : 'Update Feedback'}
      </button>
    </div>
  ), [isSubmitting, isFeedbackLoading]);

  const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = useState(false);
    if (hasError) {
      return (
        <div className={styles.errorContainer}>
          <h3>Something went wrong</h3>
          <p>Please try refreshing the page or contact support if the problem persists.</p>
          <button 
            className={styles.primaryButton}
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return children;
  };

  const LoadingState = () => (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>{isInitialLoading ? 'Loading dashboard...' : 'Updating data...'}</p>
    </div>
  );

  const currentSelectedInterview = mockInterviews.find(interview => interview.id === selectedInterviewId) || null;

  return (
    <ErrorBoundary>
      <div className={styles.dashboardContainer}>
        {isInitialLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchData} />
        ) : (
          <>
            <div className={styles.dashboardHeader}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2>Delivery Team Dashboard</h2>
                <p className={styles.dashboardSubtitle}>Mock Interview Management & Employee Evaluation</p>
              </motion.div>
              <div className={styles.userProfile}>
                <div className={styles.userAvatar}>
                  {isLoading ? (
                    <div className={styles.loadingSpinner} />
                  ) : profilePic ? (
                    <img
                      src={profilePic}
                      alt={`${userData.name || 'User'}'s profile`}
                      className={styles.profilePicture}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        console.error('Profile picture failed to load');
                      }}
                    />
                  ) : (
                    <FiUser />
                  )}
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{userData.name}</span>
                  <span className={styles.userName}>
                    {userData.role} {userData.email ? `(${userData.email})` : ''}
                  </span>
                </div>
              </div>
            </div>
            
            <div className={styles.tabs}>
              <motion.button
                className={`${styles.tab} ${activeTab === 'employees' ? styles.active : ''}`}
                onClick={() => setActiveTab('employees')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiUsers /> Employees
              </motion.button>
              <motion.button
                className={`${styles.tab} ${activeTab === 'interviews' ? styles.active : ''}`}
                onClick={() => setActiveTab('interviews')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiCalendar /> Upcoming Interviews
              </motion.button>
              <motion.button
                className={`${styles.tab} ${activeTab === 'completed' ? styles.active : ''}`}
                onClick={() => setActiveTab('completed')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiCheckCircle /> Completed Interviews
              </motion.button>
              <motion.button
                className={`${styles.tab} ${activeTab === 'analytics' ? styles.active : ''}`}
                onClick={() => setActiveTab('analytics')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiBarChart2 /> Analytics
              </motion.button>
              <motion.button
                className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
                onClick={() => setActiveTab('profile')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiUser /> My Profile
              </motion.button>
            </div>
            
            <motion.div
              className={styles.tabContent}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
            
            <AnimatePresence>
              {selectedInterviewId && (
                <EvaluationModal
                  selectedInterview={currentSelectedInterview}
                  setSelectedInterview={setSelectedInterviewId}
                  mockInterviews={mockInterviews}
                  onUpdate={handleUpdateFeedback}
                  feedbackFile={feedbackFile}
                  onFileChange={handleFeedbackFileChange}
                  onDownloadFile={downloadFile}
                />
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {showInterviewScheduler && (
                <ScheduleInterviewModal
                  show={showInterviewScheduler}
                  onClose={() => {
                    setShowInterviewScheduler(false);
                    setSelectedEmployeeForScheduling(null);
                  }}
                  onSubmit={handleScheduleInterviewSubmit}
                  employees={employees}
                  selectedEmployee={selectedEmployeeForScheduling}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default DeliveryTeamDashboard;
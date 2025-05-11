import React, { useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiCheckCircle, FiClock, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './Dashboard.module.css';

const DeliveryTeamDashboard = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [employees, setEmployees] = useState([]);
  const [mockInterviews, setMockInterviews] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Mock data - in real app, this would come from API
    setEmployees([
      { id: 1, name: 'John Doe', skill: 'Java', level: 'Intermediate', nextReviewDate: '2023-05-20' },
      { id: 2, name: 'Jane Smith', skill: 'Python', level: 'Senior', nextReviewDate: '2023-05-22' },
      { id: 3, name: 'Mike Johnson', skill: '.NET', level: 'Junior', nextReviewDate: '2023-05-18' },
      { id: 4, name: 'Sarah Williams', skill: 'DevOps', level: 'Intermediate', nextReviewDate: '2023-05-25' }
    ]);

    setMockInterviews([
      { id: 1, employeeId: 1, employeeName: 'John Doe', date: '2023-05-15', interviewer: 'You', status: 'completed', score: 4.2 },
      { id: 2, employeeId: 2, employeeName: 'Jane Smith', date: '2023-05-16', interviewer: 'You', status: 'scheduled' },
      { id: 3, employeeId: 3, employeeName: 'Mike Johnson', date: '2023-05-10', interviewer: 'Colleague', status: 'completed', score: 3.5 },
      { id: 4, employeeId: 4, employeeName: 'Sarah Williams', date: '2023-05-17', interviewer: 'You', status: 'completed', score: 4.0 }
    ]);
  }, []);

  const performanceData = [
    { name: 'Java', average: 4.1, employees: 12 },
    { name: 'Python', average: 4.3, employees: 8 },
    { name: '.NET', average: 3.9, employees: 10 },
    { name: 'DevOps', average: 4.2, employees: 6 },
    { name: 'UI/UX', average: 4.0, employees: 5 }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'employees':
        return (
          <div className={styles.cardGrid}>
            {employees.map(employee => (
              <motion.div 
                key={employee.id} 
                className={styles.card}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedEmployee(employee)}
              >
                <h3>{employee.name}</h3>
                <p><strong>Skill:</strong> {employee.skill} ({employee.level})</p>
                <p><strong>Next Review:</strong> {employee.nextReviewDate}</p>
                <div className={styles.cardFooter}>
                  <button className={styles.primaryButton}>
                    Schedule Interview
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        );
      case 'schedule':
        return (
          <div className={styles.interviewSchedule}>
            <h3>Upcoming Mock Interviews</h3>
            <div className={styles.scheduleList}>
              {mockInterviews.filter(i => i.status === 'scheduled').map(interview => (
                <motion.div 
                  key={interview.id} 
                  className={styles.scheduleCard}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className={styles.scheduleHeader}>
                    <h4>{interview.employeeName}</h4>
                    <span className={styles.interviewDate}>
                      <FiCalendar /> {interview.date}
                    </span>
                  </div>
                  <p><strong>Interviewer:</strong> {interview.interviewer}</p>
                  <div className={styles.scheduleActions}>
                    <button className={styles.primaryButton}>
                      Start Interview
                    </button>
                    <button className={styles.secondaryButton}>
                      Reschedule
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'completed':
        return (
          <div className={styles.completedInterviews}>
            <h3>Completed Interviews</h3>
            <div className={styles.completedList}>
              {mockInterviews.filter(i => i.status === 'completed').map(interview => (
                <motion.div 
                  key={interview.id} 
                  className={styles.completedCard}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className={styles.completedHeader}>
                    <h4>{interview.employeeName}</h4>
                    <span className={styles.interviewScore}>
                      Score: {interview.score}/5.0
                    </span>
                  </div>
                  <p><strong>Date:</strong> {interview.date}</p>
                  <p><strong>Interviewer:</strong> {interview.interviewer}</p>
                  <div className={styles.completedActions}>
                    <button className={styles.primaryButton}>
                      View Details
                    </button>
                    <button 
                      className={styles.successButton}
                      onClick={() => {
                        // In real app, this would send to sales team
                        alert(`Profile of ${interview.employeeName} sent to sales team`);
                      }}
                    >
                      Send to Sales
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className={styles.analyticsSection}>
            <div className={styles.chartContainer}>
              <h4>Skill-wise Performance</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="average" fill="#8884d8" name="Average Score" />
                  <Bar dataKey="employees" fill="#82ca9d" name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h5>Interviews Conducted</h5>
                <p className={styles.statValue}>24</p>
                <p className={styles.statLabel}>This Month</p>
              </div>
              <div className={styles.statCard}>
                <h5>Average Score</h5>
                <p className={styles.statValue}>4.1</p>
                <p className={styles.statLabel}>/ 5.0</p>
              </div>
              <div className={styles.statCard}>
                <h5>Profiles Sent</h5>
                <p className={styles.statValue}>18</p>
                <p className={styles.statLabel}>To Sales Team</p>
              </div>
              <div className={styles.statCard}>
                <h5>Conversion Rate</h5>
                <p className={styles.statValue}>65%</p>
                <p className={styles.statLabel}>Hired by Clients</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h2>Delivery Team Dashboard</h2>
        <div className={styles.teamStats}>
          <span><FiUsers /> 150 Employees</span>
          <span><FiCheckCircle /> 85 Ready for Client</span>
        </div>
      </div>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'employees' ? styles.active : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          Employees
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'schedule' ? styles.active : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          Schedule
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'completed' ? styles.active : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'analytics' ? styles.active : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>
      
      <div className={styles.tabContent}>
        {renderTabContent()}
      </div>
      
      {selectedEmployee && (
        <div className={styles.modal}>
          <motion.div 
            className={styles.modalContent}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h3>{selectedEmployee.name}'s Profile</h3>
            <div className={styles.profileDetails}>
              <p><strong>Skill:</strong> {selectedEmployee.skill}</p>
              <p><strong>Level:</strong> {selectedEmployee.level}</p>
              <p><strong>Last Review:</strong> 2023-04-15</p>
              <p><strong>Next Review:</strong> {selectedEmployee.nextReviewDate}</p>
              
              <div className={styles.feedbackSection}>
                <h4>Interview Feedback</h4>
                <textarea 
                  placeholder="Enter feedback..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.primaryButton}
                onClick={() => {
                  // Save feedback
                  setSelectedEmployee(null);
                  setFeedback('');
                }}
              >
                Save Feedback
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={() => setSelectedEmployee(null)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DeliveryTeamDashboard;
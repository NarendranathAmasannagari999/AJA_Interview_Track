import React, { useState, useEffect } from 'react';
import { 
  FiUsers, FiCalendar, FiCheckCircle, FiClock, FiFileText, 
  FiSend, FiEdit, FiPlus, FiFilter, FiSearch, FiBarChart2 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import styles from './Dashboard.module.css';

const DeliveryTeamDashboard = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [mockInterviews, setMockInterviews] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [isScheduling, setIsScheduling] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewer, setInterviewer] = useState('');

  const skills = ['Java', 'Python', '.NET', 'DevOps', 'SalesForce', 'UI Development', 'Testing'];

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockEmployees = [
      { id: 1, name: 'John Doe', skill: 'Java', level: 'Intermediate', nextReviewDate: '2023-06-20', status: 'active' },
      { id: 2, name: 'Jane Smith', skill: 'Python', level: 'Senior', nextReviewDate: '2023-06-22', status: 'active' },
      { id: 3, name: 'Mike Johnson', skill: '.NET', level: 'Junior', nextReviewDate: '2023-06-18', status: 'active' },
      { id: 4, name: 'Sarah Williams', skill: 'DevOps', level: 'Intermediate', nextReviewDate: '2023-06-25', status: 'active' },
      { id: 5, name: 'David Brown', skill: 'SalesForce', level: 'Senior', nextReviewDate: '2023-06-15', status: 'active' },
      { id: 6, name: 'Emily Davis', skill: 'UI Development', level: 'Intermediate', nextReviewDate: '2023-06-28', status: 'active' },
      { id: 7, name: 'Robert Wilson', skill: 'Testing', level: 'Junior', nextReviewDate: '2023-06-30', status: 'active' }
    ];

    const mockInterviewsData = [
      { id: 1, employeeId: 1, employeeName: 'John Doe', date: '2023-05-15', interviewer: 'Alex Johnson', status: 'completed', score: 4.2, feedback: 'Strong core Java skills but needs improvement in Spring Boot' },
      { id: 2, employeeId: 2, employeeName: 'Jane Smith', date: '2023-05-16', interviewer: 'Alex Johnson', status: 'scheduled' },
      { id: 3, employeeId: 3, employeeName: 'Mike Johnson', date: '2023-05-10', interviewer: 'Sam Wilson', status: 'completed', score: 3.5, feedback: 'Good understanding of .NET basics but needs more practice with Entity Framework' },
      { id: 4, employeeId: 4, employeeName: 'Sarah Williams', date: '2023-05-17', interviewer: 'Alex Johnson', status: 'completed', score: 4.0, feedback: 'Excellent DevOps knowledge, especially in CI/CD pipelines' },
      { id: 5, employeeId: 5, employeeName: 'David Brown', date: '2023-05-20', interviewer: 'Sam Wilson', status: 'completed', score: 4.5, feedback: 'Exceptional Salesforce knowledge with practical implementation skills' }
    ];

    setEmployees(mockEmployees);
    setMockInterviews(mockInterviewsData);
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = skillFilter === 'all' || employee.skill === skillFilter;
    return matchesSearch && matchesSkill;
  });

  const upcomingInterviews = mockInterviews.filter(i => i.status === 'scheduled');
  const completedInterviews = mockInterviews.filter(i => i.status === 'completed');

  const performanceData = [
    { name: 'Java', average: 4.1, employees: 12 },
    { name: 'Python', average: 4.3, employees: 8 },
    { name: '.NET', average: 3.9, employees: 10 },
    { name: 'DevOps', average: 4.2, employees: 6 },
    { name: 'SalesForce', average: 4.4, employees: 5 },
    { name: 'UI Development', average: 4.0, employees: 5 },
    { name: 'Testing', average: 3.8, employees: 4 }
  ];

  const skillDistributionData = skills.map(skill => {
    const count = employees.filter(e => e.skill === skill).length;
    return { skill, count };
  });

  const conversionData = [
    { name: 'Sent to Sales', value: completedInterviews.length },
    { name: 'Pending Review', value: upcomingInterviews.length }
  ];

  const employeeRadarData = selectedEmployee ? [
    { subject: 'Technical', A: 85, fullMark: 100 },
    { subject: 'Communication', A: 75, fullMark: 100 },
    { subject: 'Problem Solving', A: 90, fullMark: 100 },
    { subject: 'System Design', A: 70, fullMark: 100 },
    { subject: 'Client Fit', A: 80, fullMark: 100 }
  ] : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const renderTabContent = () => {
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
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Skills</option>
                {skills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              <button 
                className={styles.primaryButton}
                onClick={() => setIsScheduling(true)}
              >
                <FiPlus /> Schedule Interview
              </button>
            </div>
            
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
                    <h3>{employee.name}</h3>
                    <span className={`${styles.skillBadge} ${styles[employee.skill.replace(' ', '')]}`}>
                      {employee.skill}
                    </span>
                  </div>
                  <p><strong>Level:</strong> {employee.level}</p>
                  <p><strong>Next Review:</strong> {employee.nextReviewDate}</p>
                  <div className={styles.cardFooter}>
                    <button 
                      className={styles.secondaryButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEmployee(employee);
                        setIsScheduling(true);
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
      case 'schedule':
        return (
          <div className={styles.sectionContainer}>
            <h3 className={styles.sectionTitle}>Upcoming Mock Interviews</h3>
            {upcomingInterviews.length === 0 ? (
              <div className={styles.emptyState}>
                <FiCalendar size={48} />
                <p>No upcoming interviews scheduled</p>
              </div>
            ) : (
              <div className={styles.interviewList}>
                {upcomingInterviews.map(interview => (
                  <motion.div
                    key={interview.id}
                    className={styles.interviewCard}
                    whileHover={{ scale: 1.01 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.interviewHeader}>
                      <h4>{interview.employeeName}</h4>
                      <span className={styles.interviewDate}>
                        <FiCalendar /> {interview.date}
                      </span>
                    </div>
                    <p><strong>Skill:</strong> {employees.find(e => e.id === interview.employeeId)?.skill}</p>
                    <p><strong>Interviewer:</strong> {interview.interviewer}</p>
                    <div className={styles.interviewActions}>
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
            )}
          </div>
        );
      case 'completed':
        return (
          <div className={styles.sectionContainer}>
            <h3 className={styles.sectionTitle}>Completed Interviews</h3>
            {completedInterviews.length === 0 ? (
              <div className={styles.emptyState}>
                <FiCheckCircle size={48} />
                <p>No interviews completed yet</p>
              </div>
            ) : (
              <div className={styles.completedList}>
                {completedInterviews.map(interview => (
                  <motion.div
                    key={interview.id}
                    className={styles.completedCard}
                    whileHover={{ scale: 1.01 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.completedHeader}>
                      <div>
                        <h4>{interview.employeeName}</h4>
                        <p>{employees.find(e => e.id === interview.employeeId)?.skill}</p>
                      </div>
                      <div className={styles.scoreBadge}>
                        {interview.score}/5.0
                      </div>
                    </div>
                    <p><strong>Date:</strong> {interview.date}</p>
                    <p><strong>Interviewer:</strong> {interview.interviewer}</p>
                    <div className={styles.feedbackPreview}>
                      <strong>Feedback:</strong>
                      <p>{interview.feedback}</p>
                    </div>
                    <div className={styles.completedActions}>
                      <button className={styles.secondaryButton}>
                        <FiEdit /> Edit Feedback
                      </button>
                      <button
                        className={styles.successButton}
                        onClick={() => {
                          // In real app, this would send to sales team
                          alert(`Profile of ${interview.employeeName} sent to sales team`);
                        }}
                      >
                        <FiSend /> Send to Sales
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );
      case 'analytics':
        return (
          <div className={styles.analyticsContainer}>
            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <h4>Skill-wise Performance Averages</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="average" fill="#8884d8" name="Average Score" animationBegin={100} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className={styles.chartCard}>
                <h4>Employee Skill Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={skillDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="skill"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      animationBegin={200}
                    >
                      {skillDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
                  </PieChart>
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
                      animationBegin={300}
                    >
                      {conversionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} interviews`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
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
                  <h5>Average Score</h5>
                  <p className={styles.statValue}>
                    {completedInterviews.length > 0 
                      ? (completedInterviews.reduce((sum, i) => sum + i.score, 0) / completedInterviews.length).toFixed(1)
                      : '0.0'}
                  </p>
                  <p className={styles.statLabel}>/ 5.0</p>
                </motion.div>
                <motion.div 
                  className={styles.statCard}
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <h5>Profiles Sent</h5>
                  <p className={styles.statValue}>
                    {completedInterviews.filter(i => i.sentToSales).length}
                  </p>
                  <p className={styles.statLabel}>To Sales Team</p>
                </motion.div>
                <motion.div 
                  className={styles.statCard}
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <h5>Conversion Rate</h5>
                  <p className={styles.statValue}>65%</p>
                  <p className={styles.statLabel}>Hired by Clients</p>
                </motion.div>
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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Delivery Team Dashboard</h2>
          <p className={styles.dashboardSubtitle}>Mock Interview Management & Employee Evaluation</p>
        </motion.div>
        <div className={styles.teamStats}>
          <motion.div 
            className={styles.statPill}
            whileHover={{ scale: 1.05 }}
          >
            <FiUsers /> {employees.length} Employees
          </motion.div>
          <motion.div 
            className={styles.statPill}
            whileHover={{ scale: 1.05 }}
          >
            <FiBarChart2 /> {completedInterviews.length} Completed Interviews
          </motion.div>
        </div>
      </div>
      
      <div className={styles.tabs}>
        <motion.button
          className={`${styles.tab} ${activeTab === 'employees' ? styles.active : ''}`}
          onClick={() => setActiveTab('employees')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Employees
        </motion.button>
        <motion.button
          className={`${styles.tab} ${activeTab === 'schedule' ? styles.active : ''}`}
          onClick={() => setActiveTab('schedule')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Schedule
        </motion.button>
        <motion.button
          className={`${styles.tab} ${activeTab === 'completed' ? styles.active : ''}`}
          onClick={() => setActiveTab('completed')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Completed
        </motion.button>
        <motion.button
          className={`${styles.tab} ${activeTab === 'analytics' ? styles.active : ''}`}
          onClick={() => setActiveTab('analytics')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Analytics
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
        {selectedEmployee && !isScheduling && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEmployee(null)}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>{selectedEmployee.name}'s Evaluation</h3>
                <button 
                  className={styles.closeButton}
                  onClick={() => setSelectedEmployee(null)}
                >
                  &times;
                </button>
              </div>
              
              <div className={styles.profileDetails}>
                <div className={styles.profileSummary}>
                  <div className={styles.profileBadge}>
                    <span className={styles.profileInitial}>
                      {selectedEmployee.name.charAt(0)}
                    </span>
                    <div>
                      <h4>{selectedEmployee.name}</h4>
                      <p>{selectedEmployee.skill} {selectedEmployee.level}</p>
                    </div>
                  </div>
                  
                  <div className={styles.profileStats}>
                    <div className={styles.statItem}>
                      <span>Mock Interviews</span>
                      <strong>
                        {mockInterviews.filter(i => i.employeeId === selectedEmployee.id).length}
                      </strong>
                    </div>
                    <div className={styles.statItem}>
                      <span>Average Score</span>
                      <strong>
                        {mockInterviews.filter(i => i.employeeId === selectedEmployee.id && i.score)
                          .reduce((sum, i) => sum + i.score, 0) / 
                          mockInterviews.filter(i => i.employeeId === selectedEmployee.id && i.score).length || 'N/A'}
                      </strong>
                    </div>
                    <div className={styles.statItem}>
                      <span>Last Interview</span>
                      <strong>
                        {mockInterviews.filter(i => i.employeeId === selectedEmployee.id)
                          .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.date || 'N/A'}
                      </strong>
                    </div>
                  </div>
                </div>
                
                <div className={styles.radarChartContainer}>
                  <h4>Skills Assessment</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={employeeRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Employee" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className={styles.feedbackSection}>
                  <h4>Interview Feedback</h4>
                  <div className={styles.ratingSection}>
                    <span>Rating:</span>
                    <div className={styles.starRating}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          className={`${styles.star} ${star <= rating ? styles.filled : ''}`}
                          onClick={() => setRating(star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <textarea
                    placeholder="Enter detailed feedback..."
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
                    alert(`Feedback saved for ${selectedEmployee.name}`);
                    setSelectedEmployee(null);
                    setFeedback('');
                    setRating(0);
                  }}
                >
                  Save Evaluation
                </button>
                <button 
                  className={styles.secondaryButton}
                  onClick={() => {
                    setSelectedEmployee(null);
                    setFeedback('');
                    setRating(0);
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isScheduling && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsScheduling(false)}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>Schedule Mock Interview</h3>
                <button 
                  className={styles.closeButton}
                  onClick={() => setIsScheduling(false)}
                >
                  &times;
                </button>
              </div>
              
              <div className={styles.scheduleForm}>
                {selectedEmployee ? (
                  <div className={styles.employeeInfo}>
                    <h4>Employee: {selectedEmployee.name}</h4>
                    <p>{selectedEmployee.skill} {selectedEmployee.level}</p>
                  </div>
                ) : (
                  <div className={styles.formGroup}>
                    <label>Select Employee</label>
                    <select>
                      <option value="">Select an employee</option>
                      {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>{employee.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className={styles.formGroup}>
                  <label>Interview Date & Time</label>
                  <input
                    type="datetime-local"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Interviewer</label>
                  <input
                    type="text"
                    placeholder="Enter interviewer name"
                    value={interviewer}
                    onChange={(e) => setInterviewer(e.target.value)}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Interview Type</label>
                  <select>
                    <option value="technical">Technical Interview</option>
                    <option value="behavioral">Behavioral Interview</option>
                    <option value="system_design">System Design Interview</option>
                  </select>
                </div>
              </div>
              
              <div className={styles.modalActions}>
                <button 
                  className={styles.primaryButton}
                  disabled={!interviewDate || !interviewer}
                  onClick={() => {
                    // Schedule interview
                    alert(`Interview scheduled for ${selectedEmployee?.name || 'selected employee'}`);
                    setIsScheduling(false);
                    setInterviewDate('');
                    setInterviewer('');
                    setSelectedEmployee(null);
                  }}
                >
                  Schedule Interview
                </button>
                <button 
                  className={styles.secondaryButton}
                  onClick={() => {
                    setIsScheduling(false);
                    setInterviewDate('');
                    setInterviewer('');
                    setSelectedEmployee(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeliveryTeamDashboard;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser } from 'react-icons/fi';
import styles from '../pages/Dashboard/DeliveryTeamDashboard.module.css';
import { updateMockInterviewFeedback } from '../API/delivery';

const EvaluationModal = ({
  selectedInterview,
  setSelectedInterview,
  mockInterviews,
  onUpdate,
}) => {
  // Local state for form fields
  const [feedback, setFeedback] = useState({
    technical: '',
    communication: '',
    overall: ''
  });
  const [ratings, setRatings] = useState({
    technical: 0,
    communication: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when modal is opened or selected interview changes
  useEffect(() => {
    if (selectedInterview) {
      // Initialize feedback from existing data
      setFeedback({
        technical: selectedInterview.technicalFeedback || '',
        communication: selectedInterview.communicationFeedback || '',
        overall: selectedInterview.overallFeedback || ''
      });

      // Initialize ratings from existing data
      setRatings({
        technical: selectedInterview.technicalRating || 0,
        communication: selectedInterview.communicationRating || 0
      });

      setError(null);
      setIsSubmitting(false);
    }
  }, [selectedInterview]);

  if (!selectedInterview) return null;

  const handleRatingChange = (type, value) => {
    setRatings(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleFeedbackChange = (type, value) => {
    setFeedback(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Send feedback data directly without feedback[] format
      await updateMockInterviewFeedback(
        selectedInterview.id,
        feedback.overall,
        ratings.technical,
        ratings.communication
      );

      // Call the onUpdate prop with the updated data
      await onUpdate({
        interviewId: selectedInterview.id,
        feedback,
        ratings
      });

      setSelectedInterview(null);
    } catch (err) {
      console.error('Error updating feedback:', err);
      setError(err.message || 'Failed to update feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return styles.scoreHigh;
    if (score >= 6) return styles.scoreMedium;
    return styles.scoreLow;
  };

  return (
    <div className={styles.modalOverlay} onClick={() => setSelectedInterview(null)}>
      <motion.div
        className={styles.modalContent}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3>{selectedInterview.employee?.user?.fullName || 'Unknown Employee'}'s Evaluation</h3>
          <button
            className={styles.closeButton}
            onClick={() => setSelectedInterview(null)}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.profileDetails}>
            <div className={styles.profileSummary}>
              <div className={styles.profileBadge}>
                <div className={styles.userAvatarLarge}>
                  <FiUser />
                </div>
                <div>
                  <h4>{selectedInterview.employee?.user?.fullName || 'Unknown Employee'}</h4>
                  <div className={styles.profileMeta}>
                    <span className={`${styles.techBadge} ${styles[selectedInterview.employee?.technology?.replace(' ', '')]}`}>
                      {selectedInterview.employee?.technology || 'Unknown'}
                    </span>
                    <span className={`${styles.resourceBadge} ${styles[selectedInterview.employee?.resourceType]}`}>
                      {selectedInterview.employee?.resourceType || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.profileStats}>
                <div className={styles.statItem}>
                  <span>Mock Interviews</span>
                  <strong>
                    N/A
                  </strong>
                </div>
                <div className={styles.statItem}>
                  <span>Avg Technical</span>
                  <strong>
                    N/A
                  </strong>
                </div>
                <div className={styles.statItem}>
                  <span>Avg Communication</span>
                  <strong>
                    N/A
                  </strong>
                </div>
              </div>
            </div>
            
            <div className={styles.feedbackSection}>
              <h4>Interview Feedback</h4>
              
              <div className={styles.ratingSection}>
                <div className={styles.ratingGroup}>
                  <label>Technical Rating:</label>
                  <div className={styles.starRating}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                      <span
                        key={`tech-${star}`}
                        className={`${styles.star} ${star <= ratings.technical ? styles.filled : ''}`}
                        onClick={() => handleRatingChange('technical', star)}
                        style={{ color: getScoreColor(star) }}
                      >
                        ★
                      </span>
                    ))}
                    <span className={styles.ratingValue}>{ratings.technical}/10</span>
                  </div>
                </div>

                <div className={styles.ratingGroup}>
                  <label>Communication Rating:</label>
                  <div className={styles.starRating}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                      <span
                        key={`comm-${star}`}
                        className={`${styles.star} ${star <= ratings.communication ? styles.filled : ''}`}
                        onClick={() => handleRatingChange('communication', star)}
                        style={{ color: getScoreColor(star) }}
                      >
                        ★
                      </span>
                    ))}
                    <span className={styles.ratingValue}>{ratings.communication}/10</span>
                  </div>
                </div>
              </div>

              <div className={styles.feedbackGroup}>
                <label>Technical Feedback:</label>
                <textarea
                  placeholder="Enter technical feedback..."
                  value={feedback.technical}
                  onChange={(e) => handleFeedbackChange('technical', e.target.value)}
                  className={styles.feedbackTextarea}
                />
              </div>

              <div className={styles.feedbackGroup}>
                <label>Communication Feedback:</label>
                <textarea
                  placeholder="Enter communication feedback..."
                  value={feedback.communication}
                  onChange={(e) => handleFeedbackChange('communication', e.target.value)}
                  className={styles.feedbackTextarea}
                />
              </div>

              <div className={styles.feedbackGroup}>
                <label>Overall Feedback:</label>
                <textarea
                  placeholder="Enter overall feedback..."
                  value={feedback.overall}
                  onChange={(e) => handleFeedbackChange('overall', e.target.value)}
                  className={styles.feedbackTextarea}
                />
              </div>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setSelectedInterview(null)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Feedback'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default React.memo(EvaluationModal); 
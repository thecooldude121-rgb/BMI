import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Star, MessageSquare, Send, ThumbsUp, ThumbsDown, 
  Lightbulb, Bug, Heart, Zap
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../../lib/queryClient';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

interface FeedbackData {
  type: 'rating' | 'suggestion' | 'bug' | 'general';
  rating?: number;
  message: string;
  feature?: string;
  userAgent: string;
  timestamp: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, feature }) => {
  const [feedbackType, setFeedbackType] = useState<'rating' | 'suggestion' | 'bug' | 'general'>('rating');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const feedbackMutation = useMutation({
    mutationFn: async (data: FeedbackData) => {
      return apiRequest('/api/feedback', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      onClose();
      setRating(0);
      setMessage('');
      setFeedbackType('rating');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (feedbackType === 'rating' && rating === 0) return;
    if (!message.trim() && feedbackType !== 'rating') return;

    feedbackMutation.mutate({
      type: feedbackType,
      rating: feedbackType === 'rating' ? rating : undefined,
      message: message.trim(),
      feature: feature || 'lead-generation',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  };

  const feedbackTypes = [
    { id: 'rating', label: 'Rate Feature', icon: Star, color: 'blue' },
    { id: 'suggestion', label: 'Suggest Improvement', icon: Lightbulb, color: 'yellow' },
    { id: 'bug', label: 'Report Bug', icon: Bug, color: 'red' },
    { id: 'general', label: 'General Feedback', icon: MessageSquare, color: 'green' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="modal-modern p-6 w-full max-w-md mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">We'd Love Your Feedback</h3>
                  <p className="text-sm text-gray-600">Help us improve your experience</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Feedback Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What would you like to share?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {feedbackTypes.map(({ id, label, icon: Icon, color }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFeedbackType(id as any)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                        feedbackType === id
                          ? `bg-${color}-50 border-${color}-500 text-${color}-700`
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4 mx-auto mb-1" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Section */}
              {feedbackType === 'rating' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How would you rate this feature?
                  </label>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            star <= (hoveredStar || rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-sm text-gray-600">
                      {rating === 0 ? 'Click to rate' : 
                       rating === 1 ? 'Poor' :
                       rating === 2 ? 'Fair' :
                       rating === 3 ? 'Good' :
                       rating === 4 ? 'Very Good' : 'Excellent'}
                    </span>
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {feedbackType === 'rating' ? 'Additional comments (optional)' : 
                   feedbackType === 'suggestion' ? 'What would you like to see improved?' :
                   feedbackType === 'bug' ? 'Describe the issue you encountered' :
                   'Tell us what you think'}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="input-modern w-full"
                  placeholder={
                    feedbackType === 'rating' ? 'Share your thoughts...' :
                    feedbackType === 'suggestion' ? 'I would love to see...' :
                    feedbackType === 'bug' ? 'Steps to reproduce...' :
                    'Your feedback...'
                  }
                />
              </div>

              {/* Quick Actions */}
              {feedbackType === 'rating' && rating > 0 && (
                <div className="flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setMessage(message + (message ? ' ' : '') + 'Love this feature! ')}
                    className="flex items-center space-x-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span className="text-xs">Love it</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessage(message + (message ? ' ' : '') + 'Could be better. ')}
                    className="flex items-center space-x-1 px-3 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    <ThumbsDown className="h-3 w-3" />
                    <span className="text-xs">Needs work</span>
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary flex-1 py-3 hover-lift"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    feedbackMutation.isPending || 
                    (feedbackType === 'rating' && rating === 0) ||
                    (feedbackType !== 'rating' && !message.trim())
                  }
                  className="btn-primary flex-1 py-3 flex items-center justify-center space-x-2 hover-glow"
                >
                  {feedbackMutation.isPending ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>Send Feedback</span>
                </button>
              </div>
            </form>

            {/* Success State */}
            {feedbackMutation.isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center"
              >
                <Heart className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <p className="text-sm text-green-700">Thank you for your feedback!</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
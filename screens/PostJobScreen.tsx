
import React, { useState } from 'react';
import { User, Phone, MapPin, Briefcase, FileText, Mail, Send, CheckCircle2, Zap, Building2, PlayCircle, Loader2, X } from 'lucide-react';
import { postGlobalJob, getUrgentStatus, addExtraUrgentCredit, recordUrgentPost } from '../services/api';

interface PostJobScreenProps {
  onSuccess: () => void;
}

const PostJobScreen: React.FC<PostJobScreenProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    city: '',
    jobRole: '',
    description: '',
    email: '',
    company: '',
    isUrgent: false,
    agreedToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);

  const cities = ['Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Madinah', 'Khobar', 'Dhahran', 'Abha', 'Tabuk', 'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      alert('Please agree to the Terms & Conditions');
      return;
    }

    if (formData.isUrgent && formData.email) {
      const status = getUrgentStatus(formData.email);
      if (status.remaining <= 0) {
        setShowAdModal(true);
        return;
      }
    }

    setIsSubmitting(true);
    
    const { agreedToTerms, ...jobData } = formData;
    await postGlobalJob(jobData);
    
    if (formData.isUrgent && formData.email) {
      recordUrgentPost(formData.email);
    }
    
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  const handleWatchAd = () => {
    setIsWatchingAd(true);
    // Simulate watching a 5-second ad
    setTimeout(() => {
      if (formData.email) {
        addExtraUrgentCredit(formData.email);
      }
      setIsWatchingAd(false);
      setShowAdModal(false);
      alert('Reward Granted! You can now post 1 more urgent job.');
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: val });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-50">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
        <p className="text-gray-500">Your job post is now live for all users across the Kingdom.</p>
        <p className="text-xs text-gray-400 mt-8">Returning to global listings...</p>
      </div>
    );
  }

  return (
    <div className="pb-24 px-6 py-6 animate-in slide-in-from-right-4 duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900">Post a Job</h2>
        <p className="text-gray-500 text-sm mt-1">Hire the best talent across the Kingdom</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Ahmed Bin Abdullah"
                  className="w-full bg-white border border-gray-100 rounded-xl pl-12 pr-4 py-4 shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Company (Optional)</label>
              <div className="relative">
                <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="w-full bg-white border border-gray-100 rounded-xl pl-12 pr-4 py-4 shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  required
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="05xxxxxxx"
                  className="w-full bg-white border border-gray-100 rounded-xl pl-12 pr-4 py-4 shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Email (For Deletion)</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@email.com"
                  className="w-full bg-white border border-gray-100 rounded-xl pl-12 pr-4 py-4 shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">City</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <select 
                required
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full bg-white border border-gray-100 rounded-xl pl-12 pr-4 py-4 shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all appearance-none"
              >
                <option value="">Select a city</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Job Role</label>
            <div className="relative">
              <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input 
                required
                name="jobRole"
                value={formData.jobRole}
                onChange={handleChange}
                placeholder="e.g. Sales Manager"
                className="w-full bg-white border border-gray-100 rounded-xl pl-12 pr-4 py-4 shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Job Description</label>
            <div className="relative">
              <FileText size={18} className="absolute left-4 top-4 text-gray-300" />
              <textarea 
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role requirements..."
                rows={5}
                className="w-full bg-white border border-gray-100 rounded-xl pl-12 pr-4 py-4 shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
              />
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <Zap size={20} fill="currentColor" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Urgent Hiring?</h4>
                <p className="text-[10px] text-gray-500">Mark as urgent for 24 hours</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="isUrgent"
                checked={formData.isUrgent}
                onChange={handleChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="flex items-start gap-3 p-2">
            <input 
              type="checkbox" 
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleChange}
              id="terms"
              className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="terms" className="text-xs text-gray-500 leading-tight">
              I agree to the <span className="text-green-600 font-bold">Terms & Conditions</span>, <span className="text-green-600 font-bold">Privacy Policy</span>, and understand that Saudi Job is not responsible for job conduct.
            </label>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-green-100 flex items-center justify-center space-x-2 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <Send size={20} />
              <span>PUBLISH JOB POST</span>
            </>
          )}
        </button>
      </form>

      {/* Rewarded Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xs rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
            
            <button 
              onClick={() => setShowAdModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap size={32} fill="currentColor" />
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2">Limit Reached!</h3>
            <p className="text-sm text-gray-500 mb-8">
              You've used your 2 daily urgent posts. Watch a short video to get <span className="text-red-600 font-bold">1 extra urgent credit</span>.
            </p>

            <button 
              onClick={handleWatchAd}
              disabled={isWatchingAd}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {isWatchingAd ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Watching Ad...</span>
                </>
              ) : (
                <>
                  <PlayCircle size={20} />
                  <span>WATCH AD TO UNLOCK</span>
                </>
              )}
            </button>
            
            <p className="text-[10px] text-gray-400 mt-4 italic">
              * Urgent posts stay at the top for 24 hours.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostJobScreen;

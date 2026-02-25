
import React from 'react';
import { MapPin, Briefcase, Calendar, Eye, Bookmark, Share2, Zap } from 'lucide-react';
import { Job } from '../types';
import { toggleSaveJob, getLocalData } from '../services/api';

interface JobCardProps {
  job: Job;
  onClick: () => void;
  onToggleSave?: (isSaved: boolean) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick, onToggleSave }) => {
  const [isSaved, setIsSaved] = React.useState(getLocalData().savedJobIds.includes(job.id));
  
  const formattedDate = new Date(job.postedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const saved = toggleSaveJob(job.id);
    setIsSaved(saved);
    if (onToggleSave) onToggleSave(saved);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `Job: ${job.jobRole} in ${job.city}`,
        text: `Check out this job posting for ${job.jobRole} in ${job.city} on Saudi Job!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert('Sharing not supported on this browser');
    }
  };

  const isUrgentNow = job.isUrgent && (job.urgentUntil ? job.urgentUntil > Date.now() : true);

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer hover:border-green-100 relative group"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-green-700 transition-colors">
            {job.jobRole}
          </h3>
          {job.company && (
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              {job.company}
            </span>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="bg-gray-50 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
            <Calendar size={10} className="mr-1" />
            {formattedDate}
          </span>
          {isUrgentNow && (
            <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center animate-pulse">
              <Zap size={10} className="mr-1 fill-red-600" />
              URGENT
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center text-gray-500 text-sm mb-1">
        <MapPin size={14} className="mr-1.5 text-green-500" />
        <span>{job.city}</span>
      </div>
      
      <div className="flex items-center text-gray-500 text-sm mb-3">
        <Briefcase size={14} className="mr-1.5 text-gray-400" />
        <span>{job.fullName}</span>
      </div>

      <div className="border-t border-gray-50 pt-3 flex justify-between items-center">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span className="text-xs font-medium">{job.views || 0}</span>
          </div>
          <button 
            onClick={handleSave}
            className={`transition-colors ${isSaved ? 'text-green-600' : 'hover:text-green-600'}`}
          >
            <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
          <button 
            onClick={handleShare}
            className="hover:text-green-600 transition-colors"
          >
            <Share2 size={16} />
          </button>
        </div>
        
        <span className="text-green-600 text-xs font-bold flex items-center">
          View Details
          <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default JobCard;

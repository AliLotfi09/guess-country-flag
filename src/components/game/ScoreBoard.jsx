import { motion } from 'framer-motion';
import { Trophy, Flame, Target } from 'lucide-react';

export const ScoreBoard = ({ score, streak, accuracy }) => {
  const stats = [
    { 
      icon: Trophy, 
      label: 'امتیاز', 
      value: score, 
      bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200'
    },
    { 
      icon: Flame, 
      label: 'زنجیره', 
      value: streak, 
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200'
    },
    { 
      icon: Target, 
      label: 'دقت', 
      value: `${accuracy}٪`, 
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
  ];

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          whileHover={{ scale: 1.03 }}
          className={`
            ${stat.bgColor}
            flex items-center gap-4 px-5 py-4 rounded-2xl
            border-2 ${stat.borderColor}
          `}
        >
          <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center border-2 ${stat.borderColor}`}>
            <stat.icon className={`w-6 h-6 ${stat.iconColor}`} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-0.5">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.textColor}`}>{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
import { motion } from 'framer-motion';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Map, Flag, Trophy, Zap, Flame } from 'lucide-react';

export const GameMenu = ({ onSelectMode }) => {
  const gameModes = [
    {
      id: 'map',
      title: 'حدس با نقشه',
      description: 'کشورها را از روی شکل جغرافیایی شناسایی کنید',
      icon: Map,
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      id: 'flag',
      title: 'حدس با پرچم',
      description: 'کشورها را از روی پرچم ملی‌شان بشناسید',
      icon: Flag,
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl mb-6">
          <Map className="w-12 h-12 text-indigo-600" strokeWidth={1.5} />
        </div>
        <h1 className="text-6xl font-black text-gray-900 mb-4">
          بازی حدس کشورها
        </h1>
        <p className="text-xl text-gray-600 max-w-xl mx-auto leading-relaxed">
          دانش جغرافیایی خود را امتحان کنید و ببینید چند کشور را می‌توانید شناسایی کنید
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {gameModes.map((mode, index) => (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectMode(mode.id)}
            className="clickable-card"
          >
            <Card hover className="h-full">
              <div className="text-center space-y-6">
                <div className={`
                  ${mode.bgColor}
                  w-full h-32 rounded-2xl
                  flex items-center justify-center
                  border-2 ${mode.borderColor}
                `}>
                  <mode.icon className={`w-16 h-16 ${mode.iconColor}`} strokeWidth={1.5} />
                </div>

                <div className="px-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {mode.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {mode.description}
                  </p>
                </div>

                <Button variant="primary" size="lg" className="w-full">
                  شروع بازی
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="flex items-center justify-center gap-12 flex-wrap text-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center border-2 border-yellow-200">
                <Trophy className="w-6 h-6 text-yellow-600" strokeWidth={2} />
              </div>
              <span className="font-semibold text-gray-700">امتیاز برای پاسخ صحیح</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center border-2 border-orange-200">
                <Flame className="w-6 h-6 text-orange-600" strokeWidth={2} />
              </div>
              <span className="font-semibold text-gray-700">زنجیره برای امتیاز بیشتر</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center border-2 border-blue-200">
                <Zap className="w-6 h-6 text-blue-600" strokeWidth={2} />
              </div>
              <span className="font-semibold text-gray-700">۲۰ سوال در هر بازی</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
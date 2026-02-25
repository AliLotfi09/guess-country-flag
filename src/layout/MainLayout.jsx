import { motion } from 'framer-motion';
import { Globe2 } from 'lucide-react';

export const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center border-2 border-indigo-200">
              <Globe2 className="w-7 h-7 text-indigo-600" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                بازی حدس کشورها
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                دانش جغرافیایی خود را امتحان کنید
              </p>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12">
        {children}
      </main>

      <footer className="bg-white border-t-2 border-gray-200 py-6">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm text-gray-500 font-medium">
            ساخته شده با ❤️ با 
          </p>
        </div>
      </footer>
    </div>
  );
};
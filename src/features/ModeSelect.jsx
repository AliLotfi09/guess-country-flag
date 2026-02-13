import { ChevronRight, Map, Flag } from 'lucide-react';

export function ModeSelect({ onSelectMode, onBack }) {
  const modes = [
    { id: 'flag', title: 'حدس با پرچم', subtitle: 'شناسایی از روی پرچم', icon: Flag },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">حالت بازی</h2>
          <div className="w-10" />
        </div>

        <div className="space-y-3">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => onSelectMode(mode.id)}
                className="w-full p-5 bg-white border border-gray-200 rounded-xl hover:scale-[1.02] transition text-right"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{mode.title}</h3>
                    <p className="text-sm text-gray-600">{mode.subtitle}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
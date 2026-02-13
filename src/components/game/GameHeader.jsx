import { Button } from '@components/ui/Button';
import { ArrowRight } from 'lucide-react';

export const GameHeader = ({ title, onBack }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-4xl font-black text-gray-900">{title}</h2>
      {onBack && (
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
          <span className="font-bold">بازگشت</span>
        </Button>
      )}
    </div>
  );
};
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, size = 28, readOnly = false }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none"
          onClick={() => !readOnly && onChange && onChange(star)}
          tabIndex={readOnly ? -1 : 0}
          aria-label={`Calificar con ${star} estrella${star > 1 ? 's' : ''}`}
          style={{ background: 'none', padding: 0, margin: 0, cursor: readOnly ? 'default' : 'pointer' }}
          disabled={readOnly}
        >
          <Star
            size={size}
            className={
              star <= value
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }
            fill={star <= value ? 'currentColor' : 'none'}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;

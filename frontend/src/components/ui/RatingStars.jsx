import React, { useState } from "react";
import { Star } from "lucide-react";

const RatingStars = ({ value = 0, onChange, size = "md", readOnly = false }) => {
  const [hover, setHover] = useState(0);

  const sizeClass = size === "lg" ? "w-8 h-8" : "w-5 h-5";

  const display = hover || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHover(n)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => !readOnly && onChange?.(n)}
          className={`p-0.5 transition ${
            readOnly ? "cursor-default" : "cursor-pointer"
          }`}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            className={`${sizeClass} transition ${
              n <= display
                ? "fill-mauve-fonce text-mauve-fonce"
                : "text-mauve-fonce/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default RatingStars;
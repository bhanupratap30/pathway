import React, { useState, useEffect } from 'react';

export const CountUp = ({ to, duration = 1.2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const end = parseFloat(to) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      
      const current = Math.floor(progress * end);
      setCount(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end); // Ensure exact final value
      }
    };

    window.requestAnimationFrame(step);
  }, [to, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export default CountUp;

import { useState, useEffect } from "react";

const TimeAgo = ({ timestamp }) => {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = new Date();
      const pastDate = new Date(timestamp);
      const diffInMs = now - pastDate;

      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const diffInMonths = Math.floor(diffInDays / 30); // Approximate calculation

      if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
      } else if (diffInDays < 30) {
        return `${diffInDays} days ago`;
      } else {
        return `${diffInMonths} months ago`;
      }
    };

    setTimeAgo(calculateTimeAgo());

    // Optional: Auto-update the time difference every minute
    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo());
    }, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [timestamp]);

  return <span style={{fontSize:"12px"}}>{timeAgo}</span>;
};

export default TimeAgo;

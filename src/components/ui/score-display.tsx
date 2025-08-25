"use client";

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
}

const ScoreDisplay = ({ score, maxScore = 100 }: ScoreDisplayProps) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = score / maxScore;
  const offset = circumference * (1 - progress);

  const getScoreCategory = (score: number) => {
    if (score >= 90) return "EXCELLENT";
    if (score >= 80) return "GREAT";
    if (score >= 70) return "AVERAGE";
    if (score >= 60) return "GOOD";
    return "NEEDS IMPROVEMENT";
  };

  const category = getScoreCategory(score);

  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-lg">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className="text-gray-700"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          <circle
            className="text-teal-400"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold">{score}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-teal-400">{category}</span>
        <span className="text-md text-muted-foreground bg-teal-400/10 px-3 py-1 rounded-full mt-1">
          RESUME STRENGTH
        </span>
      </div>
    </div>
  );
};

export default ScoreDisplay;

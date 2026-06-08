interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  color: string
}

export function ProgressRing({
  percentage,
  size = 60,
  strokeWidth = 4,
  color,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#1e293b"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-500"
      />
      {/* Center text */}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dy="0.3em"
        className="text-xs font-semibold"
        fill="currentColor"
        transform={`rotate(90 ${size / 2} ${size / 2})`}
      >
        {Math.round(percentage)}%
      </text>
    </svg>
  )
}

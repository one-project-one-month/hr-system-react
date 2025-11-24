interface FullDonutChartProps {
    keys: string[]; // eg. ['present', 'absent', 'late']
    values: number[];      // e.g. [40, 25, 15, 20]
    colors: string[];      // same length
    size?: number;         // px
    strokeWidth?: number;  // thickness
}

export function FullDonutChart({ keys, values, colors, size = 200, strokeWidth = 16 }: FullDonutChartProps) {
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;

    const total = values.reduce((a, b) => a + b, 0);
    let cumulativePercent = 0;
    // Convert percent to radians for SVG arc
    const getArcPath = (percent: number) => {
        const startAngle = 2 * Math.PI * cumulativePercent;
        const endAngle = startAngle + 2 * Math.PI * percent;
        const x1 = center + radius * Math.cos(startAngle - Math.PI / 2);
        const y1 = center + radius * Math.sin(startAngle - Math.PI / 2);
        const x2 = center + radius * Math.cos(endAngle - Math.PI / 2);
        const y2 = center + radius * Math.sin(endAngle - Math.PI / 2);
        const largeArcFlag = percent > 0.5 ? 1 : 0;

        cumulativePercent += percent;

        return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
    };

    const calculateDecimal = (value: number) => {
        return total === 0 ? 0 : (value / total);
    };

    return (
        <div className="flex gap-3">
            <div className="relative flex items-center justify-center w-[300px] h-[200px]">
                <svg width={size} height={size}>
                    { total === 0 ? (
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            stroke="#e5e7eb"
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeLinecap="round"
                        />
                    ) : values.map((value, i) => (
                        <path
                            key={i}
                            d={getArcPath(calculateDecimal(value))}
                            stroke={colors[i]}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeLinecap="round"
                        />
                    ))}
                </svg>
                <div className="absolute flex flex-col items-center text-center justify-center text-lg font-medium">
                    {Math.round(calculateDecimal(values[0]) * 100)}% <br/>{keys[0]}
                </div>
                {/* Linear Progress Bars */}

            </div>
            <div className="w-full flex flex-col gap-2">
                {values.map((v, i) => (
                    <div key={i} className="flex flex-col gap-1">
                        <div className="flex justify-between text-sm font-medium">
                            <span>{keys[i]}</span>
                            <span>{Math.round(calculateDecimal(v) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="h-3 rounded-full"
                                style={{
                                    width: `${calculateDecimal(v) * 100}%`,
                                    backgroundColor: colors[i],
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

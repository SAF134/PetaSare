"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, LabelList } from "recharts"
import { Star } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import { hotels } from "@/data/hotels"

// Process hotel data to count hotels per rating range
const ratingRanges = {
  "3.0-3.5": { min: 3.0, max: 3.5 },
  "3.6-4.0": { min: 3.6, max: 4.0 },
  "4.1-4.5": { min: 4.1, max: 4.5 },
  "4.6-5.0": { min: 4.6, max: 5.0 },
};

const hotelRatingCounts = hotels.reduce((acc, hotel) => {
    for (const range in ratingRanges) {
        if (hotel.rating >= ratingRanges[range].min && hotel.rating <= ratingRanges[range].max) {
            acc[range] = (acc[range] || 0) + 1;
            break;
        }
    }
    return acc;
}, {} as Record<string, number>);

const chartData = Object.keys(ratingRanges).map(range => {
    const key = range.replace(/\./g, "_").replace("-", "_");
    return {
        range,
        count: hotelRatingCounts[range] || 0,
        fill: `var(--color-rating_${key})`
    }
});

const chartConfig = {
  count: {
    label: "Jumlah Hotel",
  },
  "rating_3_0_3_5": {
    label: "3.0-3.5",
    color: "hsl(220 15% 65%)", 
  },
  "rating_3_6_4_0": {
    label: "3.6-4.0",
    color: "hsl(220 20% 95%)",
  },
  "rating_4_1_4_5": {
    label: "4.1-4.5",
    color: "hsl(210 84% 62%)",
  },
  "rating_4_6_5_0": {
    label: "4.6-5.0",
    color: "hsl(48 96% 59%)",
  },
} satisfies ChartConfig

const CustomTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-50} y={0} width={100} height={22}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
          <span>{payload.value}</span>
        </div>
      </foreignObject>
    </g>
  );
};

export function RatingChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribusi Hotel Berdasarkan Rating</CardTitle>
        <CardDescription>Jumlah hotel untuk setiap rentang rating di Kota Bandung.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="range"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={<CustomTick />}
            />
            <YAxis domain={[0, 90]} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent formatter={(value) => `Jumlah Hotel: ${value}`} />}
            />
            <Bar dataKey="count" radius={8}>
              <LabelList
                position="top"
                offset={10}
                className="fill-foreground"
                fontSize={12}
              />
                {chartData.map((entry) => (
                    <Cell key={`cell-${entry.range}`} fill={entry.fill} />
                ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

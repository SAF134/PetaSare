"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, LabelList } from "recharts"
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

// Process hotel data to count hotels per price range
const priceRanges = {
  "range1": { label: "<= Rp 200.000", min: 0, max: 200000 },
  "range2": { label: "Rp 200.001 - Rp 400.000", min: 200001, max: 400000 },
  "range3": { label: "Rp 400.001 - Rp 600.000", min: 400001, max: 600000 },
  "range4": { label: "Rp 600.001 - Rp 800.000", min: 600001, max: 800000 },
  "range5": { label: "Rp 800.001 - Rp 1.000.000", min: 800001, max: 1000000 },
  "range6": { label: "> Rp 1.000.000", min: 1000001, max: Infinity },
};

const hotelPriceCounts = hotels.reduce((acc, hotel) => {
    for (const key in priceRanges) {
        if (hotel.harga >= priceRanges[key].min && hotel.harga <= priceRanges[key].max) {
            acc[key] = (acc[key] || 0) + 1;
            break;
        }
    }
    return acc;
}, {} as Record<string, number>);

const chartData = Object.keys(priceRanges).map(key => ({
  range: key,
  count: hotelPriceCounts[key] || 0,
  fill: `var(--color-${key})`
}));

const chartConfig = {
  count: {
    label: "Jumlah Hotel",
  },
  range1: {
    label: "<=Rp200.000",
    color: "hsl(220 15% 65%)",
  },
  range2: {
    label: "Rp200.001-Rp400.000",
    color: "hsl(220 20% 95%)",
  },
  range3: {
    label: "Rp400.001-Rp600.000",
    color: "hsl(210 84% 62%)",
  },
  range4: {
    label: "Rp600.001-Rp800.000",
    color: "hsl(48 96% 59%)",
  },
  range5: {
    label: "Rp800.001-Rp1.000.000",
    color: "hsl(var(--primary))",
  },
  range6: {
    label: ">Rp1.000.000",
    color: "hsla(22, 99%, 49%, 1.00)",
  },
} satisfies ChartConfig

export function PriceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribusi Hotel Berdasarkan Harga</CardTitle>
        <CardDescription>Jumlah hotel untuk setiap rentang harga di Kota Bandung.</CardDescription>
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
              tickFormatter={(value) => {
                const config = chartConfig[value as keyof typeof chartConfig];
                return config ? config.label.split(' ')[0] : value;
              }}
            />
            <YAxis domain={[0, 50]} ticks={[0, 10, 20, 30, 40, 50]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent formatter={(value) => (
                <div className="flex flex-col">
                    <span className="font-bold">Jumlah Hotel: {value}</span>
                </div>
              )} />}
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
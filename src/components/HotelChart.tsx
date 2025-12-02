import { useIsMobile } from "@/hooks/use-mobile";
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

// Process hotel data to count hotels per category
const hotelCategoryCounts = hotels.reduce((acc, hotel) => {
  const category = hotel.kategori;
  acc[category] = (acc[category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const chartData = Object.keys(hotelCategoryCounts).map(category => ({
  category,
  count: hotelCategoryCounts[category],
  fill: `var(--color-${category.replace(/\s+/g, '-')})`
}));

const chartConfig = {
  count: {
    label: "Jumlah Hotel: ",
  },
  // HOTEL BINTANG 1: hsl(220 15% 65%)
  "HOTEL-BINTANG-1": {
    label: "Bintang 1",
    shortLabel: "B1",
    color: "hsl(220 15% 65%)", 
  },
  // HOTEL BINTANG 2: hsl(220 20% 95%)
  "HOTEL-BINTANG-2": {
    label: "Bintang 2",
    shortLabel: "B2",
    color: "hsl(220 20% 95%)",
  },
  // HOTEL BINTANG 3: hsl(210 84% 62%)
  "HOTEL-BINTANG-3": {
    label: "Bintang 3",
    shortLabel: "B3",
    color: "hsl(210 84% 62%)",
  },
  // HOTEL BINTANG 4: hsl(48 96% 59%)
  "HOTEL-BINTANG-4": {
    label: "Bintang 4",
    shortLabel: "B4",
    color: "hsl(48 96% 59%)",
  },
  // HOTEL BINTANG 5: hsl(var(--primary))
  "HOTEL-BINTANG-5": {
    label: "Bintang 5",
    shortLabel: "B5",
    color: "hsl(var(--primary))", // Pertahankan variabel tema untuk Bintang 5
  },
} satisfies ChartConfig;

export function HotelChart() {
    const isMobile = useIsMobile();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribusi Hotel Berdasarkan Kategori</CardTitle>
        <CardDescription>Jumlah hotel untuk setiap kategori bintang di Kota Bandung.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={isMobile ? {
              top: 20,
              right: 20,
              bottom: 20,
              left: 0,
            } : {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                  const config = chartConfig[value.replace(/\s+/g, '-') as keyof typeof chartConfig];
                  if (!config) return value;
                  return isMobile ? config.shortLabel : config.label;
              }}
            />
            <YAxis domain={[0, 70]} ticks={[0, 10, 20, 30, 40, 50, 60, 70]} />
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
                fontSize={isMobile ? 10 : 12}
              />
                {chartData.map((entry) => (
                    <Cell key={`cell-${entry.category}`} fill={entry.fill} />
                ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,  
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  procurementTrend,
  monthlySpending,
  rfqStats,
  vendorPerformance,
} from "@/lib/mock-data"

const trendConfig = {
  spend: { label: "Spend (₹Cr)", color: "var(--chart-1)" },
  orders: { label: "Orders", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ProcurementTrendChart() {
  return (
    <ChartContainer config={trendConfig} className="h-[260px] w-full">
      <AreaChart data={procurementTrend} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillSpend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-spend)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-spend)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={28} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="spend"
          stroke="var(--color-spend)"
          fill="url(#fillSpend)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}

const spendConfig = {
  value: { label: "Spending", color: "var(--chart-1)" },
} satisfies ChartConfig

export function MonthlySpendingChart() {
  return (
    <ChartContainer config={spendConfig} className="h-[260px] w-full">
      <BarChart data={monthlySpending} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={40}
          tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`}
        />
        <ChartTooltip
          content={<ChartTooltipContent formatter={(v) => `₹${(Number(v) / 100000).toFixed(1)} L`} />}
        />
        <Bar dataKey="value" fill="var(--color-value)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

const perfConfig = {
  score: { label: "Performance", color: "var(--chart-2)" },
} satisfies ChartConfig

export function VendorPerformanceChart() {
  return (
    <ChartContainer config={perfConfig} className="h-[260px] w-full">
      <BarChart
        data={vendorPerformance}
        layout="vertical"
        margin={{ left: 8, right: 16 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" domain={[70, 100]} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="vendor"
          tickLine={false}
          axisLine={false}
          width={90}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="score" fill="var(--color-score)" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

const rfqConfig = {
  Open: { label: "Open", color: "var(--chart-1)" },
  Closed: { label: "Closed", color: "var(--chart-3)" },
  Draft: { label: "Draft", color: "var(--chart-4)" },
} satisfies ChartConfig

const pieColors = ["var(--chart-1)", "var(--chart-3)", "var(--chart-4)"]

export function RfqStatsChart() {
  return (
    <ChartContainer config={rfqConfig} className="mx-auto aspect-square max-h-[260px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        <Pie data={rfqStats} dataKey="value" nameKey="name" innerRadius={56} strokeWidth={4}>
          {rfqStats.map((entry, i) => (
            <Cell key={entry.name} fill={pieColors[i % pieColors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

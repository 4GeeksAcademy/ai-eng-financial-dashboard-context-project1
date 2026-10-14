import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartCardSkeleton } from '@/components/dashboard/chart-card-skeleton'
import { type MonthlyDataPoint } from '@/lib/financial-types'
import { formatCurrency } from '@/lib/financial-utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface IncomeOutcomeChartProps {
  data: MonthlyDataPoint[]
  loading?: boolean
}

interface TooltipPayload {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground capitalize">{entry.name}:</span>
          <span className="font-medium text-foreground ml-auto pl-4">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

function chartSummary(data: MonthlyDataPoint[]) {
  const totalIncome = data.reduce((sum, d) => sum + d.income, 0);
  const totalOutcome = data.reduce((sum, d) => sum + d.outcome, 0);
  return `Line chart comparing monthly income and outcome. Total income ${formatCurrency(
    totalIncome,
  )}, total outcome ${formatCurrency(
    totalOutcome,
  )}. Exact monthly figures are listed in the adjacent data table.`;
}

export function IncomeOutcomeChart({ data, loading }: IncomeOutcomeChartProps) {
  if (loading) {
    return <ChartCardSkeleton />
  }

  const hasData = data.some((d) => d.income > 0 || d.outcome > 0)

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Income vs. Outcome</CardTitle>
        <CardDescription>Monthly revenue and expenditure evolution</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-[280px] items-center justify-center text-muted-foreground text-sm">
            No data available to display
          </div>
        ) : (
          <>
            <div
              className="h-[280px] w-full"
              role="img"
              aria-label={chartSummary(data)}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.6} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    width={48}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => (
                      <span className="text-xs text-muted-foreground capitalize">{value}</span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    name="income"
                    stroke="var(--chart-income)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: 'var(--chart-income)', strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="outcome"
                    name="outcome"
                    stroke="var(--chart-outcome)"
                    strokeWidth={2}
                    strokeDasharray="6 3"
                    dot={{ r: 3, fill: 'var(--chart-outcome)', strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <table className="visually-hidden">
              <caption>Monthly income and outcome</caption>
              <thead>
                <tr>
                  <th scope="col">Month</th>
                  <th scope="col">Income</th>
                  <th scope="col">Outcome</th>
                </tr>
              </thead>
              <tbody>
                {data.map((point) => (
                  <tr key={point.month}>
                    <th scope="row">{point.month}</th>
                    <td>{formatCurrency(point.income)}</td>
                    <td>{formatCurrency(point.outcome)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </CardContent>
    </Card>
  )
}

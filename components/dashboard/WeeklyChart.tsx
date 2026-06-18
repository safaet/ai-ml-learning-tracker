'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/card'
import { DOMAINS } from '@/lib/domains'

interface ChartData {
  day: string
  [key: string]: number | string
}

interface WeeklyChartProps {
  data: ChartData[]
}

const COLORS = {
  'ML Fundamentals': '#6366f1',
  'Deep Learning': '#3b82f6',
  'NLP/LLMs': '#06b6d4',
  'Computer Vision': '#a855f7',
  'MLOps/Deployment': '#10b981',
  'Research Papers': '#f59e0b',
  'Coding/Projects': '#ec4899',
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">Weekly Progress</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="day" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
            }}
            cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
          />
          <Legend />
          {DOMAINS.map((domain) => (
            <Bar key={domain.name} dataKey={domain.name} fill={COLORS[domain.name as keyof typeof COLORS]} stackId="a" />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

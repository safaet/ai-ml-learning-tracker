'use client'

import { Card } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'

interface ChartData {
  date: string
  total: number
  [key: string]: string | number
}

interface RadarData {
  domain: string
  fullDomain: string
  value: number
}

interface ChartsSectionProps {
  chartData30Days: ChartData[]
  radarData: RadarData[]
}

const DOMAIN_COLORS: Record<string, string> = {
  'ML Fundamentals': '#6366f1',
  'Deep Learning': '#3b82f6',
  'NLP/LLMs': '#06b6d4',
  'Computer Vision': '#8b5cf6',
  'MLOps/Deployment': '#10b981',
  'Research Papers': '#f59e0b',
  'Coding/Projects': '#ec4899',
}

export function ChartsSection({ chartData30Days, radarData }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 30-day stacked bar chart */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Last 30 Days</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData30Days}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Legend />
            {Object.keys(DOMAIN_COLORS).map((domain) => (
              <Bar key={domain} dataKey={domain} stackId="a" fill={DOMAIN_COLORS[domain]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Domain balance radar chart */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Domain Balance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#475569" />
            <PolarAngleAxis
              dataKey="domain"
              tick={{ fontSize: 12, fill: '#94a3b8' }}
            />
            <PolarRadiusAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Radar name="Progress %" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}

'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface StatsGridProps {
  children: React.ReactNode
  className?: string
}

export function StatsGrid({ children, className = '' }: StatsGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {children}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ title, value, icon, trend, className = '' }: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </p>
          )}
        </div>
        {icon && (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

// Convenience component for simple stats without icons
export function SimpleStatsGrid({
  stats,
  columns = 4,
  className
}: {
  stats: Array<{ label: string; value: string | number; id?: string }>
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}) {
  const mappedStats: Stat[] = stats.map((stat, index) => ({
    id: stat.id || index.toString(),
    label: stat.label,
    value: stat.value
  }))

  return (
    <StatsGrid
      stats={mappedStats}
      columns={columns}
      className={className}
      showChange={false}
      animated={false}
    />
  )
}

// Loading skeleton component
export function StatsGridSkeleton({
  count = 4,
  columns = 4,
  className
}: {
  count?: number
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}) {
  const skeletonStats: Stat[] = Array.from({ length: count }, (_, index) => ({
    id: `skeleton-${index}`,
    label: '',
    value: '',
    loading: true
  }))

  return (
    <StatsGrid
      stats={skeletonStats}
      columns={columns}
      className={className}
      showChange={false}
      animated={false}
    />
  )
} 
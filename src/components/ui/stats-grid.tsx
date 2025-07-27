'use client'

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: React.ReactNode;
  color?: string;
}

function StatCard({ title, value, description, icon, color = 'blue' }: StatCardProps) {
  const bgColor = `bg-${color}-100`;
  const textColor = `text-${color}-800`;
  const iconColor = `text-${color}-600`;

  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center">
      {icon && (
        <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center mr-4`}>
          {React.cloneElement(icon as React.ReactElement, { className: `h-6 w-6 ${iconColor}` })}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className={`text-xs ${textColor}`}>{description}</p>
      </div>
    </div>
  );
}

interface StatsGridProps {
  stats: StatCardProps[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
} 
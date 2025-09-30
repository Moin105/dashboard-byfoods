'use client'

import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  MapPin, 
  Calendar, 
  FileText, 
  TrendingUp,
  Users,
  Eye,
  Plus
} from 'lucide-react'
import { api } from '@/lib/api'
import { Bar, Distillery, Event, Blog } from '@/lib/types'

export default function DashboardPage() {
  const { data: bars } = useQuery('bars', () => api.get('/bars?limit=5').then(res => res.data))
  const { data: distilleries } = useQuery('distilleries', () => api.get('/distilleries?limit=5').then(res => res.data))
  const { data: events } = useQuery('events', () => api.get('/events?limit=5').then(res => res.data))
  const { data: blogs } = useQuery('blogs', () => api.get('/blogs?limit=5').then(res => res.data))

  const stats = [
    {
      name: 'Total Bars',
      value: bars?.total || 0,
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Distilleries',
      value: distilleries?.total || 0,
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Events',
      value: events?.total || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Blog Posts',
      value: blogs?.total || 0,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your ByFoods CMS admin panel!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Bars */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bars</h3>
            <button className="btn-primary text-sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Bar
            </button>
          </div>
          <div className="space-y-3">
            {bars?.data?.length > 0 ? (
              bars.data.slice(0, 3).map((bar: Bar) => (
                <div key={bar.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={bar.image}
                    alt={bar.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{bar.name}</p>
                    <p className="text-sm text-gray-600">{bar.type} • {bar.location}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="h-4 w-4 mr-1" />
                    {bar.reviews}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <BarChart3 className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500 font-medium">Coming Soon</p>
                <p className="text-sm text-gray-400">Premium bars and lounges will be available soon</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
            <button className="btn-primary text-sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </button>
          </div>
          <div className="space-y-3">
            {events?.data?.length > 0 ? (
              events.data.slice(0, 3).map((event: Event) => (
                <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{event.name}</p>
                    <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                  </div>
                  <div className="text-sm font-medium text-primary-600">
                    {event.price}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <Calendar className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500 font-medium">Coming Soon</p>
                <p className="text-sm text-gray-400">Exclusive events and tastings will be announced soon</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Add Bar</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Add Distillery</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Add Event</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Add Blog Post</p>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

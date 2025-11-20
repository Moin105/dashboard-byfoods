'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, XCircle, Clock, Mail, Phone, Calendar, Users, DollarSign, MapPin } from 'lucide-react'
import { api } from '@/lib/api'
import { Order } from '@/lib/types'
import toast from 'react-hot-toast'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<string>('')

  const { data: order, isLoading } = useQuery(
    ['order', params.id],
    () => api.get(`/orders/${params.id}`).then(res => res.data),
    { enabled: !!params.id }
  )

  const updateStatusMutation = useMutation(
    ({ status }: { status: string }) =>
      api.patch(`/orders/${params.id}/status`, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['order', params.id])
        queryClient.invalidateQueries('orders')
        toast.success('Order status updated successfully')
      },
      onError: () => {
        toast.error('Failed to update order status')
      },
    }
  )

  const handleStatusUpdate = (status: string) => {
    updateStatusMutation.mutate({ status })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Order not found</p>
        <button
          onClick={() => router.push('/dashboard/orders')}
          className="mt-4 text-primary-600 hover:text-primary-700"
        >
          Back to Orders
        </button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getOrderTypeLabel = (type: string) => {
    switch (type) {
      case 'bar_reservation':
        return 'Bar Reservation'
      case 'distillery_tour':
        return 'Distillery Tour'
      case 'event_booking':
        return 'Event Booking'
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push('/dashboard/orders')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="font-medium text-gray-900">{order.customerName}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium text-gray-900">{order.customerEmail}</div>
                </div>
              </div>
              {order.customerPhone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium text-gray-900">{order.customerPhone}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Order Type</div>
                <div className="font-medium text-gray-900">{getOrderTypeLabel(order.orderType)}</div>
              </div>
              {order.bar && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Bar</div>
                    <div className="font-medium text-gray-900">{order.bar.name}</div>
                  </div>
                </div>
              )}
              {order.distillery && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Distillery</div>
                    <div className="font-medium text-gray-900">{order.distillery.name}</div>
                  </div>
                </div>
              )}
              {order.event && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Event</div>
                    <div className="font-medium text-gray-900">{order.event.name}</div>
                  </div>
                </div>
              )}
              {order.bookingDate && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Booking Date</div>
                    <div className="font-medium text-gray-900">
                      {new Date(order.bookingDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
              {order.bookingTime && (
                <div>
                  <div className="text-sm text-gray-500">Time</div>
                  <div className="font-medium text-gray-900">{order.bookingTime}</div>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Number of Guests</div>
                  <div className="font-medium text-gray-900">{order.numberOfGuests}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {order.specialRequests && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Special Requests</h2>
              <p className="text-gray-700">{order.specialRequests}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-bold text-lg">${order.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className={order.isPaid ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                  {order.isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
              {order.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Update Status</h2>
            <div className="space-y-2">
              {order.status === 'pending' && (
                <button
                  onClick={() => handleStatusUpdate('confirmed')}
                  disabled={updateStatusMutation.isLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Confirm Order</span>
                </button>
              )}
              {order.status !== 'completed' && order.status !== 'cancelled' && (
                <button
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={updateStatusMutation.isLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Clock className="h-5 w-5" />
                  <span>Mark as Completed</span>
                </button>
              )}
              {order.status !== 'cancelled' && (
                <button
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={updateStatusMutation.isLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  <XCircle className="h-5 w-5" />
                  <span>Cancel Order</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


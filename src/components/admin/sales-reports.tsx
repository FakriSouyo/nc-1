'use client'

import { useState } from 'react'
import { useOrders } from '@/hooks/use-orders'
import { OrderWithItems } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function SalesReports() {
  const { orders, getOrderTotal, getOrderStatus } = useOrders()
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')

  // Filter orders by date range and payment method
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at)
    const start = startDate ? new Date(startDate) : null
    const end = endDate ? new Date(endDate) : null
    
    const matchesDateRange = (!start || orderDate >= start) && (!end || orderDate <= end)
    const matchesPayment = paymentFilter === 'all' || order.payment_method === paymentFilter
    
    return matchesDateRange && matchesPayment
  })

  // Calculate total sales
  const totalSales = filteredOrders.reduce((sum, order) => sum + getOrderTotal(order), 0)

  // Get unique payment methods
  const paymentMethods = Array.from(new Set(orders.map(order => order.payment_method)))

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Calculate summary statistics
  const summary = {
    totalOrders: filteredOrders.length,
    averageOrderValue: filteredOrders.length > 0 ? totalSales / filteredOrders.length : 0,
    totalPoints: filteredOrders.reduce((sum, order) => sum + (order.points_earned || 0), 0),
    paymentBreakdown: paymentMethods.map(method => ({
      method,
      count: filteredOrders.filter(order => order.payment_method === method).length,
      total: filteredOrders
        .filter(order => order.payment_method === method)
        .reduce((sum, order) => sum + getOrderTotal(order), 0),
    })),
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="font-medium text-sm text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold">{summary.totalOrders}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-sm text-gray-500">Total Sales</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-sm text-gray-500">Average Order Value</h3>
          <p className="text-2xl font-bold">{formatCurrency(summary.averageOrderValue)}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-sm text-gray-500">Total Points Awarded</h3>
          <p className="text-2xl font-bold">{summary.totalPoints}</p>
        </Card>
      </div>

      {/* Payment Method Breakdown */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">Payment Method Breakdown</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Method</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Sales</TableHead>
              <TableHead>Average Order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summary.paymentBreakdown.map(({ method, count, total }) => (
              <TableRow key={method}>
                <TableCell className="font-medium">{method.toUpperCase()}</TableCell>
                <TableCell>{count}</TableCell>
                <TableCell>{formatCurrency(total)}</TableCell>
                <TableCell>{formatCurrency(count > 0 ? total / count : 0)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Detailed Orders Table */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">Order Details</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell className="font-mono">{order.id.slice(0, 8)}</TableCell>
                <TableCell>{order.payment_method.toUpperCase()}</TableCell>
                <TableCell>{getOrderStatus(order.status)}</TableCell>
                <TableCell>{order.points_earned || 0}</TableCell>
                <TableCell>{formatCurrency(getOrderTotal(order))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

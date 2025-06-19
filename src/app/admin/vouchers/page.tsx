import { VoucherManagement } from '@/components/admin/voucher-management'

export default function VouchersPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Voucher Management</h1>
      <VoucherManagement />
    </div>
  )
}

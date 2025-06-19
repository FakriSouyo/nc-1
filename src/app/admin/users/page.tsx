import { UserManagement } from '@/components/admin/user-management'

export default function UsersPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <UserManagement />
    </div>
  )
}

import { HeadlineManagement } from '@/components/admin/headline-management'

export default function HeadlinesPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Headline Management</h1>
      <HeadlineManagement />
    </div>
  )
}

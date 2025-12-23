import { AdminLayout } from '@/components/admin/AdminLayout';
import { MessagingHub } from '@/components/admin/messaging/MessagingHub';

export default function Messaging() {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Messaging Hub</h1>
          <p className="text-muted-foreground">
            Real-time team communication, channels, and direct messages
          </p>
        </div>
        <MessagingHub />
      </div>
    </AdminLayout>
  );
}

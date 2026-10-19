import { redirect } from 'next/navigation';

export default function LegacySubscribersPage() {
  redirect('/admin/messages');
}

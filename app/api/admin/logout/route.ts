import { logoutAdmin } from '@/lib/refonte-backend';

export async function POST() {
  return logoutAdmin();
}

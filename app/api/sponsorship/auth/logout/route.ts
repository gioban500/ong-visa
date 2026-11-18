import { logoutSponsor } from '@/lib/refonte-backend';

export async function POST() {
  return logoutSponsor();
}

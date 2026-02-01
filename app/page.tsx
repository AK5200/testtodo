import { redirect } from 'next/navigation';

export default async function Home() {
  // Always redirect to dashboard - users can view but need to login to create notes
  redirect('/dashboard');
}

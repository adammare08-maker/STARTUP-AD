import { WorkspaceDashboard } from '@/components/workspace-dashboard';
export const dynamic='force-dynamic';
export const metadata={title:'Mon espace de travail — STARTUP/AD',robots:{index:false,follow:false}};
export default function AdminPage(){return <WorkspaceDashboard admin />;}

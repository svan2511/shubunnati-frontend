import Dashboard from "../features/dashboard/components/Dashboard";

export default function DashboardPage() {
console.log(sessionStorage.getItem("auth_token") , 'tokan');

  return (
   <Dashboard></Dashboard>
  );
}

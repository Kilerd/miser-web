import { ProtectRoute, useAuth } from "../contexts/auth";
import React from "react";
import AuthenticationLayout from "../components/AuthenticationLayout";
import { Line } from "react-chartjs-2";

const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "My First dataset",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40],
    },
  ],
};

function Dashboard() {
  const { user } = useAuth();
  return (
    <>
      <AuthenticationLayout>
        <div className="container">
          <div>hello {user.username}</div>
        </div>
      </AuthenticationLayout>

      <style jsx>{`
        .container {
          min-height: 90vh;
        }
      `}</style>
    </>
  );
}

export default ProtectRoute(Dashboard);

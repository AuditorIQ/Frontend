'use client';

import React, { useEffect } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Card } from "@/components/ui/card";
import Pricing from "../pricing";

export default function plan() {

  useEffect(() => {
    ;
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Card className="flex-1 p-4 grid gap-4">
      <Pricing />
      </Card>
    </div>
  );
}

// import React, { useState } from "react";

// const Pricing = () => {
//   const [isYearly, setIsYearly] = useState(false);

//   const plans = [
//     {
//       name: "Starter",
//       price: "$99",
//       yearlyPrice: "$999",
//       cardStyle: "bg-white",
//       buttonStyle: "bg-blue-500 text-white",
//       highlight: true,
//       features: [
//         "Up to 50 chart audits/month",
//         "1 provider license",
//         "Access to MAC-based LCD/NCD audits",
//         "Audit reports in PDF",
//         "Email Support",
//       ],
//     },
//     {
//       name: "Professional",
//       price: "$249",
//       yearlyPrice: "$2,499",
//       cardStyle: "bg-white",
//       buttonStyle: "bg-blue-700 text-white",
//       highlight: true,
//       features: [
//         "Up to 200 chart audits/month",
//         "3 provider licenses",
//         "MAC & Medicare rules engine",
//         "Real-time audit feedback",
//         "Dashboard analytics",
//         "Priority support",
//       ],
//     },
//     {
//       name: "Enterprise",
//       price: "$500",
//       yearlyPrice: "$5,000",
//       cardStyle: "bg-white",
//       buttonStyle: "bg-blue-900 text-white",
//       highlight: true,
//       features: [
//         "Unlimited audits",
//         "Unlimited provider licenses",
//         "Dedicated account manager",
//         "Custom compliance reporting",
//         "API access",
//         "SLA backed support",
//       ],
//     },
//   ];

//   return (
//     <div className="py-12">
//       {/* Billing Toggle */}
//       <div className="flex justify-center items-center mb-10">
//         <div className="flex items-center gap-4">
//           <span className={isYearly ? "text-gray-400" : "text-blue-900 font-semibold"}>Pay Monthly</span>
//           <div
//             className="w-16 h-8 bg-blue-200 rounded-full p-1 cursor-pointer flex items-center transition duration-300"
//             onClick={() => setIsYearly(!isYearly)}
//           >
//             <div
//               className={`w-6 h-6 bg-blue-900 rounded-full shadow-md transform transition-transform duration-300 ${
//                 isYearly ? "translate-x-8" : "translate-x-0"
//               }`}
//             />
//           </div>
//           <span className={isYearly ? "text-blue-900 font-semibold" : "text-gray-400"}>Pay Yearly</span>
//         </div>
//       </div>

//       {/* Pricing Cards */}
//       <div className="grid md:grid-cols-3 gap-6 px-6 mx-auto" style={{ paddingLeft: "11%", paddingRight: "11%" }}>
//         {plans.map((plan, i) => (
//           <div
//             key={i}
//             className={`rounded-xl p-6 m-5 text-left shadow ${plan.cardStyle} ${
//               plan.highlight ? "scale-105 border-4 border-blue-300" : ""
//             } transition-transform duration-300`}
//           >
//             <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
//             <p className="text-3xl font-bold mb-4">
//               {isYearly ? plan.yearlyPrice : plan.price}
//               <span className="text-sm font-normal">/ {isYearly ? "Year" : "Month"}</span>
//             </p>
//             <button className={`w-full py-2 rounded-md mb-4 ${plan.buttonStyle}`} onClick={() => {window.location.href = '/sign-up'}}>
//               Get Started Now
//             </button>
//             <ul className="space-y-2 text-sm">
//               {plan.features.map((f, j) => (
//                 <li key={j} className="flex items-start gap-2">
//                   <span className="text-blue-500">✔</span>
//                   <span>{f}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Pricing;

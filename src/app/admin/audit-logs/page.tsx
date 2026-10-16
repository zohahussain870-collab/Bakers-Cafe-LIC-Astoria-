import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const logs = await prisma.auditLog.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211510]">
          Security & Audit Logs
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5B52] mt-0.5">
          Immutable audit record of administrative events, logins, and operational modifications.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E6DCce] shadow-xs overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-16 text-center text-xs text-[#8E7C72]">
            No audit events recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FAF7F2] text-[#8E7C72] font-semibold border-b border-[#E6DCce]">
                <tr>
                  <th className="py-3.5 px-6">Timestamp (PKT)</th>
                  <th className="py-3.5 px-6">Action</th>
                  <th className="py-3.5 px-6">Administrator</th>
                  <th className="py-3.5 px-6">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E9DF]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-xs text-[#8E7C72] shrink-0">
                      {log.createdAt.toLocaleString("en-PK", {
                        timeZone: "Asia/Karachi",
                      })}
                    </td>

                    <td className="py-3.5 px-6">
                      <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E6DCce] text-[#211510]">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-6 font-medium text-[#211510]">
                      {log.userName || "System"}
                    </td>

                    <td className="py-3.5 px-6 font-mono text-[11px] text-[#6B5B52] max-w-md truncate">
                      {log.details || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

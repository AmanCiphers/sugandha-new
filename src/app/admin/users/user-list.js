"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default function UserList({ users }) {
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) =>
    (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>

      <CardHeader className="px-0 pt-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-transparent pl-10 pr-4 text-sm focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/50"
          />
        </div>
      </CardHeader>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left font-medium text-muted-foreground p-4">Name</th>
                  <th className="text-left font-medium text-muted-foreground p-4">Email</th>
                  <th className="text-center font-medium text-muted-foreground p-4">Role</th>
                  <th className="text-right font-medium text-muted-foreground p-4">Orders</th>
                  <th className="text-left font-medium text-muted-foreground p-4">Joined</th>
                  <th className="text-right font-medium text-muted-foreground p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-border/20 hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium">{u.full_name || "—"}</td>
                    <td className="p-4 text-muted-foreground">{u.email}</td>
                    <td className="p-4 text-center">
                      <Badge variant={u.role === "admin" ? "default" : "secondary"} className="border-0">
                        {u.role === "admin" && <Shield className="mr-1 h-3 w-3" />}
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">{u.orderCount}</td>
                    <td className="p-4 text-muted-foreground">{formatDate(u.created_at)}</td>
                    <td className="p-4 text-right">
                      <Link href={`/admin/users/${u.id}`}>
                        <Button variant="ghost" size="icon-sm"><ChevronRight className="h-4 w-4" /></Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

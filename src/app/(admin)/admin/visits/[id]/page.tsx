
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { VisitDetails } from "@/components/visits/VisitDetails";

export default function AdminVisitDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisit();
  }, [params.id]);

  const fetchVisit = async () => {
    try {
      const res = await fetch(`/api/admin/visits/${params.id}`);
      const json = await res.json();
      if (json.success) setVisit(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    const res = await fetch(`/api/visits/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    setVisit(json.data);
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/visits/${params.id}`, { method: "DELETE" });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    router.push("/admin/visits");
  };

  if (loading) return <div>جاري التحميل...</div>;
  if (!visit) return <div>لم يتم العثور على الزيارة</div>;

  return (
    <div className="max-w-4xl mx-auto py-6" data-testid="admin-visit-page">
      <VisitDetails visit={visit} onUpdate={handleUpdate} onDelete={handleDelete} isAdmin={true} />
    </div>
  );
}

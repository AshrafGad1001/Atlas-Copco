"use client";
import { useParams } from "next/navigation";
export default function AdminVisitDetailsPage() {
  const params = useParams();
  return <div data-testid="admin-visit-details">Admin Visit {params.id}</div>;
}

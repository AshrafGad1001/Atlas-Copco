"use client";
import { useParams } from "next/navigation";
export default function VisitDetailsPage() {
  const params = useParams();
  return <div data-testid="visit-details">Visit {params.id}</div>;
}

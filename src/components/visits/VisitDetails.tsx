
"use client";
import React, { useState } from "react";
import { VisitForm } from "./VisitForm";


interface VisitDetailsProps {
  visit: any;
  onUpdate: (data: any) => Promise<void>;
  onDelete: () => Promise<void>;
  isAdmin?: boolean;
}

export function VisitDetails({ visit, onUpdate, onDelete, isAdmin }: VisitDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDelete = async () => {
    if (!confirm("?? ??? ????? ?? ??? ??? ????????")) return;
    try {
      setIsDeleting(true);
      await onDelete();
    } catch (err: any) {
      setErrorMsg(err.message || "??? ??? ????? ?????");
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      await onUpdate(data);
      setIsEditing(false);
    } catch (err: any) {
      throw err;
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-6">????? ???????</h2>
        <VisitForm initialData={visit} onSubmit={handleUpdate} />
        <div className="mt-4">
          <button onClick={() => setIsEditing(false)} className="text-gray-500 underline text-sm">
            ????? ???????
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{errorMsg}</div>}
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{visit.company?.nameAr}</h2>
            <p className="text-gray-500 mt-1">???????: {visit.engineer?.fullName}</p>
          </div>
          <div className="flex space-x-2 space-x-reverse">
            {!visit.canEdit ? (
               <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">????? ???? ??????? (24 ????)</span>
            ) : (
               <button className="px-4 py-2 border rounded hover:bg-gray-50" onClick={() => setIsEditing(true)}>?????</button>
            )}
            {visit.canDelete && (
               <button disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50" onClick={handleDelete}>???</button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">???????? ????????</h3>
            <div className="space-y-3">
              <div><span className="text-gray-500 w-24 inline-block">???????:</span> {new Date(visit.visitDate).toLocaleString("ar-EG")}</div>
              <div><span className="text-gray-500 w-24 inline-block">?????:</span> {visit.type === "planned" ? "???? ???" : visit.type === "completed" ? "??????" : "?????"}</div>
              <div><span className="text-gray-500 w-24 inline-block">???????:</span> {visit.company?.region?.name || "??? ????"}</div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">??????? ??????</h3>
            <div className="space-y-3">
              <div><strong className="block text-gray-700">?????????:</strong> <p className="text-gray-600 mt-1 whitespace-pre-wrap">{visit.notes || "?? ????"}</p></div>
              <div><strong className="block text-gray-700">?????? ???????:</strong> <p className="text-gray-600 mt-1 whitespace-pre-wrap">{visit.nextStep || "?? ????"}</p></div>
            </div>
          </div>
        </div>

        {visit.attendees && visit.attendees.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold mb-4">???????? ?? ??????</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visit.attendees.map((att: any, idx: number) => (
                <div key={idx} className="bg-gray-50 p-3 rounded border">
                  <div className="font-medium text-gray-900">{att.name}</div>
                  {att.jobTitle && <div className="text-sm text-gray-500">{att.jobTitle}</div>}
                  {att.phone && <div className="text-sm text-gray-500"><a href={`tel:${att.phone}`} dir="ltr">{att.phone}</a></div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isAdmin && visit.editHistory && visit.editHistory.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">??? ?????????</h3>
          <div className="space-y-4">
            {visit.editHistory.map((history: any, idx: number) => (
              <div key={idx} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="text-sm text-gray-500 mb-2">
                  ?? ??????? ?????? <span className="font-semibold text-gray-700">{history.editedBy?.fullName || "??????"}</span> ?????? {new Date(history.editedAt).toLocaleString("ar-EG")}
                </div>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {history.changes.map((c: any, cidx: number) => (
                    <li key={cidx}>
                      ????? <span className="font-semibold">{c.field}</span> ?? <span className="line-through bg-red-50 text-red-700 px-1 rounded">{c.from}</span> ??? <span className="bg-green-50 text-green-700 px-1 rounded">{c.to}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


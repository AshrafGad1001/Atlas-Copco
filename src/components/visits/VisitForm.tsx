"use client";
import React, { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const attendeeSchema = z.object({
  name: z.string().min(2, "اسم الحاضر مطلوب (حرفين على الأقل)"),
  jobTitle: z.string().optional(),
  phone: z.string().regex(/^[0-9+]{8,15}$/, "رقم الهاتف غير صالح").optional().or(z.literal("")),
});

const visitSchema = z.object({
  visitDate: z.string(),
  type: z.enum(["planned", "completed", "cancelled"]),
  notes: z.string().optional(),
  nextStep: z.string().optional(),
  hasFollowUp: z.boolean().optional(),
  followUp: z.object({ dueDate: z.string().min(1, "التاريخ مطلوب"), note: z.string().max(200).optional() }).optional(),
  attendees: z.array(attendeeSchema).max(10, "أقصى عدد للحاضرين هو 10").optional(),
});

type VisitFormValues = z.infer<typeof visitSchema>;

interface VisitFormProps {
  initialData?: any;
  onSubmit: (data: VisitFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function VisitForm({ initialData, onSubmit, isLoading }: VisitFormProps) {
  const [errorMsg, setErrorMsg] = useState("");
  
  const { register, control, handleSubmit, formState: { errors } } = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      visitDate: initialData?.visitDate ? new Date(initialData.visitDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      type: initialData?.type || "completed",
      notes: initialData?.notes || "",
      nextStep: initialData?.nextStep || "",
      hasFollowUp: !!initialData?.followUp?.dueDate,
      followUp: initialData?.followUp ? { dueDate: initialData.followUp.dueDate.slice(0, 10), note: initialData.followUp.note || "" } : undefined,
      attendees: initialData?.attendees || [],
    },
  });

  const hasFollowUp = useWatch({ control, name: "hasFollowUp" });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "attendees",
  });

  const handleFormSubmit = async (data: VisitFormValues) => {
    setErrorMsg("");
    try {
      await onSubmit(data);
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء حفظ الزيارة");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" data-testid="visit-form">
      {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{errorMsg}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الزيارة</label>
          <input
            type="datetime-local"
            {...register("visitDate")}
            className="w-full p-2 border rounded"
            data-testid="visit-date-input"
          />
          {errors.visitDate && <p className="text-red-500 text-xs mt-1">{errors.visitDate.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نوع الزيارة</label>
          <select
            {...register("type")}
            className="w-full p-2 border rounded"
            data-testid="visit-type-input"
          >
            <option value="planned">مخطط لها</option>
            <option value="completed">مكتملة</option>
            <option value="cancelled">ملغاة</option>
          </select>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
        <textarea
          {...register("notes")}
          rows={3}
          className="w-full p-2 border rounded"
          data-testid="visit-notes-input"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">الخطوة القادمة</label>
        <textarea
          {...register("nextStep")}
          rows={2}
          className="w-full p-2 border rounded"
          data-testid="visit-nextstep-input"
        ></textarea>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">الحاضرون</h3>
          {fields.length < 10 && (
            <button
              type="button"
              onClick={() => append({ name: "", jobTitle: "", phone: "" })}
              className="text-blue-600 flex items-center text-sm font-medium hover:text-blue-800"
              data-testid="add-attendee-btn"
            >
              + إضافة حاضر
            </button>
          )}
        </div>
        
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 p-3 border rounded bg-gray-50">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
              <input
                {...register(`attendees.${index}.name`)}
                placeholder="الاسم"
                className="w-full p-2 border rounded text-sm"
              />
              {errors.attendees?.[index]?.name && (
                <p className="text-red-500 text-xs mt-1">{errors.attendees[index]?.name?.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المسمى الوظيفي</label>
              <input
                {...register(`attendees.${index}.jobTitle`)}
                placeholder="المسمى الوظيفي"
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
              <input
                {...register(`attendees.${index}.phone`)}
                placeholder="رقم الهاتف"
                className="w-full p-2 border rounded text-sm"
              />
              {errors.attendees?.[index]?.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.attendees[index]?.phone?.message}</p>
              )}
            </div>
            <div className="flex items-end pb-1 justify-end">
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 p-2 hover:bg-red-100 rounded"
              >
                <span className="font-bold">X</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50" data-testid="visit-submit-btn">
          {isLoading ? "جاري الحفظ..." : "حفظ الزيارة"}
        </button>
      </div>
    </form>
  );
}

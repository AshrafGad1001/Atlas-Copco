
"use client";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/common/Button";

const attendeeSchema = z.object({
  name: z.string().min(2, "????? ????? (????? ??? ?????)"),
  jobTitle: z.string().optional(),
  phone: z.string().regex(/^[0-9+]{8,15}$/, "??? ?????? ??? ????").optional().or(z.literal("")),
});

const visitSchema = z.object({
  visitDate: z.string(),
  type: z.enum(["planned", "completed", "cancelled"]),
  notes: z.string().optional(),
  nextStep: z.string().optional(),
  attendees: z.array(attendeeSchema).max(10, "???? ?????? 10 ??????").optional(),
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
      attendees: initialData?.attendees || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attendees",
  });

  const handleFormSubmit = async (data: VisitFormValues) => {
    setErrorMsg("");
    try {
      await onSubmit(data);
    } catch (err: any) {
      setErrorMsg(err.message || "??? ???");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" data-testid="visit-form">
      {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{errorMsg}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">????? ???? ???????</label>
          <input
            type="datetime-local"
            {...register("visitDate")}
            className="w-full p-2 border rounded"
            data-testid="visit-date-input"
          />
          {errors.visitDate && <p className="text-red-500 text-xs mt-1">{errors.visitDate.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">??? ???????</label>
          <select {...register("type")} className="w-full p-2 border rounded" data-testid="visit-type-select">
            <option value="planned">???? ???</option>
            <option value="completed">??????</option>
            <option value="cancelled">?????</option>
          </select>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">??????? ???????</label>
        <textarea
          {...register("notes")}
          rows={3}
          className="w-full p-2 border rounded"
          data-testid="visit-notes-input"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">?????? ???????</label>
        <textarea
          {...register("nextStep")}
          rows={2}
          className="w-full p-2 border rounded"
          data-testid="visit-nextstep-input"
        ></textarea>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold">???????? ?? ??????</h3>
          {fields.length < 10 && (
            <button
              type="button"
              onClick={() => append({ name: "", jobTitle: "", phone: "" })}
              className="text-primary-600 flex items-center text-sm"
              data-testid="add-attendee-btn"
            >
              <Plus size={16} className="mr-1" /> ????? ????
            </button>
          )}
        </div>
        
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 p-3 border rounded bg-gray-50">
            <div>
              <input
                {...register(`attendees.${index}.name`)}
                placeholder="????? *"
                className="w-full p-2 border rounded text-sm"
              />
              {errors.attendees?.[index]?.name && (
                <p className="text-red-500 text-xs mt-1">{errors.attendees[index]?.name?.message}</p>
              )}
            </div>
            <div>
              <input
                {...register(`attendees.${index}.jobTitle`)}
                placeholder="?????? ???????"
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div>
              <input
                {...register(`attendees.${index}.phone`)}
                placeholder="??? ????????"
                className="w-full p-2 border rounded text-sm"
              />
              {errors.attendees?.[index]?.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.attendees[index]?.phone?.message}</p>
              )}
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 p-2"
                title="??? ??????"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" isLoading={isLoading} data-testid="visit-submit-btn">
          ??? ???????
        </Button>
      </div>
    </form>
  );
}


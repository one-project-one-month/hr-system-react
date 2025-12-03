"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formSchema } from "@/schema/companyrule";
import type { CompanyRulesFormValues } from "@/types/companyRules";
import z from "zod";
import { SuccessDialog } from "../ui/custom/SuccessDialog";

export default function CompanyRulesForm({
  mode,
  onSubmitExternal,
  initialValues,
}: {
  mode?: "edit" | "view";
  onSubmitExternal?: (values: CompanyRulesFormValues) => Promise<any>;
  initialValues?: Partial<CompanyRulesFormValues> | any;
}) {
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyRuleCode: "",
      description: "",
      value: "",
    },
  });
  // const { setValue } = form;

  // Normalize initial values coming from backend (datetime strings etc.)
  useEffect(() => {
    if (!initialValues) return;

    const vals: CompanyRulesFormValues = {
      companyRuleCode:
        initialValues.companyRuleCode ?? initialValues.companyRuleCode ?? "",
      description: initialValues.description ?? initialValues.description ?? "",
      value: initialValues.value ?? initialValues.value ?? "",
    };

    form.reset(vals);
  }, [initialValues]);

  const title =
    mode === "edit" ? "Company Rules Update" : "Company Rules Information";

  const handleSuccessConfirm = () => {
    setSuccessDialogOpen(false);
    navigate("/admin/company-rules");
  };

  const onSubmit = async (values: CompanyRulesFormValues) => {
    console.log(values);
    if (onSubmitExternal) {
      try {
        await onSubmitExternal(values);
        setSuccessDialogOpen(true);
      } catch (err) {
        console.error("Create companyRul failed", err);
        // Optionally show an error to the user here
      }
    } else {
      // Fallback behavior for standalone form usage
      setTimeout(() => {
        setSuccessDialogOpen(true);
      }, 500);
    }
  };
  return (
    <div className="p-6 md:p-8 w-full flex-1 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          {/* Two-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-48">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-natural-400 border-natural-500 text-gray-700 h-10"
                        placeholder="Enter Description"
                        disabled={mode === "view"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Value */}
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                      Value
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-natural-400 border-natural-500 text-gray-700 h-10"
                        placeholder="Enter Value"
                        disabled={mode === "view"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {mode !== "view" && (
            <div className="flex justify-end gap-4 mt-8">
              <Button
                variant={"outline"}
                type="button"
                className="px-8 py-2 text-gray-700 bg-white border-gray-300 hover:bg-gray-50 h-10"
                onClick={() => navigate("/company-rules")}
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                className="px-8 py-2 bg-primary-500 hover:bg-primary-600 text-white h-10"
              >
                UPDATE
              </Button>
            </div>
          )}
          {/* View Mode Back Button */}
          {mode === "view" && (
            <div className="flex justify-end gap-4 mt-8">
              <Button
                variant={"outline"}
                type="button"
                className="px-8 py-2 bg-primary-500 hover:bg-primary-600 text-white h-10"
                onClick={() => navigate("/company-rules")}
              >
                BACK
              </Button>
            </div>
          )}
        </form>
      </Form>

      <SuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        onConfirm={handleSuccessConfirm}
      />
    </div>
  );
}

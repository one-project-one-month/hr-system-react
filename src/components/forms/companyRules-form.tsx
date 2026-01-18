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
import { SuccessDialog } from "../ui/custom/success-dialogue";

type Mode = "detail" | "edit" ;

interface CompanyRulesFormProps {
  mode?: Mode;
  onSubmitExternal?: (values: CompanyRulesFormValues) => Promise<any>;
  initialValues?: Partial<CompanyRulesFormValues> | any;
}

export default function CompanyRulesForm({
  mode = "detail", // default to view
  onSubmitExternal,
  initialValues,
}: CompanyRulesFormProps) {
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

  useEffect(() => {
    if (!initialValues) return;

    const vals: CompanyRulesFormValues = {
      companyRuleCode: initialValues.companyRuleCode ?? "",
      description: initialValues.description ?? "",
      value: initialValues.value ?? "",
    };

    form.reset(vals);
  }, [initialValues]);

  const title =
    mode === "edit"
      ? "Company Rules Update"
      : "Company Rules Information";

  const handleSuccessConfirm = () => {
    setSuccessDialogOpen(false);
    navigate("/company-rules");
  };

  const onSubmit = async (values: CompanyRulesFormValues) => {
    if (onSubmitExternal) {
      try {
        await onSubmitExternal(values);
        setSuccessDialogOpen(true);
      } catch (err) {
        console.error("Submit failed", err);
      }
    } else {
      setTimeout(() => {
        setSuccessDialogOpen(true);
      }, 500);
    }
  };

  const isViewMode = mode === "detail";

  return (
    <div className="p-6 md:p-8 w-full flex-1">
      <div className="mb-8">
        <h1 className="page-title">{title}</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-48">
            {/* Left Column */}
            <div className="space-y-6">
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
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
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
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {!isViewMode && (
            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/company-rules")}
              >
                CANCEL
              </Button>
              <Button type="submit" className="primary-btn">
                {mode === "edit" ? "UPDATE" : "CREATE"}
              </Button>
            </div>
          )}

          {/* View Mode Back Button */}
          {isViewMode && (
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

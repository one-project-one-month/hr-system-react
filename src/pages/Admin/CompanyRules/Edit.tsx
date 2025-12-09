import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { companyRulesService } from "@/services/companyRulesService";
import CompanyRulesForm from "@/components/forms/companyRules-form";

export function CompanyRulesEdit() {
  const { companyRuleCode } = useParams();
  const [searchParams] = useSearchParams();

  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    if (!companyRuleCode) return;
    const load = async () => {
      const description = searchParams.get("description");
      const value = searchParams.get("value");
      setInitialValues({
        companyRuleCode,
        description,
        value,
      });
    };
    load();
  }, [companyRuleCode]);

  const handleUpdate = async (values: any) => {

    try {
      await companyRulesService.updateCompanyRules(
        values.companyRuleCode,
        values
      );
    } catch (error) {
      console.error("Failed to update company rule", error);
      alert("Failed to update company rule");
    }
  };

  if (!initialValues) return <div>Loading...</div>;

  return (
    <CompanyRulesForm
      mode="edit"
      initialValues={initialValues}
      onSubmitExternal={handleUpdate}
    />
  );
}

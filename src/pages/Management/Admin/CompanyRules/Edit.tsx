import { useEffect, useState, type EmbedHTMLAttributes } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import CompanyRulesForm from "@/components/forms/companyRules-form";
import { companyRulesService } from "@/services/companyRulesService";

export function CompanyRulesEdit() {
  const { companyRuleCode } = useParams();
  const [searchParams] = useSearchParams();

  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    if (!companyRuleCode) return;
    const load = async () => {
      const description = searchParams.get("description");
      const value = searchParams.get("value");
      console.log("Loading company rule for ID:", companyRuleCode);
      console.log("Description from params:", description);
      console.log("Value from params:", value);
      setInitialValues({
        companyRuleCode,
        description,
        value,
      });
    };
    load();
  }, [companyRuleCode]);

  const handleUpdate = async (values: any) => {
    console.log("Updated values:", values);

    try {
      await companyRulesService.updateCompanyRules(values.companyRuleCode, values);

    } catch (error) {
      console.error("Failed to update company rule", error);
      alert("Failed to update company rule");
    }
  }

  if (!initialValues) return <div>Loading...</div>;

  return (
    <CompanyRulesForm mode="edit" initialValues={initialValues} onSubmitExternal={handleUpdate} />
  );
}

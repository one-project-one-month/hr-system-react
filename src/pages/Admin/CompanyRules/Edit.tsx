import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { companyRulesService } from "@/services/companyRulesService";
import CompanyRulesForm from "@/components/forms/companyRules-form";

export function CompanyRulesEdit() {
  const { code } = useParams();
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    if (!code) return;
    const load = async () => {
      const fetchedData = await companyRulesService.fetchCompanyRule(code)
      if (fetchedData.data) {
        console.log (fetchedData.data)
        setInitialValues({
          companyRuleCode: code,
          description: fetchedData.data.description,
          value: fetchedData.data.value,
        });
      }
    };
    load();
  }, [code]);

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

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CompanyRulesForm from "@/components/forms/companyRules-form";

export function CompanyRulesDetails() {
  const { companyRuleId } = useParams();
  const [searchParams] = useSearchParams();

  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    if (!companyRuleId) return;
    const load = async () => {
      const description = searchParams.get("description");
      const value = searchParams.get("value");
      console.log("Loading company rule for ID:", companyRuleId);
      console.log("Description from params:", description);
      console.log("Value from params:", value);
      setInitialValues({
        companyRuleId,
        description,
        value,
      });
    };
    load();
  }, [companyRuleId]);

  if (!initialValues) return <div>Loading...</div>;

  return (
    <CompanyRulesForm mode="view" initialValues={initialValues} />
  );
}

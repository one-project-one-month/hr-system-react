import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CompanyRulesForm from "@/components/ui/companyRules-form";

export function CompanyRulesDetails() {
  const { companyRuleId } = useParams();
  const [searchParams] = useSearchParams();

  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    if (!companyRuleId) return;
    const load = async () => {
      const description = searchParams.get("description");
      const value = searchParams.get("value");
      setInitialValues({
        companyRuleId,
        description,
        value,
      });
    };
    load();
  }, [companyRuleId]);

  if (!initialValues) return <div>Loading...</div>;

  return <CompanyRulesForm mode="view" initialValues={initialValues} />;
}

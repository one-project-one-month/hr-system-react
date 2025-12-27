import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CompanyRulesForm from "@/components/forms/companyRules-form";
import { companyRulesService } from "@/services/companyRulesService";

export function CompanyRulesDetails() {
  const { code } = useParams();
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    if (!code) return;
    const load = async () => {
      const fetched = await companyRulesService.fetchCompanyRule(code)
      if (fetched.data) {
         setInitialValues({
        code,
        description:fetched.data.description,
        value: fetched.data.value,
      });
      }
     
    };
    load();
  }, [code]);

  if (!initialValues) return <div>Loading...</div>;

  return <CompanyRulesForm mode="detail" initialValues={initialValues} />;
}

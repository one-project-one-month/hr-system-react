import { useDataStore } from "@/stores/useDataStore";

export const companyRulesService = {

  fetchCompanyRules: async (pageNo: number = 1, pageSize: number = 100) => {
    await useDataStore.getState().fetchData({
      endPoint: `/CompanyRules/list?pageNo=${pageNo}&pageSize=${pageSize}`,
    });
    const fullData = useDataStore.getState().data as any;
    const result = fullData?.data?.items || [];
    return result;
  },

  fetchCompanyRule: async (ruleId: string) => {
    const data = await useDataStore.getState().fetchData({
      endPoint: `/CompanyRules/update/${ruleId}`,
    });
    return data;
  },

  updateCompanyRules: async (ruleCode: string, data: any) => {
    await useDataStore.getState().fetchData({
      endPoint: `/CompanyRules/update/${ruleCode}`,
      method: "POST",
      body: data,
    });
  },
};
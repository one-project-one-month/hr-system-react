export type MenuGroupFormValues = {
  menuGroupCode: string;
  menuGroupName: string;
  url: string;
  icon: string;
  sortOrder: number | null | undefined;
  hasMenuItem: boolean;
};

export type MenuGroupFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<MenuGroupItem>;
  submitting?: boolean;
  serverError?: string;
  onSubmit: (values: MenuGroupFormValues) => void | Promise<void>;
  onCancel: () => void;
};
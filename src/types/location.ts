export type Location = {
    locationCode: string;
    name: string;
    latitude: string;
    longitude: string;
    radius: string;
    createdAt: string;
    createdBy: string;
    modifiedBy: string | null;
    modifiedAt: string | null;
    deleteFlag: boolean;
};

export type FormMode = "add" | "edit" | "detail";

export interface LocationFormProps {
    mode: FormMode;
    locationData?: {
        name: string;
        latitude: string;
        longitude: string;
        radius: string;
    };
    onSubmit?: (values: any) => void;
    onCancel?: () => void;
    onBack?: () => void;
    error?: any;
}

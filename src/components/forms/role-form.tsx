import { useNavigate, useParams } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RoleService } from "@/services/roleService";
import { useSuccessDialogStore } from "@/stores/useSuccessDialogStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roleSchema } from "@/schema/role";
import type z from "zod";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function RoleForm() {
    const { onConfirm, openDialog } =
        useSuccessDialogStore();
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const { code } = useParams()
    const form = useForm<z.infer<typeof roleSchema>>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            roleName: ""
        }
    })
    const { reset } = form;

    function onReset() {
        form.reset();
        form.clearErrors();
    }
    const handleFormSubmit = async (values: z.infer<typeof roleSchema>) => {
        try {
            if (!code) {
                await RoleService.createRole(values);
                openDialog("Create Role Successful!", onConfirm);
            }
            else {
                await RoleService.updateRole(code, values);
                openDialog("Update Role Successful!", onConfirm);
            }
            navigate("/role");

        } catch (error) {
            setError(error.message)
        }
    }

    const handleCancel = () => {
        navigate("/role")
    }

    useEffect(() => {
        (async () => {
            try {
                if (!code) return
                const fetched = await RoleService.fetchRole(code)
                reset({
                    roleName: fetched.data.roleName ?? ""
                })
            }
            catch (error) {
                setError(error.message)
            }

        })()
    }, [code])
    return (
        <div className="w-full p-8">
            {/* Main content wrapper */}
            <div className="p-6 md:p-8 max-w-4xl mx-auto">

                {/* Header Section */}
                <h1 className="page-title">
                Add New Role
                </h1>

                {/* Form Section */}
                <Form {...form}>
                    <form className='flex flex-col mt-2'
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        onReset={onReset}>
                        {/* Form fields grid */}
                        <FormField
                            control={form.control}
                            name="roleName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full md:w-[50%]"
                                            placeholder="Enter role name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && (
                            <div className="mt-2 flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 p-3 rounded-md text-sm">
                                <AlertCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex w-full justify-end mt-2 gap-4">
                            <Button
                                className="cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="primary-btn"
                            >
                                Create
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>

        </div>
    )
}
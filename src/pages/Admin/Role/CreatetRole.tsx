// src/pages/CreateRole.tsx

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { roleSchema } from '@/schema/role';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import type z from 'zod';


const CreateRole: React.FC = () => {
  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      roleName: ""
    }
  })

  function onReset() {
    form.reset();
    form.clearErrors();
  }
  const handleFormSubmit = async (values: z.infer<typeof roleSchema>) => {
    console.log(values)
  }
  return (
    <div className="w-full p-8">
      {/* Main content wrapper */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto">

        {/* Header Section */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
          Add New Role
        </h1>

        {/* Form Section */}
        <Form {...form}>
          <form className='flex flex-col'
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
                      className="border-natural-500 rounded-sm py-5 md:w-[50%]"
                      placeholder="Enter role name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex w-full justify-end mt-2 gap-4">
              <Button
                className="outline-btn"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="outline-btn"
              >
                Create
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateRole;
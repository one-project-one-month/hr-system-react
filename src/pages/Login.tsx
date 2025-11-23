'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(2, 'username must be at least 2 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const authStore = useAuthStore();
  const [Loading, setLoading] = useState<boolean>(false);
  // const [showToast, setShowToast] = useState(true);
  // const [toastMessage, setToastMessage] = useState('');
  // const [toastType, setToastType] = useState<
  //   'success' | 'error' | 'info' | 'warning'
  // >('info');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const authorized = await authStore.login(
        values.username,
        values.password
      );
      if (authorized && authStore.user) {
        switch (authStore.user.roleName.toLocaleLowerCase()) {
          case "administrator":
            navigate("/management/admin-dashboard");
          case "hr specialist":
            navigate("/management/hr-dashboard");
          default:
            navigate("/employee");
        }
      }
    } catch (error) {
      if (error) setErrorMessage(error.message);
    }
  };

  return (
    <div className='w-full'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4 py-6 px-8 rounded-xl shadow bg-natural-500'>
          <p className='font-semibold text-2xl text-center'>Login</p>

          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl className="border-none placeholder:text-dark-50">
                  <Input
                    placeholder="you@example.com"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl className="border-none">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errorMessage && (
            <p className="text-red-500 mb-4 text-center">{errorMessage}</p>
          )}
          <div className="mb-4">
            <Link to="/forgot-password" className="text-text/40 text-xs">
              Forgot Password?
            </Link>
          </div>
          <Button type="submit" className="w-full outline-btn">
            Login
          </Button>
          <div className="flex justify-center gap-5 py-5 text-disabled">
            <p className="text-sm text-center">Terms of Use</p>
            <p className="text-sm text-center">|</p>
            <p className="text-sm text-center">Privacy</p>
          </div>
        </form>
        <Loader loading={Loading} />
        {/* {showToast && (
          <ToastMessage
            message={toastMessage}
            type={toastType}
            duration={3000}
            onClose={() => setShowToast(false)}
          />
        )} */}
      </Form>
    </div>
  );
}

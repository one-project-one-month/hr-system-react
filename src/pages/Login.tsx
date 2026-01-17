"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/schema/login";
import { useAuthStore } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";


export default function LoginForm() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const authStore = useAuthStore();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const user = await authStore.login(
        values.username,
        values.password
      );

      if (user.isFirstTimeLogin) {
        navigate("/changePassword", { state: { employeeCode: user.employeeCode } });
        return;
      }
      if (user) {
        switch (user.roleName.toLocaleLowerCase()) {
          case "administrator":
            navigate("/admin/dashboard");
            break;
          case "hr specialist":
          case "hr":
          case "hr manager":  
            navigate("/hr/dashboard");
            break;
          default:
            navigate("/employee/dashboard");
            break;
        }
      }
    } catch (error) {
      if (error) setErrorMessage(error.message);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 py-6 px-8 rounded-xl shadow bg-natural-500"
        >
          <p className="font-semibold text-2xl text-center">Login</p>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl className="border-none placeholder:text-dark-50 bg-white">
                  <Input
                    placeholder="username"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl className="border-none bg-white">
                  <Input
                    type="password"
                    placeholder="password"
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
          <Button type="submit" className="w-full primary-btn">
            Login
          </Button>
          <div className="flex justify-center gap-5 py-5 text-disabled">
            <p className="text-sm text-center">Terms of Use</p>
            <p className="text-sm text-center">|</p>
            <p className="text-sm text-center">Privacy</p>
          </div>
        </form>
      </Form>
    </div>
  );
}

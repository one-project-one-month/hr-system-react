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
import { useAuthStore } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(2, "username must be at least 2 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const authStore = useAuthStore();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const authorized = await authStore.login(values.username, values.password);
    // console.log(authStore)
    if (authorized && authStore.user) {
      if (authStore.user.username.toLocaleLowerCase() === "admin" || authStore.user.username.toLocaleLowerCase() === "hr") {
        navigate("/management/dashboard")
      }
      else
        navigate("/employee/dashboard")
    }
    else
      navigate("/")
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
                <FormControl className="border-none placeholder:text-dark-50">
                  <Input placeholder="you@example.com" {...field} />
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
                <FormControl className="border-none">
                  <Input type="password" placeholder="••••••••" {...field} className="placeholder:text-dark-50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full outline-btn">
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

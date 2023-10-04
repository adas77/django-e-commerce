import * as z from "zod";

import { AuthStorage } from "@/api/auth/authStorage";
import restClient from "@/api/rest";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useToast } from "./ui/use-toast";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Username must be at least 1 character.",
  }),
  password: z.string().min(1, {
    message: "Password must be at least 1 character.",
  }),
});

type LoginCredentials = z.infer<typeof formSchema>;

type Props = {
  defaultUsername: string;
  defaultPassword: string;
  title: string;
};

const LoginForm = ({ defaultUsername, defaultPassword, title }: Props) => {
  const { toast } = useToast();
  const { mutate: loginMutate, isLoading } = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return (await restClient.post(`/token/`, credentials)).data;
    },
    onSuccess(data) {
      AuthStorage.setAccessToken(data.access);
      AuthStorage.setRefreshToken(data.refresh);
      toast({
        variant: "default",
        title: "Successfully logged in",
      });
    },
    onError() {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });
  const form = useForm<LoginCredentials>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: defaultUsername,
      password: defaultPassword,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    loginMutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96">
        <p className="text-xl text-slate-700">
          Login as a <b>{defaultUsername} </b> {title}
        </p>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormDescription>Your password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};
export default LoginForm;

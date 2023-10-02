import * as z from "zod";

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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import restClient from "@/api/rest";
import { AuthStorage } from "@/api/auth/authStorage";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Username must be at least 1 character.",
  }),
  password: z.string().min(1, {
    message: "Password must be at least 1 character.",
  }),
});

type Props = {
  defaultUsername: string;
  defaultPassword: string;
  title: string;
};

const LoginForm = ({ defaultUsername, defaultPassword, title }: Props) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: defaultUsername,
      password: defaultPassword,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: query mutation
    const res = await restClient.post(`/token/`, values);
    console.log(res);
    if (res.status === 200) {
      console.log("FFF");
      const data = res.data;
      AuthStorage.setAccessToken(data.access);
      AuthStorage.setRefreshToken(data.refresh);
    } else {
      console.log("UUUFFF");
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
export default LoginForm;

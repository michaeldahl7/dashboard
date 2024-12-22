import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";

import { z } from "zod";
import { type FieldApi, useForm } from "@tanstack/react-form";
import { createServerValidate, ServerValidateError } from "@tanstack/react-form/start";
import { createServerFn } from "@tanstack/start";
import { authMiddleware } from "~/middleware/auth-guard";

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(",")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

const formSchema = z.object({
  firstName: z
    .string()
    .min(1, "A first name is required")
    .min(3, "First name must be at least 3 characters")
    .refine((value) => !value.includes("error"), 'No "error" allowed in first name'),
  lastName: z.string().min(1, "Last name is required"),
});

const userSchema = z.object({
  age: z.number().gte(13, "You must be 13 to make an account"),
});

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { user } = Route.useRouteContext();

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
    },
  });

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-4xl font-bold">TanStarter</h1>
      <div className="flex items-center gap-2">
        This is an unprotected page:
        <pre className="rounded-md border bg-card p-1 text-card-foreground">
          routes/index.tsx
        </pre>
      </div>

      {user ? (
        <div className="flex flex-col gap-2">
          <p>Welcome back, {user.name}!</p>
          <Button type="button" asChild className="w-fit" size="lg">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
          <div>
            More data:
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>

          <form method="POST" action="/api/auth/logout">
            <Button type="submit" className="w-fit" variant="destructive" size="lg">
              Sign out
            </Button>
          </form>
        </div>
      ) : (
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Enter your personal details below.</CardDescription>
          </CardHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <form.Field
                  name="firstName"
                  validators={{
                    onChange: formSchema.shape.firstName,
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: z.string().refine(
                      async (value) => {
                        await new Promise((resolve) => setTimeout(resolve, 500));
                        return !value.includes("error");
                      },
                      {
                        message: 'No "error" allowed in first name',
                      },
                    ),
                  }}
                >
                  {(field) => (
                    <div className="space-y-1">
                      <Label htmlFor={field.name}>First Name</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldInfo field={field} />
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="space-y-2">
                <form.Field
                  name="lastName"
                  validators={{
                    onChange: formSchema.shape.lastName,
                  }}
                >
                  {(field) => (
                    <div className="space-y-1">
                      <Label htmlFor={field.name}>Last Name</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldInfo field={field} />
                    </div>
                  )}
                </form.Field>
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <>
                    <Button type="submit" disabled={!canSubmit}>
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                      Reset
                    </Button>
                  </>
                )}
              </form.Subscribe>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@munchy/ui/components/ui/card';
import { createFileRoute } from '@tanstack/react-router';
import { AddItemForm } from '~/components/forms/add-item-form';

export const Route = createFileRoute('/_authed/dashboard')({
  component: DashboardRoute,
});

function DashboardRoute() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-4 md:min-h-min">
        <Card>
          <CardHeader>
            <CardTitle>Add New Item</CardTitle>
            <CardDescription>
              Add a new item to your kitchen inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddItemForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

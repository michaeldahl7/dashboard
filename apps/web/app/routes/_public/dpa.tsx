import { createFileRoute, redirect } from '@tanstack/react-router';
import { dashboardLinkOptions } from '~/utils/link-options';

export const Route = createFileRoute('/_public/dpa')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect(dashboardLinkOptions);
    }
  },
  component: DpaPage,
});

function DpaPage() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <h1>Data Processing Agreement</h1>

      <h2 className="mt-8 mb-4 font-semibold text-2xl">
        2. Processing of Data
      </h2>

      <p>
        2.1 The parties acknowledge and agree that with regard to the processing
        of Personal Data, Customer acts as the controller and the Company as a
        processor.
      </p>

      <p>
        2.2 The Company shall process Personal Data only on documented
        instructions from Customer, including with regard to transfers of
        Personal Data to third countries, unless required to do so by law.
      </p>

      <h3 className="mt-6 mb-2 font-semibold text-xl">
        2.3 Nature and Purpose of Processing:
      </h3>
      <ul className="list-disc pl-6">
        <li>Processing food inventory and consumption data</li>
        <li>Tracking kitchen items and expiration dates</li>
        <li>Managing shopping lists and meal planning</li>
        <li>Analyzing food usage patterns</li>
        <li>Providing recommendations for food management</li>
      </ul>
    </div>
  );
}

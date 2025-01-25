import { createFileRoute, redirect } from '@tanstack/react-router';
import { dashboardLinkOptions } from '~/utils/link-options';

export const Route = createFileRoute('/_public/terms')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect(dashboardLinkOptions);
    }
  },
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <h1>Terms of Service</h1>

      <h2 className="mt-8 mb-4 font-semibold text-2xl">2. Use of Service</h2>

      <h3 className="mt-6 mb-2 font-semibold text-xl">2.2. Use Restrictions</h3>
      <p>Customer agrees not to:</p>
      <ul className="list-disc pl-6">
        <li>
          Modify, translate, copy or create derivative works based on the
          Service
        </li>
        <li>
          Reverse engineer or attempt to discover the source code of the Service
        </li>
        <li>Sell, resell, rent, lease, or commercially exploit the Service</li>
        <li>Remove or obscure any proprietary notices or branding</li>
        <li>Use the Service in any way that violates applicable laws</li>
        <li>Attempt to gain unauthorized access or disrupt the Service</li>
        <li>Build competitive products using the Service</li>
        <li>Probe, scan, or test the vulnerability of the Service</li>
      </ul>
    </div>
  );
}

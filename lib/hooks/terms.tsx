import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/lib/components/ui/card'

export const Route = createFileRoute('/terms')({
  component: TermsPage
})

function TermsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Effective date: January 5, 2025</p>

          <p>THESE TERMS OF SERVICE (the "Agreement") GOVERN YOUR RECEIPT, ACCESS TO AND USE OF THE SERVICE (AS DEFINED BELOW) PROVIDED BY Tracker (the "Company"). BY ACCEPTING THIS AGREEMENT THROUGH (A) PURCHASING ACCESS TO THE SERVICE, (B) SIGNING UP FOR A FREE ACCESS PLAN, OR (C) CLICKING A BOX INDICATING ACCEPTANCE, YOU AGREE TO BE BOUND BY ITS TERMS.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. The Service</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">1.1. Service Description</h3>
          <p>The Company is the owner and provider of a web-based service to help track food in your kitchen (the "Service"). Anything you post, upload, share, store, or otherwise provide through the Service is considered a "User Submission." You are solely responsible for all User Submissions you contribute to the Service.</p>

          <h3 className="text-xl font-semibold mt-6 mb-2">1.2. Customer's Subscription</h3>
          <p>Subject to the terms of this Agreement, Customer may purchase a subscription to access and use the Service as specified in one or more ordering screens that reference this Agreement ("Order(s)"). All subscriptions will be for the period described on the applicable Order ("Subscription Period"). Use of and access to the Service is permitted only by individuals authorized by Customer ("Users") for Customer's own internal business purposes.</p>

          <h3 className="text-xl font-semibold mt-6 mb-2">1.3. Company's Ownership</h3>
          <p>The Company owns the Service and all related content, documentation, and materials provided to Customer. The Company retains all right, title, and interest (including all intellectual property rights) in and to the Service and any related materials. There are no implied licenses under this Agreement.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Restrictions</h2>

          <h3 className="text-xl font-semibold mt-6 mb-2">2.1. Customer's Responsibilities</h3>
          <p>Customer is responsible for all activity on its Users' accounts unless such activity is caused by unauthorized third-party access exploiting vulnerabilities in the Service itself. Customer will ensure that its Users are aware of and bound by this Agreement.</p>

          <h3 className="text-xl font-semibold mt-6 mb-2">2.2. Use Restrictions</h3>
          <p>Customer agrees not to:</p>
          <ul className="list-disc pl-6">
            <li>Modify, translate, copy or create derivative works based on the Service</li>
            <li>Reverse engineer or attempt to discover the source code of the Service</li>
            <li>Sell, resell, rent, lease, or commercially exploit the Service</li>
            <li>Remove or obscure any proprietary notices or branding</li>
            <li>Use the Service in any way that violates applicable laws</li>
            <li>Attempt to gain unauthorized access or disrupt the Service</li>
            <li>Build competitive products using the Service</li>
            <li>Probe, scan, or test the vulnerability of the Service</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Third-Party Applications</h2>
          <p>The Service may integrate with third-party products or services ("Third-Party Applications"). The Company does not endorse Third-Party Applications and disclaims all warranties relating to them. Your use of Third-Party Applications is at your own risk.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Payment Obligations</h2>

          <h3 className="text-xl font-semibold mt-6 mb-2">4.1. Fees</h3>
          <p>Customer will pay for access to and use of the Service as set forth on the applicable Order ("Fees"). All payment obligations are non-cancelable and non-refundable except as expressly stated in this Agreement.</p>

          <h3 className="text-xl font-semibold mt-6 mb-2">4.2. Payment</h3>
          <p>The Company will charge Customer for the Fees via supported payment methods. Customer is responsible for providing current and valid payment information.</p>

          <h3 className="text-xl font-semibold mt-6 mb-2">4.3. Taxes</h3>
          <p>Fees do not include taxes. Customer is responsible for paying all applicable taxes associated with its purchases.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. General Terms</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">10.1. Changes</h3>
          <p>The Company may modify the Service or this Agreement with notice to Customer.</p>

          <h3 className="text-xl font-semibold mt-6 mb-2">10.2. Governing Law</h3>
          <p>This Agreement is governed by the laws of the State of California. Any disputes will be resolved in the courts of Los Angeles, California.</p>

          <h3 className="text-xl font-semibold mt-6 mb-2">10.3. Entire Agreement</h3>
          <p>This Agreement constitutes the entire agreement between the parties regarding its subject matter.</p>
        </CardContent>
      </Card>
    </div>
  )
}

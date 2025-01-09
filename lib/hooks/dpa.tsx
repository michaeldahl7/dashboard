import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/lib/components/ui/card'

export const Route = createFileRoute('/dpa')({
  component: DpaPage
})

function DpaPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Data Processing Agreement</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Effective date: January 5, 2025</p>

          <p>This Data Processing Agreement ("DPA") supplements the Terms of Service (the "Agreement") entered into by and between Customer (as defined in the Agreement) and Tracker, a company located in Los Angeles, CA ("Company"). By executing the Agreement, Customer enters into this DPA on behalf of itself. This DPA incorporates the terms of the Agreement, and any terms not defined in this DPA shall have the meaning set forth in the Agreement.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Definitions</h2>

          <p>1.1 "Authorized Sub-Processor" means a third-party who has a need to know or otherwise access Customer's Personal Data to enable the Company to perform its obligations under this DPA or the Agreement.</p>

          <p>1.2 "Customer Account Data" means personal data that relates to Customer's relationship with the Company, including names and contact information of individuals authorized by Customer to access Customer's account and billing information.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Processing of Data</h2>

          <p>2.1 The parties acknowledge and agree that with regard to the processing of Personal Data, Customer acts as the controller and the Company as a processor.</p>

          <p>2.2 The Company shall process Personal Data only on documented instructions from Customer, including with regard to transfers of Personal Data to third countries, unless required to do so by law.</p>

          <h3 className="text-xl font-semibold mt-6 mb-2">2.3 Nature and Purpose of Processing:</h3>
          <ul className="list-disc pl-6">
            <li>Processing food inventory and consumption data</li>
            <li>Tracking kitchen items and expiration dates</li>
            <li>Managing shopping lists and meal planning</li>
            <li>Analyzing food usage patterns</li>
            <li>Providing recommendations for food management</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Exhibit A: Technical and Organizational Security Measures</h2>

          <h3 className="text-xl font-semibold mt-6 mb-2">1. Data Security</h3>
          <ul className="list-disc pl-6">
            <li>Encryption at rest and in transit</li>
            <li>Regular security updates and patches</li>
            <li>Secure access controls</li>
            <li>Regular backups</li>
            <li>Monitoring and logging systems</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Exhibit B: Sub-processors</h2>

          <p className="font-medium">Current list of sub-processors as of January 5, 2025:</p>

          <h3 className="text-xl font-semibold mt-6 mb-2">1. Cloud Infrastructure:</h3>
          <ul className="list-disc pl-6">
            <li>Amazon Web Services (United States) - Hosting</li>
            <li>Google Cloud Platform (United States) - Database Services</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2">2. Analytics and Monitoring:</h3>
          <ul className="list-disc pl-6">
            <li>Google Analytics (United States) - Usage Analytics</li>
            <li>Datadog (United States) - Performance Monitoring</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2">3. Communication Services:</h3>
          <ul className="list-disc pl-6">
            <li>SendGrid (United States) - Email Communications</li>
            <li>Stripe (United States) - Payment Processing</li>
          </ul>

          <p className="mt-8 text-muted-foreground">This DPA is effective as of January 5, 2025</p>
        </CardContent>
      </Card>
    </div>
  )
}

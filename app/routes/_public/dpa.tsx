import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/dpa')({
  component: DpaPage,
})

function DpaPage() {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <h1>Data Processing Agreement</h1>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
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

      <h3 className="text-xl font-semibold mt-6 mb-2">
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
  )
}

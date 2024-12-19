import * as React from 'react'
import { Invoice } from '#billing/types'
import { IconFileInvoice, IconExternalLink } from '@tabler/icons-react'
import Button from '#common/ui/components/button'
import { Card, CardHeader, CardTitle, CardContent } from '#common/ui/components/card'
import DashboardLayout from '#common/ui/components/dashboard_layout'
import useParams from '#common/ui/hooks/use_params'
import SettingsLayout from '#organizations/ui/components/settings_layout'

interface ShowProps {
  invoices: Invoice[]
  upcomingInvoice: Invoice
}

function formatDate(date: number) {
  return new Date(date * 1000).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const Show: React.FunctionComponent<ShowProps> = ({ invoices, upcomingInvoice }) => {
  const [loading, setLoading] = React.useState(false)
  const params = useParams()
  return (
    <SettingsLayout>
      <div className="flex items-center gap-x-4">
        <h3 className="text-2xl tracking-[-0.16px] text-zinc-900 font-serif">Billing</h3>
        <a
          href={`/organizations/${params.organizationSlug}/billing/manage`}
          onClick={() => setLoading(true)}
        >
          <Button loading={loading}>
            <span>Manage Billing</span>
          </Button>
        </a>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 my-8">
        <Card className="text-sm sm:col-span-2">
          <CardHeader>
            <CardTitle>Preview invoice</CardTitle>
          </CardHeader>
          <CardContent className="bg-white !rounded-md">
            {upcomingInvoice ? (
              <>
                <div className="flex justify-between space-x-2">
                  <div className="flex flex-col w-full">
                    <p className="font-semibold text-base">Billed to</p>
                    <p>{upcomingInvoice.billedTo}</p>
                  </div>
                  <div className="flex flex-col w-full">
                    <p className="font-semibold text-base">Invoice date</p>
                    <p>
                      {formatDate(upcomingInvoice.startDate)} -{' '}
                      {formatDate(upcomingInvoice.endDate)}
                    </p>
                  </div>
                </div>

                <div className="footer mt-8">
                  <table className="w-full table-auto">
                    <thead className="text-left border-b border-zinc-300/20 text-lg">
                      <tr>
                        <th className="pb-3">
                          <p>Description</p>
                        </th>
                        <th className="pb-3">
                          <p>Amount</p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingInvoice.items.map((item) => (
                        <tr key={item.description}>
                          <td className="py-4">{item.description}</td>
                          <td>
                            {new Intl.NumberFormat(undefined, {
                              style: 'currency',
                              currency: item.currency,
                            }).format(item.amount / 100)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t border-zinc-300/20">
                      <tr>
                        <td className="font-bold text-lg pt-3">Total</td>
                        <td className="pt-3">
                          {new Intl.NumberFormat(undefined, {
                            style: 'currency',
                            currency: upcomingInvoice.currency,
                          }).format(upcomingInvoice.total / 100)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </>
            ) : (
              <span>No upcoming invoice</span>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 text-sm">
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent className="!p-0 bg-white rounded-b-md">
            <ul className="divide-y divide-emerald-300/20">
              {invoices.map((invoice) => (
                <li key={invoice.startDate} className="flex space-x-2 justify-between p-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <IconFileInvoice className="w-4 h-4 text-blue-300" />
                    <span>
                      {formatDate(invoice.startDate)} - {formatDate(invoice.endDate)}
                    </span>
                  </div>
                  <a
                    href={invoice.invoiceUrl}
                    target="_blank"
                    className="flex items-center space-x-1"
                  >
                    <span>View</span>
                    <IconExternalLink className="w-4 h-4" />
                  </a>
                </li>
              ))}
            </ul>
            {invoices.length === 0 && <p className="p-6">No previous invoices</p>}
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  )
}

export default Show

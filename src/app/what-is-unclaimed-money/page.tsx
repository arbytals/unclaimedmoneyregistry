import { MoneySidebar } from "@/components/sideComponent";

export default function WhatIsUnclaimedMoney() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-primaryBlue">
            WHAT IS UNCLAIMED MONEY?
          </h1>

          <div className="space-y-4 text-gray-700">
            <p>
              Unclaimed money is money that is attributed to a person or company
              but has been left unclaimed within financial or government
              institutions. Unclaimed money is lost money !!!
            </p>

            <p>
              This person or company whose name is attributed to the unclaimed
              money is rightfully entitled to receive the money but in many
              circumstances they are unaware that the money has been transferred
              to Consolidated Revenue Fund.
            </p>

            <p>
              There are a whole range of reasons as to why unclaimed money
              exists. In many cases it is because the company, solicitor,
              financial institution or government institution has lost contact
              with the owner or is unable to find the owner, for instance where
              the owner of the monies owing may have moved address.
            </p>

            <p>Unclaimed money can be claimed from:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                Government institutions such as the Australian Tax Office, State
                Government and the Fair Work Ombudsman (e.g. unpaid wages)
              </li>
              <li>Bank Accounts and Bank Dividends</li>
              <li>Life Insurance Policies</li>
              <li>Share and Investments</li>
              <li>Other sources e.g. private companies and so on</li>
            </ul>

            <p>
              Locating all of this money can be difficult for private
              individuals because there are so many different locations that the
              money could be held in. At The Registry of Unclaimed Money, we
              collate all of the unclaimed money data from all available sources
              into a single database making it easy for people to search for and
              discover whether any money is owing to them.
            </p>
          </div>
        </div>

        <div>
          <MoneySidebar />
        </div>
      </div>
    </main>
  );
}

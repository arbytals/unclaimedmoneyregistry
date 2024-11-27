import { MoneySidebar } from "@/components/sideComponent";

export default function FAQ() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-primaryBlue">
            FREQUENTLY ASKED QUESTIONS ABOUT UNCLAIMED MONEY
          </h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-2">
                Why is there money owing to me?
              </h2>
              <p>
                Unclaimed money can be lost for many reasons including the death
                of a person, people change addresses without notifying companies
                where they hold shares, investments just forgotten about.
              </p>
              <p>
                Companies make efforts to find individuals and businesses when
                funds and dividends are due to be paid out. Sometimes many
                assets are lost and individuals and businesses lose touch with
                their provider.
              </p>
              <p>
                Unclaimed money related to un-presented cheques, bank accounts
                that have not been used and left untouched, untouched
                superannuation, company takeovers, rental bonds and local
                council bonds. The list is endless and ever growing. Due to
                privacy restrictions until we can confirm that you are the
                rightful owner of the funds we cannot disclose the full details
                of the funds.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                How much does it cost for you to help me receive my unclaimed
                money?
              </h2>
              <p>
                The Registry of Unclaimed Money charges a commission that is
                only payable if the unclaimed money is confirmed as lost and
                successfully claimed on your behalf. That means there are no
                &apos;up front&apos; fees. Upon the completion of the asset
                recovery process we retain our fee and forward you the balance
                by a trust cheque or a deposit into your nominated bank account.
              </p>
              <p>There are no fees to process your unclaimed money claim.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                How long does it take to receive the money?
              </h2>
              <p>
                The results will be ready within 6-8 weeks from the date the
                request has been submitted.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                How do I know The Registry of Unclaimed Money is a legitimate,
                trustworthy business?
              </h2>
              <p>
                The Registry of Unclaimed Money is registered with ASIC and has
                been actively helping people recover money.
              </p>
              <p>
                The Registry of Unclaimed Money is a fully accountable
                professional service. All funds distributed by The Registry of
                Unclaimed Money for successful claims are followed up and
                monitored by government bodies.
              </p>
              <p>
                We are licenced Private Investigators, Commercial Agents and
                Skip Tracers driven to reunite unclaimed money with their
                rightful owners. We utilise a number of publicly available and
                paid resources to track owners down ~ it is all completed
                legitimately and ethically. We are in fact going out of our way
                to ensure that people get THEIR money back ~ often against all
                odds!
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                How often is the data updated?
              </h2>
              <p>
                The process of updating the database is continual, updated
                monthly. We endeavour to keep the data as fresh as possible.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                Requirements for proof of address
              </h2>
              <p>
                We deal with various organisations and each one has different
                documentary requirements. Most organisations require 100 points
                of identity and all documents need to be certified copies. You
                will also need to provide evidence to the unclaimed money.
                Documents required as a connection to the last known address
                include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  Correspondence with the organisation that lodged the unclaimed
                  money
                </li>
                <li>Council rate notice</li>
                <li>Gas or electricity bill</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                Requirements as proof of a relevant link to the organisation
                that lodged the unclaimed money:
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Premium Certificates issued from the organisation</li>
                <li>Correspondence from the organisation</li>
                <li>Any Statements or Share certificates</li>
              </ul>
              <p className="mt-2">
                A Signed Authority to Release Form is included in our
                information pack.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                If I am providing personal information how is my privacy
                protected?
              </h2>
              <p>
                All personal information is kept in the strictest confidence. We
                only provide your details to third parties when required by the
                custodian/s of the unclaimed money to prove your entitlement to
                the claim.
              </p>
            </section>
          </div>
        </div>

        <div>
          <MoneySidebar />
        </div>
      </div>
    </main>
  );
}

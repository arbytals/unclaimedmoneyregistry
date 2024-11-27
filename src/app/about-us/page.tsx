import { MoneySidebar } from "@/components/sideComponent";

export default function AboutUs() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-primaryBlue">ABOUT US</h1>

          <div className="space-y-4 text-gray-700">
            <p>
              The Registry of Unclaimed Money came into existence after its
              founders became frustrated at the difficulty of tracking down lost
              money within Australia and New Zealand. Government and financial
              institution structures are such that they work independently,
              resulting in a very time consuming and confusing process for
              anyone looking for unclaimed money.
            </p>

            <p>
              The idea was to collate and centralise all of the data in one
              location, making it easier for anyone to track down their
              unclaimed money.
            </p>

            <p>
              The Directors are fully licenced Commercial Agents and the
              Managing Director is a licenced Private Investigator with
              extensive skip tracing skills to locate missing persons who have
              lost money to claim. With a background in investigative and legal
              work, the founders of The Registry of Unclaimed Money are familiar
              with the process of successfully retrieving unclaimed money, and
              will work on behalf of any private individual or organisation
              looking to locate and claim any lost money that may be owed to
              them.
            </p>

            <p>
              The Registry of Unclaimed Money is an Australian owned and
              operated business.
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

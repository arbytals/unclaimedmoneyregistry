import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoneySidebar } from "@/components/sideComponent";

export default function Home() {
  return (
    <main className="flex-1 container mx-auto px-2 md:px-4 py-6">
      <div className="grid md:grid-cols-3 gap-6 h-full">
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <Image
              src="/australia1.png"
              alt="Australian Map"
              width={200}
              height={200}
              className="w-28 h-28"
            />
            <h1 className="text-xl px-0 md:px-1.5 md:text-3xl font-bold text-center text-primaryBlue">
              THE REGISTRY OF UNCLAIMED MONEY
              <br />
              AUSTRALIA & NEW ZEALAND
            </h1>
            <Image
              src="/new-zealand.png"
              alt="New Zealand Map"
              width={200}
              height={200}
              className="w-28 h-28"
            />
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm">
              Our FREE search collaborates all of the information kept on
              Australian & New Zealand Government databases and makes it easy
              for you to find any money that is owing to you, your family or
              your friends.
            </p>
            <p className="text-sm">
              The Registry of Unclaimed Money specialises in searching for and
              finding unclaimed monies on behalf of people that believe they may
              possibly have money owing to them.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-primaryBlue rounded-lg p-4">
              <h2 className="text-xl font-bold text-primaryBlue text-center mb-4">
                SEARCH BY NAME
              </h2>
              <form className="space-y-3">
                <Input
                  type="text"
                  placeholder="FIRST NAME"
                  className="uppercase h-9"
                />
                <Input
                  type="text"
                  placeholder="LAST NAME"
                  className="uppercase h-9"
                />
                <Button className="w-full bg-primaryYellow hover:bg-primaryYellow h-8">
                  GO
                </Button>
              </form>
            </div>

            <div className="border-2 border-primaryBlue rounded-lg p-4">
              <h2 className="text-xl font-bold text-primaryBlue text-center mb-4">
                SEARCH BY COMPANY
              </h2>
              <form className="space-y-3">
                <Input
                  type="text"
                  placeholder="COMPANY NAME"
                  className="uppercase h-9"
                />
                <Button className="w-full bg-primaryYellow hover:bg-primaryYellow h-8">
                  GO
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div>
          <MoneySidebar />
        </div>
      </div>
    </main>
  );
}

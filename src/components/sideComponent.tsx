export function MoneySidebar() {
  return (
    <div className="bg-primaryYellow text-white max-w-xs ml-0 xl:ml-14 w-full py-8 px-5 rounded-xl space-y-12 border-t-4 border-white">
      <div className="text-center space-y-3">
        <h3 className="text-base font-medium">
          The total amount of unclaimed money currently in our database is:
        </h3>
        <p className="text-2xl font-medium text-primaryBlue">$490,769,168.36</p>
      </div>

      <div className="space-y-1 text-center">
        <h3 className="text-xl font-bold">GET RESULTS</h3>
        <h4 className="text-xl font-bold">FIND YOUR LOST MONEY</h4>
        <p className="text-base">
          We can assist you in locating and claiming your lost money
        </p>
      </div>

      <div className="text-center space-y-0.5 text-base">
        <p>PO Box 818</p>
        <p>Tugun QLD 4224</p>
        <p>Australia</p>
      </div>
    </div>
  );
}

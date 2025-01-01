"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/what-is-unclaimed-money", label: "What is Unclaimed Money" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact-us", label: "Contact Us" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownHeight, setDropdownHeight] = useState(0);

  useEffect(() => {
    if (dropdownRef.current) {
      setDropdownHeight(dropdownRef.current.scrollHeight);
    }
  }, [isOpen]);

  return (
    <header className="w-full">
      <div className="container mx-auto px-4 py-1">
        <Link href="/" className="flex justify-center">
          <Image
            src="/unclaimed-money-australia.png"
            alt="The Registry of Unclaimed Money"
            width={400}
            height={80}
            className="h-20 w-auto"
            priority
          />
        </Link>
      </div>
      {/* <nav className="bg-gradient-to-r from-gray-700 to-gray-900 shadow-lg">
        <div className="container mx-auto"> */}
          {/* Mobile Navigation */}
          {/* <div className="lg:hidden relative hover:bg-none">
            <Button
              variant="ghost"
              className="text-white p-2 m-2 flex items-center w-full justify-between"
              onClick={() => setIsOpen(!isOpen)}>
              <span className="flex items-center">
                <Menu className="h-6 w-6 mr-2" />
                Menu
              </span>
            </Button>
            <div
              ref={dropdownRef}
              className={`absolute top-full left-0 right-0 bg-gradient-to-b from-gray-700 to-gray-900 shadow-lg overflow-hidden transition-[max-height] duration-300 ease-in-out`}
              style={{ maxHeight: isOpen ? `${dropdownHeight}px` : "0px" }}>
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 text-gray-200 hover:bg-primaryYellow transition-colors ${
                    pathname === item.href
                      ? "bg-primaryYellow hover:text-white/80"
                      : ""
                  }`}
                  onClick={() => setIsOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div> */}

          {/* Desktop Navigation */}
          {/* <ul className="hidden lg:flex">
            {navigationItems.map((item) => (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`block px-4 py-2 text-center  text-white/80 hover:text-primaryYellow transition-colors ${
                    pathname === item.href
                      ? "bg-primaryYellow hover:text-white/80"
                      : ""
                  }`}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav> */}
    </header>
  );
}

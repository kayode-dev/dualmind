import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="h-12 md:h-16 w-full border-b border-b-neutral-600 p-4 md:px-10 md:py-6 flex items-center justify-between">
      <Link href="/" className="font-bold text-lg md:text-2xl">
        dm🤖
      </Link>
    </nav>
  );
};

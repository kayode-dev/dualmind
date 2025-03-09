import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const thisYear = new Date().getFullYear();
export default function Footer() {
  return (
    <footer className="p-2 md:p-6 md:text-lg border-t border-t-neutral-600 text-neutral-400 flex items-center justify-between">
      <p>&copy; kayode dev {thisYear}</p>
      <div className="items-center gap-4 hidden md:flex">
        <FooterLink
          href="https://www.linkedin.com/in/kayodedev/"
          name="linkedin"
        />
        <FooterLink href="https://www.kayodedev.com" name="portfolio" />
        <FooterLink href="https:/www.github.com/kayode-dev" name="github" />
      </div>
    </footer>
  );
}
interface FooterLinkProps {
  href: string;
  name: string;
}
const FooterLink = ({ href, name }: FooterLinkProps) => {
  return (
    <Link
      href={href}
      className="underline underline-offset-4 flex gap-2 items-center group hover:text-white duration-300 transition-colors"
      target="_blank"
    >
      {name}
      <ArrowUpRight className="group-hover:-translate-y-2 duration-300 ease-linear" />
    </Link>
  );
};

import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2", props.className)}>
      <Image 
        src="https://firebasestudio.ai/krishi-ek-logo.png" 
        alt="Krishi Ek Logo" 
        width={120} 
        height={40} 
        className="group-data-[collapsible=icon]:hidden"
      />
       <Image 
        src="https://firebasestudio.ai/krishi-ek-icon.png" 
        alt="Krishi Ek Icon" 
        width={32} 
        height={32} 
        className="hidden group-data-[collapsible=icon]:block"
      />
    </div>
  );
}

export function CowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18.8 6.2a2.4 2.4 0 0 0-3.2 0l-1.6 1.6" />
      <path d="M13 8l3-3" />
      <path d="M17.5 12.5c0-2.5-2-5-5-5s-5 2.5-5 5c0 2.2 1.4 4.1 3.4 4.8" />
      <path d="M15.5 4.5c1.5 0 2.5 1.5 2.5 3" />
      <path d="M8.5 4.5c-1.5 0-2.5 1.5-2.5 3" />
      <path d="M12 12v6" />
      <path d="M12 21a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2z" />
      <path d="M6 15H5c-1.1 0-2 .9-2 2v1a2 2 0 0 0 2 2h1" />
      <path d="M18 15h1c1.1 0 2 .9 2 2v1a2 2 0 0 1-2 2h-1" />
    </svg>
  );
}
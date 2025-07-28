import Image from "next/image";
import Hero from "./components/hero";
import JobsPreview from "./components/jobsPreview";
import HowItWorks from "./components/howItWorks";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 min-h-screen">
      <Hero/>
      <HowItWorks/>
      <JobsPreview/>
    </div>
  );
}

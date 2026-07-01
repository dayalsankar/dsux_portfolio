import { ScrollProgress, SideNav } from "@/components/ui/Chrome";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { Hero } from "@/components/sections/Hero";
import { Summary, Story, Context, Problem } from "@/components/sections/Opening";
import {
  Research,
  Competitive,
  Stakeholders,
  Journey,
  Insights,
} from "@/components/sections/Discovery";
import { Principles, IA, Flows, Decisions } from "@/components/sections/Design";
import {
  Features,
  Admin,
  AI,
  Accessibility,
  DesignSystem,
} from "@/components/sections/Product";
import {
  Prototype,
  Tech,
  Impact,
  Reflection,
  Roadmap,
  Testimonials,
  Takeaways,
} from "@/components/sections/Closing";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <SideNav />
      <main>
        {/* Act I — The opening */}
        <Hero />
        <Summary />
        <Story />
        <Context />
        <Problem />
        {/* Act II — Discovery */}
        <Research />
        <Competitive />
        <Stakeholders />
        <Journey />
        <Insights />
        {/* Act III — The design */}
        <Principles />
        <IA />
        <Flows />
        <Decisions />
        {/* Act IV — The product */}
        <Features />
        <Admin />
        <AI />
        <Accessibility />
        <DesignSystem />
        {/* Act V — Closing */}
        <Prototype />
        <Tech />
        <Impact />
        <Reflection />
        <Roadmap />
        <Testimonials />
        <Takeaways />
      </main>
    </>
  );
}

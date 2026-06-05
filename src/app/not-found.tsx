import Link from "next/link";
import { AmbientBackground } from "@/components/visuals/AmbientBackground";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
      <AmbientBackground />
      <div className="container-pad relative z-10 text-center">
        <div className="font-display text-8xl font-black text-neon">404</div>
        <h1 className="mt-4 text-2xl font-semibold text-white">This route doesn’t exist.</h1>
        <p className="mx-auto mt-3 max-w-md text-white/55">
          Like a misplaced pass — let’s get you back in play. Try a host city or the directory.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/">Back home</ButtonLink>
          <ButtonLink href="/cities" variant="secondary">Explore cities</ButtonLink>
        </div>
      </div>
    </section>
  );
}

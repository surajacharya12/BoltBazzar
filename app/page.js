import { Footer } from "./_components/footer";
import { Hero } from "./_components/hero";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen transition-colors duration-300 -mt-100 md:-mt-110">
      <Hero />
      <Footer />
    </div>
  );
}

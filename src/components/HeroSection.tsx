import { Camera, Star } from "lucide-react";

interface HeroSectionProps {
  onBookNow: () => void;
}

const HeroSection = ({ onBookNow }: HeroSectionProps) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background grid of photos */}
      <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-4 gap-1 opacity-15">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="aspect-square overflow-hidden">
            <img
              src={`/images/gallery/wedding-${(i % 16) + 1}.png`}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />

      <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in-up">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Star className="h-4 w-4 text-primary fill-primary" />
          <span className="text-sm font-body text-primary tracking-widest uppercase">Premium Photography</span>
          <Star className="h-4 w-4 text-primary fill-primary" />
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
          <span className="text-foreground">Capturing Your</span>
          <br />
          <span className="text-gold-gradient">Precious Moments</span>
        </h1>

        <p className="text-muted-foreground font-body text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          From weddings to birthdays, we turn your special moments into timeless memories with our professional photography services.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBookNow}
            className="bg-gold-gradient text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity shadow-gold flex items-center justify-center gap-2"
          >
            <Camera className="h-5 w-5" />
            Book a Session
          </button>
          <button
            onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
            className="border border-border text-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-secondary transition-colors"
          >
            View Our Work
          </button>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 text-center">
          {[
            ["500+", "Happy Clients"],
            ["8+", "Categories"],
            ["5+", "Years Experience"],
          ].map(([num, label]) => (
            <div key={label}>
              <div className="font-display text-3xl font-bold text-gold-gradient">{num}</div>
              <div className="text-sm text-muted-foreground font-body mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

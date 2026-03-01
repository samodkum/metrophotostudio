import { Instagram, ExternalLink } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/vishal_gole_photography";

const InstagramSection = () => (
  <section className="py-20 bg-card">
    <div className="container mx-auto px-4">
      <div className="text-center mb-10 animate-fade-in-up">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
          <span className="text-gold-gradient">Follow Us on Instagram</span>
        </h2>
        <p className="text-muted-foreground font-body max-w-lg mx-auto">
          See our latest stories, reels & behind-the-scenes content
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Instagram profile card */}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 bg-secondary border border-border hover:border-primary/40 rounded-2xl px-8 py-6 transition-all hover:shadow-gold"
        >
          <div className="bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743] rounded-full p-3">
            <Instagram className="h-8 w-8 text-white" />
          </div>
          <div className="text-left">
            <p className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              @vishal_gole_photography
            </p>
            <p className="text-sm text-muted-foreground font-body">
              Photos · Videos · Stories · Reels
            </p>
          </div>
          <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors ml-2" />
        </a>

        {/* Instagram embed grid placeholder with real images */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 max-w-4xl w-full mt-4">
          {[
            "/images/gallery/wedding-1.png",
            "/images/gallery/pre-wedding-3.png",
            "/images/gallery/baby-2.png",
            "/images/gallery/haldi-1.png",
            "/images/gallery/maternity-4.png",
            "/images/gallery/mehendi-2.png",
          ].map((src, i) => (
            <a
              key={i}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square overflow-hidden rounded-lg border border-border hover:border-primary/40 transition-all group"
            >
              <img
                src={src}
                alt={`Instagram post ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </a>
          ))}
        </div>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gold-gradient text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 mt-2"
        >
          <Instagram className="h-5 w-5" />
          View All on Instagram
        </a>
      </div>
    </div>
  </section>
);

export default InstagramSection;

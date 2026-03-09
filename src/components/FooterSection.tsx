import { Camera, Phone, Mail, MapPin, Instagram } from "lucide-react";

const FooterSection = () => (
  <footer id="contact" className="py-16 bg-secondary border-t border-border">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Camera className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-gold-gradient">Metro Photo Studio</span>
          </div>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Capturing your precious moments with professional photography services across all occasions.
          </p>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Contact Us</h3>
          <div className="space-y-3">
            <a href="tel:9324236203" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-body">
              <Phone className="h-4 w-4 text-primary" /> +91 93242 36203
            </a>
            <a href="mailto:info@metrophotostudio.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-body">
              <Mail className="h-4 w-4 text-primary" /> info@metrophotostudio.com
            </a>
            <div className="flex items-start gap-2 text-sm text-muted-foreground font-body">
              <MapPin className="h-4 w-4 text-primary mt-0.5" /> Mumbai, Maharashtra
            </div>
            <a href="https://www.instagram.com/metro_photo_studioo?igsh=MTRuMms1NHYybWs0aw==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-body">
              <Instagram className="h-4 w-4 text-primary" /> @metro_photo_studioo
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Services</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground font-body">
            {["Wedding", "Pre-Wedding", "Baby Shoot", "Haldi", "Mehendi", "Maternity", "Birthday", "Events"].map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-10 pt-6 text-center">
        <p className="text-xs text-muted-foreground font-body">© 2026 Metro Photo Studio. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default FooterSection;

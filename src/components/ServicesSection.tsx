import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { getServices, LocalService } from "@/data/localStore";

const ServicesSection = () => {
  const [services, setServices] = useState<LocalService[]>([]);

  useEffect(() => {
    setServices(getServices());
  }, []);

  if (services.length === 0) return null;

  return (
    <section id="services" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gold-gradient">Our Services</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Professional photography for every occasion
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map(({ id, icon, title, description }) => {
            const IconComponent = icon && (Icons as any)[icon] ? (Icons as any)[icon] : Icons.Camera;
            return (
              <Link
                key={id}
                to={`/category/${title.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-secondary text-left rounded-xl p-6 border border-border hover:border-primary/40 transition-all hover:shadow-gold group block cursor-pointer"
              >
                <IconComponent className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground font-body">{description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

import { Lightbulb, Shield, Award } from "lucide-react";
import React from "react";

type Value = {
  title: string;
  desc: string;
  icon: string;
};

// Map string icon names to actual icon components
const getIconComponent = (iconName: string) => {
  switch(iconName) {
    case 'Lightbulb':
      return Lightbulb;
    case 'Shield':
      return Shield;
    case 'Award':
      return Award;
    default:
      return Lightbulb; // default fallback
  }
};

export default function MissionValuesSection({ values }: { values: Value[] }) {
  return (
    <section className="bg-white text-black py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-12">
          Our Mission: Empowering Creativity
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v) => (
            <div key={v.title} className="bg-gray-50 p-8 rounded-xl space-y-4">
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-full">
                  {React.createElement(getIconComponent(v.icon), { className: "w-8 h-8 text-[#0A21C0]" })}
                </div>
              </div>
              <h3 className="text-xl font-bold">{v.title}</h3>
              <p className="text-gray-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
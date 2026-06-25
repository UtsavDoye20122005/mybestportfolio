export type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Alex Chen",
    role: "Engineering Manager",
    company: "Example Co.",
    quote:
      "Utsav ships with calm focus. The code reads clean, the UX is sharp, and the systems don’t flake under pressure.",
  },
  {
    name: "Priya Nair",
    role: "Product Lead",
    company: "Example Co.",
    quote:
      "Fast iterations, zero chaos. He asks the right questions early and lands the exact build we need—without the noise.",
  },
  {
    name: "Sam Rivera",
    role: "Founder",
    company: "Example Co.",
    quote:
      "Reliable, technically deep, and extremely practical. Every delivery felt like a real product milestone—not a demo.",
  },
];


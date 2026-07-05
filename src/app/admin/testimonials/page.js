import TestimonialList from "./testimonial-list";
import { getAdminTestimonials } from "@/lib/admin-queries";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAdminTestimonials();
  return <TestimonialList testimonials={testimonials} />;
}

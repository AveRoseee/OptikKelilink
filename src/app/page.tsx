import { Suspense } from "react";
import {
  FeaturedProducts,
  FeaturedProductsFallback,
} from "@/components/featured-products";
import { LandingPage } from "@/components/landing-page";

export default function Home() {
  return (
    <LandingPage
      featuredProducts={
        <Suspense fallback={<FeaturedProductsFallback />}>
          <FeaturedProducts />
        </Suspense>
      }
    />
  );
}

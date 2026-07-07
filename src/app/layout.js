import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/features/auth/context/auth-context";
import { CartProvider } from "@/features/cart/context/cart-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata = {
  title: "Sugandha - Premium Fragrances",
  description:
    "Discover your signature scent with Sugandha. Premium perfumes, attars, and car fragrances curated for those who appreciate the art of fine scent.",
  keywords: [
    "perfumes",
    "attars",
    "car perfumes",
    "fragrances",
    "premium scents",
    "Sugandha",
  ],
  icons: {
    icon: "/sugandha_logo.png",
    apple: "/sugandha_logo.png",
  },
  openGraph: {
    title: "Sugandha - Premium Fragrances",
    description:
      "Discover your signature scent with Sugandha. Premium perfumes, attars, and car fragrances.",
    type: "website",
    locale: "en_IN",
    siteName: "Sugandha",
    images: ["/sugandha_logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster
              richColors
              closeButton
              position="top-right"
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

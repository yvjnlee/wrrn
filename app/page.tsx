import Link from "next/link";
import Hero from "@/components/hero";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react"; // icons for social media
import Demo from "@/components/demo";

export default async function Index() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-8 px-4 pb-12">
        
        <Hero />

        <Demo />

        {/* Steps Section */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-secondary p-4">
            <CardHeader>
              <CardTitle>Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Begin by creating a profile to access all features and personalize your experience.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="">Learn More</Link>
            </CardFooter>
          </Card>

          <Card className="bg-secondary p-4">
            <CardHeader>
              <CardTitle>Explore</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Dive into WRRN's features and tools designed to optimize your journey.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="">Discover Features</Link>
            </CardFooter>
          </Card>

          <Card className="bg-secondary p-4">
            <CardHeader>
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Need help? Access support resources and connect with our community.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="">Get Support</Link>
            </CardFooter>
          </Card>
        </section>

        {/* Social Media Section */}
        <section className="mt-12 text-center">
          <h2 className="font-semibold text-2xl mb-4">Follow Us on Social Media</h2>
          <p className="text-muted-foreground mb-6">
            Stay connected and get the latest updates on WRRN
          </p>
          <div className="flex justify-center gap-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-8 w-8 text-pink-600 hover:text-pink-500" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter className="h-8 w-8 text-blue-500 hover:text-blue-400" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Youtube className="h-8 w-8 text-blue-700 hover:text-blue-600" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-8 w-8 text-blue-800 hover:text-blue-700" />
            </a>
          </div>
        </section>
        
      </main>
    </>
  );
}

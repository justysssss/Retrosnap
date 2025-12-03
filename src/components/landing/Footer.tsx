import Link from "next/link";
import { Instagram, Twitter, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-16 font-sans border-t-8 border-orange-500">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-3xl font-marker text-white hover:text-orange-500 transition-colors">
              RetroSnap
            </Link>
            <p className="mt-4 font-handwriting text-xl">
              Making the digital world feel a little more analog, one pixel at a time.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Explore</h4>
            <ul className="space-y-3">
              <li><Link href="/studio" className="hover:text-white transition-colors">Studio</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">Community Gallery</Link></li>
              <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Film Packs</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-white hover:text-stone-900 transition-all">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} RetroSnap Inc. Made with coffee and code.</p>
        </div>
      </div>
    </footer>
  );
}
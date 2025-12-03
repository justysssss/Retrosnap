import LoginPage from "@/components/LoginPage";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center paper-texture text-stone-800 p-8">
      <main className="max-w-3xl w-full flex flex-col items-center text-center space-y-12">
        {/* Hero Section */}
        <div className="space-y-6 relative">
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-yellow-200/50 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-orange-200/50 rounded-full blur-xl animate-pulse delay-700" />

          <h1 className="text-6xl md:text-8xl font-marker transform -rotate-2 text-stone-900 drop-shadow-sm">
            RetroSnap
          </h1>
          <p className="text-2xl md:text-3xl font-handwriting text-stone-600 max-w-lg mx-auto leading-relaxed">
            Capture moments, create memories, and share your story—one polaroid at a time.
          </p>
        </div>

        {/* Call to Action */}
        <div className="relative group">
          <div className="absolute inset-0 bg-stone-800 rounded-lg transform translate-x-1 translate-y-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
          <LoginPage />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full">
          {[
            { title: "Snap & Edit", desc: "Take photos or upload your own. Add filters and handwritten notes." },
            { title: "Pin Board", desc: "Organize your memories on a private corkboard with stickers." },
            { title: "Share", desc: "Post your favorites to the public wall for everyone to see." },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-white/50 backdrop-blur-sm border border-stone-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-bold mb-2 font-marker text-stone-700">{feature.title}</h3>
              <p className="text-stone-600 font-handwriting text-xl">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-24 text-stone-500 font-handwriting text-lg">
        <p>© {new Date().getFullYear()} RetroSnap. Made with nostalgia.</p>
      </footer>
    </div>
  );
}

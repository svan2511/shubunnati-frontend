import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            Subh Unnati Micro Finance
          </h1>

          <Link
            to="/login"
            className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-white">
            Empowering Financial Growth at the Grassroots
          </h2>

          <p className="mt-6 text-lg text-gray-300">
            Subh Unnati Micro Finance is committed to uplifting individuals,
            women entrepreneurs, and small businesses by providing accessible,
            transparent, and responsible financial solutions.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/login"
              className="rounded-md bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              Access Your Account
            </Link>

            <a
              href="#about"
              className="rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5"
            >
              Learn More
            </a>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 p-8 shadow-lg">
          <h3 className="text-xl font-semibold text-white">
            Our Core Focus
          </h3>

          <ul className="mt-6 space-y-4 text-gray-300">
            <li>• Micro-loans for rural and semi-urban communities</li>
            <li>• Financial inclusion for women-led households</li>
            <li>• Support for MSMEs and self-help groups</li>
            <li>• Ethical lending with transparent processes</li>
          </ul>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="bg-gray-800/50 py-16"
      >
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-3 gap-8">
          <div className="rounded-xl bg-white/5 p-6">
            <h4 className="text-lg font-semibold text-white">
              Our Mission
            </h4>
            <p className="mt-3 text-sm text-gray-300">
              To provide inclusive financial services that enable sustainable
              livelihoods and long-term economic growth.
            </p>
          </div>

          <div className="rounded-xl bg-white/5 p-6">
            <h4 className="text-lg font-semibold text-white">
              Our Vision
            </h4>
            <p className="mt-3 text-sm text-gray-300">
              To become a trusted microfinance institution driving social and
              financial empowerment across India.
            </p>
          </div>

          <div className="rounded-xl bg-white/5 p-6">
            <h4 className="text-lg font-semibold text-white">
              Our Values
            </h4>
            <p className="mt-3 text-sm text-gray-300">
              Integrity, transparency, customer dignity, and responsible
              growth form the foundation of everything we do.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Subh Unnati Micro Finance. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

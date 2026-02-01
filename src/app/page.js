import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold">Field Tracking</h1>
        <p className="mt-2 text-sm text-gray-600">
          Login to continue.
        </p>

        <Link
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-black px-4 py-2 text-white hover:opacity-90"
          href="/login"
        >
          Go to Login
        </Link>
      </div>
    </main>
  );
}

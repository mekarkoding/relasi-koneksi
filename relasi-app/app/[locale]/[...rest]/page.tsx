import { notFound } from "next/navigation";

/** Catch-all: renders the localized 404 page for unknown routes. */
export default function CatchAllPage() {
  notFound();
}

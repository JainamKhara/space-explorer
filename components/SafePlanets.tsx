"use client";

import { useEffect } from "react";
import ErrorBoundary from "./ErrorBoundary";
import Planets from "./Planets";

export default function SafePlanets(props: Parameters<typeof Planets>[0]) {
  useEffect(() => {
    console.log("🌍 SafePlanets mounted");
    return () => console.log("🌍 SafePlanets unmounted");
  }, []);

  return (
    <ErrorBoundary>
      <Planets {...props} />
    </ErrorBoundary>
  );
}

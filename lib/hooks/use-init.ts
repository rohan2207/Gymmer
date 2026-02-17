"use client";

import { useEffect, useState } from "react";
import { initializeApp } from "@/lib/db/seed";

export function useInit() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeApp().then(() => setReady(true));
  }, []);

  return ready;
}

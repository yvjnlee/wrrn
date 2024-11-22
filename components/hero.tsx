import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="mb-8 text-center">
      <h2 className="font-bold text-2xl mb-6">Welcome to WRRN</h2>
      <p className="text-lg text-muted-foreground mb-8">
        Your go-to platform for your personal finances.
      </p>
      <Button className="px-8 py-3">
        <Link href="/sign-in">Get Started</Link>
      </Button>
    </div>
  );
}

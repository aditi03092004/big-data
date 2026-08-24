import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { Layers3, ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export const LoginPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("admin@bigdata.hub");
  const [password, setPassword] = useState("password");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-md">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm mb-3">
            <Layers3 className="h-6 w-6 stroke-[2.4]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Big Data Analytics Hub</h1>
          <p className="mt-1 text-xs text-muted-foreground">Sign in to access e-commerce analytics & real-time telemetry</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Work Email</label>
            <Input
              icon={<Mail className="h-4 w-4" />}
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
            <Input
              icon={<Lock className="h-4 w-4" />}
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Sign In to Cockpit <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="rounded-lg bg-muted/60 p-3 text-center text-xs text-muted-foreground">
          <span className="font-mono font-bold text-foreground">DEMO MODE ACTIVE</span> · Pre-authenticated access
        </div>
      </div>
    </div>
  );
};

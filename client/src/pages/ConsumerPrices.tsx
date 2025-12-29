import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { useDrugs } from "@/hooks/use-drugs";
import { Search, Pill, Info, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ConsumerPrices() {
  const [query, setQuery] = useState("");
  const { data: drugs, isLoading } = useDrugs(query);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-10">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 pt-24 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-display font-extrabold text-foreground">Consumer Prices</h1>
          <p className="text-muted-foreground">Search and check medicine prices regulated by NPPA India</p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicine (e.g. Paracetamol, Insulin)..."
            className="pl-12 h-14 text-lg rounded-2xl shadow-lg border-primary/10"
          />
          {isLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-primary" />}
        </div>

        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {drugs?.map((drug) => (
              <motion.div
                key={drug.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="hover-elevate">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Pill className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{drug.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {drug.dosageForm} • {drug.strength}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Ceiling Price</p>
                      <p className="text-2xl font-display font-black text-primary">₹{drug.ceilingPrice.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {query && !isLoading && drugs?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Info className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No results found for "{query}"</p>
              <p className="text-sm">Try searching with the generic name</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

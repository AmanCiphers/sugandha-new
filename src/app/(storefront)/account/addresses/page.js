import { redirect } from "next/navigation";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { getAddressesByUserId } from "@/lib/queries";

export default async function AddressesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const addresses = await getAddressesByUserId(user.id);

  if (addresses.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <MapPin className="mx-auto h-16 w-16 text-muted-foreground/30" />
        <h1 className="mt-6 font-serif text-2xl font-bold text-foreground">No Addresses Saved</h1>
        <p className="mt-2 text-muted-foreground">Add an address for faster checkout.</p>
        <Button className="mt-8 rounded-full bg-foreground text-background hover:bg-foreground/90">
          <Plus className="mr-2 h-4 w-4" /> Add Address
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">My Addresses</h1>
        <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90">
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((address) => (
          <div key={address.id} className="rounded-lg border border-border/40 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">{address.label}</h3>
                {address.is_default && (
                  <Badge variant="secondary" className="text-[10px]">Default</Badge>
                )}
              </div>
              <div className="flex gap-2">
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button className="text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
              <p>{address.city}, {address.state} {address.pincode}</p>
              <p className="mt-1">{address.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

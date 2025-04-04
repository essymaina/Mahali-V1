import { WorkspaceFilter } from "../components/workspace-filter"
import { Button } from "../components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Find Your Perfect Workspace in Nairobi
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Book a table, co-working space, meeting rooms, and more.
              </p>
            </div>
            <div className="w-full max-w-3xl">
              <WorkspaceFilter />
            </div>
            <div className="mt-8"></div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl mb-8">Featured Workspaces</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Workspace cards */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <div className="p-4">
                  <h3 className="font-semibold">Workspace Name {i}</h3>
                  <p className="text-sm text-muted-foreground">Location • Category</p>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="font-medium">KSh 2,500/day</p>
                    <Button size="sm">Book Now</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
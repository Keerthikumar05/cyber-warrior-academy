import { createFileRoute, notFound } from "@tanstack/react-router";
import { MissionShell } from "@/components/mission/MissionShell";
import { getMission, getWorld } from "@/lib/missions";

export const Route = createFileRoute("/play/$world/$mission")({
  head: ({ params }) => {
    const m = getMission(params.world, params.mission);
    const w = getWorld(params.world);
    const title = m ? `${m.title} — ${w?.name ?? "Code Quest"}` : "Mission — Code Quest";
    const desc = m?.subtitle ?? "Play a Code Quest mission and learn by doing.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="panel p-8 text-center">
        <h1 className="font-display text-2xl neon-purple">Mission not found</h1>
        <p className="text-sm text-muted-foreground mt-2">That mission doesn't exist yet.</p>
        <a href="/" className="btn-hero inline-flex mt-4">Return to map</a>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="panel p-8 text-center">
        <h1 className="font-display text-xl neon-purple">Mission interrupted</h1>
        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        <a href="/" className="btn-hero inline-flex mt-4">Return to map</a>
      </div>
    </div>
  ),
  component: PlayMission,
});

function PlayMission() {
  const params = Route.useParams();
  const mission = getMission(params.world, params.mission);
  if (!mission) throw notFound();
  return <MissionShell mission={mission} />;
}

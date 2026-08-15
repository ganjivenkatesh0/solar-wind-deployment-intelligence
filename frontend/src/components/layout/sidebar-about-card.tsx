import illustration from "@/assets/renewable-illustration.jpg";

type SidebarAboutCardProps = {
  title?: string;
  description?: string;
};

/** Reusable promotional / about card pinned to the bottom of the sidebar. */
export function SidebarAboutCard({
  title = "About Platform",
  description = "AI-powered platform to analyze and identify the best locations for solar, wind, and hybrid energy projects.",
}: SidebarAboutCardProps) {
  return (
    <div className="surface-card overflow-hidden p-4">
      <p className="text-card-title">{title}</p>
      <p className="text-helper mt-1.5 leading-5">{description}</p>
      <img
        src={illustration}
        alt="Solar panels and wind turbines on a green landscape"
        loading="lazy"
        width={640}
        height={560}
        className="mt-3 w-full rounded-lg object-cover"
      />
    </div>
  );
}

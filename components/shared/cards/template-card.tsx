import Image, { StaticImageData } from "next/image";
import Link from "next/link";

type TemplateCardProps = {
  slug: string;
  title: string;
  image: StaticImageData;
  github?: string;
  demo?: string;
  detail?: boolean;
};

const TemplateCard = ({
  slug,
  title,
  demo,
  image,
  github,
  detail,
}: TemplateCardProps) => {
  const hasDetailPage = Boolean(detail);
  const externalHref = demo ?? github;
  const href = hasDetailPage ? `/project/${slug}` : externalHref;
  const ariaLabel = hasDetailPage
    ? `Read more about ${title}`
    : externalHref
      ? `Visit ${title} ${demo ? "demo" : "repository"}`
      : title;

  if (!href) {
    return (
      <div className="group/card w-full space-y-1.5 select-none">
        <div className="bg-muted overflow-hidden rounded-[2px]">
          <Image
            src={image}
            alt={`Thumbnail for ${title}`}
            width={800}
            height={450}
            placeholder="blur"
            quality={85}
            className="anim object-cover"
            style={{
              aspectRatio: "16/9",
              objectFit: "cover",
            }}
          />
        </div>
        <h3 className="text-foreground line-clamp-1 text-base font-semibold">
          {title}
        </h3>
      </div>
    );
  }

  return (
    <Link
      href={href}
      scroll={false}
      target={hasDetailPage ? undefined : "_blank"}
      rel={hasDetailPage ? undefined : "noopener noreferrer"}
      aria-label={ariaLabel}
      className="group/card w-full space-y-1.5"
      prefetch={hasDetailPage ? true : false}
    >
      <div className="bg-muted overflow-hidden rounded-[2px]">
        <Image
          src={image}
          alt={`Thumbnail for ${title}`}
          width={800}
          height={450}
          placeholder="blur"
          quality={85}
          className="anim object-cover group-hover/card:scale-105"
          style={{
            aspectRatio: "16/9",
            objectFit: "cover",
          }}
        />
      </div>
      <h3 className="text-foreground line-clamp-1 text-base font-semibold">
        {title}
      </h3>
    </Link>
  );
};

export default TemplateCard;

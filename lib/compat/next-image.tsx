import * as React from "react";

export type StaticImageData = {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
};

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height"> {
  src: string | StaticImageData | any;
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  quality?: number | string;
  priority?: boolean;
  loading?: "eager" | "lazy";
  unoptimized?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      fill = false,
      quality,
      priority = false,
      loading,
      unoptimized,
      placeholder,
      blurDataURL,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    let resolvedSrc = "";
    let naturalWidth: number | string | undefined = width;
    let naturalHeight: number | string | undefined = height;

    if (typeof src === "string") {
      resolvedSrc = src;
    } else if (src && typeof src === "object") {
      resolvedSrc = src.src || "";
      if (!naturalWidth && src.width) naturalWidth = src.width;
      if (!naturalHeight && src.height) naturalHeight = src.height;
    }

    const computedStyle: React.CSSProperties = fill
      ? {
          position: "absolute",
          height: "100%",
          width: "100%",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          ...style,
        }
      : { ...style };

    return (
      <img
        ref={ref}
        src={resolvedSrc}
        alt={alt ?? ""}
        width={fill ? undefined : naturalWidth}
        height={fill ? undefined : naturalHeight}
        loading={priority ? "eager" : (loading ?? "lazy")}
        className={className}
        style={computedStyle}
        {...props}
      />
    );
  },
);

Image.displayName = "Image";
export default Image;

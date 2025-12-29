/* eslint-disable jsx-a11y/alt-text */


import Image, { ImageProps } from "next/image";

export function ImageComponent(props: ImageProps) {
  const isProd = process.env.NODE_ENV === "production";

  return <Image {...props} unoptimized={!isProd} />;
}
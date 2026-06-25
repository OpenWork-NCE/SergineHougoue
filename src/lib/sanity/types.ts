import type { PortableTextBlock } from "@portabletext/types";

export type SanitySlug = {
  _type?: "slug";
  current: string;
};

export type SanityImageCrop = {
  _type?: "sanity.imageCrop";
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type SanityImageHotspot = {
  _type?: "sanity.imageHotspot";
  x: number;
  y: number;
  height: number;
  width: number;
};

export type SanityImage = {
  _type?: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
  crop?: SanityImageCrop;
  hotspot?: SanityImageHotspot;
};

export type SeoFields = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
};

export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  linkedin?: string;
};

export type PropertyStatus = "a-vendre" | "vendu" | "en-primeur";

export type PropertyType =
  | "unifamiliale"
  | "plex"
  | "condo"
  | "duplex"
  | "triplex"
  | "quadruplex"
  | "quintuplex"
  | "commercial";

export type Property = {
  _id: string;
  _type: "property";
  language?: string;
  title: string;
  slug: SanitySlug;
  status: PropertyStatus;
  price: number;
  address: string;
  city: string;
  neighborhood?: string;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description?: PortableTextBlock[];
  features?: string[];
  photos?: SanityImage[];
  publishedAt: string;
  featured?: boolean;
};

export type PostCategory =
  | "acheter"
  | "vendre"
  | "investir"
  | "mode-de-vie"
  | "marche";

export type PostAuthor = Pick<TeamMember, "_id" | "name" | "photo">;

export type Post = {
  _id: string;
  _type: "post";
  language?: string;
  title: string;
  slug: SanitySlug;
  excerpt: string;
  coverImage: SanityImage;
  body?: PortableTextBlock[];
  category: PostCategory;
  author: PostAuthor;
  publishedAt: string;
  seo?: SeoFields;
};

export type TeamMember = {
  _id: string;
  _type: "teamMember";
  language?: string;
  name: string;
  role: string;
  photo: SanityImage;
  bio?: PortableTextBlock[];
  order: number;
};

export type Testimonial = {
  _id: string;
  _type: "testimonial";
  language?: string;
  quote: string;
  authorName: string;
  authorContext: string;
  photo?: SanityImage;
  rating: number;
  order: number;
};

export type PartnerCategory = "preteur" | "notaire" | "inspecteur" | "autre";

export type Partner = {
  _id: string;
  _type: "partner";
  language?: string;
  name: string;
  logo: SanityImage;
  url: string;
  category: PartnerCategory;
  order: number;
};

export type SiteSettings = {
  _id: string;
  _type: "siteSettings";
  brandName: string;
  tagline?: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  hoursOfOperation?: string;
  socialLinks?: SocialLinks;
  defaultSEO?: SeoFields;
  cookieConsentCopy?: string;
};

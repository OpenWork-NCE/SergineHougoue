import { SITE_SETTINGS_DOCUMENT_ID } from "./structure";

/** Matches @sanity/document-internationalization default `languageField`. */
export const DOCUMENT_I18N_LANGUAGE_FIELD = "language";

const siteSettingsProjection = `{
  _id,
  _type,
  brandName,
  tagline,
  contactEmail,
  contactPhone,
  whatsappNumber,
  hoursOfOperation,
  socialLinks,
  defaultSEO,
  cookieConsentCopy
}`;

const propertyCardProjection = `{
  _id,
  _type,
  language,
  title,
  slug,
  status,
  price,
  address,
  city,
  neighborhood,
  type,
  bedrooms,
  bathrooms,
  area,
  photos,
  publishedAt,
  featured
}`;

const propertyDetailProjection = `{
  _id,
  _type,
  language,
  title,
  slug,
  status,
  price,
  address,
  city,
  neighborhood,
  type,
  bedrooms,
  bathrooms,
  area,
  description,
  features,
  photos,
  publishedAt,
  featured
}`;

const testimonialProjection = `{
  _id,
  _type,
  language,
  quote,
  authorName,
  authorContext,
  photo,
  rating,
  order
}`;

const teamMemberProjection = `{
  _id,
  _type,
  language,
  name,
  role,
  photo,
  bio,
  order
}`;

const partnerProjection = `{
  _id,
  _type,
  language,
  name,
  logo,
  url,
  category,
  order
}`;

const postCardProjection = `{
  _id,
  _type,
  language,
  title,
  slug,
  excerpt,
  coverImage,
  category,
  author->{
    _id,
    name,
    photo
  },
  publishedAt
}`;

const postDetailProjection = `{
  _id,
  _type,
  language,
  title,
  slug,
  excerpt,
  coverImage,
  body,
  category,
  author->{
    _id,
    name,
    photo
  },
  publishedAt,
  seo
}`;

export const siteSettingsQuery = `*[_type == "siteSettings" && _id == "${SITE_SETTINGS_DOCUMENT_ID}"][0]${siteSettingsProjection}`;

export const featuredPropertiesQuery = `*[_type == "property" && ${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang && featured == true] | order(publishedAt desc) ${propertyCardProjection}`;

export const allPropertiesQuery = `*[_type == "property" && ${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang && status != "vendu"] | order(publishedAt desc) ${propertyCardProjection}`;

export const propertyBySlugQuery = `*[_type == "property" && ${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang && slug.current == $slug][0]${propertyDetailProjection}`;

export const testimonialsQuery = `*[_type == "testimonial" && ${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang] | order(order asc) ${testimonialProjection}`;

export const teamMembersQuery = `*[_type == "teamMember" && ${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang] | order(order asc) ${teamMemberProjection}`;

export const soldPropertiesQuery = `*[_type == "property" && ${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang && status == "vendu"] | order(publishedAt desc) ${propertyCardProjection}`;

export const partnersQuery = `*[_type == "partner" && ${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang] | order(order asc) ${partnerProjection}`;

export const postsQuery = `*[_type == "post" && ${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang] | order(publishedAt desc) [$start...$end]${postCardProjection}`;

export const postsCountQuery = `count(*[_type == "post" && ${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang])`;

export const postBySlugQuery = `*[_type == "post" && ${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang && slug.current == $slug][0]${postDetailProjection}`;

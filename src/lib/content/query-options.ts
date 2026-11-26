import { queryOptions } from "@tanstack/react-query";

import {
  getSiteSettings,
  listAbout,
  listFaqs,
  listGallery,
  listJobOpenings,
  listJobPerks,
  listPosts,
  listProjects,
  listServices,
  listTestimonials,
} from "./queries";

const FIVE_MINUTES = 5 * 60_000;

export const siteSettingsQuery = () =>
  queryOptions({
    queryKey: ["content", "settings"],
    queryFn: () => getSiteSettings(),
    staleTime: FIVE_MINUTES,
  });

export const servicesQuery = () =>
  queryOptions({ queryKey: ["content", "services"], queryFn: () => listServices(), staleTime: FIVE_MINUTES });

export const projectsQuery = () =>
  queryOptions({ queryKey: ["content", "projects"], queryFn: () => listProjects(), staleTime: FIVE_MINUTES });

export const galleryQuery = () =>
  queryOptions({ queryKey: ["content", "gallery"], queryFn: () => listGallery(), staleTime: FIVE_MINUTES });

export const postsQuery = () =>
  queryOptions({ queryKey: ["content", "posts"], queryFn: () => listPosts(), staleTime: FIVE_MINUTES });

export const testimonialsQuery = () =>
  queryOptions({
    queryKey: ["content", "testimonials"],
    queryFn: () => listTestimonials(),
    staleTime: FIVE_MINUTES,
  });

export const faqsQuery = () =>
  queryOptions({ queryKey: ["content", "faqs"], queryFn: () => listFaqs(), staleTime: FIVE_MINUTES });

export const jobPerksQuery = () =>
  queryOptions({ queryKey: ["content", "job-perks"], queryFn: () => listJobPerks(), staleTime: FIVE_MINUTES });

export const jobOpeningsQuery = () =>
  queryOptions({
    queryKey: ["content", "job-openings"],
    queryFn: () => listJobOpenings(),
    staleTime: FIVE_MINUTES,
  });

export const aboutQuery = () =>
  queryOptions({ queryKey: ["content", "about"], queryFn: () => listAbout(), staleTime: FIVE_MINUTES });

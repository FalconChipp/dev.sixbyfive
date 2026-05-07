---
id: sys-site
title: dev.sixbyfive marketing site
type: system
created: '2026-05-07T23:08:10.569Z'
updated: '2026-05-08T00:00:00.000Z'
plans:
  - plan-intent-docs-page
decisions:
  - DEC-0001
  - DEC-0002
  - DEC-0003
tags:
  - next-js
  - marketing
---

## Overview

The dev.sixbyfive studio site. A Next.js App Router application deployed on Vercel. Covers work case studies, services, open source projects, and internal tooling documentation.

## Boundaries

- All pages under `app/` — marketing, work case studies, tools
- Shared components in `app/components/` — `CaseStudy`, `Header`, `Footer`, `ProofStrip`, etc.
- CSS design system in `app/globals.css` — tokens, layout classes, typography
- No CMS — all content is authored directly in page files

## Key Decisions

- CaseStudy component is the standard for retrospective work pages; custom page components are used when a page needs a content model CaseStudy can't express (see DEC-0001)
- Work items live under `/work/*` regardless of type (product, open source, SaaS)
- No new global CSS for individual pages — inline styles via the token system only (see CON-0002)

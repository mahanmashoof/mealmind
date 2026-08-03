# MealMind — Pre-Deploy Backlog

Things to polish before deploying MealMind for real-world / public use. Grouped roughly by area. Nothing here is urgent for personal local use — this is the "make it presentable to the world" pass.

## Frontend — Missing UI (backend already supports these)

- [ ] Recipe create form only captures `name` — add inputs for ingredients (dynamic list), steps (dynamic list), nutrition, portions
- [ ] No image upload UI on the recipe form (endpoint exists from Ch6, no frontend for it yet)
- [ ] No recipe edit UI (PUT endpoint exists, no form)
- [ ] No recipe delete UI (button + confirmation)
- [ ] No weekly plan creation UI — currently only viewing/assigning exists on `/plan`, plan itself must be created via Swagger
- [ ] No way to remove a meal plan entry from the UI (DELETE endpoint exists)
- [ ] No reminders UI (Ch16 backend exists, nothing in frontend yet)
- [ ] `/plan` hardcodes `plans[0]` — no week switcher/selector once multiple weeks exist

## Frontend — Navigation & Structure

- [ ] No shared navigation/header across pages (currently each page is an island)
- [ ] No logout button visible anywhere
- [ ] No "logged in as X" indicator
- [ ] No landing/empty states beyond basic "No weekly plan yet."

## Frontend — Robustness

- [ ] `apiFetch` throws a generic `Error` on any non-OK response — no user-facing error messages/toasts anywhere yet
- [ ] No loading skeletons on Server Component pages (only the AI generate button has a loading state)
- [ ] No handling for expired JWT (currently: silent 401, no redirect to `/login`)
- [ ] Form validation is minimal — relies entirely on backend's `[Required]`/`[Range]` attributes surfacing as raw 400s

## Frontend — Design & Styling

- [ ] Currently using default/plain Tailwind utility styling (gray backgrounds, basic shadows) — no real visual identity yet
- [ ] No consistent color palette, typography choices, or spacing scale defined
- [ ] No icons anywhere (meal slots, nav, buttons are all plain text)
- [ ] Recipe cards and day cards could use more visual hierarchy (currently just name + one line of metadata)
- [ ] No dark mode
- [ ] No transitions/animations (slot assignment, AI generation loading, etc. are instant/abrupt)

## Backend — Deploy Prep

- [ ] Update CORS policy (`AllowFrontend`) to include real Vercel domain, not just `localhost:3000`
- [ ] Confirm all secrets (`Jwt__Key`, `OpenAI__ApiKey`) are set as env vars on the hosting platform, not committed anywhere
- [ ] Bump outdated NuGet packages flagged by `dotnet list package --outdated` (NU1903 warnings seen earlier)
- [ ] Decide on image storage for production — `wwwroot/uploads` works locally/single-container, but won't persist across redeploys on most PaaS hosts (Render/Fly/Railway) unless a persistent volume is configured; may need cloud storage (S3/Azure Blob) eventually

## Deferred from curriculum

- [ ] Chapter 17 (Repository + CQRS/MediatR) — deliberately deferred, revisit once this backlog creates real repeated-pattern pain

## Deploy checklist (Render + Vercel, when ready)

- [ ] Push `MealMind.Api` and `MealMind.Web` to GitHub
- [ ] Render: deploy `MealMind.Api` from Dockerfile, set env vars
- [ ] Vercel: import `MealMind.Web`, set `NEXT_PUBLIC_API_URL` to Render's public URL
- [ ] Update API CORS to allow the real Vercel domain
- [ ] Smoke-test register/login/create-recipe/assign-to-plan end-to-end on the deployed URLs

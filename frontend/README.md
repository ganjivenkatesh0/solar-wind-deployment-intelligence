# Solar Intelligence Hub

TASK 1 — BUILD THE GLOBAL SOLAR & WIND APPLICATION SHELL AND DESIGN SYSTEM

I am building a professional AI-powered renewable energy platform called:

"Solar & Wind Deployment Intelligence"

I have provided 11 UI/UX screenshots that represent the FINAL visual design of the application.

IMPORTANT:

The screenshots are the visual source of truth.

Do NOT redesign them.

Do NOT create your own modern interpretation.

Do NOT change the color palette.

Do NOT simplify the layout.

Do NOT invent a different navigation system.

The final application must closely reproduce the visual language shown in the screenshots:

- layout

- spacing

- typography

- colors

- borders

- shadows

- corner radius

- icons

- button styling

- card styling

- navigation states

- header

- sidebar

- responsive behavior

For this task ONLY, build the reusable GLOBAL APPLICATION SHELL and DESIGN SYSTEM.

Do NOT implement the individual dashboard/analysis/history/compare/map/report/settings/about pages yet.

==================================================

1. GLOBAL APPLICATION STRUCTURE

==================================================

Create the reusable application layout:

--------------------------------------------------

| Sidebar                  | Top Header          |

|                          |                     |

| Logo                     | Menu / controls     |

| Dashboard                | Theme               |

| New Analysis             | Notifications      |

| Analysis History         | User profile       |

| Compare Sites            |                     |

| Map Explorer             |---------------------|

| Reports                  |                     |

| Settings                 | Main page content  |

| About Platform           |                     |

|                          |                     |

--------------------------------------------------

The sidebar is fixed on the left on desktop.

The top header occupies the top of the main content area.

The page content should be scrollable independently.

The shell must work across all future screens.

==================================================

2. SIDEBAR

==================================================

Reproduce the sidebar from the supplied screenshots.

Brand:

Solar & Wind

Deployment Intelligence

Use the same visual hierarchy as the screenshots.

Sidebar navigation items:

1. Dashboard

2. New Analysis

3. Analysis History

4. Compare Sites

5. Map Explorer

6. Reports

7. Settings

8. About Platform

Each item must contain an appropriate outline icon.

The active navigation item must use the light green background and green text/icon treatment shown in the screenshots.

Inactive navigation items should use the dark navy text/icon treatment shown in the screenshots.

Sidebar requirements:

- white background

- subtle right border

- rounded active navigation state

- generous vertical spacing

- consistent icon sizing

- consistent text alignment

- professional enterprise dashboard appearance

- exact visual proportions based on the supplied screenshots

At the bottom of the sidebar, create the reusable promotional/about card shown throughout the screenshots.

The card contains:

- small title

- short platform description

- renewable energy illustration

- rounded border/card styling

Do not invent a completely different card.

==================================================

3. TOP HEADER

==================================================

Create the reusable top header shown in the screenshots.

Left side:

- hamburger/menu button

Right side:

- theme/light-dark control

- notification bell

- notification count badge

- user avatar

- "Ganji Venkatesh"

- "AI Engineer"

- dropdown chevron

Use the same spacing and alignment as the screenshots.

The header should have:

- white background

- subtle bottom border

- clean professional appearance

- correct vertical alignment

==================================================

4. MAIN CONTENT CONTAINER

==================================================

Create a reusable page container.

Future pages must be able to use:

- page title

- page subtitle

- breadcrumb

- action buttons

- cards

- sections

- grids

- tables

- charts

Use the same content width, padding, spacing and alignment shown in the screenshots.

The application should feel spacious rather than cramped.

==================================================

5. DESIGN SYSTEM

==================================================

Create reusable design tokens/components for the entire application.

Primary visual identity:

- deep navy/dark blue text

- white backgrounds

- very light gray/blue page background

- renewable green as the primary action color

- solar yellow/orange

- wind blue

- hybrid/secondary purple

- warning orange

- error red

The green used for primary actions and active states must visually match the screenshots.

Create consistent tokens for:

- page background

- card background

- primary green

- dark navy text

- secondary text

- border

- muted background

- success

- warning

- error

- solar

- wind

- purple/hybrid

Do not use random colors on different components.

==================================================

6. TYPOGRAPHY

==================================================

Use a clean modern sans-serif typeface.

Create a consistent hierarchy for:

- page titles

- page subtitles

- section titles

- card titles

- body text

- labels

- helper text

- badges

- navigation text

The hierarchy should visually match the screenshots.

Avoid oversized marketing-style headings.

This is a professional enterprise analytics platform.

==================================================

7. REUSABLE UI COMPONENTS

==================================================

Create reusable components/styles for:

- Card

- Button

- Secondary Button

- Outline Button

- Input

- Select

- Toggle

- Badge

- Status Badge

- Tabs

- Breadcrumb

- Page Header

- Section Header

- Tooltip

- Progress indicator

- Modal/Dialog

- Empty State

- Loading State

- Error State

Primary buttons should use the platform green.

Buttons should have the same rounded appearance, spacing and visual weight as the screenshots.

==================================================

8. ICON SYSTEM

==================================================

Use one consistent icon library/style.

Do not mix random icon styles.

Icons should visually resemble the outline icons in the screenshots.

Use icons consistently for:

- navigation

- solar

- wind

- location

- infrastructure

- feasibility

- financial

- environmental

- AI

- settings

- reports

- notifications

- user

- maps

==================================================

9. CARDS

==================================================

Create the reusable card appearance visible throughout the screenshots:

- white background

- subtle border

- soft shadow where appropriate

- rounded corners

- consistent internal padding

- clear title hierarchy

Cards must not become excessively rounded or heavily shadowed.

The screenshots use a clean enterprise dashboard aesthetic.

==================================================

10. RESPONSIVE BEHAVIOR

==================================================

The desktop design shown in the screenshots is the primary target.

Also make the shell responsive.

Desktop:

- full sidebar

- full topbar

- multi-column content

Tablet:

- reduce spacing

- adapt grids

Mobile:

- collapsible sidebar

- responsive header

- single-column content

- cards stack vertically

Do not change the desktop design simply to make responsive behavior easier.

==================================================

11. IMPORTANT EXISTING PROJECT CONSTRAINT

==================================================

This visual work will eventually be integrated into an existing React + Vite application with an existing FastAPI backend.

Do NOT design or implement any backend.

Do NOT create mock backend services.

Do NOT invent API endpoints.

Do NOT replace business logic.

Do NOT remove Leaflet support.

Do NOT remove existing API integration.

Do NOT create fake analysis results.

The existing backend is the source of truth for application data.

For this task, concentrate ONLY on reusable frontend layout/design components.

==================================================

12. ROUTING PREPARATION

==================================================

Prepare the shell so these future routes/pages can be added cleanly:

/dashboard

/new-analysis

/analysis-history

/compare-sites

/map-explorer

/reports

/reports/:id

/settings

/about

The New Analysis workflow will later contain:

/new-analysis/site-details

/new-analysis/project-parameters

/new-analysis/preferences

/new-analysis/review

Do not implement those pages yet.

==================================================

13. FINAL REQUIREMENT

==================================================

The result should look like the same product shown in the supplied screenshots.

Think:

"Solar & Wind Deployment Intelligence"

NOT:

"generic AI dashboard"

NOT:

"generic SaaS template"

NOT:

"generic renewable energy website"

The screenshots define the design language.

Build the reusable foundation first.

Do not implement the 11 individual screens in this task.

After completing the shell and design system, clearly list:

1. files/components created

2. files/components modified

3. design tokens created

4. reusable components created

5. any dependencies added

Do not modify backend files.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/19e365d4-f1e3-43de-ac56-30299b855053).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

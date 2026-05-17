# Specification: Fix Language Switcher — Dropdown Overlap & Non-Functional Switching

**Feature**: fix-lang-switcher  
**Directory**: specs/001-fix-lang-switcher  
**Created**: 2026-05-16  
**Status**: Draft

---

## Summary

The documentation site navigation bar includes a language-switching control that allows users to toggle between Chinese (中文) and English. Two defects make this control unusable:

1. **Dropdown overlaps other content** — when the dropdown opens, it partially or fully obscures readable text elsewhere on the page (feedback links, sidebar headings), degrading readability and creating visual confusion.
2. **Language switching is non-functional** — selecting a language option does not navigate the user to the corresponding language version of the current page; the page language remains unchanged after clicking.

Both defects must be resolved together for the language switcher to serve its purpose.

---

## Problem Statement

### Who is affected
All visitors to the documentation site who need to read content in a different language than the one currently displayed.

### Current behaviour (broken state)
- Opening the language selector dropdown causes it to render on top of unrelated page text, making that text unreadable while the dropdown is open.
- Clicking "中文" or "English" in the dropdown has no visible effect; the page stays in its current language.

### Expected behaviour
- The dropdown, when open, is visually self-contained and does not obscure any other readable page content beyond its own anchor button.
- Clicking a language option immediately navigates the user to the same page in the chosen language.

---

## User Scenarios & Testing

### Scenario 1 — Successful language switch from English to Chinese
**Given** a user is reading any page of the documentation in English  
**When** they click the language switcher button and select "中文"  
**Then** the page reloads in Chinese at the equivalent URL, and the language switcher button now shows "中文" as the active selection.

### Scenario 2 — Successful language switch from Chinese to English
**Given** a user is reading any page of the documentation in Chinese  
**When** they click the language switcher button and select "English"  
**Then** the page reloads in English at the equivalent URL, and the language switcher button now shows "English" as the active selection.

### Scenario 3 — Selecting the already-active language is a no-op
**Given** a user is already reading the page in Chinese  
**When** they open the dropdown and click "中文" again  
**Then** the dropdown closes and the page does not reload or navigate.

### Scenario 4 — Dropdown does not block page content
**Given** a user is on any documentation page  
**When** they open the language-switcher dropdown  
**Then** all other visible page text (navigation links, sidebar entries, body content, feedback links) remains fully readable — no text is hidden behind or obscured by the dropdown.

### Scenario 5 — Dropdown closes when dismissed
**Given** the language-switcher dropdown is open  
**When** the user clicks anywhere outside the dropdown, presses Escape, or scrolls the page  
**Then** the dropdown closes without any navigation occurring.

### Scenario 6 — Language preference persists across page loads
**Given** a user switches to English  
**When** they navigate to a different section of the documentation  
**Then** the site continues to show English content (the preference is remembered for the session/browser).

---

## Functional Requirements

### FR-1 — Non-overlapping dropdown rendering
The dropdown panel, when open, must render above all other page elements in the visual stacking order without any other readable text elements showing through or behind it.

### FR-2 — Correct language navigation on selection
Clicking a language option must navigate the user to the URL corresponding to the same page in the selected language. The navigation must complete (page changes language) within a normal page-load time.

### FR-3 — Active locale displayed on button
The language switcher button must display the currently active language at all times, updating to reflect the new selection after a switch completes.

### FR-4 — No-op on re-selection of active language
If the user selects the language already in use, no navigation or reload occurs; the dropdown simply closes.

### FR-5 — Dropdown closes on outside interaction
The dropdown must close when: (a) the user clicks or taps outside it, (b) the user presses the Escape key, or (c) the user scrolls the page.

### FR-6 — Language preference persisted
After a user switches language, subsequent page navigations within the same session must default to that language.

---

## Success Criteria

| # | Criterion | Measurement |
|---|-----------|-------------|
| SC-1 | Language switch completes successfully | Clicking a language option navigates to the correct language page 100% of the time in manual testing across at least 5 representative pages |
| SC-2 | No content obscured by dropdown | Zero instances of other page text rendered behind or through the open dropdown, verified visually in both light and dark colour schemes |
| SC-3 | Dropdown dismissed correctly | All three dismissal triggers (outside click, Escape, scroll) close the dropdown without side effects in all tested scenarios |
| SC-4 | Active language always correct | The button label reflects the actual page language immediately after every switch, with no stale state |
| SC-5 | Language preference survives navigation | After switching language, navigating to 3+ other pages confirms each loads in the chosen language without re-selecting |

---

## Scope

### In scope
- Fixing the visual stacking/overlap behaviour of the language-switcher dropdown
- Fixing the language-switching navigation so it correctly loads the target-language page
- Dismissal behaviour (outside click, Escape, scroll)
- Active-language display on the button
- Language preference persistence within the session

### Out of scope
- Redesigning the visual appearance of the language switcher (button shape, colours, typography)
- Adding additional languages beyond Chinese and English
- Translating any page content
- SEO or canonical URL changes

---

## Assumptions

- The site has a defined URL convention where language variants of the same page are accessible at different URL prefixes (e.g., `/zh/...` and `/en/...`).
- A valid target-language page exists for every page where the switcher is visible; if one does not exist, graceful fallback to the target-language home page is acceptable.
- The language preference persistence mechanism (cookie, local storage, or similar) already exists in the codebase and only needs to be correctly invoked, not built from scratch.
- The defect originates in the client-side rendering of the dropdown component, not in server-side routing logic.

---

## Dependencies

- The existing language routing infrastructure must correctly serve pages at both language prefixes.
- No third-party i18n library changes are required; the fix is contained to the dropdown component implementation.

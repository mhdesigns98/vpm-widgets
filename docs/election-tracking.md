# Election module tracking (GTM + GA4)

Tracking for the Nov. 3, 2026 Virginia general election modules on vpm.org. The widgets only carry
`data-module` / `data-module-position` attributes. All tracking is set up in GTM. Nothing in the
widget code sends events.

**Deadline:** set up and QA signed off by **Nov. 2, 2026**.

## Modules

| `data-module` | Widget | Where | Links (`data-module-position`) |
|---|---|---|---|
| `promo-small` | `widgets/elections-2026-strip` | homepage under the menu bar, article promo module | 1: Explore our coverage |
| `promo-large` | `widgets/elections-2026-cta` | /elections, article pages | 1: Explore our coverage |
| `results` | `widgets/ap-election-results` | homepage rail, /elections | 1: More election coverage, 2: How AP counts the vote |

The wrapper carries `data-module` only. Each link carries `data-module` and `data-module-position`.
The homepage and /elections share `results`; use GA4's `page_location` to split them. The AP results
iframe is cross-origin and isn't tracked. No UTMs on internal links.

## Checklist

### 0. Before testing
- [ ] Re-paste all three blocks into WordPress (strip, CTA, results) from `main`, so the live pages carry the attributes. A page still running an older paste has no attributes, and its modules won't report.

### 1. Variables
Auto-Event Variable > **Element Attribute** only. These attributes are in the DOM, not the data layer, so Data Layer variables would be empty.
- [ ] `AEV - module`: Auto-Event Variable, Element Attribute, attribute name `data-module`
- [ ] `AEV - position`: Auto-Event Variable, Element Attribute, attribute name `data-module-position`

### 2. View: `module_view`
- [ ] Trigger, **Element Visibility**
  - Selection method: CSS Selector `[data-module]:not([data-module-position])`. That matches wrappers only. Links carry `data-module` too, so a bare `[data-module]` would fire a view for every link. Only links have a position.
  - When to fire: **Once per element**
  - Minimum percent visible: **50%**
  - Set minimum on-screen duration: **1000 ms**
  - Observe DOM changes: **on** (the results block can be injected after page load)
- [ ] Tag, GA4 Event `module_view`, parameter `module` = `{{AEV - module}}`, fired by that trigger

### 3. Click: `module_click`
- [ ] Trigger, **Click – Just Links**, fires on Some Link Clicks: `Click Element` matches CSS selector `a[data-module]`
- [ ] Tag, GA4 Event `module_click`, parameters `module` = `{{AEV - module}}` and `position` = `{{AEV - position}}`, fired by that trigger

### 4. GA4
- [ ] Register `module` and `position` as **event-scoped custom dimensions** (Admin > Custom definitions) **before Nov. 2**. Events sent before a dimension exists aren't backfilled.

### 5. QA (GTM Preview + GA4 DebugView), sign off by Nov. 2
Test on the homepage, /elections, and one article page that carries a promo.
- [ ] Scroll each module into view: exactly one `module_view` per wrapper, with the right `module`. Check that the results block fires once it loads.
- [ ] Click each link on its **text** and again on its **arrow**: `module_click` with the right `module` and `position`.
  - If an arrow click shows an empty `module` or `position`, the fallback is `pointer-events: none` on that widget's decorative `aria-hidden` arrow span, so the click lands on the link. That's a one-line CSS change; ship it through `/ship`.
- [ ] If the results block re-renders and fires a second `module_view`, note it. "Once per element" counts each DOM instance, so read views as instances, not unique readers.
- [ ] No events from inside the AP iframe.
- [ ] Publish the GTM container. Version: ______ Date: ______ Signed off by: ______

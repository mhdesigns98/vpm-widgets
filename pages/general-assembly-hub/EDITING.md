# Editing the General Assembly hub

This page is vpm.org/general-assembly. You don't need to know HTML to update it. Each section
is its own block in the WordPress editor, and the parts you'll change are plain text between
code that you can leave alone.

## Before you start

- **Open the right block.** In the page editor, each section is a Code Block. Open the one for the
  section you're changing (Key dates, Bills, and so on). The block's first lines say which section
  it is.
- **Change only the words.** Text between `>` and `<` is what readers see. Leave everything
  inside `< >` alone, including quotation marks.
- **Lines starting `<!--` are notes for editors.** Readers never see them.
- **Preview before you update.** If the section looks broken, undo (Cmd+Z) and try again.

## Session status line (top of the page)

You usually don't need to touch this. The line under the big "Virginia General Assembly" title
changes on its own:

- Before Jan. 13, 2027 it says **Session convenes Jan. 13, 2027**.
- From Jan. 13 on it switches to **2027 session underway**.
- Once someone enters an end date, it hides the day after that date.

**When the session's end date is announced:** open block 1 (the header) and find the line with
`data-vpm-gahdr-end=""`. Type the date between the two quotation marks in this format:
year-month-day, for example `data-vpm-gahdr-end="2027-02-27"`.

**Next year:** change the visible text, the start date (`data-vpm-gahdr-start`), the "after"
text (`data-vpm-gahdr-after`), and empty the end date. Use the same year-month-day format.

## Change a key date

Open block 2 (Key dates). Each date looks like this:

```
<span class="vpm-gahub__date">[DATE]</span>
```

Replace `[DATE]` with the date in AP style, for example `Feb. 10, 2027`. Leave the rest of the
line alone. Leave `[DATE]` in place until the date is published.

## Update who's in charge

Open block 4. Replace each bracketed value:

- `[##]` and `[#]`: seat counts, for example `51`.
- `[Name] ([Party])`: for example `Jane Doe (D)`.

If a chamber has no vacancies, delete that chamber's whole **Vacant** line, from `<div` to `</div>`.

## Change a bill's status

Open block 5 (Bills we're watching). Find the bill by its number. Its status line looks like this:

```
<span class="vpm-gahub__status">In committee</span>
```

Replace the words between `>` and `<` with one of these, typed exactly as shown:

| Type this | When |
|---|---|
| `In committee` | Introduced, waiting on or in committee |
| `Passed House` | Passed the House, not yet the Senate |
| `Passed Senate` | Passed the Senate, not yet the House |
| `Passed both chambers` | Passed both, not yet sent to the governor |
| `To governor` | On the governor's desk |
| `Signed` | Signed into law |
| `Vetoed` | Vetoed by the governor |
| `Failed` | Killed in committee or voted down |

Each of these gets its own color and symbol automatically. If you type anything else, it still
shows, just without the styling.

Then update the **Status last updated:** date near the top of the block.

## Add a bill

1. In block 5, find a bill that starts with `<!-- ===== BILL START` and ends with
   `<!-- ===== BILL END ===== -->`.
2. Select everything from the `BILL START` line to the `BILL END` line, including both lines.
   Copy it.
3. Click at the start of another `BILL START` line (or just before `</ul>` to add it at the end)
   and paste.
4. In your new copy, change:
   - **The LIS link:** replace the address between the quotes after `href=` with the bill's page on
     lis.virginia.gov. Copy it from your browser's address bar.
   - **The bill number:** the text before `<span class="vpm-gahub__sr">`, for example `HB 1234`.
   - **The summary:** one plain-language sentence on what the bill would do.
   - **The topic:** for example `Education`.
   - **The status:** see the table above.
   - **The coverage link:** replace the address after `href=` with our story's address. If there's
     no story yet, replace the whole link, from `<a` to `</a>`, with the words `No story yet`.
5. In the `BILL START` line of your copy, delete `(SAMPLE, delete before launch)` if it's there.

## Remove a bill

Select everything from its `BILL START` line to its `BILL END` line and delete it. If you remove
every bill, the section shows "Check back once the session begins for the bills we're following."

## Before launch

Delete the three bills marked **SAMPLE**. They're placeholders that show the layout.

## Explainers (block 7)

Replace `[STORY URL: ...]` with the story's address. Until a story is published, delete its whole
card, from `<li` to `</li>`, so the page never links to nothing.

## Glossary (block 8)

Each term is one chunk from `<details` to `</details>`. Edit the words in the
`vpm-gahub__term-name` line (the term) or the `vpm-gahub__term-def` line (the definition). To add a
term, copy a whole chunk and paste it just before another `<details`.

## Something looks wrong

Undo in the editor, or paste the block again from the latest file in this folder
(`sections/`) and redo your edit.

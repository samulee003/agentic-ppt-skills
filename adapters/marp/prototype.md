# Marp: prototype gate

Engine rules for the `deck-prototype` gate when the deck is built with Marp. The pipeline skill (`presentation-prototype`) calls this; author to it.

## Prerequisites — read this first

Marp runs through `npx`; no global install or workspace scaffold is needed. **Node 18+** must be present (the pipeline's status helper already requires it). Confirm reachability once:

```bash
npx @marp-team/marp-cli@latest --version
```

## File contract

- One slide = one Markdown file: `slides/<deck-id>.md`.
- Pages are separated by a line containing only `---`.
- The file **starts** with a YAML frontmatter block that selects the theme and the 16:9 aspect:

  ```markdown
  ---
  marp: true
  theme: default
  size: 16:9
  ---
  ```

- Speaker notes use an HTML comment immediately after a page's content:

  ```markdown
  <!-- speaker notes for this page go here -->
  ```

- Do not create sibling files, components, or build config. A deck is one `.md` file.

## Canvas — 16:9

Marp's `size: 16:9` renders each page at 1280×720 (CSS px). Marp scales the Markdown to fill it; you write semantic Markdown, not absolute pixels. Type size is controlled via theme CSS or inline `<style>`, not per-element pixel values like a fixed-canvas engine.

### Projector-safe type

Marp's default theme is already projector-readable, but do not shrink it to fit more in:

- Keep the default heading/body sizes; if a page overflows, **split it** rather than lowering the font size.
- One heading + a short list, OR one heading + one paragraph per page. Not both.
- A bullet should fit on one line. If it wraps, shorten it or move it to its own page.
- Prefer Marp's built-in directives (`<!-- _backgroundColor: ... -->`, `<!-- _color: ... -->`) for per-page accents over hand-written CSS.

## Visual direction

Hold one theme across every page. Use Marp's built-in themes (`default`, `gaia`, `uncover`) or a custom theme CSS registered via `--theme`. Pick ONE aesthetic and commit — do not mix themes mid-deck.

## Live review

Before calling the prototype gate passed, render the representative pages and look at them at full size:

```bash
npx @marp-team/marp-cli@latest slides/<deck-id>.md -o /tmp/preview.html
```

Open `/tmp/preview.html` in a browser (or have the user open it). Confirm type is projector-readable, nothing is cut off, pagination is correct (each `---` is a clean break), and the visual direction reads as one hand across every page.

### Headless review (no browser)

If you are a headless agent, render to PDF then rasterize to PNG and inspect with your image tool instead of opening a browser:

```bash
npx @marp-team/marp-cli@latest slides/<deck-id>.md -o /tmp/preview.pdf
pdftoppm -png -r 100 /tmp/preview.pdf /tmp/page
```

Open the PNGs with your vision capability and confirm each page is 16:9, text is not clipped, and every `---` produced exactly one page. If you have no image tool, record in the gate result that visual review was not performed and flag it for a human — do not claim the gate passed on an unverified prototype.

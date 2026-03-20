// ─── Quill ───────────────────────────────────────────────────────────────────
// NOTE: In react-quill-new (Quill v2), the list format covers both ordered
// and bullet lists. "bullet" is NOT a separate registered format —
// including it in the formats array causes the
// "Cannot register bullet" warning spam in the console.
export const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image'],
    ['clean'],
  ],
}

export const QUILL_FORMATS = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'indent',   // FIX: removed 'bullet' — not a valid Quill v2 format name
  'link', 'image',
]

// ─── Categories ──────────────────────────────────────────────────────────────
export const POST_CATEGORIES = [
  'Agriculture',
  'Business',
  'Education',
  'Entertainment',
  'Art',
  'Investment',
  'Uncategorized',
  'Weather',
]
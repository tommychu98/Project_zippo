export default function HeaderIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === "instagram" && <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </>}
      {name === "twitter" && <path stroke="none" fill="currentColor" d="M22.16 5.66c-.75.33-1.55.55-2.39.65a4.17 4.17 0 0 0 1.83-2.3 8.3 8.3 0 0 1-2.64 1.01 4.15 4.15 0 0 0-7.07 3.78 11.78 11.78 0 0 1-8.56-4.34 4.15 4.15 0 0 0 1.28 5.54 4.14 4.14 0 0 1-1.88-.52v.05a4.16 4.16 0 0 0 3.33 4.07c-.61.17-1.25.19-1.88.07a4.16 4.16 0 0 0 3.88 2.88A8.34 8.34 0 0 1 1.9 18.3a11.74 11.74 0 0 0 6.37 1.87c7.64 0 11.82-6.33 11.82-11.82l-.01-.54a8.44 8.44 0 0 0 2.08-2.15Z" />}
      {name === "cart" && <>
        <path d="M2 3h2l2.5 12h12l2-8H5" />
        <path d="M7 15l-1 3h13" />
        <circle cx="8" cy="21" r="1" />
        <circle cx="18" cy="21" r="1" />
      </>}
      {name === "account" && <>
        <circle cx="12" cy="7.5" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </>}
    </svg>
  );
}

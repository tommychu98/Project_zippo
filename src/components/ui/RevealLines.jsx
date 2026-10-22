// Keep semantic text and the original line height. The extra mask bleed protects
// Archivo/Plex glyphs where the design uses line heights below 1.
export default function RevealLines({ lines }) {
  return lines.map((line, index) => (
    <span className="reveal-line-mask" key={index}>
      <span className="reveal-line">{line}</span>
      {index < lines.length - 1 ? ' ' : null}
    </span>
  ));
}

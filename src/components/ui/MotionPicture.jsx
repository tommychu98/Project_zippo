import Picture from './Picture';

export default function MotionPicture({ className = '', ...props }) {
  return (
    <div className={`motion-image ${className}`}>
      <div className="image-mask">
        <div className="image-parallax">
          <Picture {...props} className="image-zoom" />
        </div>
      </div>
    </div>
  );
}

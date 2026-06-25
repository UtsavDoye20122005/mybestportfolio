"use client";

export function AvailabilityBadge({ available }: { available: boolean }) {
  if (!available) {
    return (
      <div className="availability">
        <div className="availability__row">
          <span className="availability__dot availability__dot--off" aria-hidden="true">
            ●
          </span>
          <span className="availability__text">NOT CURRENTLY AVAILABLE</span>
        </div>
      </div>
    );
  }

  return (
    <div className="availability">
      <div className="availability__row">
        <span className="availability__dot availability__dot--on" aria-hidden="true">
          ●
        </span>
        <span className="availability__text">AVAILABLE FOR OPPORTUNITIES</span>
      </div>
      <div className="availability__meta">Full-time · Freelance · Collaboration </div>
    </div>
  );
}


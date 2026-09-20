import {
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  Check,
  Clock3,
  Compass,
  MapPin,
  Mountain,
  Route,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import type { StudioBusiness, StudioDirection } from "../types";

type FlagshipPreviewProps = {
  business: StudioBusiness;
  direction: StudioDirection;
};

function FlagshipAction({ children }: { children: React.ReactNode }) {
  return (
    <span className="studio-flagship-action">
      {children}
      <ArrowUpRight size={13} aria-hidden="true" />
    </span>
  );
}

function HotelFlagshipPreview({ business, direction }: FlagshipPreviewProps) {
  return (
    <article
      className="studio-flagship studio-hotel-flagship"
      data-testid="studio-hotel-flagship"
      aria-label={`${business.sampleName} hotel website concept`}
    >
      <header className="studio-flagship-nav">
        <strong>{business.sampleName}</strong>
        <span className="studio-flagship-nav-links" aria-hidden="true">
          <span>Stay</span>
          <span>Experience</span>
          <span>Locate</span>
        </span>
        <FlagshipAction>Plan your stay</FlagshipAction>
      </header>

      <section className="studio-flagship-hero studio-hotel-hero">
        <div className="studio-flagship-copy">
          <p>{business.sampleEyebrow}</p>
          <h3>{business.sampleHeadline}</h3>
          <span>{business.sampleCopy}</span>
          <div className="studio-flagship-actions" aria-hidden="true">
            <b>{business.primaryAction}</b>
            <em>{business.secondaryAction}</em>
          </div>
        </div>

        <div className="studio-hotel-scene" aria-hidden="true">
          <span className="studio-hotel-sun" />
          <span className="studio-hotel-ridge studio-hotel-ridge-far" />
          <span className="studio-hotel-ridge studio-hotel-ridge-near" />
          <span className="studio-hotel-lodge">
            <i />
            <i />
            <i />
          </span>
          <span className="studio-hotel-scene-note">
            <Mountain size={13} /> Bhutan highlands · 2,240 m
          </span>
        </div>
      </section>

      <div className="studio-stay-finder" aria-label="Example stay enquiry">
        <span>
          <CalendarDays size={14} aria-hidden="true" />
          <small>Arrival</small>
          <strong>18 Oct</strong>
        </span>
        <span>
          <CalendarDays size={14} aria-hidden="true" />
          <small>Departure</small>
          <strong>21 Oct</strong>
        </span>
        <span>
          <Users size={14} aria-hidden="true" />
          <small>Guests</small>
          <strong>2 adults</strong>
        </span>
        <b>Check the stay</b>
      </div>

      <section
        className="studio-hotel-stays"
        aria-labelledby="hotel-stays-title"
      >
        <div className="studio-flagship-section-copy">
          <p>Rooms with a sense of place</p>
          <h4 id="hotel-stays-title">Two quiet ways to arrive.</h4>
          <span>
            Details guests need, atmosphere they can feel, and a direct next
            step without the booking noise.
          </span>
        </div>
        <div className="studio-hotel-room-list">
          <article className="studio-hotel-room">
            <div className="studio-hotel-room-art is-valley" aria-hidden="true">
              <span />
            </div>
            <div>
              <small>01 · Signature stay</small>
              <strong>Valley Suite</strong>
              <span>King bed · Private deck · Sunrise view</span>
            </div>
          </article>
          <article className="studio-hotel-room">
            <div className="studio-hotel-room-art is-forest" aria-hidden="true">
              <span />
            </div>
            <div>
              <small>02 · Immersive stay</small>
              <strong>Forest House</strong>
              <span>2 guests · Wood stove · Trail access</span>
            </div>
          </article>
        </div>
      </section>

      <section className="studio-hotel-detail" aria-label="Property highlights">
        <div>
          <Sparkles size={16} aria-hidden="true" />
          <small>Slow mornings</small>
          <strong>Breakfast from the valley</strong>
        </div>
        <div>
          <Compass size={16} aria-hidden="true" />
          <small>Made local</small>
          <strong>Guided trails and village walks</strong>
        </div>
        <div>
          <Star size={16} aria-hidden="true" />
          <small>{direction.name} detail</small>
          <strong>A calm path to direct enquiry</strong>
        </div>
      </section>
    </article>
  );
}

function ToursFlagshipPreview({ business, direction }: FlagshipPreviewProps) {
  return (
    <article
      className="studio-flagship studio-tours-flagship"
      data-testid="studio-tours-flagship"
      aria-label={`${business.sampleName} tours and travel website concept`}
    >
      <header className="studio-flagship-nav">
        <strong>{business.sampleName}</strong>
        <span className="studio-flagship-nav-links" aria-hidden="true">
          <span>Destinations</span>
          <span>Journeys</span>
          <span>About</span>
        </span>
        <FlagshipAction>Start a journey</FlagshipAction>
      </header>

      <section className="studio-flagship-hero studio-tours-hero">
        <div className="studio-flagship-copy">
          <p>{business.sampleEyebrow}</p>
          <h3>{business.sampleHeadline}</h3>
          <span>{business.sampleCopy}</span>
          <div className="studio-flagship-actions" aria-hidden="true">
            <b>{business.primaryAction}</b>
            <em>{business.secondaryAction}</em>
          </div>
          <div
            className="studio-travel-tags"
            aria-label="Example journey filters"
          >
            <span>Culture</span>
            <span>Nature</span>
            <span>7–10 days</span>
          </div>
        </div>

        <div className="studio-route-map" aria-hidden="true">
          <span className="studio-route-contour contour-one" />
          <span className="studio-route-contour contour-two" />
          <span className="studio-route-contour contour-three" />
          <svg viewBox="0 0 360 300" role="presentation">
            <path
              className="studio-route-path"
              d="M38 238 C92 214 90 155 148 157 C213 159 191 83 261 92 C301 97 310 60 329 35"
            />
          </svg>
          <span className="studio-route-marker marker-one">
            <i /> Phuentsholing
          </span>
          <span className="studio-route-marker marker-two">
            <i /> Thimphu
          </span>
          <span className="studio-route-marker marker-three">
            <i /> Punakha
          </span>
          <span className="studio-route-card">
            <Route size={15} /> 6 stops · 8 days
          </span>
        </div>
      </section>

      <section
        className="studio-journey-feature"
        aria-labelledby="journey-feature-title"
      >
        <div className="studio-journey-visual" aria-hidden="true">
          <span className="studio-journey-sky" />
          <span className="studio-journey-mountain mountain-back" />
          <span className="studio-journey-mountain mountain-front" />
          <span className="studio-journey-road" />
          <small>Featured route · Western Bhutan</small>
        </div>
        <div className="studio-journey-copy">
          <p>Signature journey</p>
          <h4 id="journey-feature-title">Valleys, dzongs and high passes.</h4>
          <span>
            A paced eight-day route with the practical details made clear before
            the traveller has to ask.
          </span>
          <dl>
            <div>
              <dt>
                <Clock3 size={13} aria-hidden="true" /> Duration
              </dt>
              <dd>8 days</dd>
            </div>
            <div>
              <dt>
                <Users size={13} aria-hidden="true" /> Group
              </dt>
              <dd>2–8 guests</dd>
            </div>
            <div>
              <dt>
                <MapPin size={13} aria-hidden="true" /> Start
              </dt>
              <dd>Border gateway</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="studio-itinerary" aria-labelledby="itinerary-title">
        <div className="studio-flagship-section-copy">
          <p>Route preview</p>
          <h4 id="itinerary-title">The journey, understood at a glance.</h4>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div>
              <small>Gateway to capital</small>
              <strong>Arrive slowly</strong>
            </div>
            <Check size={14} aria-hidden="true" />
          </li>
          <li>
            <span>02</span>
            <div>
              <small>High pass to valley</small>
              <strong>Walk through history</strong>
            </div>
            <Check size={14} aria-hidden="true" />
          </li>
          <li>
            <span>03</span>
            <div>
              <small>Village to trail</small>
              <strong>Go beyond the road</strong>
            </div>
            <Check size={14} aria-hidden="true" />
          </li>
        </ol>
        <span className="studio-itinerary-note">
          <Compass size={15} aria-hidden="true" /> {direction.name} direction ·
          clear itinerary, direct enquiry
        </span>
      </section>
    </article>
  );
}

export function FlagshipPreview(props: FlagshipPreviewProps) {
  if (props.business.id === "hotel") {
    return <HotelFlagshipPreview {...props} />;
  }

  if (props.business.id === "tours") {
    return <ToursFlagshipPreview {...props} />;
  }

  return null;
}

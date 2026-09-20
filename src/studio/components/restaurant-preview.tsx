import {
  CalendarDays,
  Check,
  Clock3,
  Flame,
  Leaf,
  MapPin,
  Users,
} from "lucide-react";
import { FlagshipAction, type FlagshipPreviewProps } from "./flagship-shared";

export function RestaurantFlagshipPreview({
  business,
  direction,
}: FlagshipPreviewProps) {
  return (
    <article
      className="studio-flagship studio-restaurant-flagship"
      data-testid="studio-restaurant-flagship"
      aria-label={`${business.sampleName} restaurant website concept`}
    >
      <header className="studio-flagship-nav">
        <strong>{business.sampleName}</strong>
        <span className="studio-flagship-nav-links" aria-hidden="true">
          <span>Menu</span>
          <span>Story</span>
          <span>Visit</span>
        </span>
        <FlagshipAction>Reserve a table</FlagshipAction>
      </header>

      <section className="studio-flagship-hero studio-dining-hero">
        <div className="studio-flagship-copy">
          <p>{business.sampleEyebrow}</p>
          <h3>{business.sampleHeadline}</h3>
          <span>{business.sampleCopy}</span>
          <div className="studio-flagship-actions" aria-hidden="true">
            <b>{business.primaryAction}</b>
            <em>{business.secondaryAction}</em>
          </div>
        </div>

        <div className="studio-dining-scene" aria-hidden="true">
          <span className="studio-dining-candle" />
          <span className="studio-dining-plate" />
          <span className="studio-dining-steam studio-dining-steam-one" />
          <span className="studio-dining-steam studio-dining-steam-two" />
          <span className="studio-dining-table" />
          <span className="studio-dining-scene-note">
            <Flame size={13} /> Wood-fire kitchen · Thimphu
          </span>
        </div>
      </section>

      <div className="studio-table-finder" aria-label="Example reservation">
        <span>
          <CalendarDays size={14} aria-hidden="true" />
          <small>Day</small>
          <strong>Friday</strong>
        </span>
        <span>
          <Clock3 size={14} aria-hidden="true" />
          <small>Time</small>
          <strong>7:30 pm</strong>
        </span>
        <span>
          <Users size={14} aria-hidden="true" />
          <small>Party</small>
          <strong>2 guests</strong>
        </span>
        <b>Book the table</b>
      </div>

      <section className="studio-menu" aria-labelledby="menu-title">
        <div className="studio-flagship-section-copy">
          <p>Plates with a point of view</p>
          <h4 id="menu-title">Tonight&rsquo;s short menu.</h4>
          <span>
            A short menu that changes with the valley&rsquo;s harvest — readable
            in one glance, priced without surprises.
          </span>
        </div>
        <ul className="studio-menu-list">
          <li>
            <span>01</span>
            <div>
              <small>Small plates</small>
              <strong>Ember-roast pumpkin, local butter</strong>
            </div>
            <em>Nu 320</em>
          </li>
          <li>
            <span>02</span>
            <div>
              <small>Main</small>
              <strong>Fire-grilled river trout, red rice</strong>
            </div>
            <em>Nu 560</em>
          </li>
          <li>
            <span>03</span>
            <div>
              <small>Sweet</small>
              <strong>Burnt honey tart, curd cream</strong>
            </div>
            <em>Nu 280</em>
          </li>
        </ul>
        <span className="studio-flagship-note">
          <Check size={15} aria-hidden="true" /> Tasting plate for two · Nu
          1,450
        </span>
      </section>

      <section
        className="studio-dining-story"
        aria-labelledby="dining-story-title"
      >
        <div className="studio-dining-visual" aria-hidden="true">
          <span className="studio-dining-hearth" />
          <span className="studio-dining-fire" />
          <small>The hearth, lit from 4 pm</small>
        </div>
        <div className="studio-dining-story-copy">
          <p>Cooked over wood</p>
          <h4 id="dining-story-title">Sourced within the valley.</h4>
          <span>
            The kitchen writes the menu after the morning&rsquo;s produce
            arrives — nothing travels far, nothing sits long.
          </span>
          <dl>
            <div>
              <dt>
                <Flame size={13} aria-hidden="true" /> Fire
              </dt>
              <dd>One open hearth</dd>
            </div>
            <div>
              <dt>
                <Leaf size={13} aria-hidden="true" /> Sourcing
              </dt>
              <dd>Valley farms, weekly</dd>
            </div>
            <div>
              <dt>
                <MapPin size={13} aria-hidden="true" /> Room
              </dt>
              <dd>Twelve tables, low light</dd>
            </div>
          </dl>
        </div>
      </section>

      <section
        className="studio-dining-visit"
        aria-label="Opening hours and location"
      >
        <div>
          <Clock3 size={16} aria-hidden="true" />
          <small>Hours</small>
          <strong>Tue – Sun · 5 – 10 pm</strong>
        </div>
        <div>
          <MapPin size={16} aria-hidden="true" />
          <small>Find us</small>
          <strong>West Thimphu, above the river</strong>
        </div>
        <div>
          <CalendarDays size={16} aria-hidden="true" />
          <small>{direction.name} detail</small>
          <strong>Walk-ins at the bar most nights</strong>
        </div>
      </section>
    </article>
  );
}

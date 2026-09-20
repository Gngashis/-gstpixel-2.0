import { Banknote, Check, RotateCcw, Truck } from "lucide-react";
import { FlagshipAction, type FlagshipPreviewProps } from "./flagship-shared";

export function RetailFlagshipPreview({
  business,
  direction,
}: FlagshipPreviewProps) {
  return (
    <article
      className="studio-flagship studio-retail-flagship"
      data-testid="studio-retail-flagship"
      aria-label={`${business.sampleName} retail website concept`}
    >
      <header className="studio-flagship-nav">
        <strong>{business.sampleName}</strong>
        <span className="studio-flagship-nav-links" aria-hidden="true">
          <span>Collections</span>
          <span>Journal</span>
          <span>Visit</span>
        </span>
        <FlagshipAction>Shop new arrivals</FlagshipAction>
      </header>

      <section className="studio-flagship-hero studio-retail-hero">
        <div className="studio-flagship-copy">
          <p>{business.sampleEyebrow}</p>
          <h3>{business.sampleHeadline}</h3>
          <span>{business.sampleCopy}</span>
          <div className="studio-flagship-actions" aria-hidden="true">
            <b>{business.primaryAction}</b>
            <em>{business.secondaryAction}</em>
          </div>
          <div
            className="studio-retail-filters"
            aria-label="Example collection filters"
          >
            <span>All</span>
            <span>Lighting</span>
            <span>Ceramics</span>
            <span>Textiles</span>
          </div>
        </div>

        <div className="studio-shelf-scene" aria-hidden="true">
          <span className="studio-shelf-board" />
          <span className="studio-shelf-object studio-shelf-vase" />
          <span className="studio-shelf-object studio-shelf-lamp" />
          <span className="studio-shelf-object studio-shelf-box" />
          <span className="studio-shelf-note">
            Home objects · made in small batches
          </span>
        </div>
      </section>

      <section
        className="studio-retail-products"
        aria-labelledby="retail-products-title"
      >
        <div className="studio-flagship-section-copy">
          <p>Featured objects</p>
          <h4 id="retail-products-title">Built to be used daily.</h4>
          <span>
            Clear prices, honest materials, and an add-to-cart that never gets
            in the way of browsing.
          </span>
        </div>
        <div className="studio-retail-grid">
          <article className="studio-retail-product">
            <div className="studio-retail-thumb is-bowl" aria-hidden="true">
              <span className="studio-retail-badge">New</span>
            </div>
            <div>
              <small>01 · Wild teak</small>
              <strong>Turned bowl</strong>
              <span>Nu 1,850</span>
              <b>Add to cart</b>
            </div>
          </article>
          <article className="studio-retail-product">
            <div className="studio-retail-thumb is-lamp" aria-hidden="true" />
            <div>
              <small>02 · Warm brass</small>
              <strong>Column lamp</strong>
              <span>Nu 4,200</span>
              <b>Add to cart</b>
            </div>
          </article>
          <article className="studio-retail-product">
            <div className="studio-retail-thumb is-throw" aria-hidden="true" />
            <div>
              <small>03 · Mountain wool</small>
              <strong>Weave throw</strong>
              <span>Nu 2,600</span>
              <b>Add to cart</b>
            </div>
          </article>
        </div>
      </section>

      <section className="studio-retail-band" aria-label="Ordering information">
        <div>
          <Truck size={16} aria-hidden="true" />
          <small>Delivery</small>
          <strong>Free valley delivery over Nu 2,500</strong>
        </div>
        <div>
          <RotateCcw size={16} aria-hidden="true" />
          <small>Returns</small>
          <strong>7 days, no questions</strong>
        </div>
        <div>
          <Banknote size={16} aria-hidden="true" />
          <small>Payment</small>
          <strong>Pay on delivery available</strong>
        </div>
      </section>

      <section
        className="studio-retail-service"
        aria-labelledby="retail-service-title"
      >
        <div className="studio-flagship-section-copy">
          <p>After the parcel</p>
          <h4 id="retail-service-title">A shop that stays reachable.</h4>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div>
              <small>Every order</small>
              <strong>Packed by hand, with care notes</strong>
            </div>
            <Check size={14} aria-hidden="true" />
          </li>
          <li>
            <span>02</span>
            <div>
              <small>After years of use</small>
              <strong>Repairs, re-waxing, re-fitting</strong>
            </div>
            <Check size={14} aria-hidden="true" />
          </li>
          <li>
            <span>03</span>
            <div>
              <small>{direction.name} detail</small>
              <strong>A real person replies within a day</strong>
            </div>
            <Check size={14} aria-hidden="true" />
          </li>
        </ol>
        <span className="studio-flagship-note">
          <Check size={15} aria-hidden="true" /> {direction.name} direction ·
          browse freely, buy in one tap
        </span>
      </section>
    </article>
  );
}

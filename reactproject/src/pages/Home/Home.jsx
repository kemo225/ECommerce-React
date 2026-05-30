import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import TripCard from '../../components/TripCard/TripCard';
import BlogCard from '../../components/BlogCard/BlogCard';
import FAQ from '../../components/FAQ/FAQ';
import Newsletter from '../../components/Newsletter/Newsletter';
import ImageGallery from '../../components/ImageGallery/ImageGallery';
import Button from '../../components/Button/Button';
import { getFeaturedTrips } from '../../data/trips';
import { blogs } from '../../data/blogs';
import { faqs } from '../../data/faq';
import styles from './Home.module.css';

const galleryImages = [
  '/images/santorini.png',
  '/images/maldives.png',
  '/images/kyoto.png',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
];

export default function Home() {
  const featuredTrips = getFeaturedTrips();
  const featuredBlogs = blogs.slice(0, 2);

  return (
    <main>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <h1 className={styles.heroTitle}>Curating Celestial Journeys</h1>
          <p className={styles.heroSubtitle}>
            Experiences meticulously designed for the discerning traveler. From the serene
            peaks of the Himalayas to the golden sands of the Serengeti.
          </p>
          <div className={styles.heroCtas}>
            <Button as={Link} to="/trips" variant="primary" size="lg">Explore Trips</Button>
            <Button as={Link} to="/contact" variant="white" size="lg">Book Now</Button>
          </div>
        </div>
      </section>

      {/* Signature Destinations */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Signature Destinations</h2>
            <Link to="/trips" className={styles.viewAll}>
              View All Expeditions <HiArrowRight />
            </Link>
          </div>
          <div className={styles.tripGrid}>
            {featuredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <ImageGallery images={galleryImages} />
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className={styles.faqLayout}>
            <FAQ items={faqs.slice(0, 3)} />
            <div className={styles.faqImages}>
              <ImageGallery images={galleryImages} showButton={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Voyage Journals */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Voyage Journals</h2>
            <Link to="/blog" className={styles.viewAllBtn}>Read Blog</Link>
          </div>
          <div className={styles.blogGrid}>
            {featuredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </main>
  );
}

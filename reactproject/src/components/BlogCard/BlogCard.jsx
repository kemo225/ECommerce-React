import { Link } from 'react-router-dom';
import styles from './BlogCard.module.css';

export default function BlogCard({ blog, featured = false }) {
  return (
    <Link to={`/blog/${blog.slug}`} className={`${styles.card} ${featured ? styles.featured : ''}`}>
      <div className={styles.imageWrap}>
        <img src={blog.image} alt={blog.title} className={styles.image} loading="lazy" />
        {featured && <span className={styles.featuredBadge}>Featured Story</span>}
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.category}>{blog.category}</span>
          <span className={styles.dot}>•</span>
          <span className={styles.readTime}>{blog.readTime}</span>
        </div>
        <h3 className={styles.title}>{blog.title}</h3>
        <p className={styles.excerpt}>{blog.excerpt}</p>
      </div>
    </Link>
  );
}

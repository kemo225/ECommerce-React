import { useState } from 'react';
import BlogCard from '../../components/BlogCard/BlogCard';
import { blogs, getCategories } from '../../data/blogs';
import styles from './Blog.module.css';

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', ...getCategories()];
  const featured = blogs.filter((b) => b.featured);
  const filtered = activeCategory === 'All'
    ? blogs.filter((b) => !b.featured)
    : blogs.filter((b) => b.category === activeCategory && !b.featured);

  return (
    <main className={styles.page}>
      <div className="container">
        <h1 className={styles.pageTitle}>Voyage Journals</h1>
        <p className={styles.pageSubtitle}>
          Stories, insights, and inspiration from our world of curated travel experiences.
        </p>
{/* Featured */}
<div className="row">
  {featured.map((item) => (
    <div key={item.id} className="col-md-6 mb-4">
      <div className={styles.featuredSection}>
        <BlogCard blog={item} featured />
      </div>
    </div>
  ))}
</div>

        {/* Category Filter */}
        <div className={styles.filters}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className={styles.grid}>
          {filtered.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className={styles.empty}>No articles found in this category.</p>
        )}
      </div>
    </main>
  );
}

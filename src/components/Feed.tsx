import { useEffect } from 'preact/hooks';

import useFeed from '../hooks/use-feed';
import FeedPost from './FeedPost';

export default function Feed() {
  const { posts, loadMore, loading, refresh } = useFeed();

  useEffect(() => {
    document.addEventListener('scroll', () => {
      if (window.scrollY === 0) refresh(); // TODO: refresh don't make site jump (when more are added at top)
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight
      )
        loadMore();
    });

    setInterval(() => {
      if (window.scrollY === 0) refresh();
    }, 15000); // TODO: Config
  }, []);

  return (
    <div className="post-feed">
      {posts.map((post) => {
        return <FeedPost post={post} />;
      })}
      {loading && 'Loading'}
      <button disabled={loading} onClick={loadMore}>
        Load more
      </button>
    </div>
  );
}

import { Post } from '../types';
import { formatDate } from '../utils/date';

interface FeedPostProps {
  post: Post;
}

export default function FeedPost({ post }: FeedPostProps) {
  return (
    <div className="post">
      <div className="profile">
        <div className="avatar">
          <img src={post.author.avatarURL} alt={post.author.displayName} />
        </div>
        <span className="display-name">
          <bdi>
            <strong
              dangerouslySetInnerHTML={{ __html: post.author.displayName }}
            ></strong>
          </bdi>
          <span className="username">{post.author.shortUsername}</span>
          <span className="datetime">{formatDate(post.date)}</span>
        </span>
      </div>
      <div
        className="content"
        id="content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      {/*attachments.length !== 0 && (
        <div className="gallery-holder">
          <div
            className="image-gallery"
            style={{
              gridTemplateColumns: `repeat(${
                attachments.length <= 2 ? attachments.length : 2
              }, minmax(0, 1fr))`,
            }}
          >
            {attachments.map((attachment) => {
              if (attachment.type === 'image')
                return (
                  <img
                    key={attachment.url}
                    src={attachment.url}
                    className="attachment"
                    style={{ aspectRatio: `${attachment.aspectRatio} / 1` }}
                  />
                );
              if (attachment.type === 'gifv')
                return (
                  <video
                    key={attachment.url}
                    src={attachment.url}
                    className="attachment"
                    style={{ aspectRatio: `${attachment.aspectRatio} / 1` }}
                    muted
                    playsInline
                    controls={false}
                  />
                );
              return <div key={attachment.url}></div>;
            })}
          </div>
        </div>
        )*/}
      <div className={`action-bar`}>
        <span className="action-bar-datetime">
          {post.date.toLocaleDateString('fi')}
        </span>
        <div className="action">
          <span className="icon-reply" />
          <span className="action-counter">{post.comments}</span>
          <span className="action-label">Replies</span>
        </div>
        <div className="action">
          <span className="icon-boost" />
          <span className="action-counter">{post.boosts}</span>
          <span className="action-label">Boosts</span>
        </div>
        <div className="action">
          <span className="icon-star" />
          <span className="action-counter">{post.favourites}</span>
          <span className="action-label">Favourites</span>
        </div>
      </div>
    </div>
  );
}

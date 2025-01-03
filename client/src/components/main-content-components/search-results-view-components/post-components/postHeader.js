const PostHeader = (props) => {
  const { divClass, post, communities } = props;

  const community = communities.find(community => community.postIDs.includes(post._id));

  function timeAgo(pastDate) {
      const now = new Date();
      const timeDifference = now - pastDate; // Difference in milliseconds
  
      const seconds = Math.floor(timeDifference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);
  
      if (years > 0) {
          return years === 1 ? '1 year ago' : `${years} years ago`;
      } else if (months > 0) {
          return months === 1 ? '1 month ago' : `${months} months ago`;
      } else if (weeks > 0) {
          return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
      } else if (days > 0) {
          return days === 1 ? '1 day ago' : `${days} days ago`;
      } else if (hours > 0) {
          return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
      } else if (minutes > 0) {
          return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
      } else if (seconds > 0) {
          return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
      } else {
          return 'just now';
      }
  }

  return (  
      <div className={divClass}>
          <p>{"r/" + community.name + " | " + post.postedBy + " | " + timeAgo(post.postedDate)}</p>
      </div>
  );
}

export default PostHeader;

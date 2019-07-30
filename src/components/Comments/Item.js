import React from 'react';
import day from 'dayjs';


function CommentItem(props) {
  const { comment } = props;
  return (
    <li>
      <div>
        <span>{`${comment.user.first_name} ${comment.user.last_name}`}</span>
        <span>{comment.message}</span>
      </div>
      <div>
        <span>{day(comment.created_date).format('MMMM DD, YYYY')}</span>
      </div>
    </li>
  );
}


export default CommentItem;

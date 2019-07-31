import React from 'react';
import day from 'dayjs';
import cn from 'classnames';


function CommentItem(props) {
  const { comment, className: BCP } = props;

  const isOtherUser = true
  return (
    <li className={cn(BCP, {
        [`${BCP}-isOtherUser`] : isOtherUser
      })}
     >
      <div className={`${BCP}_avatar`}>
      </div>
      <div className={`${BCP}_info`}>
        <div className={`${BCP}_info_row`}>
          <div className={`${BCP}_info_name`}>
            <a href="#" className="userLink">
              {`${comment.user.first_name} ${comment.user.last_name}`}
            </a>
          </div>
          <div className={`${BCP}_info_timestamp`}>
            <span className="date">
              <span>{day(comment.created_date).format('MMMM DD, YYYY')}</span>
            </span>
            <span className="time">
              8:59 PM
            </span>
          </div>
        </div>

        <div className={`${BCP}_info_row`}>
          <p className={`${BCP}_info_message`}>
            {comment.message}
          </p>
        </div>
      </div>
    </li>
  );
}


export default CommentItem;

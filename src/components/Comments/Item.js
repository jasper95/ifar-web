import React from 'react';
import { format as formatTime } from 'timeago.js';
import parser from 'html-react-parser';
import draftToHtml from 'draftjs-to-html';
import cn from 'classnames';

function CommentItem(props) {
  const { comment, className: BCP } = props;

  const isOtherUser = true;
  return (
    <li className={cn(BCP, {
      [`${BCP}-isOtherUser`]: isOtherUser,
    })}
    >
      <div className={`${BCP}_avatar`} />
      <div className={`${BCP}_info`}>
        <div className={`${BCP}_info_row`}>
          <div className={`${BCP}_info_name`}>
            <a href="#" className="userLink">
              {`${comment.user.first_name} ${comment.user.last_name}`}
            </a>
          </div>
          <div className={`${BCP}_info_timestamp`}>
            <span className="date">
              <span>{formatTime(comment.created_date)}</span>
            </span>
            {/* <span className="time">
              8:59 PM
            </span> */}
          </div>
        </div>

        <div className={`${BCP}_info_row`}>
          <p className={`${BCP}_info_message`}>
            {parser(draftToHtml(comment.body))}
          </p>
        </div>
      </div>
    </li>
  );
}


export default CommentItem;

import React, { useState } from 'react';
import Button from 'react-md/lib/Buttons/Button';
import TextField from 'react-md/lib/TextFields/TextField';
import useForm from 'lib/hooks/useForm';
import { getValidationResult, fieldIsRequired } from 'lib/tools';
import * as yup from 'yup';
import cn from 'classnames';
import useQuery from 'apollo/query';
import useMutation from 'apollo/mutation';
import gql from 'graphql-tag';
import Comment from './Item';

import 'sass/components/comments/_index.scss';

const commentsQuery = gql`
  subscription getComments($id: uuid) {
    comment(where: {risk_id: {_eq: $id}}) {
      id
      message
      user {
        first_name
        last_name
      }
      created_date
    }
  }

`;

function Comments(props) {
  const [showForm, setShowForm] = useState(false);
  const { risk } = props;
  console.log('props: ', risk.id);
  const commentsResponse = useQuery(commentsQuery, { ws: true, variables: { id: risk.id } });
  const { data: { comment: comments = [] } } = commentsResponse;
  const [mutationState, onMutate] = useMutation({ url: '/comment' });
  const [formState, formHandlers] = useForm({
    initialFields: { message: '' }, validator, onValid,
  });
  const { onElementChange, onValidate } = formHandlers;
  const { fields, errors } = formState;

  return (
    <div className="commentForm">
      <div className="commentForm_replies">
        <ul className="reply">
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} className="reply_item" />
          ))}
        </ul>
      </div>
      <div className="commentForm_actions">
        {!showForm
          ? (
            <Button
              onClick={() => setShowForm(!showForm)}
              iconChildren="message"
              className="commentForm_actions_write"
            >
              Write A Comment
            </Button>
          ) : (
            <div className="commentForm_actions_form">
              <h1 className="commentForm_actions_form_header">
                Write Comment
              </h1>
              <TextField
                id="message"
                rows={2}
                placeholder="Write Comment"
                onChange={onElementChange}
                error={!!errors.message}
                errorText={errors.message}
                value={fields.message || ''}
                className="iField commentForm_actions_form_field"
              />
              <div className="commentForm_actions_form_actions">
                <Button
                  className={cn('iBttn iBttn-primary',
                    { processing: mutationState.loading })}
                  onClick={() => onValidate(fields)}
                >
                  Submit
                </Button>
                <Button
                  className="iBttn iBttn-second-prio"
                  onClick={() => setShowForm(!showForm)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );

  function onValid(data) {
    onMutate({ data: { ...data, risk_id: risk.id } });
  }
}

function validator(data) {
  const schema = yup.object({
    message: yup.string().required(fieldIsRequired),
  });
  return getValidationResult(data, schema);
}

export default Comments;

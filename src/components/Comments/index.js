import React, { useState } from 'react';
import Button from 'react-md/lib/Buttons/Button';
import useForm from 'lib/hooks/useForm';
import { getValidationResult, fieldIsRequired } from 'lib/tools';
import { EditorState, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin from 'draft-js-mention-plugin';
import * as yup from 'yup';
import cn from 'classnames';
import useQuery, { useManualQuery } from 'apollo/query';
import useMutation from 'apollo/mutation';
import gql from 'graphql-tag';
import editorStyles from './editorStyles.css';
import Comment from './Item';

import 'sass/components/comments/_index.scss';

const commentsQuery = gql`
  subscription getComments($id: uuid) {
    comment(where: {risk_id: {_eq: $id}}) {
      id
      body
      user {
        first_name
        last_name
      }
      created_date
    }
  }
`;
const userQuery = gql`
  query getUsers($name: String) {
    user(where: {first_name: {_like: $name}, _or: {last_name: {_like: $name}}}) {
      id
      first_name
      last_name
      avatar
    }
  }
`;

const mentionPlugin = createMentionPlugin();
const { MentionSuggestions } = mentionPlugin;
const plugins = [mentionPlugin];

function Comments(props) {
  const [showForm, setShowForm] = useState(false);
  const { risk } = props;
  const [, onQueryUsers] = useManualQuery(userQuery);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [suggestions, setSuggestions] = useState([]);
  const commentsResponse = useQuery(commentsQuery, { ws: true, variables: { id: risk.id } });
  const { data: { comment: comments = [] } } = commentsResponse;
  console.log('comments: ', comments);
  const [mutationState, onMutate] = useMutation({ url: '/comment', onSuccess });
  const [formState, formHandlers] = useForm({ validator, onValid });
  const { onValidate, onElementChange, reset } = formHandlers;
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
              <div className={editorStyles.editor}>
                <Editor
                  editorState={editorState}
                  onChange={(newVal) => {
                    onElementChange(convertToRaw(newVal.getCurrentContent()), 'body');
                    setEditorState(newVal);
                  }}
                  plugins={plugins}
                />
                <MentionSuggestions
                  onSearchChange={onSearch}
                  suggestions={suggestions}
                />
              </div>
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

  function onSuccess() {
    reset();
    setEditorState(EditorState.createEmpty());
  }

  function onValid(data) {
    onMutate({
      data: { ...data, risk_id: risk.id },
      message: 'Comment successfully posted',
      onSuccess: () => {
        const state = EditorState.createEmpty();
        setEditorState(state);
        onElementChange(convertToRaw(state.getCurrentContent()), 'body');
      },
    });
  }

  async function onSearch({ value }) {
    const result = await onQueryUsers({ variables: { name: `%${value}%` } });
    setSuggestions(result.user.map(e => ({ ...e, name: `${e.first_name} ${e.last_name}`, link: '#' })));
  }
}

function validator(data) {
  const schema = yup.object({
    body: yup.object({
      blocks: yup.array().of(
        yup.object({
          text: yup.string().label('message').required(fieldIsRequired),
        }),
      ),
    }),
  });
  return getValidationResult(data, schema);
}

export default Comments;

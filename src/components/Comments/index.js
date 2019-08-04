import React, { useState } from 'react';
import Button from 'react-md/lib/Buttons/Button';
import useForm from 'lib/hooks/useForm';
import { getValidationResult, fieldIsRequired } from 'lib/tools';
import { EditorState, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import * as yup from 'yup';
import cn from 'classnames';
import useQuery from 'apollo/query';
import useMutation from 'apollo/mutation';
import gql from 'graphql-tag';
import mentions from './mentions';
import editorStyles from './editorStyles.css';
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

const mentionPlugin = createMentionPlugin();
const { MentionSuggestions } = mentionPlugin;
const plugins = [mentionPlugin];

function Comments(props) {
  const [showForm, setShowForm] = useState(false);
  const { risk } = props;
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [suggestions, setSuggestions] = useState([]);
  const commentsResponse = useQuery(commentsQuery, { ws: true, variables: { id: risk.id } });
  const { data: { comment: comments = [] } } = commentsResponse;
  const [mutationState, onMutate] = useMutation({ url: '/comment', onSuccess });
  const [formState, formHandlers] = useForm({
    initialFields: { message: '' }, validator, onValid,
  });
  const { onValidate, onChange, reset } = formHandlers;
  const { fields } = formState;

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
                    onChange(convertToRaw(newVal.getCurrentContent()), 'body');
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
    onMutate({ data: { ...data, risk_id: risk.id } });
  }

  function onSearch({ value }) {
    setSuggestions(defaultSuggestionsFilter(value, mentions));
  }
}

function validator(data) {
  const schema = yup.object({
    message: yup.string().required(fieldIsRequired),
  });
  return getValidationResult(data, schema);
}

export default Comments;

import React, { useState, useCallback } from 'react';
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
import debounce from 'lodash/debounce';
import editorStyles from './editorStyles.css';
import mentionsStyles from './mentionsStyles.css';
import Comment from './Item';


import 'sass/components/comments/_index.scss';

const commentsQuery = gql`
  subscription getComments($id: uuid) {
    comment(where: {risk_id: {_eq: $id}}, order_by: {created_date: desc}) {
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
  query searchUsers($name: String) {
    search_users(
      args: {search: $name}
    ){
      id,
      first_name
      last_name
    }
  }
`;

const mentionPlugin = createMentionPlugin({ theme: mentionsStyles });
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
  const [mutationState, onMutate] = useMutation({ url: '/comment', onSuccess });
  const [formState, formHandlers] = useForm({ validator, onValid });
  const { onValidate, onElementChange, reset } = formHandlers;
  const { fields } = formState;
  const debounceSearch = useCallback(debounce(onSearch, 1000), []);
  return (
    <div className="commentForm">
      <div className={cn('commentForm_replies', {
        'commentForm_replies-empty': !comments.length
      })}>
        {comments.length
          ? (
            <ul className="reply">
              {comments.map(comment => (
                <Comment key={comment.id} comment={comment} className="reply_item" />
              ))}
            </ul>
          )
          : (
            <h1 className="reply_empty">
              No Comments. Be the first to comment
            </h1>
          )
        }



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
              <div className="commentForm_actions_form_field">
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
                    onSearchChange={debounceSearch}
                    suggestions={suggestions}
                  />
                </div>
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
      hideDialog: false,
      message: 'Comment successfully posted',
      onSuccess: () => {
        const state = EditorState.createEmpty();
        setEditorState(state);
        onElementChange(convertToRaw(state.getCurrentContent()), 'body');
      },
    });
  }

  async function onSearch({ value }) {
    if (value) {
      const result = await onQueryUsers({ variables: { name: `%${value}%` } });
      setSuggestions(
        result.search_users
          .map(e => ({
            ...e,
            name: `${e.first_name} ${e.last_name}`,
            link: '#',
            avatar: '/static/img/default-avatar.png',
          })),
      );
      return;
    }
    setSuggestions([]);
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

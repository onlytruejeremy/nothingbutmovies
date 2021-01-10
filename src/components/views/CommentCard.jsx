import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../Auth";
import {
  Card,
  DropdownButton,
  Dropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { db } from "../../firebase";
function CommentCard({ comment, id, movieId, deleteComment }) {
  const { currentUser } = useContext(AuthContext);
  const editComment = (e) => {
    e.preventDefault();
    setEditMe(true);
    setModify(false);
  };
  const removeComment = (e) => {
    e.preventDefault();
    deleteComment(movieId, id);
  };
  useEffect(() => {
    if (currentUser == id) {
      setModify(true);
    }
  }, [id]);
  const [currentComment, setCurrentComment] = useState(comment);
  const [editMe, setEditMe] = useState(false);
  const [modify, setModify] = useState(false);
  const changeComment = (e) => {
    e.preventDefault();
    setCurrentComment(e.target.value);
  };

  const submitUpdate = (e) => {
    e.preventDefault();
    const commentRef = db
      .collection("comments")
      .doc(movieId)
      .collection("comment")
      .doc(currentUser);
    commentRef.update({ id: currentUser, comment: currentComment }).then(() => {
      setDisplayComment(currentComment);
      setModify(true);
      setEditMe(false);
    });
  };
  const [displayComment, setDisplayComment] = useState(comment);
  return (
    <Card className="bg-secondary text-white text-left">
      <Card.Body>
        <Card.Text>
          <p>{displayComment}</p>
          {!!modify ? (
            <p>
              <DropdownButton
                id="dropdown-basic-button"
                variant="dark"
                title="Modify"
              >
                <Dropdown.Item onClick={editComment}>Edit</Dropdown.Item>
                <Dropdown.Item onClick={removeComment}>Delete</Dropdown.Item>
              </DropdownButton>
            </p>
          ) : (
            ""
          )}
        </Card.Text>
        {editMe ? (
          <Form className="mx-auto mt-1" onSubmit={submitUpdate}>
            <FormControl
              type="text"
              placeholder="Comments"
              name="comment"
              className="mr-sm-2"
              maxLength="100"
              value={currentComment}
              onChange={changeComment}
            />
            <Button variant="outline-dark" className="my-3" type="submit">
              Update
            </Button>
          </Form>
        ) : (
          ""
        )}
      </Card.Body>
    </Card>
  );
}

export default CommentCard;

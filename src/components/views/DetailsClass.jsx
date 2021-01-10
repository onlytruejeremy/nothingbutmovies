import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Card,
  Col,
  Row,
  Button,
  Form,
  FormControl,
} from "react-bootstrap";
import { movieAPI as API } from "../../API";
import { useParams, useHistory, withRouter } from "react-router-dom";
import { db } from "../../firebase";
import { AuthContext } from "../../Auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CommentCard from "./CommentCard";
class DetailsClass extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      commentCards: [],
      mov: "",
      unLike: false,
      displayLike: false,
      showFeature: false,
    };
  }

  componentDidMount() {
    fetch(
      `${API.details}${this.props.match.params.id}?api_key=${API.key}&language=en-US`
    )
      .then((res) => res.json())
      .then((res) => {
        this.setState({ mov: res });
      });

    if (this.context.currentUser !== null) {
      //get likes
      const collectionRef = db
        .collection("liked")
        .doc(this.context.currentUser)
        .collection("likes")
        .doc(this.props.match.params.id);
      collectionRef.get().then((docSnapshot) => {
        if (docSnapshot.exists) {
          this.setState({ ...this.state, displayLike: false, unLike: true });
        } else {
          this.setState({ ...this.state, displayLike: true });
        }
      });
    } else {
      this.setState({ ...this.state, showFeature: true });
    }
    this.getComments();
  }
  getComments = async () => {
    let commentsData = [];
    const commentRef = db
      .collection("comments")
      .doc(this.props.match.params.id)
      .collection("comment");
    await commentRef.get().then((doc) => {
      doc.docs.forEach((doc) => {
        commentsData.push(doc.data());
        console.log(doc.data());
      });
    });

    this.setState({
      ...this.state,
      commentCards: commentsData.map((data) => {
        return (
          <CommentCard
            key={Math.random()}
            id={data.id}
            movieId={this.props.match.params.id}
            comment={data.comment}
            deleteComment={this.deleteCommentCard}
          />
        );
      }),
    });
  };

  back = (e) => {
    e.preventDefault();
    this.props.history.goBack();
  };

  addLike = (e) => {
    e.preventDefault();
    console.log("clicked like");
    const id = this.props.match.params.id;
    try {
      const collectionRef = db
        .collection("liked")
        .doc(this.context.currentUser)
        .collection("likes")
        .doc(id);
      collectionRef.set({ title: this.state.mov.title, id });
      toast.success("Liked");
      this.setState({ ...this.state, displayLike: false, unLike: true });
    } catch (error) {
      console.log(error.message);
    }
  };
  removeLike = (e) => {
    const id = this.props.match.params.id;
    const collectionRef = db
      .collection("liked")
      .doc(this.context.currentUser)
      .collection("likes")
      .doc(id);
    collectionRef.delete().then(() => {
      this.setState({ ...this.state, displayLike: true, unLike: false });
      toast.info("Like Removed");
    });
  };

  postComment = (e) => {
    e.preventDefault();
    const id = this.props.match.params.id;
    const commentRef = db
      .collection("comments")
      .doc(id)
      .collection("comment")
      .doc(this.context.currentUser);
    commentRef.get().then((docSnapshot) => {
      if (docSnapshot.exists) {
        toast.info("One Comment Per Movie");
      } else {
        commentRef
          .set({ id: this.context.currentUser, comment: this.state.comment })
          .then(() => {
            this.updateComments();
          });
      }
    });
  };
  updateComments = () => {
    const newComment = () => {
      const id = this.props.match.params.id;
      return (
        <CommentCard
          key={Math.random()}
          movieId={id}
          id={this.context.currentUser}
          comment={this.state.comment}
          deleteComment={this.deleteCommentCard}
        />
      );
    };
    const currentCards = [...this.state.commentCards];
    currentCards.push(newComment());
    this.setState({ ...this.state, comment: "", commentCards: currentCards });
  };
  commentChange = (e) => {
    e.preventDefault();
    this.setState({ ...this.state, comment: e.target.value });
  };

  deleteCommentCard = async (movieId, userId) => {
    const singleRef = db
      .collection("comments")
      .doc(movieId)
      .collection("comment")
      .doc(userId);
    await singleRef.delete();
    const currentCards = [...this.state.commentCards];
    let index = currentCards.findIndex((item) => item.props.id == userId);
    currentCards.splice(index, 1);
    this.setState({ ...this.state, commentCards: currentCards });
    toast.success("Removed Comment");
  };
  render() {
    return (
      <>
        <Container>
          <Card
            className="bg-dark m-5 text-info text-left mx-auto"
            style={{ maxWidth: "90vw" }}
          >
            <Card.Img
              src={`${API.image}${this.state.mov.poster_path}`}
              className="p-1 border border-white"
            />
            <Card.Body>
              <Card.Title className="text-center border-bottom border-secondary p-1">
                {this.state.mov.title}
              </Card.Title>
              <Card.Text className="border-bottom border-secondary p-1 m-1">
                {this.state.mov.overview}
              </Card.Text>

              <Card.Text>
                <Row>
                  <Col className="border-secondary border-left p-1">
                    <p>Companies:</p>
                    <p>
                      {this.state.mov.production_companies?.map((item) => {
                        return <p>{item.name}</p>;
                      })}
                    </p>
                  </Col>
                  <Col className="border-secondary border-left p-1">
                    <p>Genres:</p>
                    <p>
                      {this.state.mov.genres?.map((item) => {
                        return <p>{item.name}</p>;
                      })}
                    </p>
                  </Col>
                  <Col className="border-secondary border-left border-right p-1">
                    <p>Languages:</p>
                    <p>
                      {this.state.mov.spoken_languages?.map((item) => {
                        return <p>{item.name}</p>;
                      })}
                    </p>
                  </Col>
                </Row>
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button
                variant="outline-warning"
                className="m-3"
                onClick={this.back}
              >
                Back
              </Button>
              {!!this.state.displayLike ? (
                <Button
                  variant="outline-success"
                  name={this.props.match.params.id}
                  onClick={this.addLike}
                  className="m-3"
                >
                  Like
                </Button>
              ) : (
                ""
              )}
              {!!this.state.unLike ? (
                <Button
                  variant="outline-danger"
                  name={this.props.match.params.id}
                  onClick={this.removeLike}
                  className="m-3"
                >
                  Unlike
                </Button>
              ) : (
                ""
              )}
              {this.state.showFeature ? (
                <p className="text-info mx-auto m-1">
                  Register To Add To Favourites
                </p>
              ) : (
                ""
              )}
            </Card.Footer>
          </Card>
          <Card className="bg-dark text-secondary m-5 mx-auto">
            <Card.Title className="pt-3">Comments</Card.Title>
            <Card.Body>
              {!!this.context.currentUser ? (
                <Form className="mx-auto mt-1" onSubmit={this.postComment}>
                  <FormControl
                    type="text"
                    placeholder="Comments"
                    name="comment"
                    className="mr-sm-2"
                    maxLength="100"
                    value={this.state.comment}
                    onChange={this.commentChange}
                  />

                  <Button
                    variant="outline-secondary"
                    className="my-3"
                    type="submit"
                  >
                    Add Comment
                  </Button>
                </Form>
              ) : (
                ""
              )}
              {this.state.commentCards.length > 0
                ? this.state.commentCards
                : ""}
            </Card.Body>
          </Card>
          <ToastContainer />
        </Container>
      </>
    );
  }
}

export default withRouter(DetailsClass);

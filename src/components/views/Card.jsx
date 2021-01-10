import React from "react";
import { Card, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { useHistory } from "react-router-dom";
const SingleCard = ({ title, img, id }, ...otherProps) => {
  const history = useHistory();
  const triggerDetails = (e) => {
    e.preventDefault();
    history.push(`/details/${id}`);
  };
  return (
    <>
      <Card
        className="bg-secondary text-white m-3"
        style={{ minWidth: "18rem", minHeight: "18rem" }}
      >
        <Card.Img src={img} className="border border-white rounded-cirlce" />
        <Card.Body>
          <Card.Text>{title}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button variant="outline-light" onClick={triggerDetails}>
            Details
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
};

export default withRouter(SingleCard);

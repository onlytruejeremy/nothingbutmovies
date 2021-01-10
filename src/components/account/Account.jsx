import React, { useContext, useState, useEffect } from "react";

import { Container, Row, Card } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { db } from "../../firebase";
import { AuthContext } from "../../Auth";

const Account = (props) => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    try {
      db.collection("users")
        .doc(currentUser)
        .get()
        .then((snapShot) => {
          const user = snapShot.data();
          const { firstName, lastName, email } = user;
          setUserInfo({
            firstName,
            lastName,
            email,
          });
        });
    } catch (error) {
      alert(error);
    }
  }, [currentUser]);
  return (
    <Container>
      <Card className="bg-dark text-warning">
        <Card.Header>
          <Card.Title className="m-3">Account Info</Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Text className="text-left">
            <Row>
              <p className="mx-3">Name:</p>
              <p>
                {userInfo.firstName} {userInfo.lastName}
              </p>
            </Row>
            <Row>
              <p className="mx-3">Email:</p>
              <p>{userInfo.email}</p>
            </Row>
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default withRouter(Account);

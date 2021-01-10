import React, { useContext, useState, useEffect } from "react";
import { Card, Button, Container, Row } from "react-bootstrap";
import { useHistory, withRouter } from "react-router-dom";
import { AuthContext } from "../Auth";
import { app } from "../firebase";
const Main = (props) => {
  const history = useHistory();
  const pageChange = (e) => {
    e.preventDefault();
    switch (e.target.name) {
      case "logOut":
        const out = async () => {
          try {
            setLoggedIn(false);
            await app.auth().signOut();
          } catch (error) {
            setLoggedIn(true);
            console.log(error.message);
          }
        };
        out();
        break;
      case "logIn":
        history.push("/login");
        break;
      default:
        history.push(e.target.name);
    }
  };

  const { currentUser } = useContext(AuthContext);

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setLoggedIn(true);
    }
  }, [currentUser]);
  return (
    <Container className="mx-5 mx-auto">
      <Row>
        <Card className="bg-dark border border-info m-5 text-info w-100 mx-auto">
          <Card.Body>
            <Card.Text>
              <Button
                variant="outline-info"
                name=""
                onClick={pageChange}
                className="m-3"
              >
                Home
              </Button>
              {loggedIn ? (
                <>
                  <Button
                    variant="outline-info"
                    name="account"
                    onClick={pageChange}
                    className="m-3"
                  >
                    Account
                  </Button>
                  <Button
                    variant="outline-info"
                    name="favourites"
                    onClick={pageChange}
                    className="m-3"
                  >
                    Favourites
                  </Button>
                </>
              ) : (
                ""
              )}

              {loggedIn ? (
                <Button
                  variant="outline-info"
                  name="logOut"
                  onClick={pageChange}
                  className="m-3"
                >
                  Log Out
                </Button>
              ) : (
                <Button
                  variant="outline-info"
                  name="logIn"
                  onClick={pageChange}
                  className="m-3"
                >
                  Log In
                </Button>
              )}
            </Card.Text>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

export default withRouter(Main);

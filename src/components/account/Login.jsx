import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { app, db } from "../../firebase";
import { useHistory } from "react-router-dom";
const Login = (props) => {
  const history = useHistory();
  const [registerError, setRegisterError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [formSwitch, setFormSwitch] = useState(false);
  const registerValidation = Yup.object().shape({
    firstName: Yup.string()
      .min(3, "At Least 3 Characters, Max 15")
      .max(15, "At Least 3 Characters, Max 15")
      .required("First Name Required"),
    lastName: Yup.string()
      .min(3, "At Least 3 Characters, Max 15")
      .max(15, "At Least 3 Characters, Max 15")
      .required("Last Name Required"),
    email: Yup.string()
      .email()
      .min(6, "At Least 6 Characters, Max 30")
      .max(30, "At Least 6 Characters, Max 30")
      .required("Email Required"),
    password: Yup.string()
      .min(3, "At Least 3 Characters, Max 15")
      .max(15, "At Least 3 Characters, Max 15")
      .required("Password Required"),
    confirmPassword: Yup.string()
      .min(3, "At Least 3 Characters, Max 15")
      .max(15, "At Least 3 Characters, Max 15")
      .required("Confirm Password Required")
  });
  const registerForm = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: registerValidation,
    onSubmit: async (values) => {
      const { firstName, lastName, email, password, confirmPassword } = values;
      if (password === confirmPassword) {
        try {
          await app
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((userInfo) => {
              db.collection("users").doc(userInfo.user.uid).set({
                firstName,
                lastName,
                email
              });
            });
          setFormSwitch(false);
        } catch (error) {
          setRegisterError(error.message);
        }
      } else {
        alert("Password Must Match");
      }
    }
  });
  const loginValidation = Yup.object().shape({
    email: Yup.string()
      .email()
      .min(6, "At Least 6 Characters, Max 30")
      .max(30, "At Least 6 Characters, Max 30")
      .required("Email Required"),
    password: Yup.string()
      .min(3, "At Least 3 Characters, Max 15")
      .max(15, "At Least 3 Characters, Max 15")
      .required("Password Required")
  });
  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: loginValidation,
    onSubmit: async (values) => {
      const { email, password } = values;
      try {
        await app.auth().signInWithEmailAndPassword(email, password);
        history.push("/account");
      } catch (error) {
        setLoginError(error.message);
      }
    }
  });
  return (
    <Container className="mt-1 p-1">
      {formSwitch ? (
        <>
          <Card className="bg-dark text-white">
            <Card.Title className="mt-3">Register</Card.Title>
            <Card.Body>
              <Form onSubmit={registerForm.handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    name="firstName"
                    value={registerForm.values.firstName}
                    onChange={registerForm.handleChange}
                    type="text"
                    placeholder="First Name"
                  />
                  {
                    <p className="text-danger mt-1">
                      {registerForm.errors.firstName}
                    </p>
                  }
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={registerForm.values.lastName}
                    onChange={registerForm.handleChange}
                    placeholder="Last Name"
                  />
                  {
                    <p className="text-danger mt-1">
                      {registerForm.errors.lastName}
                    </p>
                  }
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    name="email"
                    value={registerForm.values.email}
                    onChange={registerForm.handleChange}
                    type="email"
                    placeholder="Enter email"
                  />
                  {
                    <p className="text-danger mt-1">
                      {registerForm.errors.email}
                    </p>
                  }
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    name="password"
                    value={registerForm.values.password}
                    onChange={registerForm.handleChange}
                    type="password"
                    placeholder="Password"
                  />
                  {
                    <p className="text-danger mt-1">
                      {registerForm.errors.password}
                    </p>
                  }
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    name="confirmPassword"
                    value={registerForm.values.confirmPassword}
                    onChange={registerForm.handleChange}
                    type="password"
                    placeholder="Password"
                  />
                  {
                    <p className="text-danger mt-1">
                      {registerForm.errors.confirmPassword}
                    </p>
                  }
                </Form.Group>
                {<p className="m-3 text-warning">{registerError}</p>}
                <Button variant="outline-light" type="submit">
                  Let's Go
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setFormSwitch(!formSwitch);
            }}
            className="m-5"
            variant="outline-dark"
          >
            Log In
          </Button>
        </>
      ) : (
        <>
          <Card className="bg-dark text-white">
            <Card.Title className="mt-3">Login</Card.Title>
            <Card.Body>
              <Form onSubmit={loginForm.handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={loginForm.values.email}
                    onChange={loginForm.handleChange}
                    placeholder="Enter email"
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                  {<p className="text-danger mt-1">{loginForm.errors.email}</p>}
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    name="password"
                    value={loginForm.values.password}
                    onChange={loginForm.handleChange}
                    type="password"
                    placeholder="Password"
                  />
                  {
                    <p className="text-danger mt-1">
                      {loginForm.errors.password}
                    </p>
                  }
                </Form.Group>
                {<p className="m-3 text-warning">{loginError}</p>}
                <Button variant="outline-light" type="submit">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setFormSwitch(!formSwitch);
            }}
            className="m-5"
            variant="outline-dark"
          >
            Register
          </Button>
        </>
      )}
    </Container>
  );
};

export default Login;

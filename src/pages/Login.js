import React, { useState } from 'react'
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './Login.css'
import { useLoginMutation } from '../services/appApi'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isError, isLoading, error }] = useLoginMutation();
  function handleLogin(e) {
      e.preventDefault();
      login({ email, password });
  }
  return (
      <Container>
          <Row>
              <Col md={6} className="login__form--container">
                  <Form style={{ width: "100%" }} onSubmit={handleLogin}>
                      <h1>Login Disini</h1>
                      {isError && <Alert variant="danger">{error.data}</Alert>}
                      <Form.Group>
                          <Form.Label>Email Anda</Form.Label>
                          <Form.Control type="email" placeholder="Masukan Email Anda" value={email} required onChange={(e) => setEmail(e.target.value)} />
                      </Form.Group>

                      <Form.Group className="mb-3">
                          <Form.Label>Password Anda</Form.Label>
                          <Form.Control type="password" placeholder="Masukan Password Anda" value={password} required onChange={(e) => setPassword(e.target.value)} />
                      </Form.Group>

                      <Form.Group>
                          <Button type="submit" disabled={isLoading}>
                              Login
                          </Button>
                      </Form.Group>

                      <p className="pt-3 text-center">
                          Belum Ada AKun ? <Link to="/signup">Buat Akun</Link>{" "}
                      </p>
                  </Form>
              </Col>
              <Col md={6} className="login__image--container"></Col>
          </Row>
      </Container>
  );
}


export default Login
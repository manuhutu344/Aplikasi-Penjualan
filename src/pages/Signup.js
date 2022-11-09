import React, {useState} from 'react'
import {Container, Row, Col, Form, Button, Alert} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import './Signup.css'
import { useSignupMutation } from '../services/appApi'

function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [signup, {error, isLoading, isError}] = useSignupMutation()

    function handleSignup(e){
      e.preventDefault()
      signup({name, email, password})
    }
  return (
    <Container>
    <Row>
    <Col md={6} className='signup__form--container'>
    <Form style={{width: '100%'}} onSubmit={handleSignup}>
    <h1>Buat Akun Anda</h1>
    {isError && <Alert variant='danger'>{error.data}</Alert>}
    <Form.Group>
    <Form.Label>
    Masukan Nama Anda 
    </Form.Label>
    <Form.Control type='text' placeholder='Apa Nama Anda' value={name} required onChange={(e) =>setName(e.target.value)} />
    </Form.Group>
    <Form.Group>
    <Form.Label>
    Alamat Email Anda
    </Form.Label>
    <Form.Control type='email' placeholder='Masukan Email Anda' value={email} required onChange={(e) =>setEmail(e.target.value)} />
    </Form.Group>
    <Form.Group>
    <Form.Label>
    Masukan Password Anda
    </Form.Label>
    <Form.Control type='password' placeholder='Masukan Password Anda' value={password} required onChange={(e) =>setPassword(e.target.value)}/>
    </Form.Group>
    <Form.Group>
    <Button type='submit' disabled={isLoading}>
    Masuk
    </Button>
    </Form.Group>
    <p>Sudah Punya Akun ? <Link to='/login'>Masuk Ke Login</Link> </p>
    </Form>
    </Col>
    <Col md={6} className='signup__image--container'></Col>
    </Row>
    </Container>
  )
}

export default Signup
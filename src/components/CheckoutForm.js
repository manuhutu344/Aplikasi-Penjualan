import React, { useState } from 'react'
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useCreateOrderMutation } from '../services/appApi'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState("");
    const [createOrder, { isLoading, isError, isSuccess }] = useCreateOrderMutation();
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [paying, setPaying] = useState(false);

    async function handlePay(e) {
        e.preventDefault();
        if (!stripe || !elements || user.cart.count <= 0) return;
        setPaying(true);
        const { client_secret } = await fetch("http://localhost:8080/create-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer ",
            },
            body: JSON.stringify({ amount: user.cart.total }),
        }).then((res) => res.json());
        const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });
        setPaying(false);

        if (paymentIntent) {
            createOrder({ userId: user._id, cart: user.cart, address, country }).then((res) => {
                if (!isLoading && !isError) {
                    setAlertMessage(`Pembayaran ${paymentIntent.status}`);
                    setTimeout(() => {
                        navigate("/orders");
                    }, 3000);
                }
            });
            
        }
    }


  return (
    <Col md={7} className='cart-payment-container'>
    <Form onSubmit={handlePay}>
    <Row>
    {alertMessage && <Alert>{alertMessage}</Alert>}
    <Col md={6}>
    <Form.Group className='mb-3'>
    <Form.Label>Nama Lengkap</Form.Label>
    <Form.Control type='text' placeholder='Nama Panjang' value={user.name} disabled/>
    </Form.Group>
    </Col>
    <Col md={6}>
    <Form.Group className='mb-3'>
    <Form.Label>Email</Form.Label>
    <Form.Control type='text' placeholder='Email' value={user.email} disabled/>
    </Form.Group>
    </Col>
    </Row>
    <Row>
    <Col md={7}>
    <Form.Group className='mb-3'>
    <Form.Label>Alamat</Form.Label>
    <Form.Control type='text' placeholder='Masukan Alamat Anda' value={address} onChange={(e)=>setAddress(e.target.value)} required />
    </Form.Group>
    </Col>
    <Col md={5}>
    <Form.Group className='mb-3'>
    <Form.Label>Country</Form.Label>
    <Form.Control type='text' placeholder='Country' value={country} onChange={(e)=>setCountry(e.target.value)} required />
    </Form.Group>
    </Col>
    </Row>
    <label htmlFor='card-element'>Card</label>
    <CardElement id='card-element' />
    <Button className='mt-3' type='submit' disabled={user.cart.count <= 0 || paying || isSuccess}>
    {paying ? 'Sedang Memproses' : 'Bayar'}
    </Button>
    </Form>
    </Col>
  )
}

export default CheckoutForm
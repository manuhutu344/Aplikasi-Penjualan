import React from 'react'
import { Alert, Col, Container, Row, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import './CartPage.css'
import { useIncreaseCartProductMutation, useDecreaseCartProductMutation, useRemoveFromCartMutation } from '../services/appApi'
import {loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js'
import CheckoutForm from '../components/CheckoutForm'

const stripePromise = loadStripe('pk_test_51LwzfBDTuiHhvbXS4I5aypJEZLTWcDWyYbhgyZ2mtTgLJ06wHsSPyAHyo5WTINgjbaN5dNkEI7vGe88Sajn32VZI00JexoX4cA')

function CartPage() {
    const user = useSelector((state)=> state.user)
    const products = useSelector((state)=> state.produk)
    const userCartObj = user.cart
    let cart = products.filter((product)=> userCartObj[product._id] !=null)

    const [increaseCart] = useIncreaseCartProductMutation()
    const [decreaseCart] = useDecreaseCartProductMutation()
    const [removeFromCart, {isLoading}] = useRemoveFromCartMutation()


    function handleDecrease(produk) {
      const quantity = user.cart.count;
      if (quantity <= 0) return alert("Tidak Bisa Di Proses");
      decreaseCart(produk);
  }
  

  return (
    <Container style={{minHeight: '95vh'}} className='cart-container'>
    <Row>
    <Col>
    <h1 className='pt-2 h3'>Kartu Belanja</h1>
    {cart.length == 0 ? (
        <Alert variant='info' >Tidak ada yang anda beli</Alert>
    ) : (
      <Elements stripe={stripePromise}><CheckoutForm /></Elements>
    )
}
</Col>
{cart.length > 0 && (
<Col md={5}>
  <>
  <Table responsive='sm' className='cart-table'>
  <thead>
  <tr>
  <th>&nbsp;</th>
  <th>Produk</th>
  <th>Harga</th>
  <th>Kuantitas</th>
  <th>Subtotal</th>
  </tr>
  </thead>
  <tbody>
  {cart.map((item)=>(
    <tr>
    <td>&nbsp;</td>
    <td>
    {!isLoading && <i className='fa fa-times' style={{marginRight: 10, marginLeft: 10,cursor: 'pointer'}} onClick={()=>removeFromCart({productId: item._id, price: item.price, userId: user._id})}></i>}
    <img src={item.pictures[0].url} style={{width: 100, height: 100, objectFit: 'cover'}} />
    </td>
    <td>
    RP.{item.price}
    </td>
    <td>
    <span className='quantity-indicator'>
    <i className='fa fa-minus-circle' onClick={() => handleDecrease({productId: item._id, price: item.price, userId: user._id})}></i>
    <span>{user.cart[item._id]}</span>
    <i className='fa fa-plus-circle' onClick={()=>increaseCart({productId: item._id, price: item.price, userId: user._id})}></i>
    </span>
    </td>
    <td>Rp.{item.price * user.cart[item._id]}</td>
    </tr>
  ))}
  </tbody>
  </Table>
  <div>
  <h3 className='h4 pt-4'>Total Semua: Rp.{user.cart.total}</h3>
  </div>
  </>

</Col>
)}
    </Row>
    </Container>
  )
}

export default CartPage
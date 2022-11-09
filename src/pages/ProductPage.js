import React, { useEffect, useState } from 'react'
import AliceCarousel from 'react-alice-carousel'
import "react-alice-carousel/lib/alice-carousel.css";
import { Badge, Button, ButtonGroup, Col, Container, Form, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { useParams } from 'react-router-dom'
import axios from '../axios'
import Loading from '../components/Loading'
import SimilarProduct from '../components/SimilarProduct'
import ToastMessage from '../components/ToastMessage';
import { useAddToCartMutation } from '../services/appApi';
import './ProductPage.css'

function ProductPage() {
    const {id} = useParams()
    const user = useSelector((state)=> state.user)
    const [product, setProduct] = useState(null)
    const [similar, setSimilar] = useState(null)
    const [addToCart, {isSuccess}] = useAddToCartMutation()
    const handleDragStart = (e) => e.preventDefault()
    useEffect(() =>{
        axios.get(`/products/${id}`)
        .then(({data})=>{
            setProduct(data.product)
            setSimilar(data.similar)
        })
    }, [id])
    
    if(!product){
        return <Loading />
    }
    const responsive ={
        0: {items: 1},
        568: {items: 2},
        1024: {items: 3},
    }
    const images = product.pictures.map((picture) => <img className='product__carousel--image' src={picture.url} onDragStart={handleDragStart} />)

    let similarProducts = []
    if(similar){
        similarProducts = similar.map((product, idx)=>(
            <div className='item' data-value={idx}>
            <SimilarProduct {...product}/>
            </div>
        ))
    }

  return (
    <Container className='pt-4' style={{position: 'relative'}}>
    <Row>
    <Col lg={6}>
    <AliceCarousel mouseTracking items={images} controlsStrategy='alternate' />
    </Col>
    <Col lg={6} className='pt-4'>
    <h1>{product.name}</h1>
    <p>
    <Badge bg='warning' text='dark'>{product.category}</Badge>
    </p>
    <p className='product__price'>Rp{product.price}</p>
    <p style={{textAlign: 'justify'}} className='py-3'>
    <strong>Deskripsi Produk:</strong>{product.description}
    </p>
    {user && !user.isAdmin &&(
        <ButtonGroup style={{width: '90%'}}>
        <Button size='lg' onClick={()=> addToCart({userId: user._id, productId: id, price: product.price, image: product.pictures[0].url})}>
        Tanbahkan Ke Keranjang
        </Button>
        </ButtonGroup>
    )}
    {user && user.isAdmin &&(
        <LinkContainer to={`/product/${product._id}/edit`}>
        <Button size='lg'>Edit Produk</Button>
        </LinkContainer>
    )}
    {isSuccess && <ToastMessage bg='info' title='Di Tambahkan' body={`${product.name} Masuk Ke Dalam Keranjang`} />}
    </Col>
    </Row>
    <div className='my-4'>
    <h2>Produk Sejenis</h2>
    <div className='d-flex justify-content-center align-items-center flex-wrap'>
    <AliceCarousel mouseTracking items={similarProducts} responsive={responsive} controlsStrategy='alternate' />
    </div>
    </div>
    </Container>
  )
}

export default ProductPage
import React, { useEffect, useState } from 'react'
import { Alert, Col, Container, Row, Form, Button  } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateProductMutation } from '../services/appApi';
import axios from '../axios';
import './EditProductPage.css'

function EditProductPage() {
    const {id} = useParams()
  const [name, setName] = useState('')
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imgToRemove, setImgToRemove] = useState(null)
  const navigate = useNavigate()
  const [updateProduct, {isError, error, isLoading, isSuccess}] = useUpdateProductMutation()

  useEffect(()=>{
    axios.get('/products/' + id)
    .then(({data})=>{
        const product = data.product
        setName(product.name)
        setDescription(product.description)
        setCategory(product.category)
        setImages(product.pictures)
        setPrice(product.price)
    })
    .catch((e)=>console.log(e))
  }, [id])

  function handleRemoveImg(imgObj){
    setImgToRemove(imgObj.public_id)
    axios.delete(`/images/${imgObj.public_id}/`).then((res)=>{
      setImgToRemove(null)
      setImages((prev)=>prev.filter((img)=>img.public_id !== imgObj.public_id))
    })
    .catch((e)=>console.log(e))
  }

  function handleSubmit(e){
    e.preventDefault()
    if(!name || !description || !price || !category || !images.length){
      return alert('tolong masukan datanya')
    }
    updateProduct({id, name, description, price, category, images})
    .then(({data})=>{
      if(data.length > 0){
        setTimeout(()=>{
          navigate('/admin')
        }, 1500)
      }
    })
  }

  function showWidget(){
    const widget = window.cloudinary.createUploadWidget(
      {
      cloudName: 'ddr4gso17',
      uploadPreset: 'x8drrrls'
    },
    (error, result) =>{
      if(!error && result.event === 'success'){
        setImages((prev)=>[...prev, {url: result.info.url, public_id: result.info.public_id}])
      }
    }
    );
    widget.open()
  }
  return (
    <Container>
    <Row>
    <Col md={6} className='new-product__form--container'>
    <Form style={{width: '100%'}} onSubmit={handleSubmit}>
    <h1 className='mt-4'>Edit Produk Anda</h1>
    {isSuccess && <Alert variant='success'>Berhasil Mengedit Produk Anda</Alert>}
    {isError && <Alert variant='danger'>{error.data}</Alert>}
    <Form.Group className = 'mb-3'>
    <Form.Label>
    Nama Produk Anda
    </Form.Label>
    <Form.Control type='text' placeholder='Nama Produk' value={name} required onChange={(e) =>setName(e.target.value)} />
    </Form.Group>

    <Form.Group className='mb-3'>
    <Form.Label>
    Deskripsikan Produk Anda
    </Form.Label>
    <Form.Control as='textarea' placeholder='Deskripsi Produk Anda' style={{height: '100px'}} value={description} required onChange={(e) =>setDescription(e.target.value)} />
    </Form.Group>

    <Form.Group className='mb-3'>
    <Form.Label>
    Harganya (RP)
    </Form.Label>
    <Form.Control type='number' placeholder='Harga Produk'  value={price} required onChange={(e) =>setPrice(e.target.value)} />
    </Form.Group>
    
    <Form.Group className='mb-3' onChange={(e)=>setCategory(e.target.value)}>
    <Form.Label>
    Categori Produk Anda
    </Form.Label>
    <Form.Select value={category}>
    <option disabled selected>
    -- Pilih Salah Satu --
    </option>
    <option value='technology'>
    Technology
    </option>
    <option value='tablets'>
    Tablets
    </option>
    <option value='phones'>
    Phones
    </option>
    <option value='laptops'>
    Laptops
    </option>
    </Form.Select>
    </Form.Group>

    <Form.Group className='mb-3'>
    <Button type='button' onClick={showWidget}>Masukan Gambar Produk Anda</Button>
    <div className='images-preview-container'>
    {images.map((image) => (
      <div className='image-preview'>
      <img src={image.url} />
      {imgToRemove != image.public_id &&<i className='fa fa-times-circle' onClick={()=>handleRemoveImg(image)}></i>}
      </div>
  ))}
    </div>
    </Form.Group>

    <Form.Group>
    <Button type='submit' disabled={isLoading || isSuccess}>
    Edit Produk
    </Button>
    </Form.Group>

    </Form>
    </Col>
    <Col md={6} className='Edit-Product__image--container'>
    </Col>
    </Row>
    </Container>
  )
}

export default EditProductPage
import React, {useEffect, useState} from 'react'
import { Badge, Container, Table } from 'react-bootstrap'
import {useSelector} from 'react-redux'
import axios from '../axios'
import Loading from '../components/Loading'
import Pagination from '../components/Pagination'
import './OrdersPage.css'


function OrdersPage() {
    const user = useSelector((state)=>state.user)
    const products = useSelector((state)=>state.produk)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [ordersToShow, setOrderToShow] = useState([])
    const [show, setShow] = useState(false)

    useEffect(()=>{
      setLoading(true)
      axios
      .get(`/users/${user._id}/orders`)
      .then(({data})=>{
        setLoading(false)
        setOrders(data)
      })
      .catch((e)=>{
        setLoading(false)
        console.log(e)
      })
    }, [])

    if(loading){
      return <Loading />
    }

    if(orders.length == 0){
      return <h1 className='text-center pt-3'>Anda Tidak Memiliki Orderan</h1>
    }

    function TableRow({_id, status, date, total }){
      return(
        <tr>
      <td>{_id}</td>
      <td>
      <Badge bg={`${status == 'processing' ? 'warning' : 'success'}`} text='white'>
      {status}
      </Badge>
      </td>
      <td>{date}</td>
      <td>RP{total}</td>
      </tr>
      )
    }

  return (
    <Container>
    <h1 className='text-center'>Orderan Anda</h1>
    <Table responsive striped bordered hover>
    <thead>
    <tr>
    <th>Id Barang</th>
    <th>Status</th>
    <th>Tanggal</th>
    <th>Total</th>
    </tr>
    </thead>
    <tbody>
    <Pagination data={orders} RenderComponent={TableRow} pageLimit={1} dataLimit={5} tablePagination={true}/>
    </tbody>
    </Table>
    </Container>
  )
}

export default OrdersPage
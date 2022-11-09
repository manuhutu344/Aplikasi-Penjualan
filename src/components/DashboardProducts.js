import React from 'react'
import { Button, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useDeleteProductMutation } from '../services/appApi'
import Pagination from './Pagination'
import './DashboardProducts.css'

function DashboardProducts() {
    const products = useSelector((state)=>state.produk)
    const user = useSelector((state)=>state.user)
    const [deletProduct, {isLoading}] = useDeleteProductMutation()

    function handleDeleteProduct(id){
        if(window.confirm('Apakah Anda Yakin ?'))deletProduct({product_id: id, user_id: user._id})
    }

    function TableRow({ pictures, _id, name, price }){
      return(
        <tr>
        <td>
        <img src={pictures[0].url} className='dashboard-product-preview' />
        </td>
        <td>{_id}</td>
        <td>{name}</td>
        <td>{price}</td>
        <td>
        <Button onClick={()=>handleDeleteProduct(_id, user._id)} disabled={isLoading}>Hapus</Button>
        <Link to={`/product/${_id}/edit`} className='btn btn-warning'>Edit</Link>
        </td>
        </tr>
      )
    }

  return (
    <Table striped bordered hover responsive>
    <thead>
    <tr>
    <th></th>
    <th>Produk Id</th>
    <th>Nama Produk</th>
    <th>Harga Produk(RP)</th>
    </tr>
    </thead>
    <tbody>
    <Pagination data={products} RenderComponent={TableRow} pageLimit={1} dataLimit={5} tablePagination={true} />
    </tbody>
    </Table>
  )
}

export default DashboardProducts
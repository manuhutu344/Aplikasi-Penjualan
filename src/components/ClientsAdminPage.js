import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import axios from '../axios'
import Loading from './Loading'
import Pagination from'./Pagination'

function ClientsAdminPage() {
    const[users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        setLoading(true)
        axios.get('/users')
        .then(({data})=>{
            setLoading(false)
            setUsers(data)
        }).catch((e)=>{
            setLoading(false)
        })
    }, [])
    if(loading) return <Loading />
    if(users.length == 0) return <h2 className='py-2 text-center'>Tidak Ada Usernya</h2>
    function TableRow({_id, name, email}){
      return(
        <tr>
      <td>{_id}</td>
      <td>{name}</td>
      <td>{email}</td>
      </tr>
      )
    }
  return (
    <Table responsive striped bordered hover>
    <thead>
    <tr>
    <th>Id user</th>
    <th>Nama</th>
    <th>Email</th>
    </tr>
    </thead>
    <tbody>
    <Pagination data={users} RenderComponent={TableRow} pageLimit={1} dataLimit={5} tablePagination={true}/>
    </tbody>
    </Table>
  )
}

export default ClientsAdminPage
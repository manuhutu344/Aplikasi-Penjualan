import React, { useRef, useState } from 'react'
import {Navbar, Nav, Container, NavDropdown, Button} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { logout, resetNotifications } from '../features/userSlice';
import axios from '../axios'
import './Navigation.css'

function Navigation() {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const bellRef = useRef(null)
  const notificationRef = useRef(null)
  const [bellPos, setBellPos] = useState({})

  function handleLogout(){
    dispatch(logout())
  }

  const unreadNotifications = user?.notifications?.reduce((acc, current)=>{
    if(current.status == 'unread') return acc + 1
    return acc
  }, 0)

  function handleToggleNotifications(){
    const position = bellRef.current.getBoundingClientRect()
    setBellPos(position)
    notificationRef.current.style.display = notificationRef.current.style.display === 'block' ? 'none' : 'block'
    dispatch(resetNotifications())
   if(unreadNotifications > 0) axios.post(`/users/${user._id}/updateNotifications`)
  }

  return (
    <Navbar bg="light" expand="lg">
      <Container>
      <LinkContainer to='/'>
      <Navbar.Brand>Belanja Ajah Gaes</Navbar.Brand>
      </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
          {!user && (
            <>
            <LinkContainer to='/login'>
            <Nav.Link>Login Sini</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/signup'>
            <Nav.Link>Buat Akun Disini</Nav.Link>
            </LinkContainer>
            </>
            )}
            {user && !user.isAdmin && (
              <LinkContainer to="/cart">
                  <Nav.Link>
                      <i className="fas fa-shopping-cart"></i>
                      {user?.cart.count > 0 && (
                          <span className="badge badge-warning" id="cartcount">
                              {user.cart.count}
                          </span>
                      )}
                  </Nav.Link>
              </LinkContainer>
          )}
            {user && (
              <>
              <Nav.Link style={{ position: "relative" }} onClick={handleToggleNotifications}>
              <i className="fas fa-bell" ref={bellRef} data-count={unreadNotifications || null}></i>
              </Nav.Link>
            <NavDropdown title={`${user.email}`} id="basic-nav-dropdown">
            {user.isAdmin &&(
            <>
            <LinkContainer to='/'>
            <NavDropdown.Item>Halaman Utama</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to='/new-product'>
            <NavDropdown.Item>Buat Produk Anda</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to='/admin'>
            <NavDropdown.Item>Pengelolah Admin</NavDropdown.Item>
            </LinkContainer>
              </>
              )}
              {!user.isAdmin && (
                <>
                <LinkContainer to='/cart'>
                <NavDropdown.Item>Keranjang</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/orders'>
                <NavDropdown.Item>Orderan Anda</NavDropdown.Item>
                </LinkContainer>
                </>
              )}
              <NavDropdown.Divider />
              <Button variant='danger' onClick={handleLogout} className='logout-btn'>Keluar</Button>
            </NavDropdown>
            </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <div className='notifications-container' ref={notificationRef} style={{position: 'absolute',top: bellPos.top + 30, left: bellPos.left, display: "none" }}>
      {user?.notifications.length > 0 ? (
      user?.notifications.map((notification)=>(
        <p className={`notification-${notification.status}`}>
        {notification.message}
        <br />
        <span>{notification.time.split("T")[0] + " " + notification.time.split("T")[1]}</span>
        </p>
      ))
      ):(
        <p>Tidak Ada Pemesanan</p>
      )}
      </div>
    </Navbar>
  );
}

export default Navigation
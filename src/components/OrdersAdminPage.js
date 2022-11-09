import React, { useState, useEffect} from 'react'
import { Table, Badge, Button, Modal } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import axios from '../axios'
import Loading from './Loading'
import Pagination from './Pagination'
import './DashboardProducts.css'

function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const products = useSelector((state) => state.produk);
  const [orderToShow, setOrderToShow] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  function markShipped(orderId, ownerId) {
      axios
          .patch(`/orders/${orderId}/mark-shipped`, { ownerId })
          .then(({ data }) => setOrders(data))
          .catch((e) => console.log(e));
  }

  function showOrder(productsObj) {
      let productsToShow = products.filter((product) => productsObj[product._id]);
      productsToShow = productsToShow.map((product) => {
          const productCopy = { ...product };
          productCopy.count = productsObj[product._id];
          delete productCopy.description;
          return productCopy;
      });
      setShow(true);
      setOrderToShow(productsToShow);
  }

  useEffect(() => {
      setLoading(true);
      axios
          .get("/orders")
          .then(({ data }) => {
              setLoading(false);
              setOrders(data);
          })
          .catch((e) => {
              setLoading(false);
          });
  }, []);

  if (loading) {
      return <Loading />;
  }

  if (orders.length === 0) {
      return <h1 className="text-center pt-4">Tidak Ada Orderan</h1>;
  }

  function TableRow({ _id, count, owner, total, status, products, address, date }) {
      return (
          <tr>
              <td>{_id}</td>
              <td>{owner?.name}</td>
              <td>{count}</td>
              <td>{total}</td>
              <td>{address}</td>
              <td>{ date}</td>
              <td>
                  {status === "processing" ? (
                      <Button size="sm" onClick={() => markShipped(_id, owner?._id)}>
                      Konfirmasi Terkirim
                      </Button>
                  ) : (
                      <Badge bg="success">Sedang Dikirim</Badge>
                  )}
              </td>
              <td>
                  <span style={{ cursor: "pointer" }} onClick={() => showOrder(products)}>
                      Lihat Orderan <i className="fa fa-eye"></i>
                  </span>
              </td>
          </tr>
      );
  }

  return (
      <>
          <Table responsive striped bordered hover>
              <thead>
                  <tr>
                      <th>Id Barang</th>
                      <th>Nama Pemesan</th>
                      <th>Jumlah Barang</th>
                      <th>Total</th>
                      <th>Alamat</th>
                      <th>Tanggal Pemesanan</th>
                  </tr>
              </thead>
              <tbody>
                  <Pagination data={orders} RenderComponent={TableRow} pageLimit={1} dataLimit={5} tablePagination={true} />
              </tbody>
          </Table>

          <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                  <Modal.Title>Detail Pemesanan</Modal.Title>
              </Modal.Header>
              {orderToShow.map((order) => (
                  <div className="order-details__container d-flex justify-content-around py-2">
                      <img src={order.pictures[0].url} style={{ maxWidth: 100, height: 100, objectFit: "cover" }} />
                      <p>
                          <span>{order.count} x </span> {order.name}
                      </p>
                      <p>Harga: RP{Number(order.price) * order.count}</p>
                  </div>
              ))}
              <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                      Tutup
                  </Button>
              </Modal.Footer>
          </Modal>
      </>
  );
}

export default OrdersAdminPage
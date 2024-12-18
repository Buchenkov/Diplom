import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap';
import api from '../api';

const SearchMachine = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [machine, setMachine] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setMachine(null);
    try {
      const response = await api.get('/search_machine/', {
        params: { serial_number: serialNumber },
      });
      setMachine(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('Данных о машине с таким заводским номером нет в системе');
      } else {
        setError('Произошла ошибка при поиске машины');
      }
    }
  };

  return (
    <Container className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <h2>Поиск машины по заводскому номеру</h2>
          <Form onSubmit={handleSearch}>
            <Form.Group controlId="formSerialNumber">
              <Form.Label>Заводской номер</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите заводской номер машины"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Поиск
            </Button>
          </Form>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          {machine && (
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>Зав. № машины</th>
                  <th>Модель техники</th>
                  <th>Модель двигателя</th>
                  <th>Зав. № двигателя</th>
                  <th>Модель трансмиссии</th>
                  <th>Зав. № трансмиссии</th>
                  <th>Модель ведущего моста</th>
                  <th>Зав. № ведущего моста</th>
                  <th>Модель управляемого моста</th>
                  <th>Зав. № управляемого моста</th>
                  </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{machine.serial_number}</td>
                  <td>{machine.model}</td>
                  <td>{machine.engine_model}</td>
                  <td>{machine.engine_serial_number}</td>
                  <td>{machine.transmission_model}</td>
                  <td>{machine.transmission_serial_number}</td>
                  <td>{machine.drive_axle_model}</td>
                  <td>{machine.drive_axle_serial_number}</td>
                  <td>{machine.steer_axle_model}</td>
                  <td>{machine.steer_axle_serial_number}</td>
                </tr>
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchMachine;
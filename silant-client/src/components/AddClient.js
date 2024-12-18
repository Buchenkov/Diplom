import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import api from '../api';

const AddClient = () => {
  const [name, setName] = useState('');

  const handleAddClient = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await api.post('/clients/', { name }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Клиент добавлен успешно!');
      setName('');
    } catch (error) {
      alert('Ошибка при добавлении клиента');
    }
  };

  return (
    <Container className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <h2>Добавить Клиента</h2>
          <Form onSubmit={handleAddClient}>
            <Form.Group controlId="formName">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите имя клиента"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Добавить
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddClient;
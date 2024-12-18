import React, { useEffect, useState } from 'react';
import { Table, Container } from 'react-bootstrap';
import api from '../api';

const Machines = () => {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const fetchMachines = async () => {
      const token = localStorage.getItem('token');
      const response = await api.get('/machines/', {
        headers: {
          Authorization:` Bearer ${token}`,
        },
      });
      setMachines(response.data);
    };

    fetchMachines();
  }, []);

  return (
    <Container>
      <h2>Машины</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Зав. № машины</th>
            <th>Модель техники</th>
            <th>Модель двигателя</th>
            <th>Зав. № двигателя</th>
            {/* Добавьте остальные столбцы */}
          </tr>
        </thead>
        <tbody>
          {machines.map((machine) => (
            <tr key={machine.serial_number}>
              <td>{machine.serial_number}</td>
              <td>{machine.model}</td>
              <td>{machine.engine_model}</td>
              <td>{machine.engine_serial_number}</td>
              {/* Добавьте остальные данные */}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Machines;
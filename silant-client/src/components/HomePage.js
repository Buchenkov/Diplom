import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Container, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './HomePage.css';

const HomePage = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [machine, setMachine] = useState(null);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setMachine(null);

    try {
      const response = await api.get('/search_machine/', {
        params: { serial_number: serialNumber },
      });
      if (response.status === 200) {
        console.log('Data received from API:', response.data);  // Отладочный вывод
        setMachine(response.data);
      } else {
        setError('Данных о машине с таким заводским номером нет в системе');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('Данных о машине с таким заводским номером нет в системе');
      } else {
        setError('Произошла ошибка при поиске машины');
      }
    }
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setIsAuthenticated(false);
    } else {
      navigate('/login');
    }
  };

  // Функции для получения названий моделей
  const getModelName = (model) => {
    console.log('Model data:', model);  // Отладочный вывод
    return typeof model === 'string' ? model : model ? model.name : 'Не указана';
  };

  return (
    <div>
      <header className="custom-header">
        <div className="header-top">
          <div className="logo">
            <img src="/Logotype accent RGB 2.jpg" alt="Логотип" className="logo-image" />
          </div>
          <div className="contact-box">
            <span className="contact">+7-8352-20-12-09, telegram</span>
          </div>
          <Button className="auth-button" onClick={handleAuthClick}>
            {isAuthenticated ? 'Выход' : 'Авторизация'}
          </Button>
        </div>
        <div className="intro-text-container">
          <div className="intro-text">Электронная сервисная книжка "Мой Силант"</div>
        </div>
      </header>

      <Container className="main-content">
        <p className="info-text">Проверьте комплектацию и технические характеристики техники Силант.</p>

        <Form onSubmit={handleSearch} className="search-box mb-4">
          <Row className="justify-content-center"><Col md={8}>
              <Form.Group controlId="formSerialNumber">
                <Form.Control
                  type="text"
                  placeholder="Введите заводской номер"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button variant="primary" type="submit">
                Поиск
              </Button>
            </Col>
          </Row>
        </Form>

        {error && <Alert variant="danger">{error}</Alert>}

        {machine && (
          <>
            <div className="search-result-title">Результат поиска:</div>
            <div className="info-box">Информация о комплектации и технических характеристиках Вашей техники</div>
            <div className="table-container">
              <Table striped bordered hover className="data-table">
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
                    <td>{getModelName(machine.model)}</td>
                    <td>{getModelName(machine.engine_model)}</td>
                    <td>{machine.engine_serial_number}</td>
                    <td>{getModelName(machine.transmission_model)}</td>
                    <td>{machine.transmission_serial_number}</td>
                    <td>{getModelName(machine.drive_axle_model)}</td>
                    <td>{machine.drive_axle_serial_number}</td>
                    <td>{getModelName(machine.steer_axle_model)}</td>
                    <td>{machine.steer_axle_serial_number}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </>
        )}
      </Container>

      <footer className="custom-footer">
        <div className="footer-box">
          <span className="footer-contact">+7-8352-20-12-09, telegram</span>
        </div>
        <div className="footer-box">
          <span className="footer-brand">Мой Силант 2022</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
          



// import React, { useState } from 'react';
// import { Form, Button, Row, Col, Alert, Container, Table } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import api from '../api';
// import './HomePage.css';

// const HomePage = () => {
//   const [serialNumber, setSerialNumber] = useState('');
//   const [machine, setMachine] = useState(null);
//   const [error, setError] = useState('');
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMachine(null);

//     try {
//       const response = await api.get('/search_machine/', {
//         params: { serial_number: serialNumber },
//       });
//       if (response.status === 200) {
//         console.log('Data received from API:', response.data);  // Отладочный вывод
//         setMachine(response.data);
//       } else {
//         setError('Данных о машине с таким заводским номером нет в системе');
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         setError('Данных о машине с таким заводским номером нет в системе');
//       } else {
//         setError('Произошла ошибка при поиске машины');
//       }
//     }
//   };

//   const handleAuthClick = () => {
//     if (isAuthenticated) {
//       setIsAuthenticated(false);
//     } else {
//       navigate('/login');
//     }
//   };

//   // Функции для получения названий моделей
//   const getModelName = (model) => {
//     console.log('Model data:', model);  // Отладочный вывод
//     return model ? model.name : 'Не указана';
//   };

//   return (
//     <div>
//       <header className="custom-header">
//         <div className="header-top">
//           <div className="logo">
//             <img src="/Logotype accent RGB 2.jpg" alt="Логотип" className="logo-image" />
//           </div>
//           <div className="contact-box">
//             <span className="contact">+7-8352-20-12-09, telegram</span>
//           </div>
//           <Button className="auth-button" onClick={handleAuthClick}>
//             {isAuthenticated ? 'Выход' : 'Авторизация'}
//           </Button>
//         </div>
//         <div className="intro-text-container">
//           <div className="intro-text">Электронная сервисная книжка "Мой Силант"</div>
//         </div>
//       </header>

//       <Container className="main-content">
//         <p className="info-text">Проверьте комплектацию и технические характеристики техники Силант.</p>

//         <Form onSubmit={handleSearch} className="search-box mb-4">
//           <Row className="justify-content-center">
//             <Col md={8}>
//               <Form.Group controlId="formSerialNumber">
//                 <Form.Control
//                   type="text"
//                   placeholder="Введите заводской номер"
//                   value={serialNumber}
//                   onChange={(e) => setSerialNumber(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={2}>
//               <Button variant="primary" type="submit">
//                 Поиск
//               </Button>
//             </Col>
//           </Row>
//         </Form>

//         {error && <Alert variant="danger">{error}</Alert>}

//         {machine && (
//           <>
//             <div className="search-result-title">Результат поиска:</div>
//             <div className="info-box">Информация о комплектации и технических характеристиках Вашей техники</div>
//             <div className="table-container">
//               <Table striped bordered hover className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Зав. № машины</th>
//                     <th>Модель техники</th>
//                     <th>Модель двигателя</th>
//                     <th>Зав. № двигателя</th>
//                     <th>Модель трансмиссии</th>
//                     <th>Зав. № трансмиссии</th>
//                     <th>Модель ведущего моста</th>
//                     <th>Зав. № ведущего моста</th>
//                     <th>Модель управляемого моста</th>
//                     <th>Зав. № управляемого моста</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>{machine.serial_number}</td>
//                     <td>{getModelName(machine.model)}</td>
//                     <td>{getModelName(machine.engine_model)}</td>
//                     <td>{machine.engine_serial_number}</td>
//                     <td>{getModelName(machine.transmission_model)}</td>
//                     <td>{machine.transmission_serial_number}</td>
//                     <td>{getModelName(machine.drive_axle_model)}</td>
//                     <td>{machine.drive_axle_serial_number}</td>
//                     <td>{getModelName(machine.steer_axle_model)}</td>
//                     <td>{machine.steer_axle_serial_number}</td>
//                   </tr>
//                 </tbody>
//               </Table>
//             </div>
//           </>
//         )}
//       </Container>

//       <footer className="custom-footer">
//         <div className="footer-box">
//           <span className="footer-contact">+7-8352-20-12-09, telegram</span>
//         </div>
//         <div className="footer-box">
//           <span className="footer-brand">Мой Силант 2022</span>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;





// import React, { useState } from 'react';
// import { Form, Button, Row, Col, Alert, Container, Table } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import api from '../api';
// import './HomePage.css';

// const HomePage = () => {
//   const [serialNumber, setSerialNumber] = useState('');
//   const [machine, setMachine] = useState(null);
//   const [error, setError] = useState('');
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMachine(null);

//     try {
//       const response = await api.get('/search_machine/', {
//         params: { serial_number: serialNumber },
//       });
//       if (response.status === 200) {
//         setMachine(response.data);
//       } else {
//         setError('Данных о машине с таким заводским номером нет в системе');
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         setError('Данных о машине с таким заводским номером нет в системе');
//       } else {
//         setError('Произошла ошибка при поиске машины');
//       }
//     }
//   };

//   const handleAuthClick = () => {
//     if (isAuthenticated) {
//       setIsAuthenticated(false);
//     } else {
//       navigate('/login');
//     }
//   };
//   const getModelMashineName = (model) => (model ? model.name : 'Не указана');
//   const getEngineModelName = (engine) => (engine ? engine.model : 'Не указана');


//   return (
//     <div>
//       <header className="custom-header">
//         <div className="header-top">
//           <div className="logo">
//             <img src="/Logotype accent RGB 2.jpg" alt="Логотип" className="logo-image" />
//           </div>
//           <div className="contact-box">
//             <span className="contact">+7-8352-20-12-09, telegram</span>
//           </div>
//           <Button className="auth-button" onClick={handleAuthClick}>
//             {isAuthenticated ? 'Выход' : 'Авторизация'}
//           </Button>
//         </div>
//         <div className="intro-text-container">
//           <div className="intro-text">Электронная сервисная книжка "Мой Силант"</div>
//         </div>
//       </header>

//       <Container className="main-content">
//         <p className="info-text">Проверьте комплектацию и технические характеристики техники Силант.</p>

//         <Form onSubmit={handleSearch} className="search-box mb-4">
//           <Row className="justify-content-center">
//             <Col md={8}>
//               <Form.Group controlId="formSerialNumber">
//                 <Form.Control
//                   type="text"
//                   placeholder="Введите заводской номер"
//                   value={serialNumber}
//                   onChange={(e) => setSerialNumber(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={2}>
//               <Button variant="primary" type="submit">
//                 Поиск
//               </Button>
//             </Col>
//           </Row>
//         </Form>

// {error && <Alert variant="danger">{error}</Alert>}

// {machine && (
//           <>
//             <div className="search-result-title">Результат поиска:</div>
//             <div className="info-box">Информация о комплектации и технических характеристиках Вашей техники</div>
//             <div className="table-container">
//               <Table striped bordered hover className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Зав. № машины</th>
//                     <th>Модель техники</th>
//                     <th>Модель двигателя</th>
//                     <th>Зав. № двигателя</th>
//                     <th>Модель трансмиссии</th>
//                     <th>Зав. № трансмиссии</th>
//                     <th>Модель ведущего моста</th>
//                     <th>Зав. № ведущего моста</th>
//                     <th>Модель управляемого моста</th>
//                     <th>Зав. № управляемого моста</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>{machine.serial_number}</td>
//                     <td>{getModelMashineName(machine.model)}</td>
//                     <td>{getEngineModelName(machine.engine_model)}</td>
//                     <td>{machine.engine_serial_number}</td>
//                     <td>{machine.transmission_model}</td>
//                     <td>{machine.transmission_serial_number}</td>
//                     <td>{machine.drive_axle_model}</td>
//                     <td>{machine.drive_axle_serial_number}</td>
//                     <td>{machine.steer_axle_model}</td>
//                     <td>{machine.steer_axle_serial_number}</td>
//                   </tr>
//                 </tbody>
//               </Table>
//             </div>
//           </>
//         )}
// </Container>
//  {/* <td>{getServiceCompanyName(machine.service_company)}</td> */}
// <footer className="custom-footer">
// <div className="footer-box">
//   <span className="footer-contact">+7-8352-20-12-09, telegram</span>
// </div>
// <div className="footer-box">
//   <span className="footer-brand">Мой Силант 2022</span>
// </div>
// </footer>
// </div>
// );
// };

// export default HomePage;








// import React, { useState } from 'react';
// import { Form, Button, Row, Col, Table, Alert, Container } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import api from '../api';
// import './HomePage.css';

// const HomePage = () => {
//   const [serialNumber, setSerialNumber] = useState('');
//   const [machine, setMachine] = useState(null);
//   const [error, setError] = useState('');
//   const [isAuthenticated, setIsAuthenticated] = useState(false); // Добавляем состояние для проверки авторизации
//   const navigate = useNavigate();

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMachine(null);
//     try {
//       const response = await api.get('/search_machine/', {
//         params: { serial_number: serialNumber },
//       });
//       if (response.status === 200) {
//         setMachine(response.data);
//       } else {
//         setError('Данных о машине с таким заводским номером нет в системе');
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         setError('Данных о машине с таким заводским номером нет в системе');
//       } else {
//         setError('Произошла ошибка при поиске машины');
//       }
//     }
//   };

//   const handleAuthClick = () => {
//     if (isAuthenticated) {
//       // Логика выхода
//       setIsAuthenticated(false);
//     } else {
//       // Перенаправляем на страницу логина
//       navigate('/login');
//     }
//   };

//   return (
//     <div>
//       <header className="custom-header">
//         <div className="logo">
//           <img src="/Logotype accent RGB 2.jpg" alt="Логотип" className="logo-image" />
//         </div>
//         <div className="contact-box">
//           <span className="contact">+7-8352-20-12-09, telegram</span>
//         </div>
//         <Button className="auth-button" onClick={handleAuthClick}>
//           {isAuthenticated ? 'Выход' : 'Авторизация'}
//         </Button>
//       </header>

//       <Container className="main-content">
//         <div className="intro-text">Электронная сервисная книжка "Мой Силант"</div>
//         <p className="info-text">Проверьте комплектацию и технические характеристики техники Силант.</p>

//         <Form onSubmit={handleSearch} className="search-box mb-4">
//           <Row className="justify-content-center">
//             <Col md={8}>
//               <Form.Group controlId="formSerialNumber">
//                 <Form.Control
//                   type="text"
//                   placeholder="Введите заводской номер"
//                   value={serialNumber}
//                   onChange={(e) => setSerialNumber(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={2}>
//             <Button variant="primary" type="submit">
//                 Поиск
//               </Button>
//             </Col>
//           </Row>
//         </Form>

//         {error && <Alert variant="danger">{error}</Alert>}

//         {machine && (
//           <>
//             <div className="search-result-title">Результат поиска:</div>
//             <div className="info-box">Информация о комплектации и технических характеристиках Вашей техники</div>
//             <div className="table-container">
//               <Table striped bordered hover className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Зав. № машины</th>
//                     <th>Модель техники</th>
//                     <th>Модель двигателя</th>
//                     <th>Зав. № двигателя</th>
//                     <th>Модель трансмиссии</th>
//                     <th>Зав. № трансмиссии</th>
//                     <th>Модель ведущего моста</th>
//                     <th>Зав. № ведущего моста</th>
//                     <th>Модель управляемого моста</th>
//                     <th>Зав. № управляемого моста</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>{machine.serial_number}</td>
//                     <td>{machine.model}</td>
//                     <td>{machine.engine_model}</td>
//                     <td>{machine.engine_serial_number}</td>
//                     <td>{machine.transmission_model}</td>
//                     <td>{machine.transmission_serial_number}</td>
//                     <td>{machine.drive_axle_model}</td>
//                     <td>{machine.drive_axle_serial_number}</td>
//                     <td>{machine.steer_axle_model}</td>
//                     <td>{machine.steer_axle_serial_number}</td>
//                   </tr>
//                 </tbody>
//               </Table>
//             </div>
//           </>
//         )}
//       </Container>

//       <footer className="custom-footer">
//         <div className="footer-box">
//           <span className="footer-contact">+7-8352-20-12-09, telegram</span>
//         </div>
//         <div className="footer-box">
//           <span className="footer-brand">Мой Силант 2022</span>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;












// import React, { useState } from 'react';
// import { Form, Button, Row, Col, Table, Alert, Container } from 'react-bootstrap';
// import api from '../api';
// import './HomePage.css'; 

// const HomePage = () => {
//   const [serialNumber, setSerialNumber] = useState('');
//   const [machine, setMachine] = useState(null);
//   const [error, setError] = useState('');

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMachine(null);
//     try {
//       const response = await api.get('/search_machine/', {
//         params: { serial_number: serialNumber },
//       });
//       if (response.status === 200) {
//         setMachine(response.data);
//       } else {
//         setError('Данных о машине с таким заводским номером нет в системе');
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         setError('Данных о машине с таким заводским номером нет в системе');
//       } else {
//         setError('Произошла ошибка при поиске машины');
//       }
//     }
//   };

//   return (
//     <div>
//       <header className="custom-header">
//         <div className="logo">
//           <img src="/Logotype accent RGB 2.jpg" alt="Логотип" className="logo-image" />
//         </div>
//         <div className="contact-box">
//           <span className="contact">+7-8352-20-12-09, telegram</span>
//         </div>
//         <Button className="auth-button">Авторизация</Button>
//       </header>

//       <Container className="main-content">
//         <div className="intro-text">Электронная сервисная книжка "Мой Силант"</div>
//         <p className="info-text">Проверьте комплектацию и технические характеристики техники Силант.</p>

//         <Form onSubmit={handleSearch} className="search-box mb-4">
//           <Row className="justify-content-center">
//             <Col md={8}>
//               <Form.Group controlId="formSerialNumber">
//                 <Form.Control
//                   type="text"
//                   placeholder="Введите заводской номер"
//                   value={serialNumber}
//                   onChange={(e) => setSerialNumber(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={2}>
//               <Button variant="primary" type="submit">
//                 Поиск
//               </Button>
//             </Col>
//           </Row>
//         </Form>

//         {error && <Alert variant="danger">{error}</Alert>}

//         {machine && (
//           <>
//             <div className="search-result-title">Результат поиска:</div>
//             <div className="info-box">Информация о комплектации и технических характеристиках Вашей техники</div>
//             <div className="table-container">
//               <Table striped bordered hover className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Зав. № машины</th>
//                     <th>Модель техники</th>
//                     <th>Модель двигателя</th>
//                     <th>Зав. № двигателя</th>
//                     <th>Модель трансмиссии</th>
//                     <th>Зав. № трансмиссии</th>
//                     <th>Модель ведущего моста</th>
//                     <th>Зав. № ведущего моста</th>
//                     <th>Модель управляемого моста</th>
//                     <th>Зав. № управляемого моста</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>{machine.serial_number}</td>
//                     <td>{machine.model}</td>
//                     <td>{machine.engine_model}</td>
//                     <td>{machine.engine_serial_number}</td>
//                     <td>{machine.transmission_model}</td>
//                     <td>{machine.transmission_serial_number}</td>
//                     <td>{machine.drive_axle_model}</td>
//                     <td>{machine.drive_axle_serial_number}</td>
//                     <td>{machine.steer_axle_model}</td>
//                     <td>{machine.steer_axle_serial_number}</td>
//                   </tr>
//                 </tbody>
//               </Table>
//             </div>
//           </>
//         )}
//       </Container>

//       <footer className="custom-footer">
//         <div className="footer-box">
//           <span className="footer-contact">+7-8352-20-12-09, telegram</span>
//         </div>
//         <div className="footer-box">
//           <span className="footer-brand">Мой Силант 2022</span>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;





// import React, { useState } from 'react';
// import { Form, Button, Row, Col, Table, Alert } from 'react-bootstrap';
// import Layout from './Layout';
// import api from '../api';

// const HomePage = () => {
//   const [serialNumber, setSerialNumber] = useState('');
//   const [machine, setMachine] = useState(null);
//   const [error, setError] = useState('');

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMachine(null);
//     try {
//       const response = await api.get('/search_machine/', { // Убедитесь, что здесь маршрут указан правильно
//         params: { serial_number: serialNumber },
//       });
//       if (response.status === 200) {
//         setMachine(response.data);
//       } else {
//         setError('Данных о машине с таким заводским номером нет в системе');
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         setError('Данных о машине с таким заводским номером нет в системе');
//       } else {
//         setError('Произошла ошибка при поиске машины');
//       }
//     }
//   };

//   return (
//     <Layout>
//       <Form onSubmit={handleSearch} className="mb-4">
//         <Row className="justify-content-center">
//           <Col md={8}>
//             <Form.Group controlId="formSerialNumber">
//               <Form.Control
//                 type="text"
//                 placeholder="Введите заводской номер машины"
//                 value={serialNumber}
//                 onChange={(e) => setSerialNumber(e.target.value)}
//               />
//             </Form.Group>
//           </Col>
//           <Col md={2}>
//             <Button variant="primary" type="submit">
//               Поиск
//             </Button>
//           </Col>
//         </Row>
//       </Form>
//       {error && <Alert variant="danger">{error}</Alert>}
//       {machine && (
//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>Зав. № машины</th>
//               <th>Модель техники</th>
//               <th>Модель двигателя</th>
//               <th>Зав. № двигателя</th>
//               <th>Модель трансмиссии</th>
//               <th>Зав. № трансмиссии</th>
//               <th>Модель ведущего моста</th>
//               <th>Зав. № ведущего моста</th>
//               <th>Модель управляемого моста</th>
//               <th>Зав. № управляемого моста</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>{machine.serial_number}</td>
//               <td>{machine.model}</td>
//               <td>{machine.engine_model}</td>
//               <td>{machine.engine_serial_number}</td>
//               <td>{machine.transmission_model}</td>
//               <td>{machine.transmission_serial_number}</td>
//               <td>{machine.drive_axle_model}</td>
//               <td>{machine.drive_axle_serial_number}</td>
//               <td>{machine.steer_axle_model}</td>
//               <td>{machine.steer_axle_serial_number}</td>
//             </tr>
//           </tbody>
//         </Table>
//       )}
//     </Layout>
//   );
// };

// export default HomePage;

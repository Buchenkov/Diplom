import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Button, Table, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import { addMachine, updateMachine } from '../api';
import './HomePage.css'; // Импортируйте стили

const Dashboard = () => {
  const { isAuthenticated, logout } = useContext(AuthContext); // Используем функцию logout из контекста
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout(); // Выход из системы через функцию logout
      navigate('/'); // Перенаправляем на главную страницу
    } else {
      navigate('/login'); // Перенаправляем на страницу логина
    }
  };

  const [userInfo, setUserInfo] = useState(null);
  const [machines, setMachines] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [reclamations, setReclamations] = useState([]);
  const [clients, setClients] = useState([]);
  const [serviceCompanies, setServiceCompanies] = useState([]);
  const [activeTab, setActiveTab] = useState('machines');
  const [selectedMachineSerialNumber, setSelectedMachineSerialNumber] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  // Состояния для фильтров
  const [filters, setFilters] = useState({
    model: '',
    engineModel: '',
    transmissionModel: '',
    steerAxleModel: '',
    driveAxleModel: '',
  });


  const [maintenanceFilters, setMaintenanceFilters] = useState({
    type: '',
    machineSerialNumber: '',
    serviceCompany: '',
  });

  const [reclamationFilters, setReclamationFilters] = useState({
    failureNode: '',
    recoveryMethod: '',
    serviceCompany: '',
  });
  

 

  useEffect(() => {
    if (isAuthenticated) {
      // console.log('Fetching user info');
      api.get('/user-info/')
        .then(response => {
          console.log('User Info:', response.data);
          setUserInfo(response.data);
          const userId = response.data.id;
          const username = response.data.username;
          const userRole = response.data.role;

          console.log('User ID:', userId);
          console.log('Username:', username);
          console.log('User Role:', userRole);

          api.get('/clients/')
            .then(response => {
              console.log('Clients:', response.data);
              setClients(response.data);
            })
            .catch(error => console.error('Error fetching clients:', error));

          api.get('/service-companies/')
            .then(response => {
              // console.log('Service Companies:', response.data);
              setServiceCompanies(response.data);

              if (userRole === 'service') {
                const serviceCompany = response.data.find(company => company.name === username);
                if (serviceCompany) {
                  console.log('Service Company ID:', serviceCompany.id);
                  api.get('/machines/')
                    .then(response => {
                      console.log('Machines:', response.data);
                      // const filteredMachines = response.data.filter(machine => machine.service_company === serviceCompany.id);
                      const filteredMachines = response.data.filter(machine => machine.service_company.id === serviceCompany.id);
                      // console.log('Filtered Machines!:', filteredMachines);
                      setMachines(filteredMachines);
                      if (filteredMachines.length > 0) {
                        setSelectedMachineSerialNumber(filteredMachines[0].serial_number);
                      }
                    })
                    .catch(error => console.error('Error fetching machines:', error));
                } else {
                  console.error('Service company not found for user:', username);
                }
              } else {
                api.get('/machines/')
                  .then(response => {
                    // Сортируем машины по дате отгрузки с завода по умолчанию
                    const sortedMachines = response.data.sort((a, b) => new Date(a.shipment_date) - new Date(b.shipment_date));
                    setMachines(sortedMachines);

                    let filteredMachines = response.data;
                    if (userRole === 'client') {
                      response.data.forEach(machine => {
                        console.log(`Machine ID: ${machine.id}, Supply Contact: ${machine.supply_contact}, Full Machine Data:, machine);}`);
                      });
                      // filteredMachines = response.data.filter(machine => machine.client === userId);
                      filteredMachines = response.data.filter(machine => 
                        machine.supply_contract === username || machine.end_user.includes(username));
                    }
                    console.log('Filtered Machines:', filteredMachines);
                    setMachines(filteredMachines);
                    if (filteredMachines.length > 0) {
                      setSelectedMachineSerialNumber(filteredMachines[0].serial_number);
                      // console.log('!!!!!!!!!    machines:', setSelectedMachineSerialNumber);
                    }
                  })
                  .catch(error => console.error('Error fetching machines:', error));
              }
            })
            .catch(error => console.error('Error fetching service companies:', error));
        })
        .catch(error => console.error('Error fetching user info:', error));
    }
  }, [isAuthenticated]);

      // Сортировка машин по дате отгрузки
  // const sortedMachines = [...machines].sort((a, b) => new Date(a.shipment_date) - new Date(b.shipment_date));

  // Сортировка ТО по дате проведения
  // const sortedMaintenances = [...maintenances].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Сортировка рекламаций по дате отказа
  // const sortedReclamations = [...reclamations].sort((a, b) => new Date(a.failure_date) - new Date(b.failure_date));




  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };


  
useEffect(() => {
  if (machines.length > 0) {
    // Получаем все ID машин доступных пользователю
    const machineIds = machines.map(machine => machine.id);

    // Загружаем все данные для ТО
    api.get('/maintenances/')
      .then(response => {
        // Фильтруем данные ТО по всем доступным машинам
        const filteredMaintenances = response.data
          .filter(maintenance => machineIds.includes(maintenance.machine))
          .sort((a, b) => new Date(a.date) - new Date(b.date)); // Сортируем после фильтрации

        console.log('Filtered Maintenances:', filteredMaintenances);
        setMaintenances(filteredMaintenances);
      })
      .catch(error => console.error('Ошибка при получении данных ТО:', error));

    // Загружаем все данные для рекламаций
    api.get('/reclamations/')
      .then(response => {
        // Фильтруем данные рекламаций по всем доступным машинам
        const filteredReclamations = response.data.filter(
          reclamation => machineIds.includes(reclamation.machine)
        );
        console.log('Filtered Reclamations:', filteredReclamations);
        setReclamations(filteredReclamations);
      })
      .catch(error => console.error('Ошибка при получении данных рекламаций:', error));
  }
}, [machines]);


  const handleAddData = () => {
    setIsEditMode(false);
    setFormData({});
    setShowModal(true);
  };

  const handleEditData = (data) => {
    setIsEditMode(true);
    setFormData(data);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log('Submitting form data:', formData);

    if (!['machines', 'maintenances', 'reclamations'].includes(activeTab)) {
      console.error('Invalid activeTab:', activeTab);
      return;
    }

    if (isEditMode && !formData.id) {
      console.error('Missing id for update operation');
      return;
    }

    const endpoint = activeTab === 'machines' 
      ? `/machines/${formData.id || ''}` 
      : activeTab === 'maintenances' 
      ? `/maintenances/${formData.id || ''} `
      : `/reclamations/${formData.id || ''}`;

    const method = isEditMode ? api.put : api.post;

    console.log(`Using endpoint: ${endpoint} with method: ${isEditMode ? 'PUT' : 'POST'}`);

    method(endpoint, formData)
      .then(response => {
        console.log('Data submitted successfully:', response.data);
        handleCloseModal();
        if (activeTab === 'machines') {
          setMachines(prevMachines => 
            isEditMode ? prevMachines.map(m => (m.id === response.data.id ? response.data : m)) : [...prevMachines, response.data]
          );
        } else if (activeTab === 'maintenances') {
          setMaintenances(prevMaintenances => 
            isEditMode ? prevMaintenances.map(m => (m.id === response.data.id ? response.data : m)) : [...prevMaintenances, response.data]
          );
        } else {
          setReclamations(prevReclamations => 
            isEditMode ? prevReclamations.map(m => (m.id === response.data.id ? response.data : m)) : [...prevReclamations, response.data]
          );
        }
      })
      .catch(error => console.error('Error submitting data:', error));
  };

  const getDriveAxleModelName = (driveAxleModel) => {
    if (typeof driveAxleModel === 'object' && driveAxleModel !== null && 'id' in driveAxleModel && 'name' in driveAxleModel) {
      // console.log('Drive Axle Model ID:', driveAxleModel.id, 'Drive Axle Model:', driveAxleModel);
      return driveAxleModel.name;
    } else {
      console.log('Некорректный входной параметр:', driveAxleModel);
      return 'Неизвестно';
    }
  };
    
  const getSteerAxleModelName = (steerAxleModel) => {
    if (typeof steerAxleModel === 'object' && steerAxleModel !== null && 'id' in steerAxleModel && 'name' in steerAxleModel) {
      // console.log('Steer Axle Model ID:', steerAxleModel.id, 'Steer Axle Model:', steerAxleModel);
      return steerAxleModel.name;
    } else {
      console.log('Некорректный входной параметр:', steerAxleModel);
      return 'Неизвестно';
    }
  };
 
  const getRecoveryMethodName = (methodId) => {
    return methodId === 1 ? 'ремонт' : 'замена';
  };

  // Применение фильтров
  const filteredMachines = machines.filter(machine => 
    machine.model.toLowerCase().includes(filters.model.toLowerCase()) &&
    machine.engine_model.name.toLowerCase().includes(filters.engineModel.toLowerCase()) &&
    machine.transmission_model.name.toLowerCase().includes(filters.transmissionModel.toLowerCase()) &&
    getDriveAxleModelName(machine.drive_axle_model).toLowerCase().includes(filters.driveAxleModel.toLowerCase()) &&
    getSteerAxleModelName(machine.steer_axle_model).toLowerCase().includes(filters.steerAxleModel.toLowerCase())
  );

  // const handleMachineSelect = (serialNumber) => {
  //   console.log('Machine selected:', serialNumber);
  //   setSelectedMachineSerialNumber(serialNumber);
  // };


  const handleMaintenanceFilterChange = (e) => {
    const { name, value } = e.target;
    setMaintenanceFilters({
      ...maintenanceFilters,
      [name]: value, 
    });
  };
  // Применение фильтров для рекламаций

  const filteredMaintenances = maintenances.filter(maintenance => {
    const typeName = maintenance.type ? maintenance.type.toLowerCase().trim() : '';
    const machineName = maintenance.machine_name ? maintenance.machine_name.toLowerCase().trim() : '';
    const serviceCompanyName = maintenance.service_company ? maintenance.service_company.toLowerCase().trim() : '';
  
    const filterTypeName = maintenanceFilters.type.toLowerCase().trim();
    const filterMachineSerialNumber = maintenanceFilters.machineSerialNumber.toLowerCase().trim();
    const filterServiceCompanyName = maintenanceFilters.serviceCompany.toLowerCase().trim();
  
    // // Диагностика
    // console.log("Сравнение A:", machineName, filterMachineSerialNumber);
    // console.log("Длина A:", machineName.length, "Длина B:", filterMachineSerialNumber.length);
    // console.log("Сравнение boolean:", machineName.includes(filterMachineSerialNumber));
  
    return (
      typeName.includes(filterTypeName) &&
      machineName.includes(filterMachineSerialNumber) &&
      serviceCompanyName.includes(filterServiceCompanyName)
    );
  });
  
  
const handleReclamationFilterChange = (e) => {
  const { name, value } = e.target;
  setReclamationFilters({
    ...reclamationFilters,
    [name]: value,
  });
};


// Создаем маппинг машины к сервисной компании из данных "ТО"
const machineToServiceMap = {};
maintenances.forEach(maintenance => {
  if (maintenance.machine_name && maintenance.service_company) {
    machineToServiceMap[maintenance.machine_name] = maintenance.service_company;
  }
});

// Обогащаем данные "Рекламаций" информацией о сервисной компании
const enrichedReclamations = reclamations.map(reclamation => ({
  ...reclamation,
  service_company: machineToServiceMap[reclamation.machine_name] || 'Неизвестно',
}));

// Фильтруем обогащенные данные "Рекламаций"
const filteredReclamations = enrichedReclamations.filter(reclamation => {
  const failureNode = reclamation.failure_node ? reclamation.failure_node.toLowerCase().trim() : '';
  const recoveryMethodName = getRecoveryMethodName(reclamation.recovery_method).toLowerCase().trim();
  const serviceCompanyName = reclamation.service_company.toLowerCase().trim();

  const filterFailureNode = reclamationFilters.failureNode.toLowerCase().trim();
  const filterRecoveryMethod = reclamationFilters.recoveryMethod.toLowerCase().trim();
  const filterServiceCompany = reclamationFilters.serviceCompany.toLowerCase().trim();

  return (
    failureNode.includes(filterFailureNode) &&
    recoveryMethodName.includes(filterRecoveryMethod) &&
    serviceCompanyName.includes(filterServiceCompany)
  );
});

  const canAddMachine = userInfo && userInfo.role === 'manager';
  const canAddMaintenance = userInfo && (userInfo.role === 'client' || userInfo.role === 'service' || userInfo.role === 'manager');
  const canAddReclamation = userInfo && (userInfo.role === 'service' || userInfo.role === 'manager');



// const handleSave = () => {
//   if (isEditMode) {
//     updateMachine(formData)
//       .then(response => {
//         // Обновите состояние, чтобы отобразить изменения
//         // Например, обновите список машин
//         setMachines(prevMachines => prevMachines.map(machine => machine.id === response.id ? response : machine));
//         handleCloseModal();
//       })
//       .catch(error => {
//         console.error('Ошибка при обновлении машины:', error);
//       });
//   } else {
//     addMachine(formData)
//       .then(response => {
//         // Добавьте новую машину в список
//         setMachines(prevMachines => [...prevMachines, response]);
//         handleCloseModal();
//       })
//       .catch(error => {
//         console.error('Ошибка при добавлении машины:', error);
//       });
//   }
// };

// // Обработчик сохранения
// const handleSave = () => {
//   if (isEditMode) {
//     updateMachine(formData)
//       .then(response => {
//         setMachines(prevMachines => prevMachines.map(machine => machine.id === response.id ? response : machine));
//         handleCloseModal();
//       })
//       .catch(error => {
//         console.error('Ошибка при обновлении машины:', error);
//       });
//   } else {
//     addMachine(formData)
//       .then(response => {
//         setMachines(prevMachines => [...prevMachines, response]);
//         handleCloseModal();
//       })
//       .catch(error => {
//         console.error('Ошибка при добавлении машины:', error);
//       });
//   }
// };

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
      <div className="user-info-box">
      <h3>{userInfo && userInfo.username}</h3>
</div>
<div className="info-box">
  <p>Информация о комплектации и технических характеристиках Вашей техники</p>
</div>

<Row className="my-4">
          <Col>
            <Button
              variant={activeTab === 'machines' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('machines')}
            >
              Таб: Общая информация
            </Button>
          </Col>
          <Col>
            <Button
              variant={activeTab === 'maintenances' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('maintenances')}
              disabled={!selectedMachineSerialNumber}
            >
              Таб: ТО
            </Button>
          </Col>
          <Col>
            <Button
              variant={activeTab === 'reclamations' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('reclamations')}
              disabled={!selectedMachineSerialNumber}
            >
              Таб: Рекламации
            </Button>
          </Col>
        </Row>

              {activeTab === 'machines' && (
        <div>
     <Form>
            <Row className="align-items-center mb-3">
              <Col><Form.Label>Модель техники</Form.Label></Col>
              <Col><Form.Label>Модель двигателя</Form.Label></Col>
              <Col><Form.Label>Модель трансмиссии</Form.Label></Col>
              <Col><Form.Label>Модель управляемого моста</Form.Label></Col>
              <Col><Form.Label>Модель ведущего моста</Form.Label></Col>
            </Row>
            <Row className="align-items-center">
              <Col><Form.Control
                  type="text"
                  placeholder="Фильтр по модели техники"
                  name="model"
                  value={filters.model}
                  onChange={handleFilterChange}
                />
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Фильтр по модели двигателя"
                  name="engineModel"
                  value={filters.engineModel}
                  onChange={handleFilterChange}
                />
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Фильтр по модели трансмиссии"
                  name="transmissionModel"
                  value={filters.transmissionModel}
                  onChange={handleFilterChange}
                />
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Фильтр по модели управляемого моста"
                  name="steerAxleModel"
                  value={filters.steerAxleModel}
                  onChange={handleFilterChange}
                />
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Фильтр по модели ведущего моста"
                  name="driveAxleModel"
                  value={filters.driveAxleModel}
                  onChange={handleFilterChange}
                />
              </Col>
            </Row>
          </Form>


                <div className="table-responsive">
            <Table striped bordered hover>
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
                  <th>Покупатель</th>
                  <th>Дата отгрузки с завода</th>
                  <th>Грузополучатель</th>
                  <th>Адрес поставки</th>
                  <th>Комплектация </th>
                  <th>Клиент</th>
                  <th>Сервисная компания</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
              {filteredMachines.map((machine) => (
                  <tr
                    // key={machine.id}
                    // onClick={() => handleMachineSelect(machine.serial_number)}
                    // style={{
                    //   backgroundColor: selectedMachineSerialNumber === machine.serial_number ? '#afd7ff' : '',
                    //   fontWeight: selectedMachineSerialNumber === machine.serial_number ? 'bold' : 'normal',
                    //   cursor: 'pointer'
                    // }}
                  >
                    <td>{machine.serial_number}</td>
                    <td>{machine.model}</td>
                    <td>{machine.engine_model.name }</td>
                    <td>{machine.engine_serial_number}</td>
                    <td>{machine.transmission_model.name}</td> 
                    <td>{machine.transmission_serial_number}</td>
                    <td>{getDriveAxleModelName(machine.drive_axle_model)}</td>
                    <td>{machine.drive_axle_serial_number}</td>
                    <td>{getSteerAxleModelName(machine.steer_axle_model)}</td>
                    <td>{machine.steer_axle_serial_number}</td>
                    <td>{machine.supply_contract}</td>
                    <td>{machine.shipment_date}</td>
                    <td>{machine.end_user}</td>
                    <td>{machine.supply_address}</td>
                    <td>{machine.configuration}</td>
                    <td>{machine.client.name}</td>
                    <td>{machine.service_company.name}</td>
                    <td>
                      {canAddMachine && (
                        <>
                          <Button variant="success" onClick={handleAddData}>Добавить</Button>
                          <Button variant="warning" onClick={() => handleEditData(machine)}>Редактировать</Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
             </div>
             </div>
          )}


<div>
  {activeTab === 'maintenances' && (
    <>
      <Form>
        <Row className="align-items-center mb-3">
          <Col><Form.Label>Вид ТО</Form.Label></Col>
          <Col><Form.Label>Зав. номер машины</Form.Label></Col>
          <Col><Form.Label>Сервисная компания</Form.Label></Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <Form.Control
              type="text"
              placeholder="Фильтр по виду ТО"
              name="type"
              value={maintenanceFilters.type}
              onChange={handleMaintenanceFilterChange}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Фильтр по зав. номеру машины"
              name="machineSerialNumber"
              value={maintenanceFilters.machineSerialNumber}
              onChange={handleMaintenanceFilterChange}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Фильтр по сервисной компании"
              name="serviceCompany"
              value={maintenanceFilters.serviceCompany}
              onChange={handleMaintenanceFilterChange}
            />
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Вид ТО</th>
            <th>Дата проведения ТО</th>
            <th>Операционные часы</th>
            <th>№ заказ-наряда</th>
            <th>Дата заказ-наряда</th>
            <th>Организация, проводившая ТО</th>
            <th>Машина</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredMaintenances.length > 0 ? (
            filteredMaintenances.map((maintenance) => (
              <tr key={maintenance.id}>
                <td>{maintenance.type}</td>
                <td>{maintenance.date}</td>
                <td>{maintenance.operating_hours}</td>
                <td>{maintenance.order_number}</td>
                <td>{maintenance.order_date}</td>
                <td>{maintenance.service_company}</td>
                <td>{maintenance.machine_name}</td>
                <td>
                  {canAddMaintenance && (
                    <>
                      <Button variant="success" onClick={handleAddData}>Добавить</Button>
                      <Button variant="warning" onClick={() => handleEditData(maintenance)}>Редактировать</Button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">Нет данных о ТО для выбранной машины</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  )}
</div>



<div>
  {activeTab === 'reclamations' && (
    <>
      <Form>
        <Row className="align-items-center mb-3">
          <Col><Form.Label>Узел отказа</Form.Label></Col>
          <Col><Form.Label>Способ восстановления</Form.Label></Col>
          <Col><Form.Label>Сервисная компания</Form.Label></Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <Form.Control
              type="text"
              placeholder="Фильтр по узлу отказа"
              name="failureNode"
              value={reclamationFilters.failureNode}
              onChange={handleReclamationFilterChange}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Фильтр по способу восстановления"
              name="recoveryMethod"
              value={reclamationFilters.recoveryMethod}
              onChange={handleReclamationFilterChange}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Фильтр по сервисной компании"
              name="serviceCompany"
              value={reclamationFilters.serviceCompany}
              onChange={handleReclamationFilterChange}
            />
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Дата отказа</th>
            <th>Наработка, м/час</th>
            <th>Узел отказа</th>
            <th>Описание</th>
            <th>Способ восстановления</th>
            <th>Используемые запасные части</th>
            <th>Дата восстановления</th>
            <th>Время простоя техники</th>
            <th>Mашина</th>
            <th>Сервисная компания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredReclamations.length > 0 ? (
            filteredReclamations.map(reclamation => (
              <tr key={reclamation.id}>
                <td>{reclamation.failure_date}</td>
                <td>{reclamation.operating_hours}</td>
                <td>{reclamation.failure_node}</td>
                <td>{reclamation.description}</td>
                <td>{getRecoveryMethodName(reclamation.recovery_method)}</td>
                <td>{reclamation.spare_parts}</td>
                <td>{reclamation.restoration_date}</td>
                <td>{reclamation.downtime}</td>
                <td>{reclamation.machine_name}</td>
                <td>{reclamation.service_company}</td>
                <td>
                  {canAddReclamation && (
                    <>
                      <Button variant="success" onClick={handleAddData}>Добавить</Button>
                      <Button variant="warning" onClick={() => handleEditData(reclamation)}>Редактировать</Button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">Нет данных о рекламациях для выбранной машины</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  )}
</div>

      </Container>

      <footer className="custom-footer">
        <div className="footer-box">
          <span className="footer-contact">+7-8352-20-12-09, telegram</span>
        </div>
        <div className="footer-box">
          <span className="footer-brand">Мой Силант 2022</span>
        </div>
      </footer>


      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Редактировать данные' : 'Добавить данные'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {activeTab === 'machines' && (
              <>
                <Form.Group controlId="formSerialNumber">
                  <Form.Label>Зав. № машины</Form.Label>
                  <Form.Control type="text" name="serial_number" value={formData.serial_number || ''} onChange={handleFormChange} />
                </Form.Group>
                <Form.Group controlId="formModel">
                  <Form.Label>Модель техники</Form.Label>
                  <Form.Control type="text" name="model" value={formData.model || ''} onChange={handleFormChange} />
                </Form.Group>
                <Form.Group controlId="formClient">
                  <Form.Label>Клиент</Form.Label>
                  <Form.Control as="select" name="client" value={formData.client || ''} onChange={handleFormChange}>
                    <option value="">Выбрать клиента</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formServiceCompany">
                  <Form.Label>Сервисная компания</Form.Label>
                  <Form.Control as="select" name="service_company" value={formData.service_company || ''} onChange={handleFormChange}>
                    <option value="">Выбрать компанию</option>
                    {serviceCompanies.map(company => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formEngineModel">
                  <Form.Label>Модель двигателя</Form.Label>
                  <Form.Control type="text" name="engine_model" value={formData.engine_model || ''} onChange={handleFormChange} />
                </Form.Group>
                <Form.Group controlId="formEngineSerialNumber">
                  <Form.Label>Зав. № двигателя</Form.Label>
                  <Form.Control type="text" name="engine_serial_number" value={formData.engine_serial_number || ''} onChange={handleFormChange} />
                </Form.Group>
                <Form.Group controlId="formTransmissionModel">
                <Form.Label>Модель трансмиссии</Form.Label>
                  <Form.Control type="text" name="transmission_model" value={formData.transmission_model || ''} onChange={handleFormChange} />
                </Form.Group>
                <Form.Group controlId="formTransmissionSerialNumber">
                  <Form.Label>Зав. № трансмиссии</Form.Label>
                  <Form.Control type="text" name="transmission_serial_number" value={formData.transmission_serial_number || ''} onChange={handleFormChange} />
                </Form.Group>
                <Form.Group controlId="formDriveAxleModel">
                  <Form.Label>Модель ведущего моста</Form.Label>
                  <Form.Control type="text" name="drive_axle_model" value={formData.drive_axle_model || ''} onChange={handleFormChange} />
                </Form.Group>
                <Form.Group controlId="formDriveAxleSerialNumber">
                  <Form.Label>Зав. № ведущего моста</Form.Label>
                  <Form.Control type="text" name="drive_axle_serial_number" value={formData.drive_axle_serial_number || ''} onChange={handleFormChange} />
                </Form.Group>
                <Form.Group controlId="formSteerAxleModel">
                  <Form.Label>Модель управляемого моста</Form.Label>
                  <Form.Control type="text" name="steer_axle_model" value={formData.steer_axle_model || ''} onChange={handleFormChange} />
                </Form.Group>
                <Form.Group controlId="formSteerAxleSerialNumber">
                  <Form.Label>Зав. № управляемого моста</Form.Label>
                  <Form.Control type="text" name="steer_axle_serial_number" value={formData.steer_axle_serial_number || ''} onChange={handleFormChange} />
                </Form.Group>
              </>
            )}

            {activeTab === 'maintenances' && (
              <>
                <Form.Group controlId="formDate">
                  <Form.Label>Дата</Form.Label>
                  <Form.Control type="date" name="date" value={formData.date || ''} onChange={handleFormChange} />
                </Form.Group>
                <Form.Group controlId="formOperatingHours">
                  <Form.Label>Операционные часы</Form.Label>
                  <Form.Control type="number" name="operating_hours" value={formData.operating_hours || ''} onChange={handleFormChange} />
                </Form.Group>
                <Form.Group controlId="formOrderNumber">
                  <Form.Label>Номер заказа</Form.Label>
                  <Form.Control type="text" name="order_number" value={formData.order_number || ''} onChange={handleFormChange} />
                </Form.Group>
                <Form.Group controlId="formOrderDate">
                  <Form.Label>Дата заказа</Form.Label>
                  <Form.Control type="date" name="order_date" value={formData.order_date || ''} onChange={handleFormChange} />
                </Form.Group>
              </>
            )}
{activeTab === 'reclamations' && (
              <>
                <Form.Group controlId="formFailureDate">
                  <Form.Label>Дата отказа</Form.Label>
                  <Form.Control type="date" name="failure_date" value={formData.failure_date || ''} onChange={handleFormChange} />
                </Form.Group>
                <Form.Group controlId="formDescription">
                  <Form.Label>Описание</Form.Label>
                  <Form.Control as="textarea" name="description" value={formData.description || ''} onChange={handleFormChange} />
                </Form.Group>
                <Form.Group controlId="formRecoveryMethod">
                  <Form.Label>Метод восстановления</Form.Label>
                  <Form.Control as="select" name="recovery_method" value={formData.recovery_method || ''} onChange={handleFormChange}>
                    <option value="1">ремонт</option>
                    <option value="2">замена</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formSpareParts">
                  <Form.Label>Запчасти</Form.Label>
                  <Form.Control type="text" name="spare_parts" value={formData.spare_parts || ''} onChange={handleFormChange} />
                </Form.Group>
                <Form.Group controlId="formRestorationDate">
                  <Form.Label>Дата восстановления</Form.Label>
                  <Form.Control type="date" name="restoration_date" value={formData.restoration_date || ''} onChange={handleFormChange} />
                </Form.Group>
                <Form.Group controlId="formDowntime">
                  <Form.Label>Простой (часы)</Form.Label>
                  <Form.Control type="number" name="downtime" value={formData.downtime || ''} onChange={handleFormChange} />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Отмена</Button>
          <Button variant="primary" onClick={handleSubmit}>{isEditMode ? 'Сохранить' : 'Добавить'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;




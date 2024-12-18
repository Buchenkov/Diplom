from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = [
        ('guest', 'Гость'),
        ('client', 'Клиент'),
        ('service', 'Сервисная организация'),
        ('manager', 'Менеджер'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='guest')

class Client(models.Model):
    name = models.CharField(max_length=150)
    address = models.CharField(max_length=255, default='Не указан')  

    def __str__(self):
        return self.name

class ServiceCompany(models.Model):
    name = models.CharField(max_length=150)
    address = models.CharField(max_length=255, default='Не указан') 

    def __str__(self):
        return self.name
    
class Engine(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class Transmission(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name
    
class ModelMashine(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name
    
class BridgeA(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class BridgeB(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class Machine(models.Model):
    serial_number = models.CharField(max_length=100)
    model = models.ForeignKey(ModelMashine, on_delete=models.CASCADE)
    engine_model = models.ForeignKey(Engine, on_delete=models.CASCADE)
    engine_serial_number = models.CharField(max_length=100)
    transmission_model = models.ForeignKey(Transmission, on_delete=models.CASCADE)
    transmission_serial_number = models.CharField(max_length=100)
    drive_axle_model = models.ForeignKey(BridgeA, on_delete=models.CASCADE)
    drive_axle_serial_number = models.CharField(max_length=100)
    steer_axle_model = models.ForeignKey(BridgeB, on_delete=models.CASCADE)
    steer_axle_serial_number = models.CharField(max_length=100)
    supply_contract = models.CharField(max_length=100, blank=True, null=True)  
    shipment_date = models.DateField(blank=True, null=True)  
    end_user = models.CharField(max_length=100, blank=True, null=True)  
    supply_address = models.CharField(max_length=255, blank=True, null=True)  
    configuration = models.CharField(max_length=255, blank=True, null=True)  
    client = models.ForeignKey('Client', on_delete=models.CASCADE, blank=True, null=True, related_name='machines')  # Пример дополнительного поля
    service_company = models.ForeignKey('ServiceCompany', on_delete=models.CASCADE, blank=True, null=True, related_name='machines')  # Пример дополнительного поля

    def __str__(self):
        return self.serial_number

class TypeTo(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Maintenance(models.Model):
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE)
    type = models.ForeignKey(TypeTo, on_delete=models.CASCADE)
    date = models.DateField()
    operating_hours = models.IntegerField()
    order_number = models.CharField(max_length=100)
    order_date = models.DateField()
    service_company = models.ForeignKey(ServiceCompany, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.machine.serial_number} - {self.type.name}"

class RecoveryMethod(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class FailureNode(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Reclamation(models.Model):
    machine = models.ForeignKey('Machine', on_delete=models.CASCADE)
    failure_date = models.DateField("Дата отказа")
    operating_hours = models.IntegerField()
    failure_node = models.ForeignKey('FailureNode', on_delete=models.CASCADE)
    description = models.TextField()
    recovery_method = models.ForeignKey('RecoveryMethod', on_delete=models.CASCADE)
    spare_parts = models.TextField(blank=True, null=True)  # Позволяет полю быть пустым
    restoration_date = models.DateField("Дата восстановления")
    downtime = models.IntegerField("Время простоя", editable=False)

    def save(self, *args, **kwargs):
        if self.restoration_date and self.failure_date:
            # Вычисляем разницу в днях
            self.downtime = (self.restoration_date - self.failure_date).days
        else:
            self.downtime = 0
        # Корректный вызов метода save
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.machine.serial_number} - {self.failure_node.name}"



# from django.contrib.auth.models import AbstractUser
# from django.db import models

# class User(AbstractUser):
#     ROLE_CHOICES = [
#         ('guest', 'Гость'),
#         ('client', 'Клиент'),
#         ('service', 'Сервисная организация'),
#         ('manager', 'Менеджер'),
#     ]
#     role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='guest')

# class Client(models.Model):
#     name = models.CharField(max_length=255)
    
#     def __str__(self):
#         return self.name

# class ServiceCompany(models.Model):
#     name = models.CharField(max_length=255)
    
#     def __str__(self):
#         return self.name

# class Machine(models.Model):
#     serial_number = models.CharField(max_length=100, unique=True)
#     model = models.CharField(max_length=100)
#     engine_model = models.CharField(max_length=100)
#     engine_serial_number = models.CharField(max_length=100)
#     transmission_model = models.CharField(max_length=100)
#     transmission_serial_number = models.CharField(max_length=100)
#     drive_axle_model = models.CharField(max_length=100)
#     drive_axle_serial_number = models.CharField(max_length=100)
#     steer_axle_model = models.CharField(max_length=100)
#     steer_axle_serial_number = models.CharField(max_length=100)
#     supply_contract = models.CharField(max_length=100)
#     shipment_date = models.DateField()
#     end_user = models.CharField(max_length=100)
#     supply_address = models.CharField(max_length=200)
#     configuration = models.TextField()
#     client = models.ForeignKey(Client, related_name='client_machines', on_delete=models.CASCADE)
#     service_company = models.ForeignKey(ServiceCompany, related_name='service_machines', on_delete=models.CASCADE)

#     def __str__(self):
#         return self.serial_number

# class TypeTo(models.Model):
#     name = models.CharField(max_length=255)
    
#     def __str__(self):
#         return self.name

# class Maintenance(models.Model):
#     machine = models.ForeignKey(Machine, related_name='maintenances', on_delete=models.CASCADE)
#     type = models.ForeignKey(TypeTo, on_delete=models.CASCADE)
#     date = models.DateField()
#     operating_hours = models.IntegerField()
#     order_number = models.CharField(max_length=100)
#     order_date = models.DateField()
#     service_company = models.ForeignKey(ServiceCompany, on_delete=models.CASCADE)

#     def str(self):
#         return f"{self.machine.serial_number} - {self.machine}"

# class FailureNode(models.Model):
#     name = models.CharField(max_length=255)
    
#     def str(self):
#         return self.name

# class RecoveryMethod(models.Model):
#     name = models.CharField(max_length=255)
    
#     def str(self):
#         return self.name

# class Reclamation(models.Model):
#     machine = models.ForeignKey(Machine, related_name='reclamations', on_delete=models.CASCADE)
#     failure_date = models.DateField()
#     operating_hours = models.IntegerField()
#     failure_node = models.ForeignKey(FailureNode, on_delete=models.CASCADE)
#     description = models.TextField()
#     recovery_method = models.ForeignKey(RecoveryMethod, on_delete=models.CASCADE)
#     spare_parts = models.TextField(blank=True)
#     restoration_date = models.DateField()
#     downtime = models.IntegerField(default=0)

#     def str(self):
#         return f"{self.machine.serial_number} - {self.failure_node}"
from rest_framework import serializers
from .models import *

class TypeToSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeTo
        fields = '__all__'

class RecoveryMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecoveryMethod
        fields = '__all__'

class FailureNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FailureNode
        fields = '__all__'

class ReclamationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reclamation
        fields = '__all__'

class MachineLimitedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = 'all'

class ModelMashineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelMashine
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')

class EngineModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Engine
        fields = ['id', 'name']

class TransmissionModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transmission
        fields = ['id', 'name']

class BridgeASerializer(serializers.ModelSerializer):
    class Meta:
        model = BridgeA
        fields = ['id', 'name']

class BridgeBSerializer(serializers.ModelSerializer):
    class Meta:
        model = BridgeB
        fields = ['id', 'name']

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'name']

class ServiceCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCompany
        fields = ['id', 'name']

class MachineSerializer(serializers.ModelSerializer):
    model = serializers.SerializerMethodField()
    engine_model = EngineModelSerializer()
    transmission_model = TransmissionModelSerializer()
    drive_axle_model = BridgeASerializer()
    steer_axle_model = BridgeBSerializer()
    client = ClientSerializer()
    service_company = ServiceCompanySerializer()

    class Meta:
        model = Machine
        fields = '__all__'

    def get_model(self, obj):
        return obj.model.name if obj.model else 'Не указана'
    

class ToSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeTo
        fields = ['id', 'name']
    

class MachineToSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = ['serial_number']


class MaintenanceSerializer(serializers.ModelSerializer):
    machine_name = serializers.CharField(source='machine.serial_number', read_only=True)
    type = serializers.CharField(source='type.name', read_only=True)
    service_company = serializers.CharField(source='service_company.name', read_only=True)

    class Meta:
        model = Maintenance
        fields = '__all__'


class ReclamationSerializer(serializers.ModelSerializer):
    machine_name = serializers.CharField(source='machine.serial_number', read_only=True)
    failure_node = serializers.CharField(source='failure_node.name', read_only=True)
    recovery_method_name = serializers.CharField(source='recovery_method.name', read_only=True)

    class Meta:
        model = Reclamation
        fields = '__all__'



from rest_framework import serializers
from .models import User, Client, ServiceCompany, Machine, TypeTo, Maintenance, RecoveryMethod, FailureNode, Reclamation, Engine, Transmission, BridgeA, BridgeB, ModelMashine

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

class TypeToSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeTo
        fields = '__all__'

class MaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maintenance
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


# from rest_framework import serializers
# from .models import User, Client, ServiceCompany, Machine, TypeTo, Maintenance, RecoveryMethod, FailureNode, Reclamation, Engine, Transmission, BridgeA, BridgeB

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'email', 'role')
#         # fields = '__all__'

# class EngineModelSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Engine
#         fields = '__all__'

# class TransmissionModelSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Transmission
#         fields = '__all__'

# class BridgeASerializer(serializers.ModelSerializer):
#     class Meta:
#         model = BridgeA
#         fields = '__all__'

# class BridgeBSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = BridgeB
#         fields = '__all__'

# class ClientSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Client
#         fields = '__all__'

# class ServiceCompanySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ServiceCompany
#         fields = '__all__'

# class MachineSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Machine
#         fields = '__all__'

# class TypeToSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TypeTo
#         fields = '__all__'

# class MaintenanceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Maintenance
#         fields = '__all__'

# class RecoveryMethodSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = RecoveryMethod
#         fields = '__all__'

# class FailureNodeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = FailureNode
#         fields = '__all__'

# class ReclamationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Reclamation
#         fields = '__all__'

# class MachineLimitedSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Machine
#         fields = '__all__'
#         # fields = ('serial_number', 'model', 'engine_model', 'engine_serial_number', 'transmission_model', 'transmission_serial_number', 'drive_axle_model', 'drive_axle_serial_number', 'steer_axle_model', 'steer_axle_serial_number')


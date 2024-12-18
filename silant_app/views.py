from rest_framework import viewsets, permissions, status
from .models import User, Client, ServiceCompany, Machine, TypeTo, Maintenance, RecoveryMethod, FailureNode, Reclamation
from .serializers import UserSerializer, ClientSerializer, ServiceCompanySerializer, MachineSerializer, TypeToSerializer, MaintenanceSerializer, RecoveryMethodSerializer, FailureNodeSerializer, ReclamationSerializer, MachineLimitedSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

import logging

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer

from django.shortcuts import render, redirect
from .forms import CustomAuthenticationForm

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response


from rest_framework import viewsets
from .models import Machine
from .serializers import MachineSerializer
   


logger = logging.getLogger(__name__)


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@require_http_methods(["PUT"])
def update_machine(request, id):
    try:
        # Получение машины по ID
        machine = Machine.objects.get(pk=id)
    except Machine.DoesNotExist:
        return JsonResponse({'error': 'Machine not found'}, status=404)

    # Парсинг JSON данных из запроса
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    # Применение данных к объекту машины через сериализатор
    serializer = MachineSerializer(machine, data=data, partial=True)  # partial=True позволяет обновлять только указанные поля
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=200)
    else:
        return JsonResponse(serializer.errors, status=400)



class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.all()  # набор данных, с которым будет работать ViewSet
    serializer_class = MachineSerializer  # используемый сериализатор



@api_view(['GET'])
def search_machine_by_serial_number(request):
    serial_number = request.GET.get('serial_number', None)
    if serial_number:
        try:
            machine = Machine.objects.get(serial_number=serial_number)
            serializer = MachineSerializer(machine)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Machine.DoesNotExist:
            return Response({'detail': 'Данных о машине с таким заводским номером нет в системе'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Ошибка при поиске машины: {e}")
            return Response({'detail': 'Произошла ошибка при поиске машины'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({'detail': 'Необходимо указать заводской номер'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def user_info(request):
    permission_classes = [IsAuthenticated]
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]

class ServiceCompanyViewSet(viewsets.ModelViewSet):
    queryset = ServiceCompany.objects.all()
    serializer_class = ServiceCompanySerializer
    permission_classes = [permissions.IsAuthenticated]

class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer
    permission_classes = [permissions.IsAuthenticated]

class TypeToViewSet(viewsets.ModelViewSet):
    queryset = TypeTo.objects.all()
    serializer_class = TypeToSerializer
    permission_classes = [permissions.IsAuthenticated]

class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer
    permission_classes = [permissions.IsAuthenticated]

class RecoveryMethodViewSet(viewsets.ModelViewSet):
    queryset = RecoveryMethod.objects.all()
    serializer_class = RecoveryMethodSerializer
    permission_classes = [permissions.IsAuthenticated]

class FailureNodeViewSet(viewsets.ModelViewSet):
    queryset = FailureNode.objects.all()
    serializer_class = FailureNodeSerializer
    permission_classes = [permissions.IsAuthenticated]

class ReclamationViewSet(viewsets.ModelViewSet):
    queryset = Reclamation.objects.all()
    serializer_class = ReclamationSerializer
    permission_classes = [permissions.IsAuthenticated]


class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        return Response(serializer.errors, status=400)
    

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            print(f'Получен запрос на логин: {username}, {password}')  # Логирование входящих данных

            # Пример проверки логина и пароля
            if username == 'admin' and password == 'password':
                return JsonResponse({
                    'token': 'example-token',
                    'tokenExpire': (timezone.now() + timezone.timedelta(hours=1)).timestamp(),  # Пример времени истечения токена (1 час)
                })
            else:
                print('Неверный логин или пароль')  # Логирование ошибки
                return JsonResponse({'message': 'Неверный логин или пароль'}, status=401)
        except Exception as e:
            print(f'Ошибка при обработке запроса: {e}')  # Логирование исключений
            return JsonResponse({'message': 'Ошибка при обработке запроса'}, status=500)
    return JsonResponse({'message': 'Метод не поддерживается'}, status=405)


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ClientViewSet, ServiceCompanyViewSet, MachineViewSet, TypeToViewSet, MaintenanceViewSet, RecoveryMethodViewSet, FailureNodeViewSet, ReclamationViewSet, search_machine_by_serial_number, user_info
from .views import CustomAuthToken
from django.contrib.auth import views as auth_views
from .views import MaintenanceListView, ReclamationListView
# from . import views
# from .views import login_view


router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'clients', ClientViewSet)
router.register(r'service-companies', ServiceCompanyViewSet)
router.register(r'machines', MachineViewSet)
router.register(r'types-to', TypeToViewSet)
router.register(r'maintenances', MaintenanceViewSet)
router.register(r'recovery-methods', RecoveryMethodViewSet)
router.register(r'failure-nodes', FailureNodeViewSet)
router.register(r'reclamations', ReclamationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # path('login/', login_view, name='login'),
    path('login/', CustomAuthToken.as_view(), name='api_login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('search_machine/', search_machine_by_serial_number, name='search_machine_by_serial_number'),
    path('user-info/', user_info, name='user_info'),
    path('api/maintenances/', MaintenanceListView.as_view(), name='maintenance-list'),
    path('api/reclamations/', ReclamationListView.as_view(), name='reclamation-list'),
    path('api/user-info/', user_info, name='user_info'),
    path('', include(router.urls)),
]







# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import UserViewSet, ClientViewSet, ServiceCompanyViewSet, MachineViewSet, TypeToViewSet, MaintenanceViewSet, RecoveryMethodViewSet, FailureNodeViewSet, ReclamationViewSet, search_machine_by_serial_number

# router = DefaultRouter()
# router.register(r'users', UserViewSet)
# router.register(r'clients', ClientViewSet)
# router.register(r'service-companies', ServiceCompanyViewSet)
# router.register(r'machines', MachineViewSet)
# router.register(r'types-to', TypeToViewSet)
# router.register(r'maintenances', MaintenanceViewSet)
# router.register(r'recovery-methods', RecoveryMethodViewSet)
# router.register(r'failure-nodes', FailureNodeViewSet)
# router.register(r'reclamations', ReclamationViewSet)

# urlpatterns = [
#     path('', include(router.urls)),
#     path('search_machine/', search_machine_by_serial_number, name='search_machine_by_serial_number'),
# ]

from django.contrib import admin
from .models import User, Client, ServiceCompany, Machine, TypeTo, Maintenance, RecoveryMethod, FailureNode, Reclamation, Engine, Transmission, ModelMashine, BridgeA, BridgeB

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'role')
    list_filter = ('role', 'is_staff', 'is_active')

class ClientAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class ServiceCompanyAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# class MashineEngine(admin.ModelAdmin):
#     list_display = ('name',)
#     search_fields = ('name',)

# class ServiceCompanyAdmin(admin.ModelAdmin):
#     list_display = ('name',)
#     search_fields = ('name',)

class MachineAdmin(admin.ModelAdmin):
    list_display = [
        'serial_number', 'model', 'engine_model', 'engine_serial_number',
        'transmission_model', 'transmission_serial_number', 'drive_axle_model',
        'drive_axle_serial_number', 'steer_axle_model', 'steer_axle_serial_number',
        'supply_contract', 'shipment_date', 'end_user', 'supply_address',
        'configuration', 'client', 'service_company'
    ]
    list_filter = ['model', 'engine_model', 'transmission_model', 'drive_axle_model', 'steer_axle_model', 'shipment_date']

class TypeToAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class MaintenanceAdmin(admin.ModelAdmin):
    list_display = ('machine', 'type', 'date', 'operating_hours', 'order_number', 'order_date', 'service_company')
    search_fields = ('machine__serial_number', 'type__name', 'service_company__name')
    list_filter = ('date', 'type', 'service_company')

class RecoveryMethodAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class FailureNodeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class ReclamationAdmin(admin.ModelAdmin):
    list_display = ('machine', 'failure_date', 'operating_hours', 'failure_node', 'description', 'recovery_method', 'spare_parts', 'restoration_date', 'downtime')
    search_fields = ('machine__serial_number', 'failure_node__name', 'recovery_method__name')
    list_filter = ('failure_date', 'restoration_date', 'failure_node', 'recovery_method')

admin.site.register(User, UserAdmin)
admin.site.register(Machine, MachineAdmin)
admin.site.register(Client, ClientAdmin)
admin.site.register(ServiceCompany, ServiceCompanyAdmin)
admin.site.register(TypeTo, TypeToAdmin)
admin.site.register(Maintenance, MaintenanceAdmin)
admin.site.register(RecoveryMethod, RecoveryMethodAdmin)
admin.site.register(FailureNode, FailureNodeAdmin)
admin.site.register(Reclamation, ReclamationAdmin)
admin.site.register(Engine)
admin.site.register(Transmission)
admin.site.register(ModelMashine)
admin.site.register(BridgeA)
admin.site.register(BridgeB)
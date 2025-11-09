from django.contrib import admin
from .models import Department, Employee, Room, Booking

# Department Admin
@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name',)
    list_filter = ('name',)


# Employee Admin
@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'email', 'department', 'position', 'role', 'manager')
    search_fields = ('first_name', 'last_name', 'email', 'position')
    list_filter = ('department', 'role')
    autocomplete_fields = ('department', 'manager')  # Helpful for large datasets
    readonly_fields = ('id',)


# Room Admin
@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'type', 'capacity', 'is_available', 'facilities')
    search_fields = ('name',)
    list_filter = ('type', 'is_available')


# Booking Admin
@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'room', 'employee', 'start_time', 'end_time', 'number_of_participants', 'status', 'created_at')
    search_fields = ('room__name', 'employee__first_name', 'employee__last_name')
    list_filter = ('status', 'room', 'employee')
    autocomplete_fields = ('room', 'employee')
    readonly_fields = ('created_at',)
# serializers.py
from rest_framework import serializers
from .models import Department, Employee, Room, Booking
from django.contrib.auth.hashers import make_password

# Department Serializer
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description']


# Employee Serializer
class EmployeeSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)  # Nested department info
    manager = serializers.StringRelatedField()  # Show manager's name
    password = serializers.CharField(write_only=True)  # Never expose password

    class Meta:
        model = Employee
        fields = [
            'id', 'first_name', 'last_name', 'email', 'password',
            'phone', 'position', 'department', 'hire_date',
            'salary', 'manager', 'role'
        ]

    # Hash password when creating/updating
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)


# Room Serializer
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'type', 'capacity', 'facilities', 'is_available']


# serializers.py
from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

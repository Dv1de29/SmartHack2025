from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

# Department Model
class Department(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.name


# Employee Model
class Employee(models.Model):
    ROLE_CHOICES = [
        ('employee', 'Employee'),
        ('manager', 'Manager'),
        ('admin', 'Admin'),
    ]

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    phone = models.CharField(max_length=20)
    position = models.CharField(max_length=255, default='Employee')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    hire_date = models.DateField(auto_now_add=True)  # Automatically set to today
    salary = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))])
    manager = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subordinates')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    @property
    def is_authenticated(self):
        return True
    
    @property
    def is_anonymous(self):
        return False
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - ID : {self.id}"



# Room Model
class Room(models.Model):
    ROOM_TYPE_CHOICES = [
        ('office', 'Office'),
        ('meeting', 'Meeting'),
        ('relaxation', 'Relaxation'),
        ('training', 'Training'),
    ]

    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=ROOM_TYPE_CHOICES)
    capacity = models.IntegerField(validators=[MinValueValidator(1)])
    facilities = models.TextField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.type})"


# Booking Model
class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    ]

    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    number_of_participants = models.IntegerField(validators=[MinValueValidator(1)])
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically set to now

    def __str__(self):
        return f"{self.room.name} booking by {self.employee.first_name} ({self.status})"

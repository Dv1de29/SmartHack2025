# app/views.py
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Department, Employee, Room, Booking
from .serializers import DepartmentSerializer, EmployeeSerializer, RoomSerializer, BookingSerializer
import jwt
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta, timezone
from datetime import datetime

exp = datetime.now(timezone.utc) + timedelta(hours=1)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer



class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]



class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer


class EmployeeLoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        
        try:
            employee = Employee.objects.get(email=email)
        except Employee.DoesNotExist:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
        
        if employee.password != password:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
        
        
        payload = {
            "employee_id": employee.id,
            "email": employee.email,
            "role": employee.role,
            "exp": datetime.now(timezone.utc) + timedelta(hours=1) 
        }
        
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
        
        refresh = RefreshToken.for_user(employee) 
        
        return Response({
            "employee_id": employee.id,
            "email": employee.email,
            "role": employee.role,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })

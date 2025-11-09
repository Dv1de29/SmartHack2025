# app/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from .models import Employee

class EmployeeJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            employee_id = validated_token.get('user_id')
            
            if not employee_id:
                raise AuthenticationFailed('Token does not contain user_id')
            
            employee = Employee.objects.get(id=employee_id)
            return employee
            
        except Employee.DoesNotExist:
            raise AuthenticationFailed('Employee not found')
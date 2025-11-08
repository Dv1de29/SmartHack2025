from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, EmployeeViewSet, RoomViewSet, BookingViewSet, EmployeeLoginView

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),          # toate endpoint-urile API
    path('login/', EmployeeLoginView.as_view(), name='employee-login'),  # login
]

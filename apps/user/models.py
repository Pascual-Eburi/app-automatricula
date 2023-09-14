from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
import os

# Create your models here.
"""
Table usuarios {
  id_usuario integer [primary key]
  nombre varchar(50)
  apellidos varchar(100)
  email varchar(100) [unique, not null]
  clave varchar(255) [not null]
  telefono varchar(9) [unique]
  id_grupo integer
}

"""
class UserAccountManager(BaseUserManager):

    # Create a normal user account
    def create_user(self, email, password = None, **extra_fields):
        
        if not email:
            raise ValueError('El usuario tiene que tener un email')
        
        print(extra_fields)
        email = self.normalize_email(email)
        user = self.model(email = email, **extra_fields)
        
        print(user)
        
        user.set_password(password)

        user.save()
        return user
    
            
        
    # create a super user account
    def create_superuser(self, email, password, **extra_fields):
        user = self.create_user(email, password, **extra_fields)
        
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        
        return user
    
    """ def create_superuser(self, email, phone, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email=email, phone=phone, password=password, **extra_fields)
    """


class UserAccount(AbstractBaseUser, PermissionsMixin):
    roles = (
        ('student', 'STUDENT'),
        ('institute_staff', 'INSTITUTE_STAFF'),
        ('staff', 'STAFF'),
        ('admin_staff', 'ADMIN_STAFF'),
    )
    #user_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=255, unique=True)
    phone = models.CharField(max_length=15, unique=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now = True)
    rol = models.CharField(max_length=30, 
                           choices=roles, default='student' )
    
    objects = UserAccountManager()
    
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'last_name', 'phone']
    
    def get_full_name(self):
        return self.name + ' ' + self.last_name

    def get_short_name(self):
        return self.name

    def __str__(self):
        return self.email
        
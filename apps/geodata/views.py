from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework import permissions

from .models import Province, District
from .serializers import ProvinceSerializer, DistrictSerializer

from core.utils import is_valid_number

#*****************************************
# PROVINCE API VIEWS
#*****************************************
# get single province
class ProvinceDetailView(APIView):
    # permission_classes = (permissions.AllowAny, )
    
    def get(self, request, id, format = None):
        # validate province id
        if is_valid_number(id) == False:
            return Response(
                {'error': 'El id de provincia tiene que ser un número'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
            
        # check if the province exists
        if Province.objects.filter(province_id = id).exists():
   
            # ok, the province exits --> serialize
            province = Province.objects.get(province_id = id)
            province = ProvinceSerializer(province)
            
            return Response(
                {'province': province.data}, 
                status=status.HTTP_200_OK
            )
            
        else:
            return Response(
                {'error': 'No existe provincia con este id'},
                status=status.HTTP_404_NOT_FOUND
            )
            

# get list of provinces
class ListProvinceView(APIView):
    # permission_classes = (permissions.AllowAny, )
    def get(self, request, format = None):
        
        if Province.objects.all().exists() == False:
            return Response(
                {'provinces': []},
                status = status.HTTP_204_NO_CONTENT
            )
        
        sortBy = request.query_params.get('sortBy')
        
        if sortBy not in ['province_id', 'name']:
            sortBy = 'name'
        
        # ordering
        # limit
        provinces = Province.objects.order_by(sortBy).all()
        provinces = ProvinceSerializer(provinces, many = True)
        
        if provinces:
            return Response(
                {'provinces': provinces.data},
                status = status.HTTP_200_OK
            )
        else:
            return Response(
                {'provinces': []},
                status = status.HTTP_404_NOT_FOUND
            )
            
# add province 
class CreateProvinceView(APIView):
    permission_classes = (AllowAny, )

    def post(self, request, format = None):
        province = ProvinceSerializer(data=request.data)
        if province.is_valid():
            province.save()
            return Response(province.data, status=status.HTTP_200_OK)
        
        return Response(province.errors, status=status.HTTP_400_BAD_REQUEST)
 
# edit province
class EditProvinceView(APIView):
    permission_classes = (AllowAny, )

    def put(self, request, format = None):
        validate_province = ProvinceSerializer(data=request.data)
        if validate_province.is_valid():
            
            data = self.request.data
            province = Province.objects.get(province_id = data['province_id'])
            province.province_id = data['province_id']
            province.name = data['name']
            province.save()
            return Response(
                {'message': 'Provincia actualizada'}, 
                status=status.HTTP_200_OK
            )
        
        return Response(validate_province.errors, status=status.HTTP_400_BAD_REQUEST)
    
# delete province
class DeleteProvinceView(APIView):
    permission_classes = [AllowAny]
    
    def delete(self, request, id, format = None):
                
        # validate province id
        if is_valid_number(id) == False:
            return Response(
                {'error': 'El id de provincia tiene que ser un número'},
                status = status.HTTP_400_BAD_REQUEST
            )

        if Province.objects.filter(province_id = id).exists() == False:
            return Response({'error': 'La provincia no existe'}, status = status.HTTP_404_NOT_FOUND)
        
        
        province = Province.objects.get(province_id = id)
        print(province)
        province.delete()
        
        return Response({'message': 'Provincia eliminada'}, status = status.HTTP_200_OK)



#*****************************************
# DISTRICT API VIEWS
#*****************************************
# get single district
class DistrictDetailView(APIView):
    # permission_classes = (permissions.AllowAny, )
    
    def get(self, request, id, format = None):
        # validate district id
        
        if is_valid_number(id) == False:
            return Response(
                {'error': 'El id de distrito tiene que ser un número'},
                status = status.HTTP_404_NOT_FOUND
            )  


                        
        # check if the district exists
        if District.objects.filter(district_id = id).exists():
   
            # ok, the district exits --> serialize
            district = District.objects.get(district_id = id)
            district = DistrictSerializer(district)
            
            return Response(
                {'district': district.data}, 
                status = status.HTTP_200_OK
            )
            
        else:
            return Response(
                {'error': 'No existe distrito con este id'},
                status = status.HTTP_404_NOT_FOUND
            )
            

# list of districts           
class ListDistrictView(APIView):
    permission_classes = (permissions.AllowAny, )
    
    def get(self, request, format = None):
        
        # check if exists records
        if District.objects.all().exists() == False:
            return Response(
                {'districts': []},
                status = status.HTTP_204_NO_CONTENT
            )
        
        sortBy = request.query_params.get('sortBy')
        
        if sortBy not in ['district_id', 'name']:
            sortBy = 'name'
        
        # ordering
        # limit
        districts = Province.objects.order_by(sortBy).all()
        
        districts = DistrictSerializer(districts, many = True)
        
        if districts:
            return Response(
                {'districts': districts.data},
                status = status.HTTP_200_OK
            )
        else:
            return Response(
                {'districts': []},
                status = status.HTTP_404_NOT_FOUND
            )
              

# add district

# edit district

# delete district

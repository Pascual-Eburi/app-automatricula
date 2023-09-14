"""
 utils.py
 This file contains utils functions
"""
from rest_framework import status

# validate a number
def is_valid_number(val):
    try:
        valid_number = int(val)
        return True       
    except:
        return False
    
# Api respnoses
def api_response(type, model_name, data = []):
    
    # Api response and message types
    responses = {
        # when the id fild is not a number
        "id_error": {
            
        "response": {'type':'error', 'message': 'El id tiene que ser numérico'},
        "status": status.HTTP_400_BAD_REQUEST
        },
        # When model.object.all().exits() == False
        "no_content": (            
            {'type':'warning', 'message': 'Todavía no se ha registrado datos '},
            status.HTTP_204_NO_CONTENT
        ),
        # When not found data for especific id o pk
        "no_content_for_id":(            
            {'type':'error', 'message': 'No existen datos para este registro'},
            status.HTTP_404_NOT_FOUND
        ),
        # When found content and data
        "found_data": (
            {model_name: data},
            
        )
          
    }

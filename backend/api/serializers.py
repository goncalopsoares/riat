from rest_framework import serializers
from api.models import CustomUser, Dimensions, Projects, Scales, Statements, Surveys, Users, UsersHasProjects
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils.timezone import now

# USERS_AUTH

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'user_first_name', 'user_last_name', 'user_email', 'user_role', 'password']
    
    def create(self, validated_data): 
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()

        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "user_email": user.user_email,
                "user_first_name": user.user_first_name,
                "user_last_name": user.user_last_name,
                "role": user.user_role
            }
        }


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data.get('email'), password=data.get('password'))
        if not user:
            raise serializers.ValidationError("Credentials error: Invalid email or password")

        refresh = RefreshToken.for_user(user)
        user.last_login = now()
        user.save(update_fields=['last_login'])
        
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'user_first_name': user.user_first_name,
                'user_last_name': user.user_last_name,
                'user_email': user.user_email,
                'user_role': user.user_role
            }
            }
       
       
# PROJECTS

class UserHasProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersHasProjects
        fields = [
            'users_has_projects_role',
            'users_has_projects_function',
        ]
        extra_kwargs = {
            'users_id_users': {'read_only': True},
            'projects_id_projects': {'read_only': True},
        }

class ProjectSerializer(serializers.ModelSerializer):
    
    project_name = serializers.CharField(validators=[])
    metadata = UserHasProjectsSerializer(many=True, source='usershasprojects_set')
    
    class Meta:
        model = Projects
        fields = [
            'id_projects',
            'project_name',
            'project_organization',
            'project_phase',
            'project_trl',
            'project_mrl',
            'project_srl',
            'metadata',
        ]
        extra_kwargs = {
            'project_creation_time': {'read_only': True},       
        }
        
    def create(self, validated_data):
        return self.update_or_create(validated_data)
    
    def update_or_create(self, validated_data):
        
        metadata_data = validated_data.pop('usershasprojects_set', [])
        request = self.context.get('request')
        user = request.user if request else None

        if user and not isinstance(user, Users):
            user = Users.objects.get(pk=user.pk)

        project_name = validated_data.get('project_name')

        try:
            project = Projects.objects.get(project_name=project_name)
            exists = True
        except Projects.DoesNotExist:
            exists = False

        defaults = {
            'project_organization': validated_data.get('project_organization'),
            'project_phase': validated_data.get('project_phase'),
            'project_trl': validated_data.get('project_trl'),
            'project_mrl': validated_data.get('project_mrl'),
            'project_srl': validated_data.get('project_srl'),
        }
        if not exists:
            defaults.update({
                'project_creation_time': now(),
            })

        project, created = Projects.objects.update_or_create(
            project_name=project_name,
            defaults=defaults
        )
        
        if user and created:

                for item in metadata_data:
                    UsersHasProjects.objects.create(
                        users_id_users=user,
                        projects_id_projects=project,
                        **item
                    )

        return project  
        
        
# SURVEYS
    
class SurveySerializer(serializers.ModelSerializer):
    
    survey_name = serializers.CharField(validators=[])
    
    class Meta:
        model = Surveys
        fields = [
            'id_surveys',
            'survey_name',
            'survey_description',
            'survey_creation_time',
            'survey_created_by',
            'survey_modified_by',
            'survey_last_modified_by_date'
        ]
        extra_kwargs = {
            'survey_creation_time': {'read_only': True},
            'survey_created_by': {'read_only': True},
            'survey_modified_by': {'read_only': True},
            'survey_last_modified_by_date': {'read_only': True}
        }

    def create(self, validated_data):
        return self.update_or_create(validated_data)

    def update_or_create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        survey_name = validated_data.get('survey_name')

        try:
            survey = Surveys.objects.get(survey_name=survey_name)
            exists = True
        except Surveys.DoesNotExist:
            exists = False

        defaults = {
            'survey_description': validated_data.get('survey_description'),
            'survey_modified_by':  user.user_first_name + ' ' + user.user_last_name,
            'survey_last_modified_by_date': now(),
        }
        if not exists:
            defaults.update({
                'survey_created_by': user.user_first_name + ' ' + user.user_last_name,
                'survey_creation_time': now(),
            })

        survey, created = Surveys.objects.update_or_create(
            survey_name=survey_name,
            defaults=defaults
        )

        return survey  
    
    # SCALES
    
class ScaleSerializer(serializers.ModelSerializer):
    
    scale_name = serializers.CharField(validators=[])
    
    class Meta:
        model = Scales
        fields = [
            'id_scales',
            'scale_name',
            'scale_levels',
            'scale_labels'
        ]
        
    def create(self, validated_data):
        return self.update_or_create(validated_data)

    def update_or_create(self, validated_data):
    
        scale_name = validated_data.get('scale_name')

        try:
            scale = Scales.objects.get(scale_name=scale_name)
            exists = True
        except Scales.DoesNotExist:
            exists = False

        defaults = {
            'scale_levels': validated_data.get('scale_levels'),
            'scale_labels': validated_data.get('scale_labels'),
        }
        
        if not exists:
            defaults.update({
                'scale_levels': validated_data.get('scale_levels'),
                'scale_labels': validated_data.get('scale_labels'),
            })

        scale, created = Scales.objects.update_or_create(
            scale_name=scale_name,
            defaults=defaults
        )

        return scale
    
# DIMENSIONS

from django.utils.timezone import now

class DimensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dimensions
        fields = [
            'id_dimensions',
            'surveys_id_surveys',
            'dimension_name',
            'dimension_description',
            'dimension_phase',
            'dimension_created_by',
            'dimension_last_modified_by',
            'dimension_last_modified_by_date'
        ]
        extra_kwargs = {
            'dimension_created_by': {'read_only': True},
            'dimension_last_modified_by': {'read_only': True},
            'dimension_last_modified_by_date': {'read_only': True},
        }

    def create(self, validated_data):
        return self.update_or_create(validated_data)

    def update_or_create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        surveys_id_surveys = validated_data.get('surveys_id_surveys')
        dimension_name = validated_data.get('dimension_name')  # Used for lookup

        # Ensure that dimension_name and surveys_id_surveys exist
        if not dimension_name or not surveys_id_surveys:
            raise serializers.ValidationError({"error": "Both dimension_name and surveys_id_surveys are required."})

        # Try to find the existing dimension or create a new one if it doesn't exist
        dimension, created = Dimensions.objects.get_or_create(
            dimension_name=dimension_name,
            dimension_description=validated_data.get('dimension_description'),
            dimension_phase=validated_data.get('dimension_phase'),
            surveys_id_surveys=surveys_id_surveys,
            defaults={  # Only used if the object doesn't exist
                'dimension_created_by': f"{user.user_first_name} {user.user_last_name}",
                'dimension_last_modified_by': f"{user.user_first_name} {user.user_last_name}",
                'dimension_last_modified_by_date': now(),
            }
        )

        # If the dimension was not created, update it
        if not created:
            # Prepare update fields
            update_fields = {
                'dimension_last_modified_by': f"{user.user_first_name} {user.user_last_name}",
                'dimension_last_modified_by_date': now(),  # Update the last modified date
            }

            # Only update the fields that were provided in the request
            if 'dimension_description' in validated_data:
                update_fields['dimension_description'] = validated_data['dimension_description']
            if 'dimension_phase' in validated_data:
                update_fields['dimension_phase'] = validated_data['dimension_phase']

            # Perform the update (using update_fields for optimized update)
            Dimensions.objects.filter(id_dimensions=dimension.id_dimensions).update(**update_fields)

            # No need to re-assign or call save on dimension_last_modified_by and dimension_last_modified_by_date 
            # because they are already being updated in update_fields.

            # Refresh the object from the database to get the latest values
            dimension.refresh_from_db()

        # Return the dimension, either newly created or updated
        return dimension

 
#STATEMENTS

class StatementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statements
        fields = [
            'id_statements',
            'dimensions_id_dimensions',
            'scales_id_scales',
            'statement_name',
            'statement_description',
            'statement_created_by',
            'statement_modified_by',
            'statement_last_modified_by_date'
        ]
        extra_kwargs = {
            'statement_created_by': {'read_only': True},
            'statement_modified_by': {'read_only': True},
            'statement_last_modified_by_date': {'read_only': True},
        }

    def create(self, validated_data):
        return self.update_or_create(validated_data)

    def update_or_create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        dimensions_id_dimensions = validated_data.get('dimensions_id_dimensions')
        statement_name = validated_data.get('statement_name')

        if not statement_name or not dimensions_id_dimensions:
            raise serializers.ValidationError({"error": "Both statement_name and dimensions_id_dimensions are required."})

        try:
            statement = Statements.objects.get(statement_name=statement_name, dimensions_id_dimensions=dimensions_id_dimensions)
        except Statements.DoesNotExist:
            # Criar novo statement se não existir
            statement = Statements.objects.create(
                statement_name=statement_name,
                dimensions_id_dimensions=dimensions_id_dimensions,
                scales_id_scales=validated_data.get('scales_id_scales'),
                statement_description=validated_data.get('statement_description', ''),
                statement_created_by=f"{user.user_first_name} {user.user_last_name}",
                statement_modified_by=f"{user.user_first_name} {user.user_last_name}",
                statement_last_modified_by_date=now()
            )
            return statement

        # Campos a atualizar
        update_fields = {
            'statement_modified_by': f"{user.user_first_name} {user.user_last_name}",
            'statement_last_modified_by_date': now(),
        }

        if 'statement_description' in validated_data:
            update_fields['statement_description'] = validated_data['statement_description']
        if 'scales_id_scales' in validated_data:
            update_fields['scales_id_scales'] = validated_data['scales_id_scales']
            
        # Always update statement_last_modified_by and statement_last_modified_by_date
        update_fields['statement_last_modified_by'] = f"{user.user_first_name} {user.user_last_name}"
        update_fields['statement_last_modified_by_date'] = now()

        Statements.objects.filter(id_statements=statement.id_statements).update(**update_fields)

        statement.refresh_from_db()
        return statement

from rest_framework import serializers
from api.models import AnswersBase, AnswersBoolean, AnswersInteger, AnswersText, CustomUser, Dimensions, Projects, Scales, Statements, Surveys, Users, UsersHasProjects, Reports, ReportsOverallScore, OverallRecommendations, OverallScoreLevels, Submissions, ReportsScore
from django.utils.timezone import now
from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils.crypto import get_random_string

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
        
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not Users.objects.filter(user_email=value).exists():
            
            pass
        return value
    
class PasswordResetSerializer(serializers.Serializer):
    
    model = CustomUser
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)

    def validate(self, attrs):
        token = attrs.get('token')
        user = CustomUser.objects.filter(password_reset_token=token).first()

        if not user:
            raise serializers.ValidationError("Token inválido.")

        if not user.password_reset_token_date or now() - user.password_reset_token_date > timedelta(hours=1):
            raise serializers.ValidationError("Token expirado.")

        attrs['user'] = user
        return attrs


# PROJECTS

class UserHasProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersHasProjects
        fields = [
            'id_users_has_projects',
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
            'project_value_chain',
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
            'project_value_chain': validated_data.get('project_value_chain'),
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
    
    id_surveys = serializers.CharField(validators=[])
    
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

        id_surveys = validated_data.get('id_surveys')

        try:
            survey = Surveys.objects.get(id_surveys=id_surveys)
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
            id_surveys=id_surveys,
            defaults=defaults
        )

        return survey  

# SUBMISSIONS

class SubmissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submissions
        fields = [
            'id_submissions',
            'surveys_id_surveys',
            'users_has_projects_id_users_has_projects',
            'submission_state',
            'submission_starting_time',
            'submission_ending_time',
        ]
        extra_kwargs = {
            'submission_starting_time': {'read_only': True},
            'submission_ending_time': {'read_only': True},
        }
        defaults = {
            'submission_starting_time': now(),
        }
      

    def create(self, validated_data):

        validated_data['submission_starting_time'] = now()
        validated_data['submission_state'] = 1
        return Submissions.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.submission_ending_time = now()
        instance.submission_state = validated_data.get('submission_state', instance.submission_state)
        instance.save()
        return instance

    
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

class DimensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dimensions
        fields = [
            'id_dimensions',
            'surveys_id_surveys',
            'dimension_name',
            'dimension_description',
            'dimension_order',
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
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        dimension = Dimensions(
            surveys_id_surveys=validated_data.get('surveys_id_surveys'),
            dimension_name=validated_data.get('dimension_name'),
            dimension_description=validated_data.get('dimension_description', ''),
            dimension_created_by=f"{user.user_first_name} {user.user_last_name}" if user else "Unknown",
            dimension_last_modified_by=f"{user.user_first_name} {user.user_last_name}" if user else "Unknown",
            dimension_last_modified_by_date=now()
        )
        dimension.save()
        return dimension

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        instance.dimension_name = validated_data.get('dimension_name', instance.dimension_name)
        instance.dimension_description = validated_data.get('dimension_description', instance.dimension_description)
        instance.dimension_last_modified_by = f"{user.user_first_name} {user.user_last_name}" if user else "Unknown"
        instance.dimension_last_modified_by_date = now()

        instance.save()
        return instance

 
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
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        statement = Statements(
            dimensions_id_dimensions=validated_data.get('dimensions_id_dimensions'),
            scales_id_scales=validated_data.get('scales_id_scales'),
            statement_name=validated_data.get('statement_name'),
            statement_description=validated_data.get('statement_description', ''),
            statement_created_by=f"{user.user_first_name} {user.user_last_name}" if user else "Unknown",
            statement_modified_by=f"{user.user_first_name} {user.user_last_name}" if user else "Unknown",
            statement_last_modified_by_date=now()
        )
        statement.save()
        return statement

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        instance.statement_name = validated_data.get('statement_name', instance.statement_name)
        instance.statement_description = validated_data.get('statement_description', instance.statement_description)
        instance.scales_id_scales = validated_data.get('scales_id_scales', instance.scales_id_scales)

        instance.statement_modified_by = f"{user.user_first_name} {user.user_last_name}" if user else "Unknown"
        instance.statement_last_modified_by_date = now()

        instance.save()
        return instance

# ANSWERS

class AnswerBaseSerializer(serializers.ModelSerializer):
    value = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = AnswersBase
        fields = [
            'id_answers_base',
            'statements_id_statements',
            'submissions_id_submissions',
            'answer_creation_time',
            'value',
        ]
        read_only_fields = ['id_answers_base', 'answer_creation_time']
        
    def get(self, submissions_id_submissions):
        answers_base = AnswersBase.objects.filter(submissions_id_submissions=submissions_id_submissions)
        result = []
        for answer in answers_base:
            answer_data = {
                'id_answers_base': answer.id_answers_base,
                'statements_id_statements': answer.statements_id_statements.id_statements,
                'submissions_id_submissions': answer.submissions_id_submissions.id_submissions,
                'answer_creation_time': answer.answer_creation_time,
                'value': None
            }
            try:
                answer_data['value'] = AnswersInteger.objects.get(answers_base_id_answers_base=answer).value
            except AnswersInteger.DoesNotExist:
                try:
                    answer_data['value'] = AnswersBoolean.objects.get(answers_base_id_answers_base=answer).value
                except AnswersBoolean.DoesNotExist:
                    try:
                        answer_data['value'] = AnswersText.objects.get(answers_base_id_answers_base=answer).value
                    except AnswersText.DoesNotExist:
                        pass
            result.append(answer_data)
        return result

    def create(self, validated_data):
        value = validated_data.pop('value', '')
        base_answer = AnswersBase.objects.create(**validated_data)
        self._save_typed_answer(base_answer, value)
        return base_answer

    def update(self, instance, validated_data):
        value = validated_data.pop('value', '')
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        self._save_typed_answer(instance, value)
        return instance

    def _save_typed_answer(self, base_answer, value):
        # try to convert to integer first
        try:
            int_value = int(value)
            AnswersInteger.objects.update_or_create(
                answers_base_id_answers_base=base_answer,
                defaults={'value': int_value}
            )
            return
        except (ValueError, TypeError):
            pass

        # verify if boolean
        if isinstance(value, bool) or str(value).lower() in ['true', 'false']:
            bool_value = value if isinstance(value, bool) else str(value).lower() == 'true'
            AnswersBoolean.objects.update_or_create(
                answers_base_id_answers_base=base_answer,
                defaults={'value': bool_value}
            )
            return

        # if text, saves as text
        AnswersText.objects.update_or_create(
            answers_base_id_answers_base=base_answer,
            defaults={'value': value}
        )
        
# REPORTS

class DimensionScoreSerializer(serializers.Serializer):
    dimensionId = serializers.IntegerField()
    totalPointsByDimension = serializers.IntegerField()

    # Add the dimension_name field to include it in the output
    dimension_name = serializers.SerializerMethodField()

    def get_dimension_name(self, obj):
        # Here we fetch the name of the dimension based on the dimensionId
        try:
            dimension = Dimensions.objects.get(id=obj['dimensionId'])
            return dimension.dimension_name
        except Dimensions.DoesNotExist:
            return None  # Or raise a validation error if needed

    
class OverallScoreLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = OverallScoreLevels
        fields = '__all__'

class OverallRecommendationSerializer(serializers.ModelSerializer):
    recommendation_name = serializers.CharField(source='overall_recommendation_name')
    recommendation_description = serializers.CharField(source='overall_recommendations_description')

    class Meta:
        model = OverallRecommendations
        fields = ['recommendation_name', 'recommendation_description']

class ReportsOverallScoreSerializer(serializers.ModelSerializer):
    overall_recommendation = OverallRecommendationSerializer(source='overall_recommendations_id_overall_recommendations')

    class Meta:
        model = ReportsOverallScore
        fields = [
            'reports_overall_score_value',
            'reports_overall_score_max_value',
            'overall_recommendation',
        ]

class ReportsScoreSerializer(serializers.ModelSerializer):
  
    dimension_name = serializers.CharField(source='dimensions_id_dimensions.dimension_name', read_only=True)

    class Meta:
        model = ReportsScore
        fields = [
            'dimension_name',
            'reports_score_dimension_score',
            'dimensions_id_dimensions_id',
        ]


class ReportSerializer(serializers.ModelSerializer):

    final_score = serializers.FloatField(write_only=True)
    max_possible_points = serializers.IntegerField(write_only=True)
    ponderated_score = serializers.FloatField(write_only=True)
    surveys_id_surveys = serializers.PrimaryKeyRelatedField(queryset=Surveys.objects.all(), write_only=True)
    dimension_scores = DimensionScoreSerializer(many=True, write_only=True)
    overall_score = ReportsOverallScoreSerializer(source='reports_overall_score_id_reports_overall_score', read_only=True)

    class Meta:
        model = Reports
        fields = [
            'id_reports',
            'submissions_id_submissions',
            'overall_score',
            'report_creation_date',
            'final_score',
            'max_possible_points',
            'ponderated_score',
            'surveys_id_surveys',
            'dimension_scores',
        ]
        extra_kwargs = {
            'report_creation_date': {'read_only': True},
            'overall_score': {'read_only': True},
        }

    def create(self, validated_data):

        final_score = validated_data.pop('final_score', None)
        max_possible_points = validated_data.pop('max_possible_points', None)
        ponderated_score = validated_data.pop('ponderated_score', None)
        survey = validated_data.pop('surveys_id_surveys', None)
        # Generate a random token for the report
        report_token = get_random_string(length=32)
        validated_data['report_token'] = report_token
        validated_data['report_creation_date'] = now()

        if final_score is None:
            raise serializers.ValidationError("Final score must be provided.")
        if ponderated_score is None:
            raise serializers.ValidationError("Ponderated score must be provided.")
        if survey is None:
            raise serializers.ValidationError("Survey ID must be provided.")
        if report_token is None:
            raise serializers.ValidationError("Report token must be provided.")

        if ponderated_score is None or not isinstance(ponderated_score, (int, float)):
            raise serializers.ValidationError("Ponderated score must be a valid number.")
        
        if max_possible_points is None or not isinstance(max_possible_points, (int)):
            raise serializers.ValidationError("Max points must be a valid number.")

        score_level = OverallScoreLevels.objects.filter(
            overall_score_level_min_value__lte=ponderated_score,
            overall_score_level_max_value__gte=ponderated_score
        ).first()

        if not score_level:
            raise serializers.ValidationError("Não foi possível encontrar um nível de score para este valor.")

        recommendation = OverallRecommendations.objects.filter(
            surveys_id_surveys=survey,
            overall_score_levels_id_overall_score_levels=score_level
        ).first()

        if not recommendation:
            raise serializers.ValidationError("Não foi possível encontrar uma recomendação para este score e survey.")

        overall_score_obj = ReportsOverallScore.objects.create(
            overall_recommendations_id_overall_recommendations=recommendation,
            reports_overall_score_value=final_score,
            reports_overall_score_max_value=max_possible_points
        )

        validated_data['reports_overall_score_id_reports_overall_score'] = overall_score_obj
        validated_data['report_token'] = report_token
        validated_data['report_token_date'] = now()  

        dimension_scores = validated_data.pop('dimension_scores', None)

        report = Reports.objects.create(**validated_data)

        if dimension_scores:
            for dimension_data in dimension_scores:
                ReportsScore.objects.create(
                    reports_id_reports=report,
                    dimensions_id_dimensions_id=dimension_data['dimensionId'],
                    reports_score_dimension_score=dimension_data['totalPointsByDimension']
                )

        return report

    def get_report_details(self, obj):
        report_details = {}
        
        # Get report ID using the report token
        report_token = obj.report_token
        report = Reports.objects.filter(report_token=report_token).first()
        if report:
            report_details['report_id'] = report.id_reports

        # Get dimension scores
        scores = ReportsScore.objects.filter(reports_id_reports=obj)
        report_details['dimension_scores'] = ReportsScoreSerializer(scores, many=True).data

        # Get associated project
        submission = obj.submissions_id_submissions
        if submission:
            user_project = submission.users_has_projects_id_users_has_projects
            if user_project:
                project = user_project.projects_id_projects
                if project:
                    report_details['project'] = {
                        'id': project.id_projects,
                        'name': project.project_name,
                        'organization': project.project_organization,
                    }

        # Get dimensions, statements, answers, and scales
        survey = obj.submissions_id_submissions.surveys_id_surveys
        dimensions = Dimensions.objects.filter(surveys_id_surveys=survey)
        dimension_details = []
        for dimension in dimensions:
            statements = Statements.objects.filter(dimensions_id_dimensions=dimension)
            statement_details = []
            for statement in statements:
                answers = AnswersBase.objects.filter(statements_id_statements=statement, submissions_id_submissions=submission)
                answer_details = []
                for answer in answers:
                    value = None
                    scale_label = None
                    try:
                        value = AnswersInteger.objects.get(answers_base_id_answers_base=answer).value
                    except AnswersInteger.DoesNotExist:
                        try:
                            value = AnswersBoolean.objects.get(answers_base_id_answers_base=answer).value
                        except AnswersBoolean.DoesNotExist:
                            try:
                                value = AnswersText.objects.get(answers_base_id_answers_base=answer).value
                            except AnswersText.DoesNotExist:
                                pass

                    # Get scale label if applicable
                    if statement.scales_id_scales and value is not None:
                        scale_labels = statement.scales_id_scales.scale_labels.split(',')
                        try:
                            scale_label = scale_labels[int(value) - 1] if isinstance(value, int) and 0 < value <= len(scale_labels) else None
                        except (IndexError, ValueError):
                            scale_label = None

                    answer_details.append({
                        'id': answer.id_answers_base,
                        'value': value,
                        'scale_label': scale_label,
                        'creation_time': answer.answer_creation_time,
                    })
                statement_details.append({
                    'id': statement.id_statements,
                    'name': statement.statement_name,
                    'description': statement.statement_description,
                    'answers': answer_details,
                })
            dimension_details.append({
                'id': dimension.id_dimensions,
                'name': dimension.dimension_name,
                'description': dimension.dimension_description,
                'statements': statement_details,
            })

        report_details['dimensions'] = dimension_details
        
        return report_details
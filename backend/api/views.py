from django.contrib.auth import get_user_model
from rest_framework import generics, viewsets
from .serializers import AnswerBaseSerializer, UserRegistrationSerializer, LoginSerializer, SurveySerializer, ProjectSerializer, ScaleSerializer, DimensionSerializer, StatementSerializer
from .models import AnswersBase, Surveys, Projects, Scales, Dimensions, Statements, UsersHasProjects
from rest_framework.permissions import  AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsAdminUser


User = get_user_model()

# USERS_AUTH
class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny] 

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.save(), status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


# PROJECTS

class GetProjectView(generics.ListAPIView):
    
    permission_classes = [IsAuthenticated]
    
    serializer_class = ProjectSerializer
    
    def get_queryset(self):
        users_id_users = self.kwargs.get("users_id_users")
        # Get project IDs associated with the user from user_has_projects
        user_projects = UsersHasProjects.objects.filter(users_id_users=users_id_users)
        project_ids = user_projects.values_list('projects_id_projects', flat=True)
        # Get project info from Projects using the retrieved project IDs
        return Projects.objects.filter(id_projects__in=project_ids), user_projects

    def list(self, request, *args, **kwargs):
        projects_queryset, user_projects = self.get_queryset()
        projects = []
        for project in projects_queryset:
            project_data = ProjectSerializer(project).data
            # Get submissions associated with the user's project
            user_project = user_projects.filter(projects_id_projects=project.id_projects).first()
            if user_project:
                submissions = user_project.submissions_set.all()
                project_data['submissions'] = [
                    {"id_submissions": submission.id_submissions, "submission_state": submission.submission_state} for submission in submissions
                ]
            else:
                project_data['submissions'] = []
            projects.append(project_data)
        return Response(projects, status=status.HTTP_200_OK)
    
    
class CreateProjectView(generics.CreateAPIView):
    
    permission_classes = [IsAuthenticated] 
    
    serializer_class = ProjectSerializer  
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        project = serializer.save()
        return Response(ProjectSerializer(project).data, status=status.HTTP_201_CREATED)
    

class UpdateProjectPhaseView(UpdateAPIView):
    queryset = Projects.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = 'id_projects'

    def patch(self, request, *args, **kwargs):
        project = self.get_object()
        project.project_phase = request.data.get('project_phase', project.project_phase)
        project.save()
        return Response({"message": "Project phase updated"}, status=status.HTTP_200_OK)
    

# SURVEYS

class GetSurveyView(generics.ListAPIView):
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    serializer_class = SurveySerializer
    
    def get(self, request):
        surveys = Surveys.objects.all()
        serializer = SurveySerializer(surveys, many=True)
        return Response(serializer.data)

class GetSurveyDetailView(generics.ListAPIView):
    
    serializer_class = SurveySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        id_surveys = self.kwargs.get("id_surveys")
        return Surveys.objects.filter(id_surveys=id_surveys)

class CreateSurveyView(generics.CreateAPIView):
    
    permission_classes = [IsAuthenticated, IsAdminUser] 
    
    serializer_class = SurveySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        survey = serializer.save()

        return Response(SurveySerializer(survey).data, status=status.HTTP_201_CREATED)
    
class UpdateSurveyView(UpdateAPIView):
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = SurveySerializer
    
    queryset = Surveys.objects.all()
    lookup_field = 'id_surveys'

    def update(self, request, *args, **kwargs):
        dimension = self.get_object()
        serializer = self.get_serializer(dimension, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Survey updated successfully"}, status=status.HTTP_200_OK)
    
# DIMENSIONS

class GetDimensionView(generics.ListAPIView):
    
    serializer_class = DimensionSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        surveys_id_surveys = self.kwargs.get("surveys_id_surveys")
        return Dimensions.objects.filter(surveys_id_surveys=surveys_id_surveys)

class CreateDimensionView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = DimensionSerializer

    def create(self, request, *args, **kwargs):
        surveys_id_surveys = kwargs.get('surveys_id_surveys')  # Get from URL
        if not surveys_id_surveys:
            return Response({"error": "surveys_id_surveys is required"}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()  # Copy request data
        data['surveys_id_surveys'] = surveys_id_surveys  # Add surveys_id_surveys to data
        
        serializer = self.get_serializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        dimension = serializer.save()  # No need to pass surveys_id_surveys manually

        return Response(DimensionSerializer(dimension).data, status=status.HTTP_201_CREATED)

class UpdateDimensionView(UpdateAPIView):
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = DimensionSerializer
    
    queryset = Dimensions.objects.all()
    lookup_field = 'id_dimensions'
    
    def update(self, request, *args, **kwargs):
        dimension = self.get_object()
        serializer = self.get_serializer(dimension, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Dimension updated successfully"}, status=status.HTTP_200_OK)
    
#STATEMENTS

class GetStatementView(generics.ListAPIView):
    
    serializer_class = StatementSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        dimensions_id_dimensions = self.kwargs.get("dimensions_id_dimensions")
        return Statements.objects.filter(dimensions_id_dimensions=dimensions_id_dimensions)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        statements = []
        for statement in queryset:
            statement_data = StatementSerializer(statement).data
            if statement.scales_id_scales:
                scale_data = ScaleSerializer(statement.scales_id_scales).data
                statement_data['scale'] = scale_data
            else:
                statement_data['scale'] = None
            statements.append(statement_data)
        return Response(statements, status=status.HTTP_200_OK)

class CreateStatementView(generics.CreateAPIView):
    
    permission_classes = [IsAuthenticated, IsAdminUser] 
    
    serializer_class = StatementSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        statement = serializer.save()

        return Response(StatementSerializer(statement).data, status=status.HTTP_201_CREATED)
    
class UpdateStatementView(UpdateAPIView):
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = StatementSerializer
    
    queryset = Statements.objects.all()
    lookup_field = 'id_statements'
    
    def update(self, request, *args, **kwargs):
        statement = self.get_object()
        serializer = self.get_serializer(statement, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Dimension updated successfully"}, status=status.HTTP_200_OK)


# SCALES

class GetScaleView(generics.ListAPIView):
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    serializer_class = ScaleSerializer
    
    def get(self, request):
        surveys = Scales.objects.all()
        serializer = ScaleSerializer(surveys, many=True)
        return Response(serializer.data)


class CreateScaleView(generics.CreateAPIView):
    
    permission_classes = [IsAuthenticated, IsAdminUser] 
    
    serializer_class = ScaleSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        survey = serializer.save()

        return Response(ScaleSerializer(survey).data, status=status.HTTP_201_CREATED)
    
# ANSWERS

class AnswerViewSet(viewsets.ModelViewSet):
    
    serializer_class = AnswerBaseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = AnswersBase.objects.all()
        submissions_id_submissions = self.request.query_params.get('submissions_id_submissions')
        statements_id_statements = self.request.query_params.get('statements_id_statements')

        if submissions_id_submissions:
            queryset = queryset.filter(submissions_id_submissions=submissions_id_submissions)
        if statements_id_statements:
            queryset = queryset.filter(statements_id_statements=statements_id_statements)

        return queryset

    def create(self, request, *args, **kwargs):
        submissions_id_submissions = request.data.get('submissions_id_submissions')
        statements_id_statements = request.data.get('statements_id_statements')
        
        if AnswersBase.objects.filter(submissions_id_submissions=submissions_id_submissions, statements_id_statements=statements_id_statements).exists():
            return Response(
                {"error": "Answer already exists for this submission and statement"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not submissions_id_submissions or not statements_id_statements:
            return Response(
                {"error": "Both submissions_id_submissions and statements_id_statements are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        answer = serializer.save()
        return Response(AnswerBaseSerializer(answer).data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Answer deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
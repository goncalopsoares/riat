from django.contrib.auth import get_user_model
from rest_framework import generics, viewsets
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.utils.timezone import now
from .serializers import AnswerBaseSerializer, UserRegistrationSerializer, LoginSerializer, SurveySerializer, ProjectSerializer, ScaleSerializer, DimensionSerializer, StatementSerializer, SubmissionsSerializer, ReportSerializer, PasswordResetRequestSerializer, PasswordResetSerializer,  OverallRecommendationSerializer
from .models import AnswersBase, Surveys, Projects, Scales, Dimensions, Statements, UsersHasProjects, AnswersInteger, AnswersBoolean, AnswersText, Reports, Submissions, ReportsOverallScore, OverallRecommendations
from rest_framework.permissions import  AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework import status
from .permissions import IsAdminUser
from rest_framework.generics import RetrieveAPIView
from collections import defaultdict

User = get_user_model()

# USERS_AUTH
class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny] 

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.save(), status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        user = User.objects.filter(user_email=email).first()

        if user:
            token = get_random_string(length=64)
            user.password_reset_token = token
            user.password_reset_token_date = now()
            user.save()

            # Build reset link dynamically based on request
            scheme = request.scheme
            host = request.get_host()
            reset_link = f"{scheme}://{host}/resetpassword/{token}"

            send_mail(
                'Password Reset',
                f'Click the following link to reset your password: {reset_link}',
                'no-reply@localhost.com',
                [user.user_email],
            )

        return Response({"message": ""}, status=status.HTTP_200_OK)
    
class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        new_password = serializer.validated_data['new_password']

        user.set_password(new_password)
        user.password_reset_token = None
        user.password_reset_token_date = None
        user.save()

        return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)


# PROJECTS

class AdminAllProjectsView(generics.GenericAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = ProjectSerializer

    def get(self, request, *args, **kwargs):
        projects_queryset = Projects.objects.all()
        return self._build_response_from_projects(projects_queryset)

    def _build_response_from_projects(self, projects_queryset):
        projects_data = []

        for project in projects_queryset:
            project_data = ProjectSerializer(project).data
            project_data['submissions'] = []

            user_projects = UsersHasProjects.objects.filter(projects_id_projects=project.id_projects)

            for user_project in user_projects:
                submissions = Submissions.objects.filter(users_has_projects_id_users_has_projects=user_project.id_users_has_projects)
                for submission in submissions:
                    submission_data = {
                        "id_submissions": submission.id_submissions,
                        "submission_state": submission.submission_state,
                        "reports_overall_score_value": None,
                        "reports_overall_score_max_value": None,
                        "report_token": None,
                        "submission_starting_time": submission.submission_starting_time,
                        "submission_ending_time": submission.submission_ending_time,
                    }
                    report = Reports.objects.filter(submissions_id_submissions=submission.id_submissions).first()
                    if report:
                        submission_data["report_token"] = report.report_token
                        overall_score = report.reports_overall_score_id_reports_overall_score
                        if overall_score:
                            submission_data["reports_overall_score_value"] = overall_score.reports_overall_score_value
                            submission_data["reports_overall_score_max_value"] = overall_score.reports_overall_score_max_value
                    project_data['submissions'].append(submission_data)

            projects_data.append(project_data)

        return Response(projects_data, status=status.HTTP_200_OK)
    
class UserOwnProjectsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectSerializer

    def get(self, request, users_id_users, *args, **kwargs):
        
        if request.user.id != users_id_users and not request.user.is_staff:
            return Response({"detail": "Não autorizado."}, status=status.HTTP_403_FORBIDDEN)
        
        user_projects = UsersHasProjects.objects.filter(users_id_users=users_id_users)
        project_ids = user_projects.values_list('projects_id_projects', flat=True)
        projects_queryset = Projects.objects.filter(id_projects__in=project_ids)
        return self._build_response_from_projects(projects_queryset, user_projects)

    def _build_response_from_projects(self, projects_queryset, user_projects):
        projects_data = []

        """ for project in projects_queryset:
            project_data = ProjectSerializer(project).data
            project_data['submissions'] = []

            user_project = user_projects.filter(projects_id_projects=project.id_projects).first()
            if not user_project:
                continue

            submissions = user_project.submissions_set.all()
            total_valid_submissions = submissions.filter(submission_state=2).count()

            # Get the latest submission with state=1
            last_submission_pending = submissions.filter(submission_state=1).order_by('-id_submissions').first()
            if last_submission_pending:
                submission_data = {
                    "id_submissions": last_submission_pending.id_submissions,
                    "submission_state": last_submission_pending.submission_state,
                    "reports_overall_score_value": None,
                    "reports_overall_score_max_value": None,
                    "report_token": None,
                    "total_submissions": total_valid_submissions
                }
                report = Reports.objects.filter(submissions_id_submissions=last_submission_pending.id_submissions).first()
                if report:
                    submission_data["report_token"] = report.report_token
                    overall_score = report.reports_overall_score_id_reports_overall_score
                    if overall_score:
                        submission_data["reports_overall_score_value"] = overall_score.reports_overall_score_value
                        submission_data["reports_overall_score_max_value"] = overall_score.reports_overall_score_max_value
                project_data['submissions'].append(submission_data)

            # Get the latest submission with state=2
            last_submission_completed = submissions.filter(submission_state=2).order_by('-id_submissions').first()
            if last_submission_completed:
                submission_data = {
                    "id_submissions": last_submission_completed.id_submissions,
                    "submission_state": last_submission_completed.submission_state,
                    "reports_overall_score_value": None,
                    "reports_overall_score_max_value": None,
                    "report_token": None,
                    "total_submissions": total_valid_submissions
                }
                report = Reports.objects.filter(submissions_id_submissions=last_submission_completed.id_submissions).first()
                if report:
                    submission_data["report_token"] = report.report_token
                    overall_score = report.reports_overall_score_id_reports_overall_score
                    if overall_score:
                        submission_data["reports_overall_score_value"] = overall_score.reports_overall_score_value
                        submission_data["reports_overall_score_max_value"] = overall_score.reports_overall_score_max_value
                project_data['submissions'].append(submission_data)

            projects_data.append(project_data)

        return Response(projects_data, status=status.HTTP_200_OK) """
        
        for project in projects_queryset:
            project_data = ProjectSerializer(project).data
            project_data['submissions'] = []

            user_project = user_projects.filter(projects_id_projects=project.id_projects).first()
            if not user_project:
                continue

            submissions = user_project.submissions_set.all()
            for submission in submissions:

                submission_data = {
                    "id_submissions": submission.id_submissions,
                    "submission_state": submission.submission_state,
                    "reports_overall_score_value": None,
                    "reports_overall_score_max_value": None,
                    "report_token": None,
                    "submission_ending_time": submission.submission_ending_time,
                }
                report = Reports.objects.filter(submissions_id_submissions=submission.id_submissions).first()
                if report:
                    submission_data["report_token"] = report.report_token
                    overall_score = report.reports_overall_score_id_reports_overall_score
                    if overall_score:
                        submission_data["reports_overall_score_value"] = overall_score.reports_overall_score_value
                        submission_data["reports_overall_score_max_value"] = overall_score.reports_overall_score_max_value
                project_data['submissions'].append(submission_data)

            projects_data.append(project_data)

        return Response(projects_data, status=status.HTTP_200_OK)

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
    
    
class AddUserToProjectView(APIView):
        permission_classes = [IsAuthenticated]

        def post(self, request, *args, **kwargs):
            project_unique_code = request.data.get('project_unique_code')
            user_id = request.data.get('user_id')
            user_role = request.data.get('user_has_projects_role')
            user_function = request.data.get('user_has_projects_function')

            if not all([project_unique_code, user_id, user_role, user_function]):
                return Response(
                    {"error": "project_unique_code, users_id_users, user_has_projects_role, and users_has_projects_function are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                project = Projects.objects.get(project_unique_code=project_unique_code)
            except Projects.DoesNotExist:
                return Response({"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

            if UsersHasProjects.objects.filter(users_id_users=user, projects_id_projects=project).exists():
                return Response({"error": "User already assigned to this project."}, status=status.HTTP_400_BAD_REQUEST)

            user_project = UsersHasProjects.objects.create(
                users_id_users=user,
                projects_id_projects=project,
                users_has_projects_role=user_role,
                users_has_projects_function=user_function,
                users_has_projects_state = 1
            )
            
            return Response(
                {
                    "id_users_has_projects": user_project.id_users_has_projects,
                    "users_id_users": user_project.users_id_users.id,
                    "projects_id_projects": user_project.projects_id_projects.id_projects,
                    "user_has_projects_role": user_project.users_has_projects_role,
                    "users_has_projects_function": user_project.users_has_projects_function
                },
                
                status=status.HTTP_201_CREATED
            )
            
class PendingRequestsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = ProjectSerializer

    def get(self, request, *args, **kwargs):
        # Get all UsersHasProjects with state=1 (pending requests)
        pending_links = UsersHasProjects.objects.filter(users_has_projects_state=1)
        project_ids = pending_links.values_list('projects_id_projects', flat=True).distinct()
        projects = Projects.objects.filter(id_projects__in=project_ids)

        result = []
        for project in projects:
            # Find the pending request row for this project
            request_link = pending_links.filter(projects_id_projects=project.id_projects).first()
            request_user_info = None
            request_id_users_has_projects = None
            if request_link:
                request_user = request_link.users_id_users
                request_user_info = {
                    "id": request_user.id,
                    "name": getattr(request_user, "user_name", ""),
                    "email": getattr(request_user, "user_email", ""),
                    "role": request_link.users_has_projects_role,
                    "function": request_link.users_has_projects_function,
                }
                request_id_users_has_projects = request_link.id_users_has_projects

            # Find the first entry for this project (the owner)
            owner_link = UsersHasProjects.objects.filter(
                projects_id_projects=project.id_projects
            ).order_by('id_users_has_projects').first()
            owner_info = None
            if owner_link:
                owner = owner_link.users_id_users
                owner_info = {
                    "id": owner.id,
                    "name": getattr(owner, "user_name", ""),
                    "email": getattr(owner, "user_email", ""),
                    "role": owner_link.users_has_projects_role,
                    "function": owner_link.users_has_projects_function,
                }

            result.append({
                "id_projects": project.id_projects,
                "project_name": project.project_name,
                "request_user": request_user_info,
                "id_users_has_projects": request_id_users_has_projects,
                "owner": owner_info
            })
            
        return Response(result, status=status.HTTP_200_OK)

class AcceptOrRefusePendingRequestView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, id_users_has_projects, *args, **kwargs):
        if not id_users_has_projects:
            return Response({"error": "id_users_has_projects is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_project = UsersHasProjects.objects.get(id_users_has_projects=id_users_has_projects, users_has_projects_state=1)
        except UsersHasProjects.DoesNotExist:
            return Response({"error": "Pending request not found."}, status=status.HTTP_404_NOT_FOUND)

        user_project.users_has_projects_state = 0
        user_project.save()
        return Response({"message": "Request accepted."}, status=status.HTTP_200_OK)

    def delete(self, request, id_users_has_projects, *args, **kwargs):
        if not id_users_has_projects:
            return Response({"error": "id_users_has_projects is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_project = UsersHasProjects.objects.get(id_users_has_projects=id_users_has_projects, users_has_projects_state=1)
        except UsersHasProjects.DoesNotExist:
            return Response({"error": "Pending request not found."}, status=status.HTTP_404_NOT_FOUND)

        user_project.delete()
        return Response({"message": "Request refused and deleted."}, status=status.HTTP_204_NO_CONTENT)


# SURVEYS

class GetSurveyView(generics.ListAPIView):
    
    permission_classes = [IsAuthenticated]
    
    serializer_class = SurveySerializer
    
    def get(self, request):
        surveys = Surveys.objects.all()
        serializer = SurveySerializer(surveys, many=True)
        return Response(serializer.data)

class GetSurveyDetailView(generics.ListAPIView):
    
    serializer_class = SurveySerializer
    permission_classes = [IsAuthenticated]

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
        survey = self.get_object()
        serializer = self.get_serializer(survey, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Survey updated successfully"}, status=status.HTTP_200_OK)
    
# DIMENSIONS

class GetDimensionView(generics.ListAPIView):
    
    serializer_class = DimensionSerializer
    permission_classes = [IsAuthenticated]

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
    
class DeleteDimensionView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = DimensionSerializer
    queryset = Dimensions.objects.all()
    lookup_field = 'id_dimensions'

    def delete(self, request, *args, **kwargs):
        dimension = self.get_object()
        dimension.delete()
        return Response({"message": "Dimension deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

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
    permission_classes = [IsAuthenticated]

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


class DeleteStatementView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = StatementSerializer
    queryset = Statements.objects.all()
    lookup_field = 'id_statements'

    def delete(self, request, *args, **kwargs):
        statement = self.get_object()
        statement.delete()
        return Response({"message": "Statement deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
    
# SCALES

class GetScaleView(generics.ListAPIView):
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    serializer_class = ScaleSerializer
    
    def get(self, request):
        surveys = Scales.objects.all()
        serializer = ScaleSerializer(surveys, many=True)
        return Response(serializer.data)
    
class GetSingleScaleView(generics.ListAPIView):
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    serializer_class = ScaleSerializer
    
    def get_queryset(self):
        id_scales = self.kwargs.get("id_scales")
        return Scales.objects.filter(id_scales=id_scales)


class CreateScaleView(generics.CreateAPIView):
    
    permission_classes = [IsAuthenticated, IsAdminUser] 
    
    serializer_class = ScaleSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        survey = serializer.save()

        return Response(ScaleSerializer(survey).data, status=status.HTTP_201_CREATED)
    

class UpdateScaleView(UpdateAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = ScaleSerializer
    queryset = Scales.objects.all()
    lookup_field = 'id_scales'

    def update(self, request, *args, **kwargs):
        scale = self.get_object()
        serializer = self.get_serializer(scale, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Scale updated successfully"}, status=status.HTTP_200_OK)


# SUBMISSIONS

class SubmissionViewSet(viewsets.ModelViewSet):
        
        serializer_class = SubmissionsSerializer
        permission_classes = [IsAuthenticated]
    
        def get_queryset(self):
            id_submissions = self.kwargs.get("id_submissions")
            return Surveys.objects.filter(id_submissions=id_submissions)
    
        def list(self, request, *args, **kwargs):
            queryset = self.get_queryset()
            submissions = []
            for submission in queryset:
                submission_data = SurveySerializer(submission).data
                submissions.append(submission_data)
            return Response(submissions, status=status.HTTP_200_OK)  
        
        def create(self, request, *args, **kwargs):
            serializer = self.get_serializer(data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            submission = serializer.save()
            return Response(self.get_serializer(submission).data, status=status.HTTP_201_CREATED)

        def retrieve(self, request, id_submissions, *args, **kwargs):
            try:
                submission = Submissions.objects.get(id_submissions=id_submissions)
                serializer = self.get_serializer(submission)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Submissions.DoesNotExist:
                return Response({"error": "Submission not found"}, status=status.HTTP_404_NOT_FOUND)

        def update(self, request, id_submissions, *args, **kwargs):
            try:
                submission = Submissions.objects.get(id_submissions=id_submissions)
                serializer = self.get_serializer(submission, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                updated_submission = serializer.save()
                return Response(self.get_serializer(updated_submission).data, status=status.HTTP_200_OK)
            except Submissions.DoesNotExist:
                return Response({"error": "Submission not found"}, status=status.HTTP_404_NOT_FOUND)

        def destroy(self, request, id_submissions, *args, **kwargs):
            try:
                submission = Submissions.objects.get(id_submissions=id_submissions)
                submission.delete()
                return Response({"message": "Submission deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
            except Submissions.DoesNotExist:
                return Response({"error": "Submission not found"}, status=status.HTTP_404_NOT_FOUND)
        
    
# ANSWERS

class AnswerViewSet(viewsets.ModelViewSet):
    serializer_class = AnswerBaseSerializer
    permission_classes = [IsAuthenticated]
    queryset = AnswersBase.objects.all()

    def get_queryset(self):
        queryset = AnswersBase.objects.all()
        submission_id = self.request.query_params.get('submissions_id_submissions')
        statement_id = self.request.query_params.get('statements_id_statements')

        if submission_id:
            queryset = queryset.filter(submissions_id_submissions=submission_id)
        if statement_id:
            queryset = queryset.filter(statements_id_statements=statement_id)

        return queryset

    def create(self, request, *args, **kwargs):
        submission_id = request.data.get('submissions_id_submissions')
        statement_id = request.data.get('statements_id_statements')

        if not submission_id or not statement_id:
            return Response(
                {"error": "Both submissions_id_submissions and statements_id_statements are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if AnswersBase.objects.filter(
            submissions_id_submissions=submission_id,
            statements_id_statements=statement_id
        ).exists():
            return Response(
                {"error": "Answer already exists for this submission and statement"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        answer = serializer.save()

        return Response(self.get_serializer(answer).data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['delete'], url_path=r'(?P<submissions_id_submissions>\d+)/(?P<statements_id_statements>\d+)', url_name='delete_by_composite')
    
    def delete_by_composite(self, request, submissions_id_submissions, statements_id_statements):
        answer = get_object_or_404(
            AnswersBase,
            submissions_id_submissions=submissions_id_submissions,
            statements_id_statements=statements_id_statements
        )
        
        # Delete related entries in AnswersInteger, AnswersBoolean, and AnswersText
        AnswersInteger.objects.filter(answers_base_id_answers_base=answer).delete()
        AnswersBoolean.objects.filter(answers_base_id_answers_base=answer).delete()
        AnswersText.objects.filter(answers_base_id_answers_base=answer).delete()
        
        # Delete the main answer entry
        answer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_object_by_composite_key(self, submission_id, statement_id):
        return get_object_or_404(
            AnswersBase,
            submissions_id_submissions=submission_id,
            statements_id_statements=statement_id
        )

    @action(detail=False, methods=['get'], url_path=r'(?P<submissions_id_submissions>\d+)/(?P<statements_id_statements>\d+)', url_name='retrieve_by_composite')
    
    def retrieve_by_composite(self, request, submissions_id_submissions, statements_id_statements, *args, **kwargs):
        instance = self.get_object_by_composite_key(submissions_id_submissions, statements_id_statements)
        serializer = self.get_serializer(instance)
        data = serializer.data

        # Try to get the value from AnswersInteger, AnswersBoolean, or AnswersText
        value = None
        try:
            value = AnswersInteger.objects.get(answers_base_id_answers_base=instance).value
        except AnswersInteger.DoesNotExist:
            try:
                value = AnswersBoolean.objects.get(answers_base_id_answers_base=instance).value
            except AnswersBoolean.DoesNotExist:
                try:
                    value = AnswersText.objects.get(answers_base_id_answers_base=instance).value
                except AnswersText.DoesNotExist:
                    value = None

        data['value'] = value
        return Response(data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['put', 'patch'], url_path=r'(?P<submissions_id_submissions>\d+)/(?P<statements_id_statements>\d+)', url_name='update_by_composite')
    
    def update_by_composite(self, request, submissions_id_submissions, statements_id_statements, *args, **kwargs):
        instance = self.get_object_by_composite_key(submissions_id_submissions, statements_id_statements)
        partial = request.method == 'PATCH'
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        updated_answer = serializer.save()
        return Response(self.get_serializer(updated_answer).data, status=status.HTTP_200_OK)
    
    def get(self, request, submissions_id_submissions):
        answers_base = AnswersBase.objects.filter(submissions_id_submissions=submissions_id_submissions)
        result = []

        for answer in answers_base:
            statement = answer.statements_id_statements
            dimension_id = None
            if hasattr(statement, 'dimensions_id_dimensions'):
                dimension_order = getattr(statement.dimensions_id_dimensions, 'dimension_order', None)

            answer_data = {
                'id_answers_base': answer.id_answers_base,
                'statements_id_statements': statement.id_statements,
                'submissions_id_submissions': answer.submissions_id_submissions.id_submissions,
                'answer_creation_time': answer.answer_creation_time,
                'value': None,
                'dimension_order': dimension_order
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

        return Response(result, status=status.HTTP_200_OK)


# REPORTS

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Reports.objects.all()
    serializer_class = ReportSerializer

    def create(self, request, *args, **kwargs):
        submissions_id_submissions = request.data.get('submissions_id_submissions')
        final_score = request.data.get('final_score')
        survey_id = request.data.get('surveys_id_surveys') 
        ponderated_score = request.data.get('ponderated_score')

        if submissions_id_submissions is None:
            return Response({"error": "missing submission."}, status=status.HTTP_400_BAD_REQUEST)
        if final_score is None:
            return Response({"error": "missing final score."}, status=status.HTTP_400_BAD_REQUEST)
        if survey_id is None:
            return Response({"error": "missing survey."}, status=status.HTTP_400_BAD_REQUEST)
        if ponderated_score is None:
            return Response({"error": "missing ponderated score."}, status=status.HTTP_400_BAD_REQUEST)

        request.data['final_score'] = final_score
        request.data['surveys_id_surveys'] = survey_id
        request.data['ponderated_score'] = ponderated_score

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        report = serializer.save()
        return Response(self.get_serializer(report).data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, report_token, *args, **kwargs):
        try:
            report = Reports.objects.get(report_token=report_token)
            serializer = self.get_serializer(report)
            data = serializer.data
            data['details'] = serializer.get_report_details(report)
            return Response(data, status=status.HTTP_200_OK)
        except Reports.DoesNotExist:
            return Response({"error": "Report not found"}, status=status.HTTP_404_NOT_FOUND)


# RECOMMENDATIONS


class GetOverallRecommendationsView(generics.ListAPIView):
    serializer_class = OverallRecommendationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return OverallRecommendations.objects.select_related('surveys_id_surveys').all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        grouped = defaultdict(list)
        for recommendation in queryset:
            data = OverallRecommendationSerializer(recommendation).data
            survey = getattr(recommendation, 'surveys_id_surveys', None)
            survey_name = survey.survey_name if survey else None
            data['id_surveys'] = survey.id_surveys if survey else None
            data['survey_name'] = survey_name
            grouped[survey_name].append(data)
        # Convert to list of dicts for easier frontend consumption
        result = [
            {"survey_name": survey_name, "recommendations": recs}
            for survey_name, recs in grouped.items()
        ]
        return Response(result, status=status.HTTP_200_OK)

class UpdateOverallRecommendationsView(UpdateAPIView):
    queryset = OverallRecommendations.objects.all()
    serializer_class = OverallRecommendationSerializer
    lookup_field = 'id_overall_recommendations'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        overall_recommendations_description = request.data.get('overall_recommendations_description')
        if overall_recommendations_description is not None:
            instance.overall_recommendations_description = overall_recommendations_description
            instance.save()
            return Response({"message": "Overall recommendations updated successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "overall_recommendations_description is required"}, status=status.HTTP_400_BAD_REQUEST)
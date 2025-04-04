from django.contrib import admin
from django.urls import path, include
from api.views import RegisterView, LoginView, GetSurveyView, GetSurveyDetailView, CreateSurveyView, UpdateSurveyView, GetScaleView, CreateScaleView, GetStatementView, CreateStatementView, CreateProjectView, UpdateProjectPhaseView, GetDimensionView, CreateDimensionView, UpdateDimensionView, UpdateStatementView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView  

urlpatterns = [
    path('admin/', admin.site.urls),
    #USERS_AUTH
    path('api/user/register/', RegisterView.as_view(), name='register'),
    path('api/user/login/', LoginView.as_view(), name='login'),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('api-auth/', include('rest_framework.urls')),
    #SURVEYS
    path('api/survey/get/', GetSurveyView.as_view(), name='view_survey'),
    path('api/survey/get/<int:id_surveys>/', GetSurveyDetailView.as_view(), name='view_detail_survey'),
    path('api/survey/create/', CreateSurveyView.as_view(), name='create_survey'),
    path('api/survey/update/<int:id_surveys>/', UpdateSurveyView.as_view(), name='update_survey'),
    #DIMENSIONS
    path('api/dimension/get/<int:surveys_id_surveys>/', GetDimensionView.as_view(), name='view_dimension'),
    path('api/dimension/create/<int:surveys_id_surveys>/', CreateDimensionView.as_view(), name='create_dimension'),
    path('api/dimension/update/<int:id_dimensions>/', UpdateDimensionView.as_view(), name='update_dimension'),
    #STATEMENTS
    path('api/statement/get/<int:dimensions_id_dimensions>/', GetStatementView.as_view(), name='view_statement'),
    path('api/statement/create/<int:dimensions_id_dimensions>/', CreateStatementView.as_view(), name='create_statement'),
    path('api/statement/update/<int:id_statements>/', UpdateStatementView.as_view(), name='update_statement'),
    #STATEMENTS
    #SCALES
    path('api/scale/get/', GetScaleView.as_view(), name='view_scale'),
    path('api/scale/create/', CreateScaleView.as_view(), name='create_scale'),
    #PROJECTS
    path('api/project/create/', CreateProjectView.as_view(), name='create_project'),
    path('api/project/update/<int:id_projects>/', UpdateProjectPhaseView.as_view(), name="update-project-phase"),
]
 
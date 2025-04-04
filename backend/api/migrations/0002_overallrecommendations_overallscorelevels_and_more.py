# Generated by Django 5.1.7 on 2025-03-24 16:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='OverallRecommendations',
            fields=[
                ('id_overall_recommendations', models.AutoField(primary_key=True, serialize=False)),
                ('overall_recommendation_name', models.CharField(max_length=100)),
                ('overall_recommendations_description', models.TextField()),
            ],
            options={
                'db_table': 'overall_recommendations',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='OverallScoreLevels',
            fields=[
                ('id_overall_score_levels', models.AutoField(primary_key=True, serialize=False)),
                ('overall_score_level_name', models.CharField(max_length=100)),
                ('overall_score_min_value', models.IntegerField()),
                ('overall_score_max_value', models.IntegerField()),
            ],
            options={
                'db_table': 'overall_score_levels',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Recommendations',
            fields=[
                ('id_recommendations', models.AutoField(primary_key=True, serialize=False)),
                ('recommendations_description', models.TextField()),
            ],
            options={
                'db_table': 'recommendations',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Reports',
            fields=[
                ('id_reports', models.AutoField(primary_key=True, serialize=False)),
                ('report_creation_time', models.DateTimeField()),
            ],
            options={
                'db_table': 'reports',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ReportsOverallScore',
            fields=[
                ('id_reports_overall_score', models.AutoField(primary_key=True, serialize=False)),
                ('reports_overall_score_value', models.IntegerField()),
            ],
            options={
                'db_table': 'reports_overall_score',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ReportsScore',
            fields=[
                ('id_reports_score', models.AutoField(primary_key=True, serialize=False)),
                ('reports_score_dimension_score', models.IntegerField()),
            ],
            options={
                'db_table': 'reports_score',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ScoreLevels',
            fields=[
                ('id_score_levels', models.AutoField(primary_key=True, serialize=False)),
                ('score_level_name', models.CharField(max_length=100)),
                ('score_level_min_value', models.IntegerField()),
                ('score_level_max_value', models.IntegerField()),
            ],
            options={
                'db_table': 'score_levels',
                'managed': False,
            },
        ),
    ]

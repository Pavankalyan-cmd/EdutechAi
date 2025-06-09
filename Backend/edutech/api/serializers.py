from rest_framework import serializers

class Topicserializer(serializers.Seralizer):
    Name=serializers.CharField()
class Milestoneserializer(serializers.Seralizer):
    Title = serializers.CharField()
    Topics = serializers.charField(many=True)
class Roadmapserializer(serializers.Seralizer):
    Title=serializers.CharField()
    Milestones=serializers.CharField(many=True) 
    uid=serializers.CharField()   

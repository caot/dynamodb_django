from django.views.generic import ListView
import boto3
import botocore

from django.conf import settings

dynamodb = boto3.resource(
    'dynamodb',
    **settings.DYNAMODB
)

'''
http://127.0.0.1:8000/search
http://127.0.0.1:8090/search?net_worth=66&location=Omaha,%20NE
'''
class Search(ListView):
    template_name = 'search.html'

    def get_queryset(self):
        return None
    
    def get_context_data(self, *, object_list=None, **kwargs):
        context = super(Search, self).get_context_data(object_list=object_list, **kwargs)
        items = self.get_data(self.request.GET)
        context.update({
           'items' : items
        })
        
        return context
    
    def get_data(self, param):
        '''
        "AttributeType": "S | N | B"
        '''
        filter_expression = []
        expression_attribute_names = {}
        expression_attribute_values = {}
        
        net_worth = param.get('net_worth', None)
        if bool(net_worth):
            filter_expression.append('(#net_worth <= :net_worth)')
            expression_attribute_names['#net_worth'] = 'net_worth'
            expression_attribute_values[':net_worth'] = int(net_worth)
        
        location = param.get('location', None)
        if bool(location):
            filter_expression.append('(#location = :location)')
            expression_attribute_names['#location'] = 'location'
            expression_attribute_values[':location'] = location
        
        try:
            table = dynamodb.Table('Person')
        except botocore.exceptions.ClientError as _e:
            raise
        else:
            filtered_string = self.to_string(filter_expression)
            print(filtered_string)

            if bool(filtered_string) and expression_attribute_names and expression_attribute_values:
                context = table.scan(
                    FilterExpression = filtered_string,
                    ExpressionAttributeNames = expression_attribute_names,
                    ExpressionAttributeValues = expression_attribute_values,
                )
            else:
                context = table.scan(
                  ReturnConsumedCapacity = 'TOTAL',
                )
                
            if context['ResponseMetadata']['HTTPStatusCode'] == 200:
                return context['Items']
    
    def to_string(self, filter_expression):        
        return  ' and '.join(filter_expression)

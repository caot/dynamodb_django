from django.conf import settings

import boto3
import botocore


dynamodb = boto3.resource(
    'dynamodb',
    **settings.DYNAMODB
)

class Person(object):
    def __init__(self):
        try:
            self._client = dynamodb.Table('Person')
        except botocore.exceptions.ClientError as e:
            raise e

    def to_string(self, filter_expression):
        return  ' and '.join(filter_expression)

    # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html
    def scan(self, filter_expression, ExpressionAttributeNames, ExpressionAttributeValues):
        FilterExpression = self.to_string(filter_expression)

        if bool(FilterExpression) and ExpressionAttributeNames and ExpressionAttributeValues:
            response = self._client.scan(
                FilterExpression = FilterExpression,
                ExpressionAttributeNames = ExpressionAttributeNames,
                ExpressionAttributeValues = ExpressionAttributeValues,
            )
        else:
            response = self._client.scan(
                ReturnConsumedCapacity = 'TOTAL',
            )

        return response

from django.conf import settings

import boto3
import botocore


dynamodb = boto3.resource(
    'dynamodb',
    **settings.DYNAMODB
)


class Person(object):
    list_display = ['id', 'first_name', 'last_name',
                    'location', 'net_worth', 'source_of_wealth']

    def __init__(self):
        try:
            self._client = dynamodb.Table('Person')
        except botocore.exceptions.ClientError as e:
            raise e

    def to_string(self, filter_expression):
        return ' and '.join(filter_expression)

    # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html
    def scan(self, filter_expression, ExpressionAttributeNames, ExpressionAttributeValues):
        FilterExpression = self.to_string(filter_expression)

        if bool(FilterExpression) and ExpressionAttributeNames and ExpressionAttributeValues:
            response = self._client.scan(
                FilterExpression=FilterExpression,
                ExpressionAttributeNames=ExpressionAttributeNames,
                ExpressionAttributeValues=ExpressionAttributeValues,
            )
        else:
            response = self._client.scan(
                ReturnConsumedCapacity='TOTAL',
            )

        response.update(dict(list_display=self.list_display))
        # print(response)
        return response
